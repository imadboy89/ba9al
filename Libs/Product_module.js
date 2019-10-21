import DB from "./DB";
import Company from './Company_module';
import Photo from "./Photo_module";

class Product {
    constructor() {
        this.table_name = "products";
        this.fields = {
            "id":null,"name":null,"desc":null,"img":null,"company":null,  "price":null
        };
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
    //save = async ()=>{
    saveCompany(){
        let company_ob = new Company();
        company_ob.doesExist({"id":this.fields.company}).then((res)=>{
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
        photo_ob.save();
    }
    save(){
        return this.doesExist({"id":this.fields.id}).then((res_prod)=>{
            if (res_prod["doesExist"]==false){
                this.saveCompany();
                this.savePhoto();
                return this.DB.insert();

            }else{
                this.saveCompany();
                this.savePhoto();
                return this.DB.update();
            }
        });
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
}


export default Product;