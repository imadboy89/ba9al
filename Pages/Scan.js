import React from 'react';
import { ActivityIndicator, Text, View, Button, TouchableOpacity,TextInput,Image,Modal,Alert } from 'react-native';
import {styles_Btn,styles_list,buttons_style,styles} from "../Styles/styles";
import Company from "../Libs/Company_module";
import Product from "../Libs/Product_module";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderButton from "../Components/HeaderButton";
import LocalStorage from "../Libs/LocalStorage";
import AutoComplite from "../Components/autoComplite";
import History from "../Libs/History_module";
import backUp from "../Libs/backUp";
import { Audio } from 'expo-av';
import { Notifications } from 'expo';

class ScanScreen extends React.Component {
    constructor(props) {
      super(props);
      this.loadMp3(true);
      this.checkingRequests_inProcess = false;
      this.state = {
        isCalcule : false,
        isVisible_modal_scan : false,
        isVisible_modal_add : false,
        sql_error:null,
        items_list :[],
        method : null,
        disable_btns : false,
        Total : 0,
        scanned : null,
        hist_label:null,
        
      };
      this.last_requested_t9dya = "";
      this.counter = 0;
      this.company = new Company();
      this.product = new Product();
      this.continue_list=[];
      this.LS = new LocalStorage();
      this.History_ob = new History();
      this.lastNotifData = null;
      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          Translation_.getTranslation().then(tr=>{
            if(TXT != tr){
              TXT = tr;
              this.props.navigation.setParams({title:TXT.Scan});
            }
          });
          this.handle_navigation_notification();

          if(!this.state.items_list || this.state.items_list.length==0 || this.state.items_list[0].is_hist){
            this.loadLastP();
          }
          
        }
      );
      try {
        this.backup_status = false;
        try {
          this.backup = new backUp();
          this.backup.executingQueued();
          this.backup_status = false;
        } catch (error) {
          alert(error);
        }
        this.checkingRequests();
  
      } catch (error) {
        alert(error);        
      }
      
      
    }
    componentDidMount = async()=>{
      this._notificationSubscription = Notifications.addListener(
        this._handleNotification
      );
    }
    handle_navigation_notification(){
      const action = this.props["navigation"].getParam("action",false);
      if(action && action =="requestedT9dya"){
        try {
          let notificationData = this.props["navigation"].getParam("data",false);
          if(notificationData != this.lastNotifData){
            this.state.new_requestedT9dya_read = true;
            this.checkingRequests(notificationData);
            this.backup.requestT9adya("viewed","received");
          }else{
          }
          this.props.navigation.setParams({data:false,action:false});
          this.lastNotifData = notificationData;
        } catch (error) {
          alert(error);
          this.notificationData = false;
        }
        
      }else{
        this.notificationData = false;
        this.lastNotifData = null;
      }


    }
    _handleNotification = notification => {
      console.log("notif");
      let screen = "Home";
      let params = {};
      if(notification.data && notification.data.data && notification.data.data.length  && notification.data.data.length > 0 && notification.data.data[0].hist_id){
        screen = "Scan_";
        params = {"action":"requestedT9dya","data":notification.data} ;

        return this.handle_navigation_notification();
      }
      this.props.navigation.navigate(screen,params);
      //this.setState({ notification: notification });
    };
    loadMp3(firstload=false){
      if(firstload){
        this.newOrderSound        = new Audio.Sound();
        this.sendSound            = new Audio.Sound();
        this.deleteSound          = new Audio.Sound();
        this.notificationSound    = new Audio.Sound();
        this.newOrderSound      .loadAsync(require('../assets/new_order.mp3'));
        this.sendSound          .loadAsync(require('../assets/send.mp3'));
        this.deleteSound        .loadAsync(require('../assets/trash.mp3'));
        this.notificationSound  .loadAsync(require('../assets/notification.mp3'));
  
      }else{
        this.newOrderSound      .unloadAsync();
        this.sendSound          .unloadAsync();
        this.deleteSound        .unloadAsync();
        this.notificationSound  .unloadAsync();

        this.newOrderSound      .loadAsync(require('../assets/new_order.mp3'));
        this.sendSound          .loadAsync(require('../assets/send.mp3'));
        this.deleteSound        .loadAsync(require('../assets/trash.mp3'));
        this.notificationSound  .loadAsync(require('../assets/notification.mp3'));


      }


    }
    playNewOrder (){
      try {
        return this.newOrderSound.replayAsync().catch(err=>{console.log(err);});
      } catch (error) {
        console.log(error);
        this.loadMp3();
      }
    }
    playSend (){
      try {
        return this.sendSound.replayAsync().catch(err=>{console.log(err);});
      } catch (error) {
        console.log(error);
        this.loadMp3();
      }
    }
    playDelete (){
      try {
        return this.deleteSound.replayAsync().catch(err=>{console.log(err);});
      } catch (error) {
        this.loadMp3();
        console.log(error);
      }
    }
    playNotification (){
      try {
        return this.notificationSound.replayAsync().catch(err=>{console.log(err);});
      } catch (error) {
        this.loadMp3();
        console.log(error);
      }
    }
    checkClient = async()=>{
      await this.backup.setClientInfo();
      if(this.backup.email && this.backup.email!=""){
        this.backup_status = true;
        this.setState({});
        return true;
      }
      console.log("still no client :",this.backup_status);
      this.backup_status = false;
      this.setState({});
      return false;
    }
    checkingRequests = async(notificationData=false)=>{
      console.log("checkingRequests");
      if(this.checkingRequests_inProcess){
        return ;
      }
      this.checkingRequests_inProcess = true ;
      if(this.timer == undefined){
        this.timer = setInterval(()=> this.checkingRequests(), 10*1000);
      }
      if(this.props.navigation.getParam("hideT9dyaBtns") != true && this.props.navigation.getParam("showSaveBtn")==true && this.props.navigation.getParam("req_type") != "rscv"){
        this.checkingRequests_inProcess = false ;
        return false;
      }

      if(!notificationData){
        if(this.state.isVisible_modal_scan || this.state.scanned!=null || this.props.navigation.getParam("reqUpdated") == true){//reqUpdated
          this.checkingRequests_inProcess = false ;
          return false;
        }
        if(this.state.items_list && this.state.items_list.length > 0 && this.state.items_list[0].is_send){
          this.checkingRequests_inProcess = false ;
          return false;
        }
      }

      if(!this.backup_status && !notificationData){
        if(this.state.items_list.length == 0){
          this.loadLastP();
        }
        const res_ = await this.checkClient();
        if(!res_){
          this.checkingRequests_inProcess = false ;
          return false;
        }
      }
      const res = !notificationData ? await this.backup.requestT9adya("get",[],false) : false;
      const new_requestedT9dya_count = res && res["success"] == true && res["count"] ? res["count"] : 0;
      const new_requestedT9dya_read = res && res["success"] == true && res["output"] && res["output"]["viewed"] ? res["output"]["viewed"] : false;
      const actual_t9dya_id = res && res["success"] == true && res["output"] && res["output"] ["_id"]? res["output"] ["_id"] : false;
      if(new_requestedT9dya_count != this.state.requestedT9dya_count){
        this.setState({requestedT9dya_count :new_requestedT9dya_count });
      }
      if(new_requestedT9dya_read != this.state.new_requestedT9dya_read){
        this.setState({new_requestedT9dya_read :new_requestedT9dya_read });
      }
      let t9adya = false;
      if(!notificationData && res && res["success"] == true && res["output"] && res["output"]["t9adya"] && res["output"]["t9adya"].length >0 ){
        t9adya = res["output"]["t9adya"];
      }else if( !notificationData && res &&  res["success"] == true && res["output"]==null && res["error"]==false && this.props.navigation.getParam("showSaveBtn")==true){
        this.state.items_list = [];
        t9adya = false;
      }else if( notificationData && notificationData.data ){
        t9adya = notificationData["data"];
      }else{
        t9adya = false;
      }
      if(t9adya){
        let items_list = [];
        const t9dya_entered = res ? res["output"]["entered"] : t9adya[0]["entered"] ;
        if(t9dya_entered == this.last_requested_t9dya ){
          if(this.state.items_list.length == 0 || !this.state.items_list[0].is_hist){
            this.checkingRequests_inProcess = false ;
            return ;
          }

        }
        if(!notificationData){
          this.playNotification();
          this.actual_t9dya_id = actual_t9dya_id;
        }
        this.last_requested_t9dya = t9dya_entered;
        
        for (let i = 0; i < t9adya.length; i++) {
          const prod_req = new Product();
          await prod_req.get({id : t9adya[i].product_id});
          prod_req.quantity        = t9adya[i].quantity;
          prod_req.fields.price    = t9adya[i].price;
          prod_req.is_rscv = true;
          items_list.push(prod_req);  
        }


        this.state.items_list = items_list;
        if(items_list.length > 0){
          this.state.hist_label = !notificationData ? res["output"]["owner"] : notificationData["from"];
          this.state.hist_label = this.state.hist_label.split("@")[0];
          
          this.Total(2);
        }
        this.props.navigation.setParams({hideT9dyaBtns:false});
      }else{
        this.loadLastP();
      }
      this.checkingRequests_inProcess = false ;
    }
    
    updateRequestedT9adya = async()=>{
      this.state.new_requestedT9dya_read = false;
      this.props.navigation.setParams({hideT9dyaBtns:true,reqUpdated:false});
      const output  = await this.backup.requestT9adya("delete",this.actual_t9dya_id);
      if(!output){
        return false;
      }
      const output1 = await this.requestT9adya();
    }
    deleteRequestedT9adya = async()=>{
      this.state.new_requestedT9dya_read = false;
      this.props.navigation.setParams({hideT9dyaBtns:true,reqUpdated:false,data:null,action:null});
      const output = await this.backup.requestT9adya("delete",this.actual_t9dya_id);
      if(!output){
        return false;
      }
      this.actual_t9dya_id= false;
      this.playDelete();
      this.setState({items_list:[]});
      this.checkingRequests();
    }
    requestT9adya = async()=>{
      this.state.new_requestedT9dya_read = false;
      this.props.navigation.setParams({hideT9dyaBtns:true,reqUpdated:false});
      let t9adya = this.saveHistory(is_send=true);
      let title = TXT.New_order_X_items__Total.replace("X",this.state.items_list.length) +": "+ this.state.Total + " dh";
      
      let body =  TXT.Ordered_by + " : "+this.backup.email+"\n";
      for (let i = 0; i < this.state.items_list.length; i++) {
        body+=this.state.items_list[i].quantity+"x "+this.state.items_list[i].fields.name+" - "+this.state.items_list[i].fields.price+" dh\n"
      }
      const output = await this.backup.requestT9adya("request",t9adya,false);
      if(!output){
        return false;
      }
      let titles = Translation_.getTrans("New_order_X_items__Total",  ": "+ this.state.Total + " dh");
      titles["en"] = titles["en"].replace("X",this.state.items_list.length)
      titles["ar"] = titles["ar"].replace("X",this.state.items_list.length)
      titles["fr"] = titles["fr"].replace("X",this.state.items_list.length)
      titles["dr"] = titles["dr"].replace("X",this.state.items_list.length)

      //const outpu1 = await this.backup.pushNotification(titles,body,{data:t9adya,from:this.backup.email},false);
      await this.pushNotification_newOrder(t9adya,true);
      this.playSend();
      for (let i = 0; i < this.state.items_list.length; i++) {
        this.state.items_list[i] . req_type = "rscv" ;
        this.state.items_list[i] . is_send = false ;
        this.state.items_list[i] . is_rscv = true ;
      }
      this.props.navigation.setParams({
        showSaveBtn : this.state.items_list.length>0 && this.state.items_list[0].is_hist!=true ,
        req_type    : "rscv",
        hideT9dyaBtns:false
      });
      
    }
    pushNotification_newOrder(t9adya,isReqeust=true){
      let bodies =  isReqeust ? TXT.Ordered_by + " : "+this.backup.email+"\n" : Translation_.getTrans("Total",  ": "+ this.state.Total + " dh");
      if(isReqeust){
        let order_list = "";
        for (let i = 0; i < this.state.items_list.length; i++) {
          order_list+=this.state.items_list[i].quantity+"x "+this.state.items_list[i].fields.name+" - "+this.state.items_list[i].fields.price+" dh\n"
        }
        bodies = Translation_.getTrans("Ordered_by",  ": "+ this.backup.email + " \n"+order_list);
      }
      let titles = isReqeust 
                    ? Translation_.getTrans("New_order_X_items__Total",  ": "+ this.state.Total + " dh") 
                    : Translation_.getTrans("New_purchase_by",  ": "+ this.backup.email) ;
      titles["en"] = titles["en"].replace("X",this.state.items_list.length)
      titles["ar"] = titles["ar"].replace("X",this.state.items_list.length)
      titles["fr"] = titles["fr"].replace("X",this.state.items_list.length)
      titles["dr"] = titles["dr"].replace("X",this.state.items_list.length)

      const chanelId = isReqeust ? false : "Notifications_lessImportant";
      return this.backup.pushNotification(titles,bodies,{data:t9adya,from:this.backup.email},false,chanelId);
    }
    saveHistory = (is_send=false)=>{
      let items_list = [];
      const hist_id  = new History().DB.getDateTime();
      let is_req_list = false;
      const month    = hist_id.split(" ")[0].split("-").slice(0,2).join("-");
      for (let i = 0; i < this.state.items_list.length; i++) {
        const item = this.state.items_list[i];
        item.fields.quantity = item.quantity;
        
        let fields_ = {
          hist_id    : hist_id,
          month      : month,
          product_id : item.fields.id,
          price      : item.fields.price,
          quantity   : item.quantity,
          entered    : hist_id,
        }; 
        items_list.push(fields_);
        if(!is_send){
          const history_ = new History(fields_);
          history_.save();
        }
        
        if(!is_send){
          this.state.items_list[i].is_hist = true;
          this.state.items_list[i].is_send = false;
        }else{
          this.state.items_list[i].is_hist = false;
          this.state.items_list[i].is_send = true;
        }
        if(item.is_send || item.is_rscv){
          is_req_list = true;
        }
        
      }
      if(!is_send){
        this.props.navigation.setParams({hideT9dyaBtns:true});
        if(is_req_list){
          this.backup.requestT9adya("done").then(o=>{
            this.props.navigation.setParams({hideT9dyaBtns:false});
          });
        }
      }else{
        return items_list;
      }
      
      this.setState({});
      this.props.navigation.setParams({showSaveBtn : false,})
      this.playNewOrder();
      this.pushNotification_newOrder([],false).then(o=>{this.playSend();});
    }
    loadLastP = async(t9adya=false)=>{
      let items_list = [];
      let lastPurchaseList_  = await this.History_ob.filterWithExtra({},"hist_id DESC","",true);
      let lastPurchaseList = [];
      for (let i = 0; i < lastPurchaseList_.length; i++) {
        const hist_elem = lastPurchaseList_[i];
        if(lastPurchaseList.length==0 || lastPurchaseList[0].hist_id == hist_elem.hist_id){
          lastPurchaseList.push(hist_elem);
        }
      }
      if(lastPurchaseList && lastPurchaseList.length > 0){
        if(this.state.hist_label != lastPurchaseList[0].hist_id){
          this.setState({hist_label:lastPurchaseList[0].hist_id , new_requestedT9dya_read:false});
        }

        for (let i = 0; i < lastPurchaseList.length; i++) {
          const prod_h = lastPurchaseList[i];
          items_list.push(prod_h);
        }
        if(this.state.items_list != items_list  && ( this.state.items_list.length==0 ||  this.state.items_list[0].fields.entered !=items_list[0].fields.entered ) ){
          
          this.state.items_list = items_list.slice();
          this.state.new_requestedT9dya_read = false;
          this.state.requestedT9dya_count = 0;
          this.Total(2);
        }
        
      }
      this.props.navigation.setParams({
        TXT  : TXT,
        disable:false,
        check_price   : ()=>{this.startScan(0);} ,
        calculate     : ()=>{this.startScan(1);} ,
        saveHistory   : ()=>{this.saveHistory()} ,
deleteRequestedT9adya : this.deleteRequestedT9adya ,
updateRequestedT9adya : this.updateRequestedT9adya ,
        requestT9adya : this.requestT9adya,
        showSaveBtn   : false,
        req_type      : "",
        hideT9dyaBtns : false,
        reqUpdated    : false,
     })
    }
    componentDidMount(){
      this.props.navigation.setParams({
        TXT  : TXT,
        disable:false,
        check_price   : ()=>{this.startScan(0);} ,
        calculate     : ()=>{this.startScan(1);} ,
        saveHistory   : ()=>{this.saveHistory()} ,
deleteRequestedT9adya : this.deleteRequestedT9adya ,
updateRequestedT9adya : this.updateRequestedT9adya ,
        requestT9adya : this.requestT9adya,
        showSaveBtn   : false,
        req_type      : "",
        hideT9dyaBtns : false,
        reqUpdated    : false,
     })
    }
  static navigationOptions =  ({ navigation  }) => ({
      title : navigation.getParam("title"),
      headerRight: a=>{
        const {params = {}} = navigation.state;
        let Add_str = "";
        try {
          Add_str = params.TXT.Add;
        } catch (error) {
        }
        return (
          <View style={{flexDirection:"row"}}>
            { !params.hideT9dyaBtns && params.showSaveBtn==true &&  params.req_type == "rscv" &&
            <HeaderButton 
            name="trash"
            disabled={params.disable}
            onPress={()=>params.deleteRequestedT9adya()}
            size={28} 
            color="#e74c3c"
            />
            }
            { !params.hideT9dyaBtns && params.showSaveBtn==true &&  params.req_type == "rscv" && params.reqUpdated == true &&
            <HeaderButton 
            name="cloud-upload"
            disabled={params.disable}
            onPress={()=>params.updateRequestedT9adya()}
            size={28} 
            color="#2ecc71"
            />
            }
            { !params.hideT9dyaBtns && params.showSaveBtn==true &&  params.req_type != "rscv" &&
            <HeaderButton 
            name="send"
            disabled={params.disable}
            onPress={()=>params.requestT9adya()}
            size={28} 
            color="#2ecc71"
            />
            }
            { !params.hideT9dyaBtns && params.showSaveBtn==true &&
            <HeaderButton 
            name="save"
            disabled={params.disable}
            onPress={()=>params.saveHistory()}
            size={28} 
            color="#89ccf9"
            />
            }
            <HeaderButton 
            name="search"
            disabled={params.disable}
            onPress={()=>params.check_price()}
            size={28} 
            color="#ecf0f1"
            />
            <HeaderButton 
            name="calculator"
            disabled={params.disable}
            onPress={()=>params.calculate()}
            size={28} 
            color="#ecf0f1"
            />
          </View>
        )
        },
    });
    startScan(method){
      if(method==2){
        this.continue_list = this.state.items_list;
        method = 1;
        this.props.navigation.setParams({reqUpdated:true});
      }else{
        this.continue_list = [];
      }
        this.setState({
          isVisible_modal_scan:true,
          method:method,
          disable_btns:true,
          Total : 0,
          hist_label : null,
          new_requestedT9dya_read:false,
        });
        
        this.state.items_list = [] ;
      }
    setProductObjet(prod_dict){
      let product = new Product();
      product.fields = prod_dict;
      return product;
    }
    plusProd(){
      if( this.state.scanned && !this.state.scanned.is_hist && this.state.scanned.fields.id==null){
        alert(TXT.Please_fill_the_required_fields);
        return false;
      }
      if(this.state.scanned && !this.state.scanned.is_hist){
        this.state.items_list.push(this.state.scanned);
        this.setState({scanned:null});
      }
    }
    Total(second_call){
      this.plusProd();
      const items_list = this.continue_list.concat(this.state.items_list);
      if(!items_list || items_list.length ==0){
        if(second_call){
          return;
        }
        return this.loadLastP();
      }
      this.state.items_list = [];
      for (let k = 0; k < items_list.length; k++) {
        const pr = items_list[k];
        if(pr){
          this.state.items_list.push(pr);
        }
      }
      
      let total = 0 ;
      for (let i = 0; i < this.state.items_list.length; i++) {
        const prod = this.state.items_list[i];
        
        try {
          total+= parseFloat(prod.fields.price)>0 ? parseFloat(prod.fields.price) * prod.quantity : 0;
        } catch (error) {
          console.log("Total ",prod);  
        }
      }
      this.setState({scanned:null,Total:total,isVisible_modal_scan:false});
      this.props.navigation.setParams({
        showSaveBtn : this.state.items_list.length>0 && this.state.items_list[0].is_hist!=true ,
        req_type    : this.state.items_list.length>0 && this.state.items_list[0].is_rscv==true ? "rscv" : "" ,
      });
      this.continue_list = [];
    }
    loadItemsForSearch(){
      if(this.products_list && this.products_list.length>0  && 1==2){
        return new Promise(resolve=>{resolve(this.products_list);});
      }
      this.products_list = []
      return this.product.filter().then(output=>{
          if("list" in output && output["list"]){
              for (let i = 0; i < output["list"].length; i++) {
                  const prod = output["list"][i];
                  let prod_dict = {};
                  prod_dict[prod.fields.id] = prod.fields.name + " - "+prod.fields.price+"dh"
                  this.products_list.push(prod_dict);
              }
          }
      });
  }
    setCode = (type, code, country,company,product,isNoBarCode) => {
        this.setState({disable_btns:false});
        if(isNoBarCode){
          let new_prod = new Product();
          new_prod.fields.desc = "PickProduct";
          new_prod.fields.price = "";
          new_prod.list=[]

          this.loadItemsForSearch().then(()=>{
            new_prod.list=this.products_list;
            this.setState({scanned:new_prod});
          });
          return ;
        }
        let new_prod = new Product();
        new_prod.get({id:code}).then((output)=>{
            if(output["success"] && output["res"]!=false){
              if(this.state.method===0){
                new_prod.scanMethod = 0 ;
                this.setState({scanned:new_prod});
              }else if (this.state.method===1){
                this.setState({scanned:new_prod});

              }
            }else{
              Alert.alert(TXT.Product_not_found,TXT.Product_does_not_exist + `: [`+code+`] `,
              [
                {
                  text: TXT.Cancel, 
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: TXT.Add, 
                  onPress: () => {
                    this.Total(); 
                    this.setState({isVisible_modal_scan:false});
                    this.props.navigation.navigate('Products_',{product_id:code, });
                   },
                },
              ]
              );
            }

        });

    }
    setNoBArCode_product = (item_id)=>{
      let new_prod = new Product();
      new_prod.get({id:item_id}).then((output)=>{
        this.setState({scanned:new_prod});
      });
    }
    render_nobarecode(){

    }
    render_modal_ScanResult(){
      if(this.state.scanned==null){
        return null;
      }
      let img_source = ( this.state.scanned.photo_ob && ["",null,undefined].indexOf(this.state.scanned.photo_ob.fields.data)<0 )
            ? { uri:this.state.scanned.photo_ob.fields.data} 
            : require('../assets/camera.png');
      img_source = ( this.state.scanned && ["",null,undefined].indexOf(this.state.scanned.photo_data)<0 )
            ? { uri:this.state.scanned.photo_data} 
            : img_source;
      return (
          <Modal 
          animationType="slide"
          transparent={true}
          visible={this.state.scanned!=null}
          onRequestClose={() => { 
              this.setState({ scanned:null,});
           } }
        >
            <View style={{flex:.1,backgroundColor:"#2c3e5066"}}></View>
            <View style={{height:400,width:"100%",backgroundColor:"#646c78"}}>
            { this.state.scanned && this.state.scanned.scanMethod==undefined && this.state.scanned.fields.desc!="PickProduct" &&
            
                <View style={{width:200,height:150,backgroundColor:"#bdc3c7",alignSelf:"center"}}>
                    <Image  source={img_source} resizeMode="contain" style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
            }
            { this.state.scanned && this.state.scanned.scanMethod==undefined && this.state.scanned.fields.desc!="PickProduct" &&
                <View style={styles_list.container}>
                  <Text style={styles.product_title}>{this.state.scanned.fields.name} : {this.state.scanned.fields.price} Dh</Text>
                  <Text style={styles.product_desc}>{this.state.scanned.company_ob.fields.name+" - "+this.state.scanned.company_ob.fields.country}</Text>
                </View>
              }
              { this.state.scanned && this.state.scanned.scanMethod==undefined && this.state.scanned.fields.desc=="PickProduct" &&
                <View style={{flex:1}}>
                  <Text style={styles_list.text_k}>{TXT.Product}  :</Text>
                  <AutoComplite
                      styleTextInput={styles_list.TextInput}
                      placeholder={TXT.Name+" .. "}
                      placeholderTextColor="#ecf0f1"
                      options_pool={this.state.scanned.list}
                      action={this.setNoBArCode_product}
                  />
                </View>
              }
                { this.state.scanned && this.state.scanned.scanMethod==undefined && this.state.scanned.fields.desc=="NoBarCode" &&
                  <View style={[styles_list.row_view,{zIndex:0}]} >
                    <Text style={styles_list.text_k}> {TXT.Price}  :</Text>
                    <View style={styles_list.text_v}>
                    <TextInput
                        style={styles_list.TextInput}
                        placeholder={TXT.Price+" .. "}
                        placeholderTextColor="#ecf0f1"
                        onChangeText ={newValue=>{
                          this.state.scanned.fields.price=newValue;
                          this.setState({});
                        }}
                        value={this.state.scanned.fields.price+""}
                    />
                    </View>
                </View>
                }
                { this.state.scanned && this.state.scanned.scanMethod==undefined && 
                <View style={{flexDirection:"row", margin:10,justifyContent:"center",backgroundColor:"#34495e"}}>
                    <Text style={{color:"white",fontSize:20,marginRight:10}}>{TXT.Quantity} : </Text>
                    <View style={[{ width: 30,height:30, }]}>
                      <Button
                          title="-"
                          color="#bdc3c7"
                          onPress={()=>{
                            this.state.scanned.quantity-=1;
                            this.setState({});
                          }
                          }
                      ></Button>
                    </View>
                    <Text style={{fontSize:20,color:"white",width: 35,height:40,textAlign:"center"}}>{this.state.scanned.quantity}</Text>
                    <View style={[{ width: 40,height:40,}]}>
                      <Button
                          style={buttons_style.modalPlus_Minus}
                          color="#bdc3c7"
                          title="+"
                          onPress={()=>{
                            this.state.scanned.quantity+=1;
                            this.setState({});
                          }
                          }
                      ></Button>
                    </View>
                </View>
                }
                { this.state.scanned && this.state.scanned.scanMethod==undefined && 
                  <View style={buttons_style.container_row}>
                    <View style={buttons_style.view_btn_row}>
                     <Button
                        style={buttons_style.modalAdd}
                        title={TXT.Total}
                        color="#e55039"
                        onPress={()=>{
                            this.Total();
                        }
                        }
                    ></Button>
                    </View>
                    <View style={buttons_style.view_btn_row}>
                      <Button
                          style={buttons_style.modalPlus}
                          title={TXT["+"]}
                          color="green"
                          onPress={()=>{
                              this.plusProd();
                          }
                          }
                      ></Button>
                    </View>

                </View>
                }
                { this.state.scanned && this.state.scanned.scanMethod===0 && 
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                  <View style={[{ width: 60,height:40,}]}>
                  <Button
                      style={buttons_style.modalAdd}
                      title={TXT.Ok}
                      color="#e55039"
                      onPress={()=>{
                          this.setState({scanned:null});
                      }
                      }
                  ></Button>
                  </View>
                </View>
                }
                </View>
                <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

        </Modal>
      );
  }
    render_modal_BarcodeScanner(){
        return (
            <Modal 
            animationType="slide"
            transparent={false}
            visible={this.state.isVisible_modal_scan}
            onRequestClose={() => { 
                this.setState({ isVisible_modal_scan:false,});
                this.props.navigation.setParams({disable:false});
                this.Total();
             } }
          >
              <BarcodeScanner setCode={this.setCode} TXT={TXT} IsCalc={true}></BarcodeScanner>

            {this.render_modal_ScanResult()}
          </Modal>
        );
    }
    setItemParent = (item, index) => {
      if(item.is_hist){
        return false;
      }
      Alert.alert(
        TXT.Confirmation,
        TXT.Are_you_sure_you_want_to_delete + `: \n  [`+item.fields.name+`] `,
        [
          {
            text: TXT.No, 
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: TXT.Yes, 
            onPress: () => {

              if(this.state.items_list.length>0 && this.state.items_list[0].is_rscv ){
                this.props.navigation.setParams({reqUpdated:true});
              }
              /*
              const items_list__ = this.state.items_list.slice();
              items_list__.splice(index,1);
              this.setState({items_list:[null,]} , ()=>{
                console.log("delete",this.state.items_list.length);
                this.state.items_list = items_list__.slice();
                console.log("delete",this.state.items_list.length);
                this.Total();
              });
              */
              delete this.state.items_list[index];
              this.Total();              
            },
          },
        ],
      );
    }
    render() {
      
        return (
          <View style={styles.container} >
            {this.state.requestedT9dya_count!=undefined && this.state.requestedT9dya_count>1 &&
              <Text  style={{color:"orange",fontSize:20}}>{TXT.Orders_count} : {this.state.requestedT9dya_count}</Text>
            }
            {this.state.hist_label &&
            <Text  style={styles.hist_label}>
            {this.backup_status==true ? "." : "" }{this.state.hist_label+" "}
            {this.state.new_requestedT9dya_read!=false &&
              <Icon
                name="check"
                color={this.state.new_requestedT9dya_read == "received" ? "#95a5a6" : "#23ea78"}
                size={styles.hist_label.fontSize}
              ></Icon>
            }
            </Text>
            }
            {this.state.items_list.length>0 && this.state.Total>0 }
              <ItemsList 
                items_list={this.state.items_list}
                setItemParent={this.setItemParent}
                ItemClass={Product}
                isCalculate={true}
                 />

            
            {this.state.items_list.length>0 &&
              <Text style={styles.textTotal}>
                {TXT.Total} : {this.state.Total}
              </Text>
                 
            }
            { this.state.items_list.length>0 && this.state.Total>0 && this.state.items_list[0] && this.state.items_list[0].is_hist!=true /*&& this.state.items_list[0].is_send!=true && this.state.items_list[0].is_rscv!=true */ &&
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={()=>{this.startScan(2);}}
              style={styles_Btn.TouchableOpacityStyle_float}>
                <View style={styles_Btn.ButtonStyle_float} >
                  <Icon name="plus-circle" size={50} color="#66b6eb" />
                </View>
                
            </TouchableOpacity>
            }
            {this.render_modal_BarcodeScanner()}
            
          </View>
        );
      }
}


export default ScanScreen;