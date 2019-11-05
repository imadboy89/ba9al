import LocalStorage from "./LocalStorage";
import Photo from "./Photo_module";
import Company from './Company_module';
import Product from "./Product_module";
import { Linking  } from 'react-native';
import { Stitch,RemoteMongoClient , AnonymousCredential,UserPasswordCredential } from "mongodb-stitch-react-native-sdk";


class BackUp{
    constructor() {
        this.Product = new Product();
        this.Company = new Company();
        this.Photo   = new Photo();
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
        
    }
    setClientInfo(){
      try {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
          RemoteMongoClient.factory,
          "mongodb-atlas"
        );
        this.client = Stitch.defaultAppClient;
        this.lastActivity = this.client.auth.activeUserAuthInfo.lastAuthActivity;
        this.email = this.client.auth.activeUserAuthInfo.userProfile.data.email;  
        console.log("this.email",this.email);
        return true;
      } catch (error) {
        console.log(error)
      }

    }
    changeClient = async (eml,pass)=>{
      const app = Stitch.defaultAppClient;
      const credents = await this.LS.getCredentials();
      this.admin = true ;
      try {
        const credential = new UserPasswordCredential(credents["email"],credents["password"]);
        this.client = await app.auth.loginWithCredential(credential);
        return this.setClientInfo(); 
      } catch (error) {
        alert(error);
        let credential= new  AnonymousCredential();
        this.client = await app.auth.loginWithCredential(credential);
        this.admin = false ;
        return false;
      }
       
    }
    _loadClient = async () => {
        const credents = await this.LS.getCredentials();
        let credential= new  AnonymousCredential();
        let usingAnon = true;
        if(credents && credents.email && credents.password){
          credential = new UserPasswordCredential(credents["email"],credents["password"]);
          usingAnon = false;
        }


        return Stitch.initializeDefaultAppClient("ba9al-xpsly").then(client => {
          this.client = client ;
          return this.client.auth
            .loginWithCredential(credential)
            .then(user => {
              
              this.currentUserId = user.id;
              this.admin = !usingAnon ;
              this.setClientInfo();
              console.log(`Successfully logged in as user ${this.email}` , this.lastActivity );
              return user;
              
            })
            .catch(err => {
              console.log(`Failed to log in anonymously: ${err}`);
              this.currentUserId = undefined;
            });

        });
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
      
      const out1 = await this.clean(this.products_mdb);
      let deleted = out1 && "deletedCount" in out1 ? out1["deletedCount"] : 0 ;
      this.appendLog("    Products cleaned ["+deleted+"]");
      
      const out2 = await this.clean(this.companies_mdb);
      deleted = out2 && "deletedCount" in out2 ? out2["deletedCount"] : 0 ;
      this.appendLog("    Companies cleaned ["+deleted+"]");

      
      const out3 = await this.clean(this.photos_mdb);
      deleted = out3 && "deletedCount" in out3 ? out3["deletedCount"] : 0 ;
      this.appendLog("    Photos cleaned ["+deleted+"]");

      return output;
    }

    insertMany= async (db, data) => {
      //await db.deleteMany({});
      return db.insertMany(data);
    }
    updateOne= async (db, query, data) => {
      //await db.deleteMany({});
      return db.updateOne(query,data);
    }
    getMDB(db,query={},options = {"projection": { "_id": 0 },}){
      return db.find(query, options).asArray().then(docs => {
              return docs;
          }).catch(err => {
              console.error(err);
              alert(err);
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
      
      let itemsR_dict = {};
      let saved=0;
      let local_updated=0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        delete item["_id"];
        itemsR_dict[item["id"]] = item;
        let outp = await Item_ob_check.doesExist({id:item.id});
        const photo_cond=false;
        try {
          photo_cond = isPhoto && "data" in outp["doesExist"] && outp["doesExist"]["data"]==null;
        } catch (error) {
          console.log(outp,item.id);
        }
        isRemoteNewer = false;
        const item_ll = outp["doesExist"];
        if(item.updated ){
          const date_l = item_ll.updated ? this.parseDate2Int(item_ll.updated) : 0;
          const date_r = item.updated ? this.parseDate2Int(item.updated) : 0;
          isRemoteNewer = item_ll.updated!=null ? date_r > date_l : true;
        } 
        if (!outp["doesExist"] || photo_cond || isRemoteNewer ){

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
      
      //await this.synchronize_item(this.history_mdb, Product);
      return true;
    }

    getBackupMail = async (receiver)=>{
        await this.initDb();
        //mailto:<receiver_email>?subject=<subject>&body=<body>&cc=<emails_to_copy>
        const data = await this.getBackup();
        const out1 = await this.insertMany(this.products_mdb, data["Product"]["data"]);
        console.log("Product insertedIds : ", Object.keys(out1["insertedIds"] ) . length );

        const out2 = await this.insertMany(this.companies_mdb, data["Company"]["data"]);
        console.log("Company insertedIds : ", Object.keys(out2["insertedIds"] ) . length );

        const out3 = await this.insertMany(this.photos_mdb, data["Photo"]["data"]);
        console.log("Photo insertedIds : ", Object.keys(out3["insertedIds"] ) . length );

        //const out4 = await this.insertMany(this.history_mdb, data["Hitory"]);
        //console.log("Hitory insertedIds : ", Object.keys(out4["insertedIds"] ) . length );
    }

    getBackup = async ()=>{
        let backupDATA = {};

        backupDATA["Product"]  = await this.Product.DB.backup();
        console.log("Product",backupDATA["Product"]["data"].length);
        backupDATA["Company"]  = await this.Company.DB.backup();
        console.log("Company",backupDATA["Company"]["data"].length);
        backupDATA["Photo"]  = await this.Photo.DB.backup();
        console.log("Photo",backupDATA["Photo"]["data"].length);
        backupDATA["Hitory"] = await this.LS.getHistory();
        console.log("Hitory",backupDATA["Hitory"].length);


        backupDATA["LastRemovedHistory"] = await this.LS.LastRemovedHistory();
        
        return backupDATA;
    }

}

export default BackUp ;