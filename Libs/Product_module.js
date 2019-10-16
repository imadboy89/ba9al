import DB from "./DB";

class Product {
    constructor() {
        this.table_name = "products";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"code":null,"company":null,  "price":null
        };
        this.fields_defenition = [
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "name text",
            "desc text",
            "img text",
            "company INTEGER",
            "code INTEGER",
            "price REAL",
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
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
       return  this.DB.filter(Product,where);
    }
}


export default Product;