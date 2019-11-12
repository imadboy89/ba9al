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
        this.BackedUp = false; 
        this.db = SQLite.openDatabase(this.database_name, this.database_version, this.database_displayname, this.database_size);
        this.create_table();
        /*
        "DROP TABLE companies;"
        this.executeSql("ALTER TABLE companies2 RENAME TO companies;",[]).then(out=>{
          console.log(out) ;
        }) ; 
        this.db = null;
        */
        //"ALTER TABLE companies2 RENAME TO companies;"
    }
    backup(){
      const query = "SELECT * from "+this.module.table_name+" ";
      return this.executeSql(query,[]).then(output=>{
        output["data"] = output["ResultSet"]["rows"]["_array"];
        delete output["ResultSet"];
        return output;
      });
    }
    updateTables = async()=>{
      const q1 = "ALTER TABLE companies ADD entered DATETIME DEFAULT CURRENT_TIMESTAMP DEFAULT NULL ;"
      const q2 = "ALTER TABLE companies ADD updated DATETIME DEFAULT NULL;"
      const q3 = "ALTER TABLE products  ADD entered DATETIME DEFAULT CURRENT_TIMESTAMP DEFAULT NULL ;"
      const q4 = "ALTER TABLE products  ADD updated DATETIME DEFAULT NULL;"
      const q5 = "UPDATE products SET entered='2019-10-29 09-38' ;"
      const q6 = "UPDATE companies SET entered='2019-10-29 09-38' ;"

      const q7 = "ALTER TABLE photo ADD entered DATETIME DEFAULT CURRENT_TIMESTAMP DEFAULT NULL ;"
      const q8 = "ALTER TABLE photo ADD updated DATETIME DEFAULT NULL;"
      const q9 = "UPDATE photo SET entered='2019-10-29 09-38' ;"
      /*
      out = await this.executeSql(q1,[]); console.log(out);
      out = await this.executeSql(q2,[]);console.log(out);
      out = await this.executeSql(q3,[]);console.log(out);
      out = await this.executeSql(q4,[]);console.log(out);
      out = await this.executeSql(q5,[]);console.log(out);
      out = await this.executeSql(q6,[]);console.log(out);
      */
     out = await this.executeSql(q7,[]);console.log(out);
     out = await this.executeSql(q8,[]);console.log(out);
     out = await this.executeSql(q9,[]);console.log(out);
    }
    changetable = async ()=>{
      return;
      await this.executeSql("drop table companies;",[]);
      await this.executeSql("ALTER TABLE companies2 RENAME TO companies;",[]);
      
      return;
      let out_ss = await this.executeSql("drop table products2;",[]);
      let out = await this.executeSql('CREATE TABLE IF NOT EXISTS products2 ('+this.module.fields_defenition_str+')' ,[]);
      console.log(out);

      let out_s = await this.executeSql("select * from products;",[]);
      console.log(out);
      const res_arr = out_s["ResultSet"]["rows"]["_array"] ;
      //"id":null,"name":null,"desc":null,"img":null,"company":null,  "price":null
      //"id":null,"name":null,"desc":null,"img":null,"company":null,  "price":null
      for (let i = 0; i < res_arr.length; i++) {
        const comp = res_arr[i];
        let values = [ comp["code"],comp["name"],comp["desc"],comp["img"],comp["company"],comp["price"] ];
        await this.executeSql("INSERT INTO products2 values(?,?,?,?,?,?);",values);
      }
      console.log(await this.executeSql("select count(*) from products2;",values));
    }
    empty(){
      return this.executeSql("DELETE FROM "+this.module.table_name,[]);
    }
    getDateTime(){
      const date_ob = new Date();
      const date  = ("0" +date_ob.getDate()).slice(-2);
      const month = ("0" + (date_ob.getMonth() + 1) ).slice(-2);
      const year  = date_ob.getFullYear();
      const hours = ("0" +date_ob.getHours()).slice(-2);
      const min   = ("0" +date_ob.getMinutes()).slice(-2);
      const sec   = ("0" +date_ob.getSeconds()).slice(-2);
      return year + '-' + month + '-' + date + ' ' + hours + ':' + min + ":" + sec;
    }

    create_table(){
      return this.db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS '+this.module.table_name+' ('+this.module.fields_defenition_str+')' ,
          [],
          (res,res1)=>{
            //console.log(res,res1);
            //alert("success"+JSON.stringify(res1));
            return res1;
          },
          (res,res1)=>{
            //console.log(res,res1);
            alert("error"+JSON.stringify(res1));
            return res1;
          }
          );
      });
    }
    drop_create_table = async ()=>{
      //alert("empty table droping");
      out = await this.executeSql("DROP TABLE "+this.module.table_name,[]);
      return this.create_table();
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
        return this.executeSql(query,[this.module.fields.id,]);
      }
    }
    get(where){
        return this.select( where)
        .then(output=>{
            let res = false;
            if(output["success"] && output["ResultSet"]["rows"]["_array"].length==1){
                res = output["ResultSet"]["rows"]["_array"][0];
                res_keys = Object.keys(res);
                for (let i = 0; i < res_keys.length; i++) {
                    const key = res_keys[i];
                    this.module.fields[key] = res[key];
                }
            }
            output["success"] = true;
            delete output["ResultSet"];
            output["res"] = res ;
            return output;
        });
    }
    doesExist(where){
      return this.select( where)
      .then(output=>{ 
          let res=false;
          if(output && output["success"] && output["ResultSet"]["rows"]["_array"].length==1){
              res = output["ResultSet"]["rows"]["_array"][0];
              res_keys = Object.keys(res);
              
          }else{

          }
          output["success"] = true;
          delete output["ResultSet"];
          output["doesExist"] = res==false ? false : res ;
          return output;

      });
    }
    filter(Module,where={},orderby="",limit=""){
      return  this.select(where,orderby,limit)
       .then(output=>{
           let list = []
           let dara_rows = output && output["ResultSet"] && output["ResultSet"]["rows"] && output["ResultSet"]["rows"]["_array"] ?  output["ResultSet"]["rows"]["_array"] : [];
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
      fields_ = Object.assign({}, this.module.fields);
      if(fields_["entered"] == null){
        delete fields_["entered"];
      }
      if(!this.BackedUp){
        fields_["updated"] = this.getDateTime();
      }

      const fields_name = Object.keys(fields_);
      const fields_value = Object.values(fields_);
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
      fields_ = Object.assign({}, this.module.fields);
      if(fields_["entered"] == null){
        fields_["entered"] = this.getDateTime();
      }
      if(fields_["updated"] == null){
        delete fields_["updated"]
      }
      const fields_name = Object.keys(fields_);
      const fields_value = Object.values(fields_);
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

    build_where(where){
      const where_values = Object.values(where);
      const where_keys   = Object.keys(where);
      let fields_holder = [];
      let where_values_new = [];
      for (let i = 0; i < where_keys.length; i++) {
        if(Array.isArray(where_values[i])){
          let holders_symbol = [];
          for (let k = 0; k < where_values[i].length; k++) {
            const val = where_values[i][k];
            where_values_new.push(val);
            holders_symbol.push("?");
          }
          fields_holder.push(where_keys[i]+" in ("+holders_symbol.join(",")+") ");
        }else{
          fields_holder.push(where_keys[i]+"=?");
          where_values_new . push( where_values[i] );
        }  
      }
      fields_holder = fields_holder.length>0 ? " WHERE "+fields_holder.join(" AND ") : "";
      return [fields_holder,where_values_new];
    }
    select(where,orderby="",limit=""){
      orderby = orderby && orderby!="" ? " ORDER BY "+orderby : "";
      limit   = limit && limit !="" ? " LIMIT "+limit : "";
      const where_values = Object.values(where);
      const where_keys   = Object.keys(where);
      let fields_holder = [];
      for (let i = 0; i < where_keys.length; i++) {
          if(Array.isArray(where_values[i])){
            const values = where_values[i].join(",");
            where_values[i] = values;
            fields_holder.push(where_keys[i]+" in (?) ");
          }else{
            fields_holder.push(where_keys[i]+"=?");
          }
          
      }
      fields_holder = fields_holder.length>0 ? " WHERE "+fields_holder.join(" AND ") : "";
      let output = {"success":false,"error":"",output:""};
      const fields = Object.keys(this.module.fields);

      const query = 'SELECT '+fields.join(",")+' FROM '+this.module.table_name+' '+fields_holder + " "+orderby+limit;
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
                //alert( "errorrr ", JSON.stringify(ResultSet) );
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