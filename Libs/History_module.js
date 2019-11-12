import DB from "./DB";
import Product from "./Product_module";
class History {
    constructor(fields=null) {
        let list = [];
        this.table_name = "history";
        this.fields = {
            "id":null,
            "hist_id":null,
            "month":null,
            "product_id":null,
            "price":null,
            "quantity":null,
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
            "id INTEGER PRIMARY KEY",
            "hist_id TEXT",
            "month TEXT",
            "product_id INTEGER",
            "price REAL",
            "quantity INTEGER",
            "entered DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated DATETIME DEFAULT NULL"
        ];
        this.fields_defenition_str = this.fields_defenition.join(",")
        this.DB = new DB(this);
    }
    getMonth(date){
        return date.split(" ")[0].split("-").slice(0,2).join("-");
    }
    importLS = async(history)=>{
        try {
            console.log("history",history);
            if (!history || history.length==0){
                return false;
            }
            const history_exist = await this.filter();
            console.log("history_exist",history_exist);
            if( ! history_exist || !history_exist["success"] || !history_exist["list"] || history_exist["list"].length == 0){
                return false
            }            
        } catch (error) {
            console.log(error);
            return false;
        }

        //await  this.DB.empty();
        for (let i = 0; i < history.length; i++) {
            const histt = history[i];
            const month = this.getMonth(histt["title"]);
            for (let j = 0; j < histt["list"].length; j++) {
              const prodValues = histt["list"][j];
              let prod_h = new Product(prodValues);
              prod_h.is_hist = true;
              prod_h.quantity = prodValues.quantity;
              history_ob = new History({
                "hist_id":histt["title"]+":00",
                "month":month,
                "product_id":prod_h.fields.id,
                "price":prodValues.price,
                "quantity":prodValues.quantity,
                "entered":histt["title"]+":00","updated":null
              });
              history_ob.save().then(outputt=>console.log(outputt));
            }
  
          }
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
    filter(where={},orderby="",limit=""){
       return  this.DB.filter(History,where,orderby,limit);
    }
    getLastHistory(){
        
    }
    gethistory(){
        return this.filter({},"id desc").then(output=>{
            if(!output["success"] || !output["list"]){
                return output;
            }
            let list_by_month = {};
            let total = 0 ;
            let month_total = {};
            let t9adya_total = {};
            for (let i  = 0; i  < output["list"].length; i ++) {
              const Hist = output["list"][i];

              if(Hist.fields.month in list_by_month){
                month_total[Hist.fields.month] += Hist.fields.quantity*Hist.fields.price;
                  if (Hist.fields.hist_id in list_by_month[Hist.fields.month]){
                    list_by_month[Hist.fields.month][Hist.fields.hist_id].push(Hist);
                  }else{
                    list_by_month[Hist.fields.month][Hist.fields.hist_id] = [Hist,];
                  }
              }else{
                month_total[Hist.fields.month] = Hist.fields.quantity*Hist.fields.price;
                list_by_month[Hist.fields.month] = {};
                list_by_month[Hist.fields.month][Hist.fields.hist_id] = [Hist,];
              }
              
              if(Hist.fields.hist_id in t9adya_total){
                t9adya_total[Hist.fields.hist_id] += Hist.fields.quantity*Hist.fields.price;
              }else{
                t9adya_total[Hist.fields.hist_id] = Hist.fields.quantity*Hist.fields.price;
              }
              
            }
            
            return [list_by_month,month_total,t9adya_total] ;

        });
    }
    filterWithExtra = async(where={},orderby="",limit="",is_last_history=false)=>{
        let history_q = await this.filter(where,orderby,limit);
        if(!history_q || (history_q["error"] && history_q["error"]!="") || !history_q["success"] || !history_q["list"] || history_q["list"].length==0){
            return new Promise(resolve=>{
                resolve([]);
            });
        }
        const history_ = history_q["list"] ;
        let history = [];
        let products_ids = [];
        let hist_id_first = "";
        for (let j = 0; j < history_.length; j++) {
            if(j==0){
                hist_id_first = history_[j].fields.hist_id ;
            }
            if(is_last_history && hist_id_first!=history_[j].fields.hist_id){
                continue
            }
            products_ids.push(history_[j].fields.product_id);
            history.push(history_[j]);
        }
        let where1 = {};
        const _Product = new Product();
        let products = {};
        if(products_ids.length> 0 ){
            where1["products.id"] =  products_ids;
        }else{
            return new Promise(resolve=>{
                resolve([]);
            });
        }
        return _Product.filterWithExtra(where1).then(output=>{
            if(output["success"] && output["list"]){
                
                for (let i = 0; i < output["list"].length; i++) {
                    const prod = output["list"][i];
                    products[prod.fields.id] = prod;
                }
                //return output["list"];

                for (let j = 0; j < history.length; j++) {
                    const hist = history[j];
                    //products_ids.push(history[j].product_id);
                    let product_hist = ( history[j].fields.product_id in  products) ? products[history[j].fields.product_id] : null;
                    product_hist . is_hist = true;
                    product_hist . quantity = history[j].fields.quantity ;
                    product_hist . fields.price = history[j].fields.price; 
                    product_hist . hist_id  = history[j].fields.hist_id ;
                    history[j] = product_hist;
                }
                return history;
            }else{
                return false;
            }

        });
    }
}


export default History;