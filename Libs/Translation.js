import LocalStorage from "./LocalStorage";

class translation{
    constructor(LS){
        this.language = "en";
        this.translation = {
            "Check_price" : {"fr":"Verifier prix","dr":"Chof taman",},
            "Calculate_products" : {"fr":"Calculer des produits","dr":"7seb chi Smiya",},
            "calculate_more"     : {"fr":"calculer plus","dr":"zid sl3a fel 7seb",},
            "Name"        : {"fr":"Nome","dr":"Smiya",},
            "Image_quality"    : {"fr":"Quality d'image","dr":"qualiti d photo",},
            "Add"         : {"fr":"Ajouter","dr":"Dakhal",},
            "Items_count" : {"fr":"Nombre d'activles","dr":"3adad d sel3a",},
            "Ok"          : {"fr":"D'accord","dr":"Safi",},
            "History"     : {"fr":"Historique","dr":"sijil",},
            "+"           : {"fr":"+","dr":"+",},
            "Delete"      : {"fr":"Suppremer","dr":"Msa7",},
            "Update"      : {"fr":"Modifier","dr":"Bedel",},
            "Edit"        : {"fr":"Modifier","dr":"Bedel",},
            "Save"        : {"fr":"Sauvegarder","dr":"Sejel",},
            "Company"     : {"fr":"Compagnie","dr":"Charika",},
            "Product"     : {"fr":"Produit","dr":"Sel3a",},
            "Country"     : {"fr":"Payer","dr":"Dawla",},
            "Code"        : {"fr":"Code","dr":"Kod",},
            "Price"       : {"fr":"Prix","dr":"Taman",},
            "Calculate"   : {"fr":"Calculer","dr":"7seb",},
            "Total"       : {"fr":"Total","dr":"Majmo3",},
            "Language"    : {"fr":"Language","dr":"Logha",},
            "Scan"        : {"fr":"Scanner","dr":"Scani",},
            "Home"        : {"fr":"Accueil","dr":"Ra2issiya",},
            "Companies"   : {"fr":"Compagnies","dr":"charikat",},
            "Products"     : {"fr":"Produits","dr":"Sel3a",},
            "Quantity"    : {"fr":"Quantité","dr":"Kimiya",},
            "Bare code"   : {"fr":"Code a bare","dr":"Code a bare",},
            "Cancel"      : {"fr":"Annuler","dr":"Bna9ess",},
            "Check_price" : {"fr":"Verifier le prix","dr":"Chef taman",},
"Product_does_not_exist"  : {"fr":"Produit n'exist pas","dr":"Prodwi mamsjelchi",},
"Product_already_Exist"   : {"fr":"Produit deja exist","dr":"Prodwi deja kayn",},
"Company_already_Exist"   : {"fr":"Compagnie déjà exist","dr":"Charika déja kayna",},
"Product_found"           : {"fr":"Produit trouvé","dr":"Prodwi kayn",},
"Company_found"           : {"fr":"Compagnie trouvé","dr":"Charika kayna",},
"Product_not_found"       : {"fr":"Produit pas trouvé","dr":"Prodwi makaynchi",},
"Add_another_one"         : {"fr":"Ajouter autre.","dr":"dakhal wa7ed akhor",},
"Scan_product_bare_code"  : {"fr":"Scanner code a bare de produit","dr":"Scanni code d prowi",},
        }

        this.LS = LS;
    }

    getTranslation = async () => {
        if(this.LS && this.LS.getSettings){

        }else{
            this.LS = new LocalStorage();
        }
        this.language = await this.LS.getSettings("language");
        let trans_new = {};
        Object.keys(this.translation).forEach(key => {
            trans_new[key] = this.language in this.translation[key] ? this.translation[key][this.language] : key.replace("_"," ") ;
        });            
        return  trans_new;

    }
}

export default translation;