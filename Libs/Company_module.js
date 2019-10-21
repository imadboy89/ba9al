import DB from "./DB";
import getCountry from "./Countries";

class Company {
    constructor() {
        let list = [];
        this.table_name = "companies";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"country":null,
        };
        this.fields_defenition = [
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "name text",
            "desc text",
            "img text",
            "country text",
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
        //console.log("company");
    }
    doesExist(where){
        return this.DB.doesExist(where);
    }
    save(){
        this.fields.country = this.fields.country>0 ? getCountry(this.fields.country) : this.fields.country;
        return this.doesExist({"id":this.fields.id}).then((res)=>{
            if (res["doesExist"]==false){
                return this.DB.insert();

            }else{
                return this.DB.update();
            }
        });
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