import LocalStorage from "./LocalStorage";

class translation{
    constructor(LS){
        this.language = "en";
        this.translation = {
            "Your_invitation_has_been_accepted"                : {"ar":"تم قبول دعوتك"        ,"fr":"Votre invitation a été acceptée","dr":"da3wa dyalk t9blat",},
            "Accepted_by"                : {"ar":"تم قبول دعوتك بواسطة"        ,"fr":"Accepté par","dr":"9bela",},

            "Invitation_for_partnership"                : {"ar":"دعوة للشراكة"        ,"fr":"Invitation au partenariat","dr":"da3wa li charaka",},
            "Invitation_from"                : {"ar":"دعوة من"        ,"fr":"Invitation de","dr":"d3wa men",},
            "Send"                : {"ar":"إرسال"        ,"fr":"Envoyer","dr":"Sayfet",},
            "Message_to"                : {"ar":"رسالة إلى"        ,"fr":"Message à","dr":"Message l ",},
            "Admin_tmp"                : {"ar":"Admin_tmp"        ,"fr":"Admin_tmp","dr":"Admin_tmp",},
            "New_purchase_by"                : {"ar":"شراء جديد من قبل"        ,"fr":"Nouvel achat par","dr":"T9adya jdida mn",},
"Please_open_and_clode_the_app_to_auto_update"                : {"ar":"الرجاء فتح التطبيق وإغلاقه للتحديث التلقائي."        ,"fr":"S'il vous plaît ouvrir et fermer l'application pour la mise à jour automatique","dr":"pls chod w fta7 l app bach t3ml ta7dit .",},
            "New_update_available"                : {"ar":"تحديث جديد متاح"        ,"fr":"Nouvelle mise à jour disponible","dr":"ta7dit jdid",},
            "Orders_count"                : {"ar":"عدد الطلبات"        ,"fr":"Le nombre de commandes","dr":"3adad d commandes",},
            "New_Updates_for_products_database"             : {"ar":"تحديثات جديدة لقاعدة بيانات المنتجات"         ,"fr":"Nouvelles mises à jour pour la base de données de produits","dr":"Ta7dit jdid n base donne dyal prodwiyats",},
            "New_products"             : {"ar":"منتجات جديدة"         ,"fr":"Nouveaux produits","dr":"Prodwiyat jdad",},
            "Updated_products"             : {"ar":"المنتجات المحدثة"         ,"fr":"Produits mis à jour","dr":"Prodwiyat tbdlo",},
            "New_order_X_items__Total"             : {"ar":"طلب جديد: X عناصر ، المجموع"         ,"fr":"Nouvelle commande: X items, Total","dr":"Commande jdida , X d 7ajat, total",},
            "Ordered_by"             : {"ar":"بطلب من"         ,"fr":"Commandé par","dr":"command mn",},
            "Version"             : {"ar":"الإصدار"         ,"fr":"Version","dr":"Version",},
            "Logged_as"             : {"ar":"متصل ك"         ,"fr":"Connecté","dr":"Mconnecti b",},
            "Cloud_history_cleaned_successfully"             : {"ar":"سحابة التاريخ تنظيفها بنجاح"         ,"fr":"L'historique des cloud ​​nettoyé avec succès","dr":"historique d cloud tms7o",},
            "Cloud_history_failed"             : {"ar":"فشل سحابة التاريخ"         ,"fr":"L'historique des cloud ​​a échoué","dr":"Riglaj",},
            "Settings"             : {"ar":"الإعدادات"         ,"fr":"Paramètres","dr":"Riglaj",},
            "Pending"             : {"ar":"قيد الانتظار"         ,"fr":"En attente","dr":"taAcceptik",},
            "Manage"             : {"ar":"إدارة"         ,"fr":"Gérer","dr":"Gérer",},
            "Partners"             : {"ar":"شركاء"         ,"fr":"Les partenaires","dr":"choraka2",},
            "Partner"             : {"ar":"شريك"         ,"fr":"Partenaire","dr":"charik",},
            "You_need_internet_connection_for_this_action"             : {"ar":"تحتاج إلى اتصال بالإنترنت لهذا الإجراء"         ,"fr":"Vous avez besoin d'une connexion Internet pour cette action","dr":"Khask connexion bach t3mel hadchi",},
            "You_need_internet_connection_to"             : {"ar":"تحتاج إلى اتصال بالإنترنت ل"         ,"fr":"Vous avez besoin d'une connexion Internet pour ","dr":"Khask connexion bach ",},
            "User_name"             : {"ar":"اسم المستخدم"         ,"fr":"Nom d'utilisateur","dr":"Ism lmosta3mil",},
            "Users"             : {"ar":"المستخدمين"         ,"fr":"Utilisateurs","dr":"lmosta3milin",},
            "Are_you_sure_you_want_to_clear_database"             : {"ar":"هل أنت متأكد أنك تريد مسح قاعدة البيانات؟"         ,"fr":"Êtes-vous sûr de vouloir effacer la base de données?","dr":"M2aked baghi tmsa7 base donee ?",},
            "This_will_remove_all_the_products_and_companies"             : {"ar":"سيؤدي هذا إلى إزالة جميع المنتجات والشركات"         ,"fr":"Cela supprimera tous les produits et sociétés","dr":"Ghadi tmsa7 prouiyat w charikat kamlin ",},
            "Requesting_for_camera_permission"  : {"ar":"طلب إذن الكاميرا"         ,"fr":"Demander l'autorisation de la caméra","dr":"Activi camera n ba9Al App",},
            "No_access_to_camera"             : {"ar":"لا يمكن الوصول إلى الكاميرا"         ,"fr":"Pas d'accès à la caméra","dr":"Camera mblokiya 3la ba9al App",},
            "Product_name"             : {"ar":"اسم المنتج"         ,"fr":"Nom du produit","dr":"Ism d prodwi",},
            "All"             : {"ar":"الكل"         ,"fr":"Tout","dr":"Kolchi",},
            "Invite"             : {"ar":"أدعوه"         ,"fr":"Inviter","dr":"invitih",},
            "Accept"             : {"ar":"قبول"         ,"fr":"Accepter","dr":"9bel",},
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
            "Clear_cloud"      : {"ar":"مسح السحابية"              ,"fr":"Vider cloud","dr":"Msa7 cloud",},
            "Clear_local"      : {"ar":"مسح المحلية"              ,"fr":"Vider local","dr":"Msa7 local",},
            "Clear"      : {"ar":"مسح"              ,"fr":"Vider","dr":"Msa7",},
            "Clear_remote_Backup"      : {"ar":"مسح النسخ الاحتياطي عن بعد"              ,"fr":"Vider Backup a distance.","dr":"Msa7 backup",},
            "Close"                       : {"ar":"أغلق"              ,"fr":"Fermer","dr":"Chod",},
            "Name"                       : {"ar":"اسم"              ,"fr":"Nom","dr":"Smiya",},
            "Snap"                       : {"ar":"Snap"              ,"fr":"Snap","dr":"Snap",},
            "Image_quality"              : {"ar":"جودة الصورة"        ,"fr":"Quality d'image","dr":"qualiti d photo",},
            "Add"                        : {"ar":"إضافة"            ,"fr":"Ajouter","dr":"Dakhal",},
            "Items_count"                : {"ar":"عدد العناصر"        ,"fr":"Nombre d'articles","dr":"3adad d sel3a",},
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
    getTrans(string_,addstr=""){
        let obj = {};
        for (let key in this.translation){
            if(this.translation.hasOwnProperty(key)){
              if(key == string_){
                tr = this.translation[key];
                tr["en"] = key.replace(/_/g," ");
                obj = Object.assign({}, tr);
                obj["en"] += addstr;
                obj["ar"] += addstr;
                obj["fr"] += addstr;
                obj["dr"] += addstr;
                break;
              }
            }
         }
         return obj;
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