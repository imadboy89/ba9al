import React from 'react';
import { StyleSheet, Text, View, Button, FlatList,TextInput,ScrollView,Modal,TouchableHighlight,Image } from 'react-native';
import {header_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Product from "../Libs/Product_module";
import Translation from "../Libs/Translation";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";


TXT = new Translation("fr").getTranslation();


class ProductsScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        product_edit : null,
        isVisible_modal_scan : false,
        isVisible_modal_add : false,
        sql_error:null,
        items_list :[],
      };
      this.product = new Product();
      
    }
    openAddModal = (product) => {
        if(product){
            this.setState({isVisible_modal_add:true,product_edit:product});
        }else{
            this.setState({isVisible_modal_scan:true,product_edit:new Product()});
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
        this.product.filter({}).then(output=>{
            if(output["success"]){
                console.log("loaded",output["list"].length);
              this.setState({items_list:output["list"]});
            }else{
              this.setState({sql_error:output["error"]});
            }
        });
    }
    setCode = (type,code) => {
        this.state.product_edit.fields.code= ""+code;
        this.state.product_edit.fields.company = this.state.product_edit.fields.code.slice(1,7);
        this.setState({
            isVisible_modal_scan : false,
            isVisible_modal_add : true,
        });
    }
    save(){
        this.state.product_edit.save();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
    }
    delete(){
        this.state.product_edit.delete();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
    }

    setItemParent = (item) => {
        this.setState({
            product_edit : item,
            isVisible_modal_add : true,
        });

    }
    render_modal_BarcodeScanner(){
        return (
            <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.isVisible_modal_scan}
            onRequestClose={() => { this.setState({ isVisible_modal_scan:false,}); } }
          >
              <BarcodeScanner setCode={this.setCode}></BarcodeScanner>
          </Modal>
        );
    }
    render_modal(){
        if(this.state.product_edit == null){
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
                                this.state.product_edit.fields.name=newValue;
                                this.setState({});
                            }}
                            value={this.state.product_edit.fields.name}
                        />
                        </View>
                    </View>

                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Company}  :</Text>
                        <View style={styles_list.text_v}>
                        <TextInput
                            style={styles_list.TextInput}
                            placeholder={TXT.Company+" .. "}
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={newValue=>{
                                this.state.product_edit.fields.company=newValue+"";
                                this.setState({});
                            }}
                            value={this.state.product_edit.fields.company ? this.state.product_edit.fields.company+"": ""}
                        />
                        </View>
                    </View>
                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Price}  :</Text>
                        <View style={styles_list.text_v}>
                        <TextInput
                            style={styles_list.TextInput}
                            placeholder={TXT.Price+" .. "}
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={newValue=>{
                                this.state.product_edit.fields.price=newValue;
                                this.setState({});
                            }}
                            value={this.state.product_edit.fields.price ? this.state.product_edit.fields.price+"": ""}
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
                                this.state.product_edit.fields.code=newValue;
                                this.setState({});
                            }}
                            value={this.state.product_edit.fields.code ? this.state.product_edit.fields.code+"": ""}
                        />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <Button
                        title={TXT.Save}
                        color="green"
                        onPress={()=>{
                            this.save();
                        }
                        }
                    ></Button>
                    <Button
                        title={TXT.Cancel}
                        color="orange"
                        onPress={()=>{
                            this.setState({isVisible_modal_add:false});
                        }
                        }
                    ></Button>
                    <Button
                        style={{color:"black"}}
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
                ItemClass={Product}
                 />
            {this.render_modal()}
            {this.render_modal_BarcodeScanner()}
          </View>
        );
      }
}


export default ProductsScreen;