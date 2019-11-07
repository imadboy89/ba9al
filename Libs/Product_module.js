import DB from "./DB";
import Company from './Company_module';
import Photo from "./Photo_module";

class Product {
    constructor(fields) {
        this.table_name = "products";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"company":null,  "price":null,
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
            "company INTEGER",
            "price REAL",
            "entered DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated DATETIME DEFAULT NULL"
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
        this.company = null;
        this.quantity = 1;
        this.rand = Math.random();
        this.company_ob = null;
        this.photo_ob = null;
    }

    doesExist(where){
        return this.DB.doesExist(where);
    }
    getCompany(){
        if(this.company_ob){
            return new Promise(resolve=>{
                resolve(this.company_ob);
            });
        }else{
            this.company_ob = new Company();
            return this.company_ob.get({id:this.fields.company});
        }
    }

    //save = async ()=>{
    saveCompany(){
        let company_ob = new Company();
        return company_ob.doesExist({"id":this.fields.company}).then((res)=>{
            if (res["doesExist"]==false){
                const company = "0".repeat(8-this.fields.company.length)+this.fields.company;
                company_ob.fields.name = this.fields.company;
                company_ob.fields.id = this.fields.company;
                company_ob.fields.country = company.slice(0,3);
                company_ob.save();
            }
        });

    }
    savePhoto(){
        if(this.photo_data){
            let photo_ob = new Photo();
            photo_ob.fields.id = this.fields.id;
            photo_ob.fields.data = this.photo_data;
            return photo_ob.save().then(output=>{
                console.log("saved PH");
            });
        }
    }
    
    save = async (ignoreExtra=false)=>{
        const res_prod = await this.doesExist({"id":this.fields.id});
        if(!ignoreExtra){
            await this.saveCompany();
            await  this.savePhoto();
        }
        if (res_prod["doesExist"]==false){
            return this.DB.insert();
        }else{
            return this.DB.update();
        }
    }
    deletePhoto(){
        let photo_ob = new Photo();
        photo_ob.get({"id":this.fields.id}).then((res)=>{
            if (res["res"]!=false){
                photo_ob.delete();
            }
        });
    }
    delete(){
        this.deletePhoto();
        return this.DB.delete();
    }
    //get(where){
    get = async (where={})=>{
        const output = await this.DB.get(where);
        await this.getCompany();
        await this.getPhoto();
        return output;
    }
    filter(where={}){
        return this.DB.filter(Product,where);
    }

    getPhoto(){
        if(this.photo_ob && this.photo_ob.fields && this.photo_ob.fields.data ){
            return new Promise(resolve=>{
                resolve(this.photo_ob);
            });
        }else{
            this.photo_ob = new Photo();
            return this.photo_ob.get({id:this.fields.id});
        }
        
    }
    getMaxBarCode_noBarCode(){
        const query = "SELECT max(id) AS max_id FROM "+this.table_name+" WHERE desc=?";
        let max_id= 0;
        return this.DB.executeSql(query, ["NoBarCode",]).then(output=>{
            let list = [];
            let dara_rows = output["ResultSet"]["rows"]["_array"] ;
            if(output["success"] && dara_rows.length==1){
                dara_rows.forEach(res => {
                    res["data"] ;
                });
                max_id = dara_rows[0]["max_id"] ? dara_rows[0]["max_id"] : 6119999900001;
            }
            output["success"] = list.length>0 ? true : false;
            delete output["ResultSet"];
            output["maxId"] = max_id ;
            return output;
        });
    }
    filterWithExtra(where={},page,perPage){
        
        let limit = "";
        if(perPage){
            limit = "limit "+(page*perPage)+", "+perPage;
        }
        
        const where_build = this.DB.build_where(where);
        const fields_name = Object.keys(this.fields);
        let query = "select products."+fields_name.join(",products.")+
              //",photos.data where products.id=photos.id limit 1";
              ",photo.data,companies.name AS company_name "+
              " FROM "+this.table_name+
              " LEFT JOIN photo ON products.id=photo.id"+
              " LEFT JOIN companies ON products.company=companies.id "+where_build[0] + " ORDER BY products.entered DESC "+limit  ;
        return this.DB.executeSql(query, where_build[1]).then(output=>{
            let list = [];
            if("error" in output && output["error"] && output["error"] !=""){
                console.log(output["error"]);
            }else{
                let dara_rows = output["ResultSet"]["rows"]["_array"] ;
                if(output["success"] && dara_rows.length>=1){
                    dara_rows.forEach(res => {
                        let _module = new Product();
                        //_module.photo_data = res["data"];
                        //////////////////////////////////  PHOTO
                        _module.photo_ob = new Photo({id:res["id"],"data":res["data"]});
                        delete res["data"] ;
                        //////////////////////////////////  COMPANY
                        _module.company_ob = new Company({id:res["company"],name:res["company_name"]});
                        delete res["company_name"] ;
                        ///////////////////////////////////////////
                        res_keys = Object.keys(res);
                        for (let i = 0; i < res_keys.length; i++) {
                            const key = res_keys[i];
                            _module.fields[key] = res[key];
                        }
                        //regenrerate companies:
                        /*
                        console.log((_module.fields.id+"").length , _module.fields.id  , (_module.fields.id+"").slice(0,8));
                        if((_module.fields.id+"").length >=8 ){
                            _module.fields.company = (_module.fields.id+"").slice(0,8) ;
                            _module.save();
                            _module.company_ob.fields.id  = _module.fields.company;
                            _module.company_ob.fields.name = _module.fields.company+"";
                            _module.company_ob.save();
                        }
                        */
                        list.push(_module);
                    });
                }
            }
            output["success"] = list.length>0 ? true : false;
            delete output["ResultSet"];
            output["list"] = list ;
            return output;
        });
    }
}


export default Product;