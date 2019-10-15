import DB from "./DB";

class Company {
    constructor() {
        this.table_name = "companies";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"country":null,"code":null,
        };
        this.DB = new DB(this);
        //console.log("company");
    }
    save(){
        this.DB.insert(this.table_name,this.fields).then((output)=>{
            //console.log(output);
        });
    }
}


export default Company;