import DB from "./DB";

class Photo {
    constructor(fields=null) {
        let list = [];
        this.table_name = "photo";
        this.fields = {
            "id":null,"data":null,
        };
        if (fields){
            this.fields = fields;
            for(let key in fields){
                if (key in this.fields){
                    this.fields[key] = fields[key];
                }
            }
        }
        this.fields_defenition = [
            "id INTEGER PRIMARY KEY",
            "data BLOB",
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
    }
    doesExist(where){
        return this.DB.doesExist(where);
    }
    save(){
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
       return  this.DB.filter(Photo,where);
    }
}


export default Photo;