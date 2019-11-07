import LocalStorage from "./LocalStorage";

class translation{
    constructor(LS){
        this.language = "en";
        this.translation = {
            "Product_name"             : {"ar":"اسم المنتج"         ,"fr":"Nom du produit","dr":"Ism d prodwi",},
            "All"             : {"ar":"الكل"         ,"fr":"Tout","dr":"Kolchi",},
            "Entered"             : {"ar":"مسجل"         ,"fr":"Entré","dr":"Dkhal f ",},
            "Updated"             : {"ar":"تم تحديث"         ,"fr":"sauvegardé","dr":"Tbdel f ",},
            "LastBackUp"             : {"ar":"النسخة الاحتياطية الاخيرة"         ,"fr":"Dernière sauvegarde","dr":"akhir backup",},
            "Yes"             : {"ar":"نعم"         ,"fr":"Oui","dr":"Ah",},
            "No"             : {"ar":"لا"         ,"fr":"Non","dr":"La",},
            "Sign_in"             : {"ar":"تسجيل الدخول"         ,"fr":"Se connecter","dr":"Tconnecta",},
            "Sign_up"             : {"ar":"اشترك"         ,"fr":"S'inscrire","dr":"Tsejel",},
            "Please_fill_the_required_fields"             : {"ar":"يرجى تعبئة جميع الحقول المطلوبة"         ,"fr":"Veuillez remplir les champs requis","dr":"kteb ma3lomat kamla",},
            "Are_you_sure_you_want_to_clear_backup"             : {"ar":"هل أنت متأكد أنك تريد مسح النسخ الاحتياطي؟"         ,"fr":"Êtes-vous sûr de vouloir effacer la sauvegarde?","dr":"MtZaked baghi tmsa7 backup ?",},
            "Are_you_sure_you_want_to_delete"             : {"ar":"هل أنت متأكد أنك تريد المسح ؟"         ,"fr":"Êtes-vous sûr de vouloir effacer ?","dr":"MtZaked baghi tmsa7 ?",},
            "Confirmation"             : {"ar":"التأكيد"         ,"fr":"Confirmation","dr":"Ta2kid",},
            "Incorect_barcode_please_try_again"             : {"ar":"الباركود غير صحيح ، يرجى المحاولة مرة أخرى"         ,"fr":"Incorrect code a bare, essayer autre fois!","dr":"Code machi s7i7, 3awd scanni mara akhra!",},
            "Sych_Now"             : {"ar":"تزامن"         ,"fr":"Sych Now","dr":"Sych_Now",},
            "Try_again"             : {"ar":"حاول مرة أخري"         ,"fr":"Réessayer","dr":"7Awl mara akhra",},
            "Email"             : {"ar":"البريد الإلكتروني"         ,"fr":"Email","dr":"Email",},
            "Credents"             : {"ar":"معرفات"         ,"fr":"identifiants","dr":"Credents",},
            "Password"             : {"ar":"كلمة المرور"         ,"fr":"Mot de pass","dr":"ra9m sirri",},
            "Synchronize_data"             : {"ar":"مزامنة البيانات"         ,"fr":"synchronizer les donnes","dr":"synchronizi data",},
            "Generate"             : {"ar":"توليد"         ,"fr":"Générer","dr":"Générer",},
            "Generate_backup"             : {"ar":"توليد النسخ الاحتياطي"         ,"fr":"Générer une sauvegarde","dr":"generer l i7tiyat",},
            "calculate_more"             : {"ar":"احسب أكثر"         ,"fr":"calculer plus","dr":"zid sl3a fel 7seb",},
            "No_Bar_Code"             : {"ar":"لا رمز شريط"         ,"fr":"Pas de Code a bar","dr":"Mkaynchi code a bar",},
            "AutoFocus"             : {"ar":"التركيز التلقائي"         ,"fr":"AutoFocus","dr":"AutoFocus",},
            "Ratio"             : {"ar":"نسبة"         ,"fr":"Ratio","dr":"Ratio",},
            "Photo_quality"             : {"ar":"جودة الصورة"         ,"fr":"Qualité de photo","dr":"quality d photo",},
            "Take_Photo"             : {"ar":"التقاط صورة"         ,"fr":"Prendre une photo","dr":"Sawr prodwi",},
            "Name"                       : {"ar":"اسم"              ,"fr":"Nom","dr":"Smiya",},
            "Last_cleared_history"        : {"ar":"تاريخ آخر مسح"              ,"fr":"Dernier historique effacé","dr":"akhir mara tmsa7",},
            "Clear_history"        : {"ar":"مسح التاريخ"              ,"fr":"Vider historique","dr":"msa7 sijil",},
            "Clear_cache"      : {"ar":"مسح ذاكرة التخزين المؤقت"              ,"fr":"Vider Cache","dr":"msa7 lcache",},
            "Clear_database"      : {"ar":"مسح قاعدة البيانات"              ,"fr":"Vider base donnee","dr":"msa7 base donnee",},
            "Clear"      : {"ar":"مسح"              ,"fr":"Vider","dr":"Msa7",},
            "Clear_remote_Backup"      : {"ar":"مسح النسخ الاحتياطي عن بعد"              ,"fr":"Vider Backup a distance.","dr":"Msa7 backup",},
            "Close"                       : {"ar":"أغلق"              ,"fr":"Fermer","dr":"Chod",},
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
            trans_new[key] = this.language in this.translation[key] ? this.translation[key][this.language] : key.replace(/_/g," ") ;
        });            
        return  trans_new;

    }
}

export default translation;