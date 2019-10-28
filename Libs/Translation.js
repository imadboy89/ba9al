import LocalStorage from "./LocalStorage";

class translation{
    constructor(LS){
        this.language = "en";
        this.translation = {
            
            
            "Incorect_barcode_please_try_again"             : {"ar":"الباركود غير صحيح ، يرجى المحاولة مرة أخرى"         ,"fr":"Incorrect code a bare, essayer autre fois!","dr":"code machi s7i7, 3awd scanni mara akhra!",},
            "Sych_Now"             : {"ar":"تزامن"         ,"fr":"Sych Now","dr":"Sych_Now",},
            "Synchronize_data"             : {"ar":"مزامنة البيانات"         ,"fr":"synchronizer les donnes","dr":"synchronizi data",},
            "Generate"             : {"ar":"توليد"         ,"fr":"Générer","dr":"Générer",},
            "Generate_backup"             : {"ar":"توليد النسخ الاحتياطي"         ,"fr":"Générer une sauvegarde","dr":"generer l i7tiyat",},
            "calculate_more"             : {"ar":"احسب أكثر"         ,"fr":"calculer plus","dr":"zid sl3a fel 7seb",},
            "No_Bar_Code"             : {"ar":"لا رمز شريط"         ,"fr":"Pas de Code a bar","dr":"Mkaynchi code a bar",},
            "AutoFocus"             : {"ar":"AutoFocus"         ,"fr":"AutoFocus","dr":"AutoFocus",},
            "Ratio"             : {"ar":"Ratio"         ,"fr":"Ratio","dr":"Ratio",},
            "Photo_quality"             : {"ar":"جودة الصورة"         ,"fr":"Qualité de photo","dr":"quality d photo",},
            "Take_Photo"             : {"ar":"التقاط صورة"         ,"fr":"Prendre une photo","dr":"Sawr prodwi",},
            "Name"                       : {"ar":"اسم"              ,"fr":"Nom","dr":"Smiya",},
            "Last_cleared_history"        : {"ar":"تاريخ آخر مسح"              ,"fr":"Dernier historique effacé","dr":"akhir mara tmsa7",},
            "Clear_history"        : {"ar":"مسح التاريخ"              ,"fr":"Vider historique","dr":"msa7 sijil",},
            "Clear_cache"      : {"ar":"مسح ذاكرة التخزين المؤقت"              ,"fr":"Vider Cache","dr":"msa7 lcache",},
            "Name"                       : {"ar":"اسم"              ,"fr":"Nom","dr":"Smiya",},
            "Snap"                       : {"ar":"Snap"              ,"fr":"Snap","dr":"Snap",},
            "Image_quality"              : {"ar":"جودة الصورة"        ,"fr":"Quality d'image","dr":"qualiti d photo",},
            "Add"                        : {"ar":"إضافة"            ,"fr":"Ajouter","dr":"Dakhal",},
            "Items_count"                : {"ar":"عدد العناصر"        ,"fr":"Nombre d'activles","dr":"3adad d sel3a",},
            "Ok"                         : {"ar":"حسنا"             ,"fr":"D'accord","dr":"Safi",},
            "History"                    : {"ar":"التاريخ"            ,"fr":"Historique","dr":"sijil",},
            "+"                          : {"ar":"+"               ,"fr":"+","dr":"+",},
            "Delete"                     : {"ar":"حذف"             ,"fr":"Suppremer","dr":"Msa7",},
            "Update"                     : {"ar":"تحديث"            ,"fr":"Modifier","dr":"Bedel",},
            "Edit"                       : {"ar":"تعديل"             ,"fr":"Modifier","dr":"Bedel",},
            "Save"                       : {"ar":"حفظ"              ,"fr":"Sauvegarder","dr":"Sejel",},
            "Company"                    : {"ar":"شركة"             ,"fr":"Compagnie","dr":"Charika",},
            "Product"                    : {"ar":"المنتج"             ,"fr":"Produit","dr":"Sel3a",},
            "Country"                    : {"ar":"بلد"               ,"fr":"Payer","dr":"Dawla",},
            "Code"                       : {"ar":"الشفرة"            ,"fr":"Code","dr":"Kod",},
            "Price"                      : {"ar":"السعر"             ,"fr":"Prix","dr":"Taman",},
            "Calculate"                  : {"ar":"حساب"            ,"fr":"Calculer","dr":"7seb",},
            "Total"                      : {"ar":"مجموع"            ,"fr":"Total","dr":"Majmo3",},
            "Language"                   : {"ar":"لغة"              ,"fr":"Language","dr":"Logha",},
            "Scan"                       : {"ar":"مسح"             ,"fr":"Scanner","dr":"Scani",},
            "Home"                       : {"ar":"الرئيسية"      ,"fr":"Accueil","dr":"Ra2issiya",},
            "Companies"                  : {"ar":"الشركات"           ,"fr":"Compagnies","dr":"charikat",},
            "Products"                   : {"ar":"منتجات"            ,"fr":"Produits","dr":"Sel3a",},
            "Quantity"                   : {"ar":"كمية"             ,"fr":"Quantité","dr":"Kimiya",},
            "Bare code"                  : {"ar":"الرمز العاري"        ,"fr":"Code a bar","dr":"Code a bar",},
            "Cancel"                     : {"ar":"إلغاء"             ,"fr":"Annuler","dr":"Bna9ess",},
            "Check_price"                : {"ar":"التحقق من السعر"        ,"fr":"Verifier le prix","dr":"Chof taman",},
            "Calculate_products"         : {"ar":"حساب المنتجات"      ,"fr":"Calculer des produits","dr":"7seb chi Smiya",},
            "Product_does_not_exist"     : {"ar":"المنتج غير موجود"     ,"fr":"Produit n'exist pas","dr":"Prodwi mamsjelchi",},
            "Product_already_Exist"      : {"ar":"المنتج موجود بالفعل"    ,"fr":"Produit deja exist","dr":"Prodwi deja kayn",},
            "Company_already_Exist"      : {"ar":"الشركة موجودة بالفعل"   ,"fr":"Compagnie déjà exist","dr":"Charika déja kayna",},
            "Product_found"              : {"ar":"تم العثور على المنتج"    ,"fr":"Produit trouvé","dr":"Prodwi kayn",},
            "Company_found"              : {"ar":"وجدت الشركة"        ,"fr":"Compagnie trouvé","dr":"Charika kayna",},
            "Product_not_found"          : {"ar":"الصنف غير موجود"    ,"fr":"Produit pas trouvé","dr":"Prodwi makaynchi",},
            "Add_another"            : {"ar":"أضف واحدة أخرى"    ,"fr":"Ajouter autre","dr":"dakhal akhor",},
            "Scan_product_bar_code"     : {"ar":"مسح الرمز الشريطي للمنتج" ,"fr":"Scanner code a bar de produit","dr":"Scanni code d prowi",},
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