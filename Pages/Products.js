import React from 'react';
import { Text, View, Button,TextInput,Image,Modal,TouchableHighlight,Alert } from 'react-native';
import {header_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import Product from "../Libs/Product_module";
import Translation from "../Libs/Translation";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";
import HeaderButton from "../Components/HeaderButton";
import { TouchableOpacity } from 'react-native-gesture-handler';

TXT = null;


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
      //this.product.DB.changetable();
      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          new Translation().getTranslation().then(tr=>{
            if(TXT != tr){
                TXT = tr;
                this.props.navigation.setParams({title:TXT.Products});
            }
            //this.setState({});
          });
          const company = this.props["navigation"].getParam("company");
          if(company){
              this.loadItems();
          }else{
            this.props.navigation.setParams({company:null});
          }
        }
      );

    }
    
    openAddModal = (product) => {
        if(product){
            this.setState({isVisible_modal_add:true,product_edit:product,});
        }else{
            this.props.navigation.setParams({disable:true});
            this.setState({isVisible_modal_scan:true,product_edit:new Product() });
        }
      };

    componentDidMount(){

        this.loadItems();
        this.props.navigation.setParams({
            openAddModal : this.openAddModal,
            TXT  : TXT,
            disable:false,
            loadItems:this.loadItems
         });
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
                {params.company && params.company.fields && params.company.fields.name &&
                    <View style={{flexDirection:"row"}}>
                        <Text style={{color:"white",marginRight:20,fontSize:20,}}>{params.company.fields.name}</Text>
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.setParams({company:null});
                                params.loadItems(true); 
                            }}
                        >
                            <Text style={{paddingLeft:5,paddingRight:5,color:"white",backgroundColor:"#425b74",marginRight:20,fontSize:20,borderRadius: 4,borderWidth: 0.5,borderColor: '#d6d7da'}}>All</Text>
                        </TouchableOpacity>
                    </View>
                }
                <HeaderButton 
                    name="plus-square"
                    disabled={params.disable}
                    onPress={()=>params.openAddModal()}
                    size={28} 
                    color="#ecf0f1"
                />
              </View>
          )
          },
      });

    loadItems = (switchToAll=false) => {

        let company = switchToAll ? null : this.props["navigation"].getParam("company");
        if (this.state.items_list){
            this.setState({items_list:[]});
        }
        where = (company && company.fields) ? {company:company.fields.id}: {};
        this.product.filterWithExtra(where).then(output=>{
        //this.product.filter({}).then(output=>{
            if(output["success"]){
              this.setState({items_list:output["list"]});
            }else{
              this.setState({sql_error:output["error"]});
            }
        });
    }
    setImgB64 = (imgBs64) => {
        this.state.product_edit.photo_data = "data:image/jpg;base64,"+imgBs64["base64"];
        this.setState({
            isVisible_modal_camera : false,
        });
    }
    setCode = (type, code, country,company,product,isNoBarCode) => {
        this.props.navigation.setParams({disable:false});
        this.state.product_edit.fields.id= code;
        this.state.product_edit.fields.desc = isNoBarCode ? "NoBarCode" : null;
        this.state.product_edit.get({"id":code}).then((output)=>{
            if (output["res"]==false){
                this.state.product_edit.fields.company = this.state.product_edit.fields.id.slice(0,7);
                this.setState({
                    isVisible_modal_scan : false,
                    isVisible_modal_add : true,
                });

            }else{
                Alert.alert(
                    TXT.Product_found,
                    output["res"].name+" : "+output["res"].price+" DH",
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
                                product_edit:null
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
                                product_edit:new Product()
                            });
                        },
                      },
                    ],
                  );

            }
        });

    }
    save(){
        this.state.product_edit.save().then((output)=>{
            if(output==-1){
                alert(TXT.Product_found,TXT.Product_already_Exist+"!");
            }
            this.loadItems();
        });
        this.setState({isVisible_modal_add:false});
        
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
            transparent={false}
            visible={this.state.isVisible_modal_scan}
            onRequestClose={() => { 
                this.props.navigation.setParams({disable:false});
                this.setState({ isVisible_modal_scan:false,});
             } }
          >
              <BarcodeScanner setCode={this.setCode} TXT={TXT}></BarcodeScanner>
          </Modal>
        );
    }
    render_modal_Camera(){
        if(this.state.isVisible_modal_camera!=true){
            return null;
        }
        return (
            <Modal 
            animationType="slide"
            transparent={false}
            visible={this.state.isVisible_modal_camera}
            onRequestClose={() => { 
                this.props.navigation.setParams({disable:false});
                this.setState({ isVisible_modal_camera:false,});
             } }
          >
              <BarcodeScanner setImgB64={this.setImgB64} TXT={TXT}></BarcodeScanner>
          </Modal>
        );
    }
    render_modal(){
        if(this.state.product_edit == null){
            return null;
        }
        /*
        let img_source = ( this.state.product_edit.photo_ob && this.state.product_edit.photo_ob.data && ["",null,undefined].indexOf(this.state.product_edit.photo_ob.data)<0 )
                ? { uri:this.state.product_edit.photo_ob.data} 
                : require('../assets/camera.png');*/
        let img_source = ( this.state.product_edit.photo_ob && ["",null,undefined].indexOf(this.state.product_edit.photo_ob.fields.data)<0 )
                ? { uri:this.state.product_edit.photo_ob.fields.data} 
                : require('../assets/camera.png');
        img_source = ( this.state.product_edit && ["",null,undefined].indexOf(this.state.product_edit.photo_data)<0 )
                ? { uri:this.state.product_edit.photo_data} 
                : img_source;
        const img_length = this.state.product_edit && this.state.product_edit.photo_ob && this.state.product_edit.photo_ob.fields.data ? this.state.product_edit.photo_ob.fields.data.length : 0;
        console.log("img_length",img_length);
        return (
            <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.isVisible_modal_add}
            onRequestClose={() => { this.setState({ isVisible_modal_add:false,}); } }
          >
            <View style={{flex:.5,backgroundColor:"#2c3e5066"}}></View>
            <View style={{height:450,width:"99%",backgroundColor:"#7f8c8d"}}>
                <View style={styles_list.container}>
                <Text>{img_length}</Text>
                    <TouchableHighlight onPress={()=>{
                        this.setState({
                            isVisible_modal_camera:true,
                        });
                    }}>
                        <View style={{width:200,height:150,backgroundColor:"#bdc3c7",alignSelf:"center"}}>
                            <Image  source={img_source} resizeMode="contain" style={{ flex: 1, height: undefined, width: undefined }} />
                        </View>
                    </TouchableHighlight>

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
                        <Text style={styles_list.text_k}> {TXT.Code}  :</Text>
                        <View style={styles_list.text_v}>
                        <TextInput
                            style={styles_list.TextInput}
                            placeholder={TXT.Code+" .. "}
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={newValue=>{
                                this.state.product_edit.fields.id=newValue;
                                this.setState({});
                            }}
                            value={this.state.product_edit.fields.id ? this.state.product_edit.fields.id+"": ""}
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
            {this.render_modal_Camera()}
          </View>
        );
      }
}


export default ProductsScreen;