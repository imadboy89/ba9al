import React from 'react';
import { Switch, Text, View, Button, TouchableOpacity,Picker,ScrollView,Modal,TextInput, Alert,ActivityIndicator } from 'react-native';
import {buttons_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import Translation from "../Libs/Translation";
import LocalStorage from "../Libs/LocalStorage";
import HeaderButton from "../Components/HeaderButton";
import backUp from "../Libs/backUp";
import History from "../Libs/History_module";
TXT = null;


class Credentials extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email:"",
      password:""
    };
    this.LS = new LocalStorage();
    this.LS.getCredentials().then(output=>{
      this.setState({email:output.email, password:output.password});
    });
    }
    saveCredentials(){
      this.LS.setCredentials(this.state.email,this.state.password);
      this.props.closeModal();
    }
    render(){
      return (
        <View style={{height:"100%",width:"100%",backgroundColor:"#646c78"}}>
          <View style={styles_list.row_view}>
          <Text style={styles_list.text_k}> {TXT.User_name} : </Text>
          <TextInput
              style={styles_list.TextInput}
              placeholder={TXT.User_name+" .. "}
              placeholderTextColor="#ecf0f1"
              onChangeText ={newValue=>{
                  this.setState({email:newValue});
              }}
              value={this.state.email}
              type="username"
              autoCorrect={false}
          />
          </View>

          <View style={styles_list.row_view}>
          <Text style={styles_list.text_k}> {TXT.Password} : </Text>
          <TextInput
              style={styles_list.TextInput}
              placeholder={TXT.Password+" .. "}
              placeholderTextColor="#ecf0f1"
              onChangeText ={newValue=>{
                  this.setState({password:newValue});
              }}
              value={this.state.password}
              type="password"
              secureTextEntry={true}
              autoCorrect={false}
          />
          </View>
          <View style={buttons_style.container_row}>
            <View style={buttons_style.view_btn_row}>
              <Button
                  style={buttons_style.btn_row}
                  title={TXT.Sign_in+""}
                  disabled={this.props.savingCredents}
                  color="#2ecc71"
                  onPress={()=>{
                    this.props.saveCredents(this.state.email,this.state.password);
                  }
                  }
              ></Button>
            </View>
            <View style={buttons_style.view_btn_row}>
              <Button
                  style={buttons_style.btn_row}
                  title={TXT.Cancel+""}
                  
                  color="#f39c12"
                  onPress={()=>{
                      this.props.closeModal();
                  }
                  }
              ></Button>
            </View>
            <View style={buttons_style.view_btn_row}>
              <Button
                  style={buttons_style.btn_row}
                  title={TXT.Sign_up+""}
                  disabled={this.props.savingCredents}
                  color="#3498db"
                  onPress={()=>{
                      this.props.signUp(this.state.email,this.state.password);
                  }
                  }
              ></Button>
              </View>
            </View>

        </View>
      );
    }
}

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
      };
      this.LS = new LocalStorage();
      this.firstHistoryRender = true;
      this.TXT_ob = new Translation(this.LS);
      this.backup = new backUp();
      //this.backup.Company.DB.updateTables();
      this.backup._loadClient().then(output=>{
        this.setState({backup_email:this.backup.email,backup_lastActivity:this.backup.lastActivity, backup_is_admin:this.backup.admin});
      });
      this.History_ob = new History();
      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          new Translation().getTranslation().then(tr=>{
          if(TXT != tr){
            TXT = tr;
            this.backup.TXT = TXT;
            this.props.navigation.setParams({title:TXT.Home});
            this.setState({language:this.TXT_ob.language});
          }
          });
          this.loadHistory();
        }
      );
    }
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
      await this.History_ob.importLS(ls_hist);

      this.History_ob.gethistory().then( output =>{
        this.setState({
          history_list       : output[0],
          month_total        : output[1],
          t9adya_total       : output[2],
          LastRemovedHistory : LastRemovedHistory});
      });
    }
    componentDidMount(){
      //this.loadHistory();
      this.props.navigation.setParams({
          openAddModal : this.openAddModal,
          TXT  : TXT,
          disable:false,

       })
    }
  static navigationOptions =  ({ navigation  }) => ({
      title : navigation.getParam("title"),
      headerRight: a=>{
        const {params = {}} = navigation.state;
        return (
          <HeaderButton 
            name="cogs"
            onPress={params.openAddModal}
            size={28} 
            color="#ecf0f1"
            />
        )
        },
    });
    saveConfig = async (key,value) => {
      await this.LS.setSetting(key,value);
      if(key=="language"){
        const transl = await this.TXT_ob.getTranslation();
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
    clearDatabase(){
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
        return (
          <Text key={v} style={{color:"#bdc3c7",textAlign:"left",width:"90%",}}>{k}</Text>
        );
      });
      return (
        <Modal 
        animationType="slide"
        transparent={true}
        visible={this.state.synchLog_modal}
        onRequestClose={() => { this.setState({ synchLog_modal:false,}); } }
        >
          <View style={{flex:1,width:"100%",justifyContent:"center",backgroundColor:"black"}}>
            {log}
            { !this.state.synchronize_btn_status && 
            <ActivityIndicator size="large" color="#00ff00" />}
            { this.state.synchronize_btn_status &&
            <Text style={{color:"#bdc3c7",textAlign:"center",width:"90%",fontSize:23}}>DONE!</Text>
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
    saveCredents =(email,password)=>{
      this.setState({savingCredents:true});
      this.LS.setCredentials(email,password).then(output=>{
        if(output==false){
          return false;
        }
        this.backup.changeClient().then(()=>{
          this.closeModal_credents();

          this.setState({
            synchronize_btn_status:true,
            backup_lastActivity:this.backup.lastActivity,
            backup_email:this.backup.email,
            backup_is_admin:this.backup.admin,
            savingCredents:false,
          });
        });
        
      });
    }
    signUp =(email,password)=>{
      this.setState({savingCredents:true});
      this.backup.newUser(email,password).then(()=>{
        this.saveCredents(email,password);
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
          <View style={{height:300,width:"100%",backgroundColor:"#646c78"}}>
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
            <View style={{flex:.4,backgroundColor:"#2c3e5066"}}></View>
            <View style={{height:400,width:"100%",backgroundColor:"#646c78"}}>
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
                <View style={styles_list.text_v} >
                  <Button 
                    style={{marginLeft:10}}
                    title = {TXT.Clear_cache}
                    disabled={!this.state.history_list || this.state.history_list.length==0}
                    onPress={ ()=> {
                      this.History_ob.DB.empty().then(()=>{
                        this.LS.setLastRemovedHistory().then(()=>{
                          this.loadHistory();
                        });
                      });
                    }}
                />
              </View>
              </View>
              <View style={styles_list.row_view}>
                <Text style={styles_list.text_k}> {TXT.Clear_database} : </Text>
                <View style={styles_list.text_v} >
                  <Button 
                    style={{marginLeft:10,marginRight:30}}
                    title = {TXT.Clear}
                    disabled={!this.state.clear_database}
                    onPress={this.clearDatabase}
                />
                </View>
              </View>
              <View style={styles_list.row_view}>
                <Text style={styles_list.text_k}> {TXT.LastBackUp} : </Text>
                <Text style={styles_list.text_v}>{this.state.backup_lastActivity+""} </Text>
              </View>
              { this.state.backup_is_admin &&  
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
                    onPress={ ()=> {
                      this.setState({synchronize_btn_status:false,synchLog_modal:true,synchLog:[]});
                      this.backup.synchronize(this.appendLog).then(out=>{
                        this.setState({
                          synchronize_btn_status:true,
                          backup_lastActivity:this.backup.lastActivity,
                          backup_email:this.backup.email,
                        });
                      });
                    }}
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
            
              <Button 
                title={TXT.Close}
                onPress={()=>this.setState({modalVisible:false}) }
              />
            </View>
            <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

        </Modal>
      );
  }
    getMonth(date){
      return date.split(" ")[0].split("-").slice(0,2).join("-");
    }
    render_history(){
      let lastMonth = "";
      this.state.months_total = {};
      let monthtotal = 0 ;
      let is_OK = true;
      let i = 0;
      let j = 0;
      let t9dyat = [];

      for (const month in this.state.history_list) {
        let list_prods=null;
        if (this.state.history_list.hasOwnProperty(month)) {
          const month_hist = this.state.history_list[month];
          t9dyat.push(                  
          <Text key={month} style={{color:"white",width:"100%",fontSize:30,backgroundColor:"#3d91c8a8"}} > 
            {month} : {this.state.month_total[month]} dh
          </Text>);
          for (const t9adya_key in month_hist) {
            let list_prods=null;
            if (month_hist.hasOwnProperty(t9adya_key)) {
              const t9adya = month_hist[t9adya_key];
              const list_details = t9adya.map((prod,k)=>{
          
                if(prod.fields.product_id==null){
                  is_OK = false;
                  return <Text>Not Found</Text>;
                }
                return (
                  <Text key={t9adya_key+prod.fields.product_id+k}  style={{color:"#bdc3c7",fontSize:18}}>
                    x{prod.fields.quantity?prod.fields.quantity:1} -{prod.fields.product_id} - {prod.fields.price} dh
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
                    console.log("t9adya_key+j",t9adya_key);
                  }}
                >
                  <View style={{alignSelf: 'stretch',flexDirection:"row"}}>
                    <Text style={{color:"white",width:"70%",fontSize:20}}> 
                      {t9adya_key}
                    </Text>
                    {this.state.t9adya_total[t9adya_key] && 
                        <Text style={{color:"#f5e295fc",padding:0,backgroundColor:"#2980b970",textAlign:"right",fontSize:20,width:"30%"}}>
                          { this.state.t9adya_total[t9adya_key] +" DH"}
                        </Text>
                      } 
                  </View>
                  <View >
                  {this.state.showDetails && this.state.showDetails==t9adya_key &&
                    list_details
                    }
                  </View>
                </TouchableOpacity>
    
              </View>
              
              );

              j=j+1;
            }
          }


          i+=1;
        }
      }
      return (
        <ScrollView style={{flex:1,flexDirection:"column",paddingRgith:10,marginLeft:10,}}>
          <Text style={{color:"white",width:"95%",paddingLeft:8,fontSize:30,}} > {TXT.History} :</Text>
          {t9dyat}
          {this.state.LastRemovedHistory &&
          <Text style={{color:"#f4caa5",fontSize:18}}>{TXT.Last_cleared_history} : {this.state.LastRemovedHistory}</Text>
          }
        </ScrollView>
      );
    }
    render() {
      
        return (
          <View style={styles.container} >   
              {this.render_history()}
              {this.render_modal_Settings()}
              {this.render_modal_credentials()}
              {this.getLoadingModal()}
          </View>
        );
      }
}

export default HomeScreen;