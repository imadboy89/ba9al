
class translation{
    constructor(language){
        this.language = language;
        this.default = "en";
        this.translation = {
            "Name":{"fr":"Nome","ar":"Smiya",},
            "Add":{"fr":"Ajouter","ar":"Dakhal",},
            "Delete":{"fr":"Suppremer","ar":"Msa7",},
            "Update":{"fr":"Modifier","ar":"Bedel",},
            "Save":{"fr":"Sauvegarder","ar":"Sejel",},
            "Company":{"fr":"Compagne","ar":"Charika",},
            "Product":{"fr":"Produit","ar":"Sel3a",},
            "Country":{"fr":"Payer","ar":"Dawla",},
            "Code":{"fr":"Code","ar":"Kod",},
            "Price":{"fr":"Prix","ar":"Taman",},
            "Calculate":{"fr":"Calculer","ar":"7seb",},
            "Total":{"fr":"Total","ar":"Majmo3",},
            "Language":{"fr":"Language","ar":"Logha",},
            "Scan":{"fr":"Scanner","ar":"Scani",},
            "Bare code":{"fr":"Code a bare","ar":"Code a bare",},
            "Cancel":{"fr":"Annuler","ar":"Bna9ess",},

        }
    }

    getTranslation(){
        let trans_new = {};
        Object.keys(this.translation).forEach(key => {
            console.log(this.language,key,this.translation[key]);
            trans_new[key] = this.language in this.translation[key] ? this.translation[key][this.language] : key ;
        });
        return  trans_new;
    }
}

export default translation;