import React from 'react';
import { StyleSheet, Text, View, Button, FlatList,TextInput,ScrollView,Modal,TouchableHighlight,Image } from 'react-native';
import {header_style,styles_list,buttons_style,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Company from "../Libs/Company_module";
import Translation from "../Libs/Translation";
import ItemsList from '../Components/ItemsList';

TXT = new Translation("fr").getTranslation();


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
      
    }
    openAddModal = (company) => {
        if(company){
            this.setState({isVisible_modal_add:true,company_edit:company});
        }else{
            this.setState({isVisible_modal_add:true,company_edit:new Company()});
        }
      };

    componentDidMount(){
        this.loadItems();
        this.props.navigation.setParams({
            openAddModal : this.openAddModal,
            TXT  : TXT,
         })
      }
    static navigationOptions =  ({ navigation  }) => ({
        headerStyle: header_style.header,
        headerTitle: a=>{
          const {params = {}} = navigation.state;
          return (
            <View style={{flex:1,flexDirection:"row"}}>
              <Text style={header_style.title_home}>{navigation.getParam("cat")}</Text>
            </View>
          )
          },
        headerRight: a=>{
          const {params = {}} = navigation.state;
          let Add_str = "";
          try {
            Add_str = params.TXT.Add;
          } catch (error) {
          }
          return (
              <Button
                name = "plus"
                onPress={ () => params.openAddModal() }
                title={Add_str}
              />
          )
          },
      });


    loadItems(){
        if (this.state.items_list){
            this.setState({items_list:[]});
        }
        this.company.filter({}).then(output=>{
            if(output["success"]){
                console.log("loaded",output["list"].length);
              this.setState({items_list:output["list"]});
            }else{
              this.setState({sql_error:output["error"]});
            }
        });
    }
    setCode(type,code){
        this.state.company_edit.fields.code= ""+code;
        this.state.company_edit.fields.code = this.state.company_edit.fields.code.slice(1,7);
    }
    save(){
        this.state.company_edit.save();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
    }
    delete(){
        this.state.company_edit.delete();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
    }

    setItemParent = (item) => {
        this.setState({
            company_edit : item,
            isVisible_modal_add : true,
        });
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
                                this.state.company_edit.fields.code=newValue;
                                this.setState({});
                            }}
                            value={this.state.company_edit.fields.code ? this.state.company_edit.fields.code+"": ""}
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
                ItemClass={Company}
                 />
            {this.render_modal()}
          </View>
        );
      }
}


export default CompaniesScreen;