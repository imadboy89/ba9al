import React from 'react';
import { Alert, Text, View, Button,TextInput,Modal } from 'react-native';
import {styles_list,buttons_style,styles} from "../Styles/styles";
import Company from "../Libs/Company_module";
import Translation from "../Libs/Translation";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";
import getCountry from "../Libs/Countries";
import HeaderButton from "../Components/HeaderButton";

TXT = null;


class CompaniesScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        company_edit : null,
        isVisible_modal_scan : false,
        isVisible_modal_add : false,
        sql_error:null,
        items_list :[]
      };
      this.company = new Company();
      new Translation().getTranslation().then(tr=>{
        TXT = tr;
        this.setState({});
      });
      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          new Translation().getTranslation().then(tr=>{
            if(TXT != tr){
                TXT = tr;
                this.props.navigation.setParams({title:TXT.Companies});
              }
          });
        }
      );
    }
    openAddModal = (company) => {
        if(company){
            this.setState({isVisible_modal_add:true,company_edit:company});
        }else{
            this.props.navigation.setParams({disable:true});
            this.setState({isVisible_modal_scan:true,company_edit:new Company()});
        }
      };

    componentDidMount(){
        this.loadItems();
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
            name="plus-square"
            disabled={params.disable}
            onPress={()=>params.openAddModal()}
            size={28} 
            color="#ecf0f1"
          />
          )
          },
      });
    setItemParent = (item) => {
        this.setState({
            company_edit : item,
            isVisible_modal_add : true,
        });
    }
    showProducts = (company) => {
        this.props.navigation.navigate('Products_',{company:company, });
    }
    loadItems(){
        if (this.state.items_list){
            this.setState({items_list:[]});
        }
        this.company.filterWithExtra({}).then(output=>{
            if(output["success"]){
              this.setState({items_list:output["list"]});
            }else{
              this.setState({sql_error:output["error"]});
            }
        });
    }
    setCode = (type, code, country,company,product) => {
        this.props.navigation.setParams({disable:false});
        this.state.company_edit.fields.id= code.slice(0,7);

        this.state.company_edit.get({"code":country+""+company}).then((output)=>{
            if (output["res"]==false){
                this.state.company_edit.fields.country = getCountry(country);
                this.setState({
                    isVisible_modal_scan : false,
                    isVisible_modal_add : true,
                });

            }else{
                Alert.alert(
                    TXT.Company_found,
                    TXT.Company_already_Exist+" : "+output["res"].name+" = "+output["res"].price+" DH",
                    [
                      {
                        text: TXT.Update,
                        onPress: () => {
                            this.setState({
                                isVisible_modal_scan : false,
                                isVisible_modal_add : true,
                            });
                        },
                        
                      },
                      {
                        text: TXT.Cancel, 
                        onPress: () => {
                            this.setState({
                                isVisible_modal_scan : false,
                                isVisible_modal_add : false,
                                company_edit:null
                            });
                        },
                        style: 'cancel',
                      },
                      {
                        text: TXT.Add_another, 
                        onPress: () => {
                            this.setState({
                                isVisible_modal_scan : true,
                                isVisible_modal_add : false,
                                company_edit:new Company()
                            });
                        },
                      },
                    ],
                  );

            }
        });
    }
    save(){
        this.state.company_edit.save().then((output)=>{
            if(output==-1){
                alert(TXT.Company_found,TXT.Company_already_Exist);
            }
            this.loadItems();
        });
        this.setState({isVisible_modal_add:false});
    }
    delete(){
        this.state.company_edit.delete();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
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
             } }
          >
              <BarcodeScanner setCode={this.setCode} TXT={TXT}></BarcodeScanner>
          </Modal>
        );
    }
    render_modal(){
        if(this.state.company_edit == null){
            return null;
        }
        return (
            <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.isVisible_modal_add}
            onRequestClose={() => { this.setState({ isVisible_modal_add:false,}); } }
          >
            <View style={{flex:.5,backgroundColor:"#2c3e5066"}}></View>
            <View style={{height:300,width:"99%",backgroundColor:"#7f8c8d"}}>
                <View style={styles_list.container}>
                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Name}  :</Text>
                        <View style={styles_list.text_v}>
                        <TextInput
                            style={styles_list.TextInput}
                            placeholder={TXT.Name+" .. "}
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={newValue=>{
                                this.state.company_edit.fields.name=newValue;
                                this.setState({});
                            }}
                            value={this.state.company_edit.fields.name}
                        />
                        </View>
                    </View>

                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Country}  :</Text>
                        <View style={styles_list.text_v}>
                        <TextInput
                            style={styles_list.TextInput}
                            placeholder={TXT.Country+" .. "}
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={newValue=>{
                                this.state.company_edit.fields.country=newValue;
                                this.setState({});
                            }}
                            value={this.state.company_edit.fields.country}
                        />
                        </View>
                    </View>
                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Code}  :</Text>
                        <View style={styles_list.text_v}>
                        <TextInput
                            style={styles_list.TextInput}
                            placeholder={TXT.Code+" .. "}
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={newValue=>{
                                this.state.company_edit.fields.id=newValue;
                                this.setState({});
                            }}
                            value={this.state.company_edit.fields.id ? this.state.company_edit.fields.id+"": ""}
                        />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <Button
                        buttonStyle={buttons_style.modalAdd}
                        containerStyle={buttons_style.modalAdd}
                        title={TXT.Save}
                        color="green"
                        onPress={()=>{
                            this.save();
                        }
                        }
                    ></Button>
                    <Button
                        buttonStyle={buttons_style.modalAdd}
                        title={TXT.Cancel}
                        color="orange"
                        onPress={()=>{
                            this.setState({isVisible_modal_add:false});
                        }
                        }
                    ></Button>
                    <Button
                        buttonStyle={buttons_style.modalAdd}
                        title={TXT.Delete}
                        color="#e55039"
                        onPress={()=>{
                            this.delete();
                        }
                        }
                    ></Button>
                </View>
                </View>
                <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>
            </Modal>
        );
    }
    render() {
      
        return (
          <View style={styles.container} >
              <ItemsList 
                items_list={this.state.items_list}
                setItemParent={this.setItemParent}
                showProducts={this.showProducts}
                ItemClass={Company}
                 />
            {this.render_modal()}
            {this.render_modal_BarcodeScanner()}
          </View>
        );
      }
}


export default CompaniesScreen;