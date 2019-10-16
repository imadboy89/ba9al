import DB from "./DB";

class Company {
    constructor() {
        let list = [];
        this.table_name = "companies2";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"country":null,"code":null,
        };
        this.fields_defenition = [
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "name text",
            "desc text",
            "img text",
            "country text",
            "code INTEGER",
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
        //console.log("company");
    }
    save(){
        return this.DB.save();
    }
    delete(){
        return this.DB.delete();
    }
    get(where){
        return this.DB.get(where);
    }
    filter(where={}){
       return  this.DB.filter(Company,where);
    }
}


export default Company;