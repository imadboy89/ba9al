//import SQLite  from 'react-native-sqlite-storage';
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';

//SQLite.DEBUG(true);
//SQLite.enablePromise(true);



class DB {
    constructor(module_) {
        this.error = "";
        this.module = module_;
        this.database_name="ba9al.db";
        this.database_version="1.0";
        this.database_displayname="ba9al Database";
        this.database_size=200000;

        this.fields_name = Object.keys(module_.fields);
        this.fields_value = Object.values(module_.fields);
        this.fields_name_str = this.fields_name.join(",");
        this.fields_holder = [];
        for (let i = 0; i < this.fields_name.length; i++) {
            this.fields_holder.push("?");
        }
        this.fields_holder = this.fields_holder.join(",");

        this.db = SQLite.openDatabase(this.database_name, this.database_version, this.database_displayname, this.database_size);
        this.create_table();

    }
    create_table(){
      return this.db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS '+this.module.table_name+' ('+this.module.fields_defenition_str+')' ,
          [],
          (res,res1)=>{
          },
          (res,res1)=>{
          }
          );
      });
    }

    save(){
        if (this.module.fields.id==null){
            return this.insert();
        }else{
            return this.update();
        }
    }
    delete(){
      if (this.module.fields.id!=null){
        const query = "DELETE FROM "+this.module.table_name+" WHERE id=?";
        console.log(query,[this.module.fields.id,]);
        return this.executeSql(query,[this.module.fields.id,]);
      }
    }
    get(where){
        return this.select( where)
        .then(output=>{
            if(output["success"] && output["ResultSet"]["rows"]["_array"].length==1){
                const res = output["ResultSet"]["rows"]["_array"][0];
                res_keys = Object.keys(res);
                for (let i = 0; i < res_keys.length; i++) {
                    const key = res_keys[i];
                    this.module.fields[key] = res[key];
                }
            }

        });
    }

    filter(Module,where={}){
      return  this.select(where)
       .then(output=>{
           let list = []
           let dara_rows = output["ResultSet"]["rows"]["_array"] ;
           if(output["success"] && dara_rows.length>=1){
               dara_rows.forEach(res => {
                   let _module = new Module();
                   res_keys = Object.keys(res);
                   for (let i = 0; i < res_keys.length; i++) {
                       const key = res_keys[i];
                       _module.fields[key] = res[key];
                   }
                   list.push(_module);
               });

           }
           
           output["success"] = list.length>0 ? true : false;
           delete output["ResultSet"];
           output["list"] = list ;
           return output;
       });
   }















    update(){
      const fields_name = Object.keys(this.module.fields);
      const fields_value = Object.values(this.module.fields);
      const fields_name_str = fields_name.join(",");
      let fields_update = [];
      for (let i = 0; i < fields_name.length; i++) {
        fields_update.push(fields_name[i]+"=?");
      }
      fields_update = fields_update.join(",");
      
      const query = 'UPDATE '+this.module.table_name+' SET '+fields_update+' WHERE id='+this.module.fields.id;
      return this.executeSql(query, fields_value);
    }
    insert(){
      const fields_name = Object.keys(this.module.fields);
      const fields_value = Object.values(this.module.fields);
      const fields_name_str = fields_name.join(",");
      let fields_holder = [];
      for (let i = 0; i < fields_name.length; i++) {
          fields_holder.push("?");
      }
      fields_holder = fields_holder.join(",");
      let output = {"success":false,"error":"",output:""};
      const query = 'INSERT INTO '+this.module.table_name+' ('+fields_name_str+') VALUES ('+fields_holder+')';
      return this.executeSql(query, fields_value);

    }
    select(where){
      const where_values = Object.values(where);
      const where_keys   = Object.keys(where);
      let fields_holder = [];
      for (let i = 0; i < where_keys.length; i++) {
          fields_holder.push(where_keys[i]+"=?");
      }
      fields_holder = fields_holder.length>0 ? " WHERE "+fields_holder.join(" AND ") : "";
      let output = {"success":false,"error":"",output:""};
      const fields = Object.keys(this.module.fields);

      const query = 'SELECT '+fields.join(",")+' FROM '+this.module.table_name+' '+fields_holder;
      return this.executeSql(query, where_values);
    }

    executeSql(query,values){
      let output = {"success":false,"error":"",output:""};
      return new Promise((resolve) => {
        this.db.transaction((tx) => {
              tx.executeSql(query, 
                values,
              (Transaction,ResultSet)=>{
                output["success"] = true;
                output["ResultSet"] = ResultSet;
                resolve(output);
              },
              (Transaction,ResultSet)=>{
                output["error"] = ResultSet;
                console.log("DB.ERROR : ",ResultSet);
                resolve(output);
              }
              );
          },
          (Transaction,ResultSet)=>{resolve(ResultSet);},
          (Transaction,ResultSet)=>{resolve(ResultSet);}
          );
        });
    }
}

export default DB;