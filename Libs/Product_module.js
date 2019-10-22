import DB from "./DB";
import Company from './Company_module';
import Photo from "./Photo_module";

class Product {
    constructor(fields) {
        this.table_name = "products";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"company":null,  "price":null
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
                company_ob.fields.name = this.fields.company;
                company_ob.fields.id = this.fields.company;
                company_ob.fields.country = this.fields.company.slice(0,3);
                company_ob.save();
            }
        });

    }
    savePhoto(){
        let photo_ob = new Photo();
        photo_ob.fields.id = this.fields.id;
        photo_ob.fields.data = this.photo_data;
        return photo_ob.save().then(output=>{
            console.log("saved PH");
        });
    }
    
    save = async ()=>{
        const res_prod = await this.doesExist({"id":this.fields.id});
        if (res_prod["doesExist"]==false){
            await this.saveCompany();
            await  this.savePhoto();
            return this.DB.insert();

        }else{
            await  this.saveCompany();
            await  this.savePhoto();
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
    filter_origin = async (where={})=>{
        return await   this.DB.filter(Product,where).then(output=>{
            if(output["success"]){
                output["list"].forEach(prod => {
                    prod.getCompany();
                    prod.getPhoto();
                });
            }
            return output;
        });
    }
    getExtra(list){
        return new Promise((resolve) => {
            for (let index = 0; index < list.length; index++) {
                const prod = list[index];
                
                prod.getCompany();
                prod.getPhoto();
            }
            resolve(list);
        });
    }
    filter = async (where={})=>{
        let output = await   this.DB.filter(Product,where);
        if(output["success"]){
            //output["list"].forEach(prod => {
            for (let index = 0; index < output["list"].length; index++) {
                const prod = output["list"][index];
                
                await prod.getCompany();
                await prod.getPhoto();
            }

            
        }
        return output;
    }

    getPhoto(){
        if(this.photo_ob){
            return new Promise(resolve=>{
                resolve(this.photo_ob);
            });
        }else{
            this.photo_ob = new Photo();
            return this.photo_ob.get({id:this.fields.id});
        }
        
    }
    getProduct(id){
        let query = "select products."+this.fields_defenition.join(",prudcts.")+
                    ",photos.data where products.id=?";
        this.DB.executeSql(query, [id,]).then(output=>{
        }) ; 
    }
    filterWithExtra(where={},limit){
        console.log("filterWithExtra");
        const where_build = this.DB.build_where(where);
        const fields_name = Object.keys(this.fields);
        let query = "select products."+fields_name.join(",products.")+
              //",photos.data where products.id=photos.id limit 1";
              ",photo.data from products LEFT JOIN photo ON products.id=photo.id "+where_build[0];
        return this.DB.executeSql(query, where_build[1]).then(output=>{
            let list = [];
            let dara_rows = output["ResultSet"]["rows"]["_array"] ;
            if(output["success"] && dara_rows.length>=1){
                dara_rows.forEach(res => {
                    let _module = new Product();
                    _module.photo_data = res["data"];
                    _module.photo_ob = new Photo({id:res["id"],"data":res["data"]});
                    delete res["data"] ;
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


export default Product;