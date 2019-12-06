import React from 'react';
import { Switch, Text, View, Button, TouchableOpacity,Picker,ScrollView,Modal,TextInput, Alert,ActivityIndicator,Platform } from 'react-native';
import {buttons_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import LocalStorage from "../Libs/LocalStorage";
import HeaderButton from "../Components/HeaderButton";
import backUp from "../Libs/backUp";
import History from "../Libs/History_module";
import Credentials from "../Components/Credentials";
import Partners from "../Components/Partners";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Notifications } from 'expo';

class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        openSidMenu: false,
        modalVisible:false,
        language:null,
        image_quality:"",
        ratio : "",
        history_list:[],
        months_total :{},
        availableRatios:[],
        synchronize_btn_status:true,
        modalVisible_credentails : false,
        backup_doClear : false,
        backup_email : "",
        backup_is_admin : false,
        synchLog : [],
        clear_database:true,
        modalVisible_partners : false,
        version : "0.9.3",

      };
      this.LS = new LocalStorage();
      this.checkVersion();
      this.firstHistoryRender = true;
      this.backup = new backUp();
      this.backup.executingQueued();
      //this.backup.Company.DB.updateTables();
      this.backup._loadClient().then(output=>{
        this.setState({backup_email:this.backup.email,backup_lastActivity:this.backup.lastActivity, backup_is_admin:this.backup.admin});
        if(this.do_synch_now){
          this.synch_now();
        }
      });
      this.Unmounted = false;
      this.History_ob = new History();
      this.didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          Translation_.getTranslation().then(tr=>{
          if(TXT != tr){
            TXT = tr;
            this.backup.TXT = TXT;
            this.props.navigation.setParams({title:TXT.Home});
            this.setState({language:Translation_.language});
          }
          });
          //this.loadHistory();
          this.synch_history();
        }
      );
    }
    componentWillUnmount(){
      this.Unmounted = true;
      if(this.backup.timer){
        clearInterval(this.backup.timer);
      }
      this.didBlurSubscription.remove();
      this._notificationSubscription.remove();
      
    }
    checkVersion = async()=>{
      const currentVersion = await this.LS.getSettings("currentVersion");
      if(currentVersion=="0"){
        this.do_synch_now = true;
      }
      if(currentVersion!=this.state.version){
        this.state.appUpdated = currentVersion!="0" ? true : false;
        this.LS.setSetting("currentVersion",this.state.version);
      }
    }
    handle_navigation_notification(){
      const action = this.props["navigation"].getParam("action",false);
      if(action && action !="requestedT9dya"){
        try {
          let notificationData = this.props["navigation"].getParam("data",false);
          if(notificationData != this.lastNotifData){
            this.synch_now();
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

    synch_now = ()=>{
      if(this.Unmounted)return;
      this.props.navigation.setParams({disabled:true});
      this.setState({synchronize_btn_status:false,synchLog:[]});
      this.backup.synchronize(this.appendLog).then(out=>{
        if(this.Unmounted)return;
        this.state.synchronize_btn_status = true;
        this.state.backup_lastActivity = this.backup.lastActivity;
        this.state.backup_email = this.backup.email;
        this.do_synch_now = false;
        this.loadHistory();
        this.props.navigation.setParams({disabled:false});
      });
    }
    _handleNotification = notification => {
      let screen = "Home";
      let params = {};
      try {
        if(notification.data && notification.data.data && notification.data.data.length  && notification.data.data.length > 0 && notification.data.data[0].hist_id){
          screen = "Scan_";
          params = {"action":"requestedT9dya","data":notification.data} ;
        }else if(notification.data && notification.data.action && notification.data.action=="db_update"){
          this.do_synch_now = true;
          if(this.backup.email){
            try {
              this.synch_now();
            } catch (error) { console.log("_handleNotification synchno ",error);}
          }
          return ;
        }
      } catch (error) {
        console.log(error);
      }

      this.props.navigation.navigate(screen,params);
      //this.setState({ notification: notification });
    };
    openAddModal = () => {
      
      this.LS.getSettings().then(settings=>{
        this.setState({
          language : settings["language"],
          ratio : settings["ratio"],
          image_quality : settings["image_quality"],
          autoFocus : settings["autoFocus"],
          availableRatios : settings["availableRatios"],
          modalVisible:true,
        });
      });
    }
    loadHistory = async()=>{
      const LastRemovedHistory = await this .LS.LastRemovedHistory();

      this.firstHistoryRender = true;
      
      let ls_hist = await this.LS.getHistory();
      const imported_history = await this.History_ob.importLS(ls_hist);
      if(imported_history && imported_history.length && imported_history.length>0){
        this.LS.clearHistory();
      }
      this.History_ob.gethistory().then( output =>{
        output= output["error"] && output["error"]!="" ? [-1,"",""] : output;
        if(!output || output.length == 0 ){
          return false;
        }
        this.props.navigation.setParams({ items_count:output[3]});
        if(this.Unmounted)return;
        this.setState({
          backup_doClear     : false,
          history_list       : output[0],
          month_total        : output[1],
          t9adya_total       : output[2],
          LastRemovedHistory : LastRemovedHistory});
      });
    }
    synch_history = ()=>{
      if(this.state.synchronize_btn_status===false){
        return false;
      }
      if(this.Unmounted)return;
      this.setState({synchronize_btn_status:false,synchLog:[]});
      this.props.navigation.setParams({disabled:true});
      this.backup.synch_history(undefined,this.appendLog).then(o=>{
        this.state.synchronize_btn_status = true;
        this.props.navigation.setParams({disabled:false});
        this.loadHistory();
      })
      .catch(erro=>{console.log(erro); this.loadHistory(); });
    }
    componentDidMount = async()=>{
      Notifications.createChannelAndroidAsync('Notifications', 
      {
        name     : 'Notifications',
        sound    : true,
        priority : 'max',
        vibrate  : [0, 250, 100, 250,100,250],
        badge    : true,
      });
      Notifications.createChannelAndroidAsync('Notifications_lessImportant', 
      {
        name     : 'Notifications_lessImportant',
        sound    : false,
        priority : 'default',
        vibrate  : false,
        badge    : true,
      });

      this._notificationSubscription = Notifications.addListener(
        this._handleNotification
      );
      this.props.navigation.setParams({
          openAddModal : this.openAddModal,
          TXT  : TXT,
          disable:false,
          items_count:0,
          synch_history : this.synch_history,
       });

    }
  static navigationOptions =  ({ navigation  }) => ({
      title : navigation.getParam("title")+" ["+(navigation.getParam("items_count",0) !=undefined?navigation.getParam("items_count",0):0 )+"]",
      headerRight: a=>{
        const {params = {}} = navigation.state;
        return (
          <View style={{flexDirection:"row"}}>
            { params.disabled==true && 
              <ActivityIndicator size={ Platform.OS === 'ios' ? "large" : 28 } color="#ecf0f1" />
            }
            <HeaderButton 
              name="refresh"
              onPress={params.synch_history}
              size={28} 
              color={params.disabled ? "#03ce5800" : "#ecf0f1"}
              disabled={params.disabled}
              />
            <HeaderButton 
              name="cogs"
              onPress={params.openAddModal}
              size={28} 
              color="#ecf0f1"
              />
            </View>
        )
        },
    });
    saveConfig = async (key,value) => {
      await this.LS.setSetting(key,value);
      if(key=="language"){
        const transl = await Translation_.getTranslation();
        TXT = transl;
      }
      let state_ = {};
      state_[key] = value;
      this.setState(state_);
    }
    get_languages(){
      return Object.keys(this.LS.languages).map( (key,v) =>{
          const label = this.LS.languages[key];
          return (
              <Picker.Item label={label} value={key} key={key} />
          );
      })
    }
    get_Qualities(){
      return Object.keys(this.LS.imageQualities).map( (key,v) =>{
          const value = this.LS.imageQualities[key];
          return (
              <Picker.Item label={key} value={value} key={key} />
          );
      })
    }
    get_Ratios (){

      return this.state.availableRatios.map( (key,v) =>{
          return (
              <Picker.Item label={key} value={key} key={key} />
          );
      })
    }
    clearDatabase = ()=>{
      Alert.alert(
        TXT.Confirmation,
        TXT.This_will_remove_all_the_products_and_companies,
        [
          {
            text: TXT.Yes,
            onPress: async() => {
              this.setState({clear_database:false});
              await this.backup.Product.DB.empty();
              await this.backup.Company.DB.empty();
              await this.backup.Photo.DB.empty();
              await this.backup.History.DB.empty();
              this.setState({clear_database:true});
            },
            
          },
          {
            text: TXT.No, 
            onPress: () => {},
            style: 'cancel',
          },
        ],
      );

    }
    appendLog = (msg)=>{
      if(!this.state.synchLog){
        this.state.synchLog = [];
      }
      console.log(msg);
      this.state.synchLog.push(msg);
      this.setState({});
    }
    getLoadingModal(){
      if(!this.state.synchLog_modal ) return null;
      const log = !this.state.synchLog.map ? null : this.state.synchLog.map((k,v)=>{
        const textColor = k.indexOf("XXX") >=0 ? "#efc4c4" : "#cbe0d5" ;
        return (
          <Text key={v} style={{color:textColor,textAlign:"left",width:"90%",marginLeft:20}}>{k}</Text>
        );
      });
      return (
        <Modal 
        animationType="slide"
        transparent={true}
        visible={this.state.synchLog_modal}
        onRequestClose={() => { this.setState({ synchLog_modal:false,}); } }
        >
          <View style={{flex:.1,backgroundColor:"#00000099"}}></View>
          <View style={{flex:1,width:"100%",justifyContent:"center",backgroundColor:"black"}}>
            <Text style={styles_list.title_modals}> Log of Synchronazing : </Text>
            <ScrollView style={{flex:1,width:"100%",backgroundColor:"black"}}>
              {log}
            </ScrollView>
            { !this.state.synchronize_btn_status && 
              <ActivityIndicator size="large" color="#00ff00" />}
            { this.state.synchronize_btn_status && this.state.synchLog.map &&this.state.synchLog.length>0 && 
              <Text style={{color:"#91ffc0",textAlign:"center",width:"90%",fontSize:23}}>DONE!</Text>
            }
            <Button
              title="close"
              onPress={()=>{ this.setState({ synchLog_modal:false,}); }}
            ></Button>
          </View>
          <View style={{flex:.1,backgroundColor:"#00000099"}}></View>
        </Modal>
      );
    }
    closeModal_credents =()=>{
      this.setState({modalVisible_credentails:false});
    }
    closeModal_partners =()=>{
      this.setState({modalVisible_partners:false});
    }
    saveCredents =(email,password)=>{
      this.props.navigation.setParams({disabled:true});
      this.setState({savingCredents:true});
      this.LS.setCredentials(email,password).then(output=>{
        if(output==false){
          this.props.navigation.setParams({disabled:false});
          return false;
        }
        this.backup.changeClient().then(()=>{
          this.History_ob.DB.empty().then(()=>{
              this.synch_history();
          });
          this.closeModal_credents();
          this.setState({
            synchronize_btn_status:true,
            backup_lastActivity:this.backup.lastActivity,
            backup_email:this.backup.email,
            backup_is_admin:this.backup.admin,
            savingCredents:false,
          });
          this.props.navigation.setParams({disabled:false});
        });
        
      });
    }
    signUp =(email,password)=>{
      this.props.navigation.setParams({disabled:true});
      this.setState({savingCredents:true});
      this.backup.newUser(email,password).then(()=>{
        this.saveCredents(email,password);
        this.props.navigation.setParams({disabled:false});
      });
    }
    render_modal_credentials(){
      return (          
          <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible_credentails}
            onRequestClose={() => { 
                this.setState({ modalVisible_credentails:false,});
            } }
          >
          <View style={{flex:.4,backgroundColor:"#2c3e5066"}}></View>
          <View style={{height:400,width:"100%",backgroundColor:"#646c78"}}>
          <Text style={styles_list.title_modals}> {TXT.Credents}: </Text>
            <Credentials
              closeModal={this.closeModal_credents}
              saveCredents={this.saveCredents}
              signUp={this.signUp}
              savingCredents={this.state.savingCredents}
            >

            </Credentials>
          </View>
          <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

          </Modal>
          );
    }
    render_modal_partners(){
      return (          
          <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible_partners}
            onRequestClose={() => { 
                this.setState({ modalVisible_partners:false,});
            } }
          >
          <View style={{flex:.4,backgroundColor:"#2c3e5066"}}></View>
          <View style={{height:350,width:"100%",backgroundColor:"#646c78"}}>
            <Text style={styles_list.title_modals}> {TXT.Partners}: </Text>
            <Partners
              closeModal={this.closeModal_partners}
              invitingPartner={this.state.invitingPartner}
              backup = {this.backup}
            >

            </Partners>
          </View>
          <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

          </Modal>
          );
    }
    render_modal_Settings(){
      return (
          <Modal 
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { 
              this.setState({ modalVisible:false,});
           } }
        >
            <View style={{flex:.3,backgroundColor:"#2c3e5066"}}></View>
            <View style={{height:450,width:"100%",backgroundColor:"#646c78"}}>
              
                <Text style={styles_list.title_modals}> {TXT.Settings} : </Text>
                <ScrollView style={{flex:1,marginTop:10,marginBottom:10,borderStyle : "solid",borderWidth : 1,borderColor:"white"}}>
                  {this.state.backup_email!=null && this.state.backup_email!="" && this.state.backup_email!=undefined &&
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Logged_as} : </Text>
                    <Text style={[styles_list.text_v,{color:"#55ff9d"}]} >{this.state.backup_email}</Text>
                  </View>
                  }
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Language} : </Text>
                    <Picker
                    selectedValue={this.state.language}
                    style={styles_list.text_v}
                    onValueChange={(itemValue, itemIndex) =>
                        this.saveConfig("language", itemValue)
                        
                    }>
                        {this.get_languages()}
                    </Picker>
                  </View>
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Image_quality} : </Text>
                    <Picker
                    selectedValue={this.state.image_quality}
                    style={styles_list.text_v}
                    onValueChange={(itemValue, itemIndex) =>
                        this.saveConfig("image_quality", itemValue)
                        
                    }>
                        {this.get_Qualities()}
                    </Picker>
                  </View>
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Ratio} : </Text>
                    <Picker
                    selectedValue={this.state.ratio}
                    style={styles_list.text_v}
                    onValueChange={(itemValue, itemIndex) =>
                        this.saveConfig("ratio", itemValue)
                        
                    }>
                        {this.get_Ratios()}
                    </Picker>
                  </View>
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.AutoFocus} : </Text>
                    <View style={styles_list.text_v} >
                      <Switch 
                        style={{flex:1, alignSelf:"flex-start"}}
                        value = {this.state.autoFocus}
                        onValueChange={ (newValue)=> {
                            this.saveConfig("autoFocus", newValue)
                        }}
                    />
                    </View>
                  </View>
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Clear_history} : </Text>
                    <View style={[styles_list.text_v,{flexDirection:"row"}]} >
                      <Button 
                        style={{marginLeft:10}}
                        title = {TXT.Clear_local}
                        disabled={this.state.history_list!=-1 && (!this.state.history_list || this.state.history_list.length==0)}
                        color="#f1c40f"
                        onPress={ ()=> {
                          this.History_ob.DB.empty().then(()=>{
                            this.LS.clearHistory().then(()=>{
                              this.loadHistory();
                            });
                          });
                        }}
                    />
                    {this.state.backup_email!=null && this.state.backup_email!="" && this.state.backup_email!=undefined &&
                      <Button 
                        style={{marginLeft:10}}
                        title = {TXT.Clear_cloud}
                        disabled={!this.state.synchronize_btn_status}
                        color="#e67e22"
                        onPress={ ()=> {
                          this.setState({synchronize_btn_status:false});
                          this.backup.synch_history_clean().then(o=>{
                            if(o===false && o>=0){
                              alert(TXT.Cloud_history_cleaned_successfully + " ["+o+"]");
                            }else{
                              alert(TXT.Cloud_history_failed + " ["+o+"]");
                            }
                            this.setState({synchronize_btn_status:true});
                          });
                        }}
                    />
                      }
                  </View>
                  </View>

                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Clear_database} : </Text>
                    <View style={styles_list.text_v} >
                      <Button 
                        style={{marginLeft:10,marginRight:30}}
                        title = {TXT.Clear}
                        color="orange"
                        disabled={!this.state.clear_database}
                        onPress={this.clearDatabase}
                    />
                    </View>
                  </View>
                  {this.state.backup_email!=null && this.state.backup_email!="" && this.state.backup_email!=undefined &&
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Partners} : </Text>
                    <View style={styles_list.text_v} >
                      <Button 
                        style={{marginLeft:10,marginRight:30}}
                        title = {TXT.Manage}
                        disabled={false}
                        onPress={()=>{this.setState({modalVisible_partners:true});}}
                    />
                    </View>
                  </View>
                  }
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.LastBackUp} : </Text>
                    <Text style={styles_list.text_v}>{this.state.backup_lastActivity+""} </Text>
                  </View>
                  { this.state.backup_is_admin==true &&  
                  <View style={styles_list.row_view}>
                    <Text style={styles_list.text_k}> {TXT.Clear_remote_Backup} : </Text>
                    <View style={styles_list.text_v} >
                      <Switch
                      style={{flex:1, alignSelf:"flex-start"}}
                      value={this.state.backup_doClear}
                      onValueChange={ (newValue)=> {
                        if(newValue){
                          Alert.alert(
                            TXT.Confirmation,
                            TXT.Are_you_sure_you_want_to_clear_backup+"?",
                            [
                              {
                                text: TXT.Yes,
                                onPress: () => {
                                  this.backup.doClean = newValue;
                                  this.setState({backup_doClear: newValue});
                                },
                                
                              },
                              {
                                text: TXT.No, 
                                onPress: () => {
                                  this.backup.doClean = false;
                                },
                                style: 'cancel',
                              },
                            ],
                          );
                        }else{
                          this.backup.doClean = newValue;
                          this.setState({backup_doClear: newValue});
                        }



                      }}
                      />
                    </View>
                  </View>
                  }
                  <View style={buttons_style.container_row}>
                    <View style={buttons_style.view_btn_row}>
                      <Button 
                        style={[styles_list.small_elemnt,{marginLeft:10}]}
                        title = {TXT.Sych_Now}
                        disabled={!this.state.synchronize_btn_status}
                        onPress={ ()=> this.synch_now()}
                    />
                    <View style={{width:10}}></View>
                  </View>
                  <View style={buttons_style.view_btn_row}>
                    <Button 
                        style={[styles_list.small_elemnt,{marginLeft:10}]}
                        title = {TXT.Credents}
                        disabled={!this.state.synchronize_btn_status}
                        color="black"
                        onPress={ ()=> {
                          this.setState({modalVisible_credentails:true})
                        }}
                    />
                    <View style={{width:10}}></View>
                    </View>
                    <View style={buttons_style.view_btn_row}>
                    <Button 
                        style={[styles_list.small_elemnt,{marginLeft:10}]}
                        title = "Log"
                        disabled={this.state.synchLog_modal}
                        color="green"
                        onPress={ ()=> {
                          this.setState({synchLog_modal:true})
                        }}
                    />
                  </View>
                </View>
              </ScrollView>
              <View style={buttons_style.container_row}>
              <View style={buttons_style.view_btn_row}>
                <Button 
                    style={[styles_list.small_elemnt,{marginLeft:10}]}
                    title={TXT.Close}
                    onPress={()=>this.setState({modalVisible:false}) }
                  />
                  </View>

              </View>
            
            </View>
            <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>


          {this.render_modal_credentials()}
          {this.render_modal_partners()}
          {this.getLoadingModal()}
        </Modal>
      );
  }
    getMonth(date){
      return date.split(" ")[0].split("-").slice(0,2).join("-");
    }
    deleteHistoryId = (t9adya_key)=>{
      Alert.alert(
        TXT.Confirmation,
        TXT.Are_you_sure_you_want_to_delete +" "+(this.state.t9adya_total[t9adya_key] ? "["+this.state.t9adya_total[t9adya_key]+" dh]" : "")+" ?",
        [
          {
            text: TXT.Yes,
            onPress: () => {
///////////////////////////////////////////////////
this.setState({synchronize_btn_status:false});
this.backup.client.callFunction("synch_history",[[],false,t9adya_key]).then(res=>{
  if(res["deleted"]>=1){
    this.History_ob.DB.empty().then(()=>{
        this.synch_history();
    });
    alert("history ["+t9adya_key+"] is deleted !");
  }
}).catch(err=>{
  console.log(err);
  this.setState({synchronize_btn_status:true});
});
///////////////////////////////////////
            },
            
          },
          {
            text: TXT.No, 
            style: 'cancel',
          },
        ],
      );


    
    }
    render_history(){
      this.state.months_total = {};
      let j = 0;
      let t9dyat = [];

      for (const month in this.state.history_list) {
        if (this.state.history_list.hasOwnProperty(month)) {
          const month_hist = this.state.history_list[month];
          t9dyat.push(                  
          <Text key={month} style={{color:"white",width:"100%",fontSize:30,backgroundColor:"#3d91c8a8"}} > 
            {month} : {this.state.month_total[month]} dh
          </Text>);
          for (const t9adya_key in month_hist) {
            if (month_hist.hasOwnProperty(t9adya_key)) {
              const t9adya = month_hist[t9adya_key];
              let owner_ = null;
              let isOwner = false;
              let list_details = t9adya.map((prod,k)=>{
          
                if(prod.fields.product_id==null && 1==2){
                  is_OK = false;
                  return true;
                }
                isOwner = prod.fields.owner.toLowerCase().trim() == this.backup.email.toLowerCase().trim() ;
                const owner_color = isOwner ? "#afd4ca" : "#62da95";
                const prod_color = prod.fields.price == 0 ? "#9da0a2" : "#bdc3c7"; 
                owner_ = 
                  <View style={{flexDirection:"row"}}>
                      {this.state.showDetails && this.state.showDetails==t9adya_key &&this.state.t9adya_total[t9adya_key]!=undefined && this.state.t9adya_total[t9adya_key]>0 && (isOwner==true || this.backup.admin==true )&&
                      <TouchableOpacity 
                      style={{backgroundColor:"#95a5a6",borderRadius:15,width:30,height:30,borderColor:"black",borderWidth:1,justifyContent:"center",alignItems:"center"}} 
                        onPress={()=>this.deleteHistoryId(t9adya_key)}
                        disabled={!this.state.synchronize_btn_status}
                        >
                        <Icon name="trash" color="#e84118" size={20} />
                      </TouchableOpacity>
                    }
                    <Text key={t9adya_key+prod.fields.owner } style={{color:owner_color,fontSize:18,marginLeft:5}}>{prod.fields.owner}</Text>
                  </View>;
                return (
                  <Text key={t9adya_key+prod.fields.product_id+k}  style={{color:prod_color,fontSize:18}}>
                    x{prod.fields.quantity?prod.fields.quantity:1} -{prod.product_name} - {prod.fields.price} dh
                  </Text>
                  
                );
              });

              t9dyat.push(
                <View key={t9adya_key}  >
                <TouchableOpacity 
                  style={{alignSelf: 'stretch',paddingBottom:5,paddingTop:5,paddingLeft:20,borderRadius: 4,borderWidth: 0.5,borderColor: '#d6d7da',}}
                  activeOpacity={0.7}
                  onPress={()=>{
                    if(this.state.showDetails && this.state.showDetails== t9adya_key){
                      this.setState({showDetails:null});
                    }else{
                      this.setState({showDetails:t9adya_key});
                    }
                  }}
                >
                  <View style={{alignSelf: 'stretch',flexDirection:"row"}}>
                    <Text style={{color:"white",width:"70%",fontSize:20,textDecorationLine:isOwner==true?"none":"underline"}}> 
                      {t9adya_key}
                    </Text>
                    {this.state.t9adya_total[t9adya_key]>=0 && 
                        <Text style={{height:"99%",color:"#f5e295fc",padding:0,backgroundColor:"#2980b970",textAlign:"right",fontSize:20,width:"30%"}}>
                          { this.state.t9adya_total[t9adya_key]!=undefined ? this.state.t9adya_total[t9adya_key] +" DH" : "-"}
                        </Text>
                      } 
                  </View>
                  <View >
                  {this.state.showDetails==t9adya_key &&
                    owner_
                  }
                  {this.state.showDetails==t9adya_key &&
                    list_details 
                    }
                  </View>
                </TouchableOpacity>
    
              </View>
              
              );

              j=j+1;
            }
          }
        }
      }
      return (
        <ScrollView style={{flex:1,flexDirection:"column",paddingRgith:10,marginLeft:10,}}>
          <Text style={{color:"white",width:"95%",paddingLeft:8,fontSize:30,}} > {TXT.History} :</Text>
          {t9dyat}
        </ScrollView>
      );
    }
    send_version_update_notification = async()=>{
      this.setState({synchronize_btn_status:false});
      try {
        titles = Translation_.getTrans("New_update_available");
        bodies = Translation_.getTrans("Please_open_and_clode_the_app_to_auto_update");
        const out = await this.backup.pushNotification(titles,bodies,{"action":"update"},"all","Notifications_lessImportant");
        alert("Notified users : "+out);
      } catch (error) {
        console.log(error);
      }
      this.setState({synchronize_btn_status:true});
    }
    render() {
      console.log("render");
        return (
          <View style={styles.container} >   
              <View style={[styles_list.row_view,{alignItems: 'flex-start',justifyContent:"flex-start"}]}>
                <Text style={styles_list.text_k}> {TXT.Version} : </Text>
                <Icon name="download" size={20} color="#0ad861" />
                <Text style={[styles_list.text_k,{textAlign: 'left',width:"30%"}]} >
                  {this.state.version}
                  <Text sytle={{color:"#55ff9d"}}>  {this.state.appUpdated===true? "Updated":""}</Text>
                </Text>
                { this.state.backup_is_admin==true && this.state.synchronize_btn_status &&  
                  <Icon name="paper-plane" size={25} color="#fbc531"
                      onPress={()=>{
                        this.send_version_update_notification();
                      }}
                    />
                }
              </View>

              {this.state.backup_email!=null && this.state.backup_email!="" && this.state.backup_email!=undefined &&
              <View style={styles_list.row_view}>
                <Text style={styles_list.text_k}> {TXT.Logged_as} : </Text>
                <Icon name={ this.state.backup_is_admin?"user-circle":"user" } size={20} color="#0ad861" />
                <Text style={[styles_list.text_v,{color:"#55ff9d"}]} >
                  {this.state.backup_email}
                  </Text>
              </View>
              }

              {this.render_history()}
              {this.state.LastRemovedHistory &&
                <Text style={{color:"#f4caa5",fontSize:18}}>{TXT.Last_cleared_history} : {this.state.LastRemovedHistory}</Text>
              }

              {this.render_modal_Settings()}

          </View>
        );
      }
}

export default HomeScreen;