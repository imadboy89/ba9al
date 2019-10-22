import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity,Picker,ScrollView,Modal } from 'react-native';
import {header_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import Translation from "../Libs/Translation";
import Icon from 'react-native-vector-icons/FontAwesome';
import LocalStorage from "../Libs/LocalStorage";
import HeaderButton from "../Components/HeaderButton";
LS = new LocalStorage();
TXT = null;


class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        openSidMenu: false,
        modalVisible:false,
        language:null,
        image_quality:LS.settings["image_quality"],
        history_list:[],
      };

      this.TXT_ob = new Translation(LS);

      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.loadHistory();
        }
      );

    }
    openAddModal = () => {
      this.setState({modalVisible:true});
    }
    loadHistory(){
      LS.getHistory().then(history=>{
        if(history && history.length>0){
          this.setState({history_list:history});
        }
      });
    }
    componentDidMount(){
      this.loadHistory();
      this.TXT_ob.getTranslation().then(tr=>{
        TXT = tr;
        this.setState({language:this.TXT_ob.language});
      });
      this.props.navigation.setParams({
          openAddModal : this.openAddModal,
          TXT  : TXT,
          disable:false,

       })
    }
  static navigationOptions =  ({ navigation  }) => ({
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
      await LS.setSetting(key,value);
      if(key=="language"){
        const transl = await this.TXT_ob.getTranslation();
        TXT = transl;
      }
      let state_ = {};
      state_[key] = value;
      this.setState(state_);
    }
    get_languages(){
      return Object.keys(LS.languages).map( (key,v) =>{
          const label = LS.languages[key];
          return (
              <Picker.Item label={label} value={key} key={key} />
          );
      })
    }
    get_Qualities(){
      return Object.keys(LS.imageQualities).map( (key,v) =>{
          const value = LS.imageQualities[key];
          return (
              <Picker.Item label={key} value={value} key={key} />
          );
      })
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
                <Text style={styles_list.text_k}> {TXT.Language} - {this.state.language}  : </Text>
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
                <Text style={styles_list.text_k}> {TXT.Image_quality}  : </Text>
                <Picker
                selectedValue={this.state.image_quality}
                style={styles_list.text_v}
                onValueChange={(itemValue, itemIndex) =>
                    this.saveConfig("image_quality", itemValue)
                    
                }>
                    {this.get_Qualities()}
                </Picker>
              </View>
              <Button 
                title="Close"
                onPress={()=>this.setState({modalVisible:false}) }
              />
            </View>
            <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

        </Modal>
      );
  }
    render_history(){
      const list =  this.state.history_list.slice(0).reverse().map((list,i)=>{
        if(!list["list"] || !list["list"].map){
          return null;
        }
        const list_details = list["list"].map((prod,k)=>{
          return (
            <Text key={list["title"]+i+prod.name+k}  style={{color:"#bdc3c7",fontSize:18}}>
              x{prod.quantity?prod.quantity:1} -{prod.name} - {prod.price} dh
            </Text>
            
          );
        });
        return (
          <View key={list["title"]+i}  style={{alignSelf: 'stretch',paddingBottom:5,paddingTop:5,paddingLeft:20,borderRadius: 4,borderWidth: 0.5,borderColor: '#d6d7da',}}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={()=>{
                if(this.state.showDetails && this.state.showDetails== list["title"]+i){
                  this.setState({showDetails:null});
                }else{
                  this.setState({showDetails:list["title"]+i});
                }
              }}
            >
              <View style={{alignSelf: 'stretch',flexDirection:"row"}}>
                <Text style={{color:"white",width:"70%",fontSize:20}}> 
                  {list["title"]}
                </Text>
                {list["total"] && 
                    <Text style={{color:"#f5e295fc",padding:0,backgroundColor:"#2980b970",textAlign:"right",fontSize:20,width:"30%"}}>
                      {list["total"]+" DH"}
                    </Text>
                  } 
              </View>
              <View >
              {this.state.showDetails && this.state.showDetails==list["title"]+i && 
                list_details
                }
              </View>
            </TouchableOpacity>

          </View>
        );
      });

      return (
        <View style={{flex:1,flexDirection:"column",paddingRgith:10,marginLeft:10,}}>
          <Text style={{color:"white",width:"95%",paddingLeft:8,fontSize:30,}} > {TXT.History} :</Text>
          {list}
        </View>
      );
    }
    render() {
      
        return (
          <View style={styles.container} >
              <Text>{TXT.Product_already_Exist}</Text>   
              {this.render_history()}
              {this.render_modal_Settings()}
          </View>
        );
      }
}

export default HomeScreen;