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
      const credential = new UserPasswordCredential(credents["email"],credents["password"]);


      this.client = await app.auth.loginWithCredential(credential);
      this.setClientInfo();
       
    }
    _loadClient = async () => {
        const credents = await this.LS.getCredentials();
        const credential = new UserPasswordCredential(credents["email"],credents["password"]);

        return Stitch.initializeDefaultAppClient("ba9al-xpsly").then(client => {
          this.client = client ;
          return this.client.auth
            .loginWithCredential(credential)
            .then(user => {
              
              this.currentUserId = user.id;
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
      console.log(out1);
      if(out1){
        output["    products Cleaned!"]
      }
      console.log("    products cleaned");
      const out2 = await this.clean(this.companies_mdb);
      if(out2){
        output["    companies Cleaned!"]
      }
      console.log("    companies cleaned");
      const out3 = await this.clean(this.photos_mdb);
      if(out3){
        output["    photos Cleaned!"]
      }
      console.log("    photos cleaned");

      return output;
    }

    insertMany= async (db, data) => {
      //await db.deleteMany({});
      return db.insertMany(data);
    }
    getMDB(db,query={},options = {"projection": { "_id": 0 },}){
      return db.find(query, options).asArray().then(docs => {
              console.log("Found docs", docs.length)
              return docs;
          }).catch(err => {
              console.error(err)
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
      infos.push ("    Found : "+items.length);
      const Item_ob_check = new Items_clss();
      let items_local = await Item_ob_check.filter();
      items_local = items_local["list"];
      let items_dict = {};
      let saved=0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        delete item["_id"];
        items_dict[item["id"]] = item;
        let outp = await Item_ob_check.doesExist({id:item.id});
        const photo_cond=false;
        try {
          photo_cond = isPhoto && "data" in outp["doesExist"] && outp["doesExist"]["data"]==null;
        } catch (error) {
          console.log(outp,item.id);
        }
        if (!outp["doesExist"] || photo_cond ){
          if(photo_cond){
            console.log("PH null "+item.id);
          }
          if(isPhoto){
            item = await db.findOne({"id":item.id},{"projection": { "_id": 0 }});
            console.log(item.id +" : ",item.data==null);
            if(item.data==null){
              continue;
            }
          }
          const Item_ob_ = new Items_clss(item);
          Item_ob_.save(true);
          console.log("saving : "+item["id"]);
          saved+=1;
        }
      }
      infos.push ("    Saved : "+saved);
      let items_to_upload = [];
      for (let j = 0; j < items_local.length; j++) {
        const item_l = items_local[j];
        const item_r =  item_l.fields.id in items_dict ? items_dict[item_l.fields.id] : false;
        const isLocalNewer = false;
        try {
          isLocalNewer = item_r && item_l.fields.updated && item_r.updated && item_l.fields.updated.getTime() > item_r.updated.getTime();
        } catch (error) {
          console.log(item_l.fields.updated+" : "+item_r.updated,error);
        }
        
        if( !(item_l.fields.id in items_dict) || isLocalNewer){
          if(!isPhoto ||  item_l.fields.data != null){
            items_to_upload.push(item_l.fields);
          }
        }
      }
      uploaded = 0;
      infos.push ("    Count to upload : "+items_to_upload.length);
      if(items_to_upload.length>0 && this.email ){
        const out_up = await this.insertMany(db, items_to_upload);
        uploaded = (out_up && out_up.insertedIds && out_up.insertedIds instanceof Object) ? Object.keys(out_up.insertedIds).length : 0;
      }
      infos.push ("    Uploaded : "+uploaded);
      return infos;
    }
    synchronize = async()=>{
      await this.initDb();
      let info_C = [];
      if(this.doClean){
        info_C = await this.cleanAll();
        info_C = ["Cleanning :",].concat(info_C);
      }
      console.log("synch Products");
      let info = await this.synchronize_item(this.products_mdb, Product);
      info = ["Products :",].concat(info);
      console.log("synch Companies");
      let info1 = await this.synchronize_item(this.companies_mdb, Company);
      info1 = ["Companies :",].concat(info1);
      let info2 = await this.synchronize_item(this.photos_mdb, Photo,true);
      info2 = ["Photos :",].concat(info2);

      info = info_C.concat(info);
      info = info.concat(info1);
      info = info.concat(info2);
      
      //await this.synchronize_item(this.history_mdb, Product);
      return info;
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