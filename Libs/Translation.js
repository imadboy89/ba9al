
class translation{
    constructor(language){
        this.language = language;
        this.default = "en";
        this.translation = {
            "Check_price" : {"fr":"Verifier prix","ar":"Chof taman",},
            "Calculate_products" : {"fr":"Calculer des produits","ar":"7seb chi Smiya",},
            "calculate_more"     : {"fr":"calculer plus","ar":"zid sl3a fel 7seb",},
            "Name"        : {"fr":"Nome","ar":"Smiya",},
            "Add"         : {"fr":"Ajouter","ar":"Dakhal",},
            "+"           : {"fr":"+","ar":"+",},
            "Delete"      : {"fr":"Suppremer","ar":"Msa7",},
            "Update"      : {"fr":"Modifier","ar":"Bedel",},
            "Edit"        : {"fr":"Modifier","ar":"Bedel",},
            "Save"        : {"fr":"Sauvegarder","ar":"Sejel",},
            "Company"     : {"fr":"Compagnie","ar":"Charika",},
            "Product"     : {"fr":"Produit","ar":"Sel3a",},
            "Country"     : {"fr":"Payer","ar":"Dawla",},
            "Code"        : {"fr":"Code","ar":"Kod",},
            "Price"       : {"fr":"Prix","ar":"Taman",},
            "Calculate"   : {"fr":"Calculer","ar":"7seb",},
            "Total"       : {"fr":"Total","ar":"Majmo3",},
            "Language"    : {"fr":"Language","ar":"Logha",},
            "Scan"        : {"fr":"Scanner","ar":"Scani",},
            "Home"        : {"fr":"Accueil","ar":"Ra2issiya",},
            "Companies"   : {"fr":"Compagnies","ar":"charikat",},
            "Products"     : {"fr":"Produits","ar":"Sel3a",},
            "Quantity"    : {"fr":"Quantité","ar":"Kimiya",},
            "Bare code"   : {"fr":"Code a bare","ar":"Code a bare",},
            "Cancel"      : {"fr":"Annuler","ar":"Bna9ess",},
            "Check_price" : {"fr":"Verifier le prix","ar":"Chef taman",},
"Product_does_not_exist"  : {"fr":"Produit n'exist pas","ar":"Prodwi mamsjelchi",},
"Product_already_Exist"   : {"fr":"Produit deja exist","ar":"Prodwi deja kayn",},
"Company_already_Exist"   : {"fr":"Compagnie déjà exist","ar":"Charika déja kayna",},
"Product_found"           : {"fr":"Produit trouvé","ar":"Prodwi kayn",},
"Company_found"           : {"fr":"Compagnie trouvé","ar":"Charika kayna",},
"Product_not_found"       : {"fr":"Produit pas trouvé","ar":"Prodwi makaynchi",},
"Add_another_one"         : {"fr":"Ajouter autre.","ar":"dakhal wa7ed akhor",},
"Scan_product_bare_code"  : {"fr":"Scanner code a bare de produit","ar":"Scanni code d prowi",},
        }
    }

    getTranslation(){
        let trans_new = {};
        Object.keys(this.translation).forEach(key => {
            trans_new[key] = this.language in this.translation[key] ? this.translation[key][this.language] : key.replace("_"," ") ;
        });
        return  trans_new;
    }
}

export default translation;