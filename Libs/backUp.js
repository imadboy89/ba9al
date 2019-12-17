import LocalStorage from "./LocalStorage";
import Photo from "./Photo_module";
import Company from './Company_module';
import Product from "./Product_module";
import History from "./History_module";
import { NetInfo  } from 'react-native';
import { Stitch,RemoteMongoClient , AnonymousCredential,UserPasswordCredential,UserPasswordAuthProviderClient } from "mongodb-stitch-react-native-sdk";
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';


class BackUp{
    constructor() {
        this.Product = new Product();
        this.Company = new Company();
        this.Photo   = new Photo();
        this.History   = new History();
        this.LS = new LocalStorage();
        //this.initDb();
        this.lastActivity = "";
        this.email = "";
        //this.setClientInfo();
        this.doClean=false;
        try {
          //this.setClientInfo();
        } catch (error) {
          console.log(error);
        }
        this.admin = false;
        this.isConnected = false;
        this.PushToken = "";

        this.executingQueued_running = false;
        this.queue = [];
        this.last_notification_time = false;
        
    }
    registerForPushNotificationsAsync = async () => {
      
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        console.log("getExpoPushTokenAsync ",token);
        this.PushToken = token ;
        this.savePushToken();
      } else {
        alert('Must use physical device for Push Notifications');
      }
    };
    checkCnx = async(check_client=true)=>{
      const isConnected = await NetInfo.isConnected.fetch();
      this.isConnected = isConnected;
      //console.log("isConnected", isConnected);
      if(check_client && (!this.client || !this.client.callFunction )){
        await this.setClientInfo();
      }
      if(isConnected && check_client){
        await this.checkConnectedUserChange();
      }
      return isConnected;
    }
    setClientInfo = async()=>{
      try {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
          RemoteMongoClient.factory,
          "mongodb-atlas"
        );
        this.client = Stitch.defaultAppClient;
        this.lastActivity = this.client.auth.activeUserAuthInfo.lastAuthActivity;
        this.email = this.client.auth.activeUserAuthInfo.userProfile.data.email;
        return this.isAdmin();

      } catch (error) {
        try {
          this._loadClient();
        } catch (error) {
        }
        return new Promise(resolve=>{resolve(false);});
      }
      
    }
    executingQueued = async()=>{
      if(this.executingQueued_running){
        return ;
      }
      if( ! await this.checkCnx()){
        return false;
      }
      this.executingQueued_running = true ;
      if(this.timer == undefined){
        this.timer = setInterval(()=> this.executingQueued(), 10*1000);
      }
      const queue = this.queue.slice();
      for (let i = 0; i < this.queue.length; i++) {
        const task = queue[i];
        console.log("executingQueued "+i,task[0]);
        try {
          task[0].apply(this,task[1]) ;
        } catch (error) {
          console.log(error);
        }
      }
      this.queue=[];
      this.executingQueued_running = false ;
    }
    isAdmin(){
      return this.client.callFunction("isAdmin").then(result => {
        console.log(result);
        this.admin = result;
      }).catch(err=>{
        alert(err);
      });
    }
    synch_history = async(history=undefined,appendLog=undefined)=>{
      if(history == undefined){
        const histories_ = await this.History.filter();
        let hist_list = [];
        for (let index = 0; index < histories_["list"].length; index++) {
          const hist = histories_["list"][index];
          hist_list.push(hist.fields);
        }
        history = hist_list;
        if(hist_list.length==0){ // drop an recteate table if empty
          this.History.DB.drop_create_table();
        }
      }
      if(appendLog!=undefined){
        this.appendLog = appendLog ;
        this.appendLog("------synch History------");
      }else{
        this.appendLog = function (a){} ;
      }
      let results = {};
      if(!this.client || !this.client.callFunction){
        this.appendLog ("    XXX synch_history function : Register to be able to synch history");
        return false;
      }
      try {
        results = await this.client.callFunction("synch_history",[history,]);
      } catch (error) {
        console.log(error);
        this.appendLog ("    XXX synch_history function : "+error);
        return false;
      }
      if(results.error ){
        this.appendLog ("    XXX synch_history function : "+results.error);
        return;
      }
      for (let i = 0; i < results["items_to_saveLC"].length; i++) {
        const hist_r = results["items_to_saveLC"][i];
        delete hist_r["_id"];
        delete hist_r["id"];
        const hist_tosave = new History(hist_r);
        await hist_tosave.delete();
      }      
      for (let i = 0; i < results["items_to_saveLC"].length; i++) {
        const hist_r = results["items_to_saveLC"][i];
        delete hist_r["_id"];
        delete hist_r["id"];
        const hist_tosave = new History(hist_r);
        await hist_tosave.save();
      }
      this.appendLog ("    Found : "+results["found"]);
      this.appendLog ("    saved : "+results["items_to_saveLC"].length);
      this.appendLog ("    upload : "+results["uploaded"]);
      return results;
    }
    synch_history_clean = async()=>{

      let results = {};
      try {
        results = await this.client.callFunction("synch_history",[false,true]);
      } catch (error) {
        this.appendLog ("    XXX synch_history Clear function : "+error.message);
        return false;
      }
      return results["deleted"];
    }
    savePushToken = async()=>{
      if( ! await this.checkCnx()){
        return new Promise(resolve=>{resolve(false);});
      }
      try {

        results = await this.client.callFunction("savePushToken",[this.PushToken,Translation_.language]);
      } catch (error) {
        console.log(error);
        return false;
      }
      return results["deleted"];
    }
    requestT9adya = async(action="get", t9adya=[],partner=undefined)=>{
      if( ! await this.checkCnx()){
        if(action!="get"){
          alert(TXT.You_need_internet_connection_for_this_action);
        }
        return new Promise(resolve=>{resolve(false);});
      }
      
      const datetime = this.Product.DB.getDateTime();
      let results = false;
      try {
        results = await this.client.callFunction("requestT9adya",[action,datetime,t9adya,partner]);
      } catch (error) {
        console.log("requestT9adya",error);
        this.queue.push([this.requestT9adya,[action, t9adya,partner]]);
        return false;
      }
      return results;
    }
    pushNotification = async(title="", body="",data={},partner=false,chanelId=false)=>{
      if( ! await this.checkCnx()){
        return new Promise(resolve=>{resolve(false);});
      }
      if(title=="" || body==""){
        return false;
      }
      const time = new Date() .getTime();
      if(this.last_notification_time && time -this.last_notification_time  < 5*1000){
        return "Can't send 2 Notif in 5s";
      }
      const datetime = this.Product.DB.getDateTime();
      let results = {};
      let args = [partner,title,body , data,datetime] ;
      if(chanelId){
        args.push(chanelId);
      }
      try {
        results = await this.client.callFunction("pushNotification",args);
        this.last_notification_time = new Date() .getTime();
        let pushednotifto=0;
        if(results && results["data"] && results["data"].length>0){
          for (let i = 0; i < results["data"].length; i++) {
            pushednotifto += results["data"][i]["status"] && results["data"][i]["status"]=="ok" ? 1 : 0 ;
          }
        }
        return pushednotifto;
      } catch (error) {
        console.log("pushNotification",error);
        this.queue.push([this.pushNotification,[title, body,data,partner,chanelId]]);
        /*
        if(error.errorCode==41){
          this.queue.push([this.pushNotification,[title, body,data,partner,chanelId]]);
        }*/
        return false;
      }
      return results;
    }
    partnersManager = async(action,partner_username)=>{
      if( ! await this.checkCnx()){
        alert(TXT.You_need_internet_connection_for_this_action);
        return false;
      }
      const datetime = this.Product.DB.getDateTime();
      let results = {};
      try {
        results = await this.client.callFunction("partnersManager",[action,datetime,partner_username]);
      } catch (error) {
        alert(error.message ? error.message : error);
        return false;
      }
      return results;
    }
    usersManager = async(user_email,new_status) => {
      if( ! await this.checkCnx()){
        alert(TXT.You_need_internet_connection_for_this_action);
        return false;
      }
      let results = {};
      try {
        results = await this.client.callFunction("Users_managements",[user_email,new_status]);
      } catch (error) {
        alert(error.message ? error.message : error);
        return false;
      }
      return results;
    }
    checkConnectedUserChange = async()=>{
      const credents = await this.LS.getCredentials();
      if(credents["email"].trim().toLowerCase()!=this.email ){
        return this.setClientInfo();
      }
      return credents;
    }
    changeClient = async ()=>{
      if( ! await this.checkCnx()){
        alert(TXT.You_need_internet_connection_to+(TXT.language=="en"?" ":"")+TXT.Sign_in);
        return false;
      }
      this.email = "";
      this.lastActivity = "";
      let app = null;
      try {
        app = Stitch.defaultAppClient;
      } catch (error) {
        console.log(error);
        try {
          this._loadClient();
        } catch (error) {
          if(this.isAdmin){
            alert("Error in backup service.");
          }else{
            alert("Error in backup service.");
          }
        }

        
        return false;
      }
      
      const credents = await this.LS.getCredentials();
      this.admin = true ;
      try {
        const credential = new UserPasswordCredential(credents["email"].toLowerCase(),credents["password"].toLowerCase());
        this.client = await app.auth.loginWithCredential(credential);
        this.registerForPushNotificationsAsync();
        return this.setClientInfo(); 
      } catch (error) {
        alert(error);
        this.LS.setCredentials("","");
        let credential= new  AnonymousCredential();
        this.client = await app.auth.loginWithCredential(credential);
        this.admin = false ;
        return false;
      }
       
    }
    newUser = async(username,password)=>{
      if( ! await this.checkCnx()){
        alert(TXT.You_need_internet_connection_to+(TXT.language=="en"?" ":"")+TXT.Sign_up);
        return false;
      }
      
      const emailPasswordClient = Stitch.defaultAppClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

      return emailPasswordClient.registerWithEmail(username.toLowerCase(),password.toLowerCase())
        .then((output) => {
          this.registerForPushNotificationsAsync();
          console.log("Successfully sent account confirmation email!", JSON.stringify(output) );
          return output;
        })
        .catch(err => {
          alert(err.message);
          console.log(JSON.stringify(err) );
        });
    }
    _loadClient = async () => {
        if(this.loadingClient){
          return true;
        }
        this.loadingClient = true;
        if( ! await this.checkCnx(false)){
          this.loadingClient = false;
          return false;
        }
        const credents = await this.LS.getCredentials();
        let credential= new  AnonymousCredential();
        let usingAnon = true;
        if(credents && credents.email && credents.password){
          credential = new UserPasswordCredential(credents["email"].toLowerCase(),credents["password"].toLowerCase());
          usingAnon = false;
        }


        return Stitch.initializeDefaultAppClient("ba9al-xpsly").then(client => {
          this.client = client ;
          return this.client.auth
            .loginWithCredential(credential)
            .then(user => {
              if(credents && credents.email && credents.password){
                this.registerForPushNotificationsAsync();
              }
              this.currentUserId = user.id;
              this.admin = !usingAnon ;
              
              console.log(`Successfully logged in as user ${this.email}` , this.lastActivity );
              this.loadingClient = false;
              return this.setClientInfo();
            })
            .catch(err => {
              console.log(`Failed to log in anonymously: ${err}`);
              this.currentUserId = undefined;
            });

        }).catch(o=>console.log(o));
      }
    
    initDb = async ()=>{
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
          RemoteMongoClient.factory,
          "mongodb-atlas"
        );
        this.db = mongoClient.db("ba9al");
        this.products_mdb = this.db.collection("products");
        this.companies_mdb = this.db.collection("companies");
        this.photos_mdb = this.db.collection("photo");
        this.history_mdb = this.db.collection("history");
    }

    clean = async(db)=>{
      if(this.email ){
        try {
          return await db.deleteMany({});
        } catch (error) {
          console.log(error);
        }
      }
      return false;
    }
    cleanAll = async()=>{
      let output = [];
      let deleted = 0;
      
      const out1 = await this.clean(this.products_mdb);
      deleted = out1 && "deletedCount" in out1 ? out1["deletedCount"] : 0 ;
      this.appendLog("    Products cleaned ["+deleted+"]");
      
      const out2 = await this.clean(this.companies_mdb);
      deleted = out2 && "deletedCount" in out2 ? out2["deletedCount"] : 0 ;
      this.appendLog("    Companies cleaned ["+deleted+"]");

      
      const out3 = await this.clean(this.photos_mdb);
      deleted = out3 && "deletedCount" in out3 ? out3["deletedCount"] : 0 ;
      this.appendLog("    Photos cleaned ["+deleted+"]");
      
      /*
      const out4 = await this.synch_history_clean();
      deleted = out4 ? out4 : 0 ;
      this.appendLog("    History cleaned ["+deleted+"]");
      */
      return output;
    }

    insertMany= async (db, data) => {
      //await db.deleteMany({});
      return db.insertMany(data).catch(err=>{
        let names = [];
        if(data && data[0].name){          
          for (let p = 0; p < data.length; p++) {
              names.push(data[p].name );
          }
        }
        const prods_names = names.length>0 && names.length<=3 ? "("+names.join(",")+")" : "("+names.length+")";
        this.appendLog ("    XXX Insert : "+err.message + " : "+prods_names);
        return err;
      });
    }
    updateOne= async (db, query, data) => {
      //await db.deleteMany({});
      return db.updateOne(query,data).catch(err=>{
        const name = data && data["name"] ? "("+data["name"]+")" : "";
        this.appendLog ("    XXX rUpdate : "+err.message + name);
        return err;
      });
    }
    getMDB(db,query={},options = {"projection": { "_id": 0 },}){
      return db.find(query, options).asArray().then(docs => {
              return docs;
          }).catch(err => {
              this.appendLog ("    XXX Found : "+err.message);
          });
    }
    synchronize_item = async(db,Items_clss, isPhoto=false)=>{
      let infos=[];
      let items= [];
      if (isPhoto){
        items = await this.getMDB(db,{"data":{"$ne":null} },{"projection": { "_id": 0,"data":0 }});
      }else{
        items = await this.getMDB(db);
      }
      this.appendLog ("    Found : "+items.length);
      const Item_ob_check = new Items_clss();
      let items_local = await Item_ob_check.filter();
      items_local = items_local["list"];
      if(items_local.length==0){ // drop an recteate table if empty
        Item_ob_check.DB.drop_create_table();
      }
      items_local_dict = {};
      for (let k = 0; k < items_local.length; k++) {
        items_local_dict[items_local[k].fields.id] = items_local[k];
        
      }
      let itemsR_dict = {};
      let saved=0;
      let local_updated=0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        delete item["_id"];
        itemsR_dict[item["id"]] = item;

        const item_ll = item.id in items_local_dict ? items_local_dict[item.id]: false;
        const photo_cond=false;
        try {
          photo_cond = isPhoto && item_ll && item_ll.fields && item_ll.fields.data  && item_ll.fields.data==null;
        } catch (error) {
          console.log(item.id);
        }

        
        let isRemoteNewer = false;
        if(item.updated ){
          const date_l = item_ll && item_ll.fields && item_ll.fields.updated ? this.parseDate2Int(item_ll.fields.updated) : 0;
          const date_r = item.updated ? this.parseDate2Int(item.updated) : 0;
          isRemoteNewer = item_ll && item_ll.fields && item_ll.fields.updated ? date_r > date_l : true;
        } 
        if (!item_ll || photo_cond || isRemoteNewer ){

          if(isPhoto){
            item = await db.findOne({"id":item.id},{"projection": { "_id": 0 }});
            //console.log(item.id +" : ",item.data==null);
            if(item.data==null){
              continue;
            }
          }
          const Item_ob_ = new Items_clss(item);
          Item_ob_.DB.BackedUp = true;
          const savedUpdated = await Item_ob_.save(true);
          const  status = isRemoteNewer ? "updating"  : "saving";
          //console.log(status+" : ",savedUpdated);
          if(item_ll){
            local_updated+=1;
          }else{
            saved+=1;
          }
          
        }
      }
      this.appendLog ("    Saved : "+saved);
      this.appendLog ("    LUpdated : "+local_updated);
      let items_to_upload = [];
      let items_to_update = [];
      for (let j = 0; j < items_local.length; j++) {
        const item_l = items_local[j];
        const item_r =  item_l.fields.id in itemsR_dict ? itemsR_dict[item_l.fields.id] : false;
        const isLocalNewer = false;
        try {
          if(item_r && item_l.fields.updated && item_l.fields.updated!=null ){
            const date_l = item_l.fields.updated ? this.parseDate2Int(item_l.fields.updated) : 0;
            const date_r = item_r.updated ? this.parseDate2Int(item_r.updated) : 0;
            isLocalNewer = item_r.updated!=null ? date_l > date_r: true;
          } 
          
        } catch (error) {
          console.log(item_l.fields.updated+" : "+item_r.updated,error);
        }
        
        if( !(item_l.fields.id in itemsR_dict) || isLocalNewer){
          if(!isPhoto ||  item_l.fields.data != null){
            if(isLocalNewer){
              items_to_update.push(item_l.fields);
            }else{
              items_to_upload.push(item_l.fields);
            }
          }
        }
      }
      uploaded = 0;
      this.appendLog ("    Count to upload : "+items_to_upload.length);
      if(items_to_upload.length>0 && this.email ){
        const out_up = await this.insertMany(db, items_to_upload);
        uploaded = (out_up && out_up.insertedIds && out_up.insertedIds instanceof Object) ? Object.keys(out_up.insertedIds).length : 0;
      }
      this.appendLog ("    Uploaded : "+uploaded);

      updated = 0;
      this.appendLog ("    Count to rUpdate : "+items_to_update.length);
      if(items_to_update.length>0 && this.email ){
        for (let i = 0; i < items_to_update.length; i++) {
          const item = items_to_update[i];
          const out_up = await this.updateOne(db,{"id":item.id} , item);
          updated +=1; 
        }
      }
      this.appendLog ("    rUpdated : "+updated);
      
      if(Items_clss == Product && (uploaded>0 || updated>0)){
        const titles = Translation_.getTrans("New_Updates_for_products_database","!");
        let bodies   = Translation_.getTrans("New_products"," : "+uploaded + " \n");
        let bodies2  = Translation_.getTrans("Updated_products"," : "+updated );
        bodies["en"] += bodies2["en"]
        bodies["ar"] += bodies2["ar"]
        bodies["fr"] += bodies2["fr"]
        bodies["dr"] += bodies2["dr"]

        this.pushNotification (titles, bodies,{"action":"db_update",by:this.email},"all","Notifications_lessImportant").then(res=>{
          this.appendLog ("----Notification pushed to : "+res);
        });
      }

      return true;
    }
    parseDate2Int(date_str){
      try {
        return parseInt(date_str.replace(/-|\s|:/g,""));
      } catch (error) {
        return 0;
      }
    }
    synchronize = async(appendLog)=>{
      this.appendLog = appendLog ;
      if( ! await this.checkCnx()){
        alert(TXT.You_need_internet_connection_to+(TXT.language=="en"?" ":"")+TXT.Sych_Now);
        return false;
      }
      await this.initDb();
      
      if(this.doClean){
        await this.cleanAll();
      }
      
      this.appendLog("------synch Products------");
      await this.synchronize_item(this.products_mdb, Product);
      
      this.appendLog("------synch Companies------");
      await this.synchronize_item(this.companies_mdb, Company);
      
      this.appendLog("------synch Photos------");
      await this.synchronize_item(this.photos_mdb, Photo,true);
      
      //this.appendLog("------synch History------");
      //await this.synch_history();
      
      return true;
    }

}

export default BackUp ;