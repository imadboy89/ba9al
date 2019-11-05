import DB from "./DB";
import getCountry from "./Countries";
import Photo from "./Photo_module";
class Company {
    constructor(fields=null) {
        let list = [];
        this.table_name = "companies";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"country":null,
            "entered":null,"updated":null
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
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "name text",
            "desc text",
            "img text",
            "country text",
            "entered DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated DATETIME DEFAULT NULL"
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
        //console.log("company");
    }
    doesExist(where){
        return this.DB.doesExist(where);
    }
    save(){
        this.fields.country = (""+this.fields.id ).slice(0,3);
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



    filterWithExtra(where={},page, perPage){
        let limit = "";
        if(perPage){
            limit = "limit "+(page*perPage)+", "+perPage;
        }
        const where_build = this.DB.build_where(where);
        const fields_name = Object.keys(this.fields);
        let query = "select companies."+fields_name.join(",companies.")+
              //",photos.data where products.id=photos.id limit 1";
              ",photo.data,products.name as products_name,count(*) as products_count "+
              " FROM products "+
              " LEFT JOIN photo ON products.company=photo.id"+
              " LEFT JOIN companies ON products.company=companies.id "+where_build[0] + 
              " GROUP BY 1 order by products_count desc "+ " "+limit;
        return this.DB.executeSql(query, where_build[1]).then(output=>{
            let list = [];
            if ("error" in output ){
                console.log(output["error"]);
            }
            let dara_rows = output["ResultSet"]["rows"]["_array"] ;
            if(output["success"] && dara_rows.length>=1){
                dara_rows.forEach(res => {
                    let _module = new Company();
                    if(res["id"]==null){
                        return;
                    }
                    //////////////////////////////////  PHOTO
                    _module.photo_ob = new Photo({id:res["id"],"data":res["data"]});
                    delete res["data"] ;
                    //////////////////////////////////  Products count
                    _module.Products_count = res["products_count"] ;
                    delete res["products_name"] ;
                    delete res["products_count"] ;
                    ///////////////////////////////////////////
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

}


export default Company;