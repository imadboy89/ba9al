//import SQLite  from 'react-native-sqlite-storage';
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';

//SQLite.DEBUG(true);
//SQLite.enablePromise(true);
console.log(SQLite);



class DB {
    constructor(module_) {
        this.error = "";
        this.module = module_;
        console.log(module_);
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


/*
        this.db = SQLite.openDatabase(this.database_name, this.database_version, this.database_displayname, this.database_size);
        console.log("db",this.db);
        this.db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
          console.log('Foreign keys turned on')
        );
        */

    }
    create_table(db){
      return db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS '+this.module.table_name+' ('+this.fields_name_str+')' );
      });
    }

    initDB() {

        let db;
        return new Promise((resolve) => {
          db = SQLite.openDatabase(this.database_name, this.database_version, this.database_displayname, this.database_size);
          this.create_table(db).then((res)=>{
            console.log(res);
          });
        });
    }

    insertP(prod) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO Product VALUES (?, ?, ?, ?, ?)', [prod.prodId, prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice]).then(([tx, results]) => {
                resolve(results);
                });
            }).then((result) => {
                this.closeDatabase(db);
            }).catch((err) => {
                console.log(err);
            });
            }).catch((err) => {
            console.log(err);
            });
        });  
    }
      
    insert(table_name, data_assoc){
        const fields_name = Object.keys(data_assoc);
        const fields_value = Object.values(data_assoc);
        const fields_name_str = fields_name.join(",");
        let fields_holder = [];
        for (let i = 0; i < fields_name.length; i++) {
            fields_holder.push("?");
        }
        fields_holder = fields_holder.join(",");
        let output = {"success":false,"error":"",output:""};

        return new Promise((resolve) => {
            this.initDB().then((db) => {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO '+table_name+' ('+fields_name_str+') VALUES ('+fields_holder+')', 
                fields_value
                ).then(([tx, results]) => {
                resolve(results);
                });
            }).then((result) => {
                this.closeDatabase(db);
            }).catch((err) => {
                console.log(err);
            });
            }).catch((err) => {
            console.log(err);
            });
        }); 

        return db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO '+table_name+' ('+fields_name_str+') VALUES (?,?,?)',
              fields_value,
              (tx, results) => {

                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    output["success"]=true;
                    output["output"]=results.insertId;

                } else {
                  output["error"] = 'Registration Failed';
                }
                return output;
              }
            );
          });
    }
}

export default DB;