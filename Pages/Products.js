import React from 'react';
import { Text, View, Button,TextInput,Image,Modal,TouchableHighlight,Alert } from 'react-native';
import {buttons_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import Product from "../Libs/Product_module";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";
import HeaderButton from "../Components/HeaderButton";
import { TouchableOpacity } from 'react-native-gesture-handler';
import AutoComplite from "../Components/autoComplite";
import Next_previous from "../Components/nex_previous";
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
        refreshing:false,
        page : 0,
      };
      this.items_number_perpage = 20;
      this.product = new Product();
      //this.product.DB.changetable();
      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
            Translation_.getTranslation().then(tr=>{
            if(TXT != tr){
                TXT = tr;
                this.props.navigation.setParams({title:TXT.Products});
            }
            //this.setState({});
          });
          const company = this.props["navigation"].getParam("company");
          const product_id = this.props["navigation"].getParam("product_id");
          if(company){
              this.state.page=0;
              this.loadItems();
              this.props.navigation.setParams({items_count:""});
          }else if(product_id){
            this.state.product_edit = new Product();
            this.setCode (null, product_id);
            this.props.navigation.setParams({product_id: null})
          }else{
            this.product.filter().then(out=>{
                let count = out && out["success"] && out["list"] && out["list"].length ? out["list"].length : 0;
                count = ' ['+count+']';
                this.props.navigation.setParams({company:null, items_count:count});
            });
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

    openAddModal_search = async() => {
        await this.loadItemsForSearch();
        this.setState({isVisible_modal_search:true});
    };
    loadItemsForSearch(){
        this.products_list = []
        return this.product.filter().then(output=>{
            if("list" in output && output["list"]){
                for (let i = 0; i < output["list"].length; i++) {
                    const prod = output["list"][i];
                    let prod_dict = {};
                    prod_dict[prod.fields.id] = prod.fields.name 
                    this.products_list.push(prod_dict);
                }
            }
        });
    }
    componentDidMount(){

        this.loadItems();
        //this.loadItemsForSearch();
        this.props.navigation.setParams({
            openAddModal : this.openAddModal,
            TXT  : TXT,
            disable:false,
            loadItems:this.loadItems,
            openAddModal_search:this.openAddModal_search,
            items_count : "",
         });
      }
    static navigationOptions =  ({ navigation  }) => ({
        title : navigation.getParam("title")+navigation.getParam("items_count",""),
        headerRight: a=>{
          const {params = {}} = navigation.state;
          let Add_str = "";
          let All_str = "All";
          try {
            Add_str = params.TXT.Add;
            All_str = params.TXT.All;
          } catch (error) {
          }
          const company = params.company ? Object.assign({}, params.company) : null;
          if(company && company.fields && company.fields.name){
            navigation.state.company = null;
          }
          return (
              <View style={{flexDirection:"row"}}>
                {params.company && params.company.fields && params.company.fields.name &&
                    <View style={{flexDirection:"row"}}>
                        <Text style={{color:"white",marginRight:8,fontSize:18,}}>{params.company.fields.name}</Text>
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.setParams({company:null});
                                params.loadItems(true); 
                            }}
                        >
                            <Text style={{paddingLeft:5,paddingRight:5,color:"white",backgroundColor:"#4d8fd2",marginRight:20,fontSize:20,borderRadius: 4,borderWidth: 0.5,borderColor: '#d6d7da'}}>{All_str}</Text>
                        </TouchableOpacity>
                    </View>
                }
                <HeaderButton 
                    name="search"
                    disabled={params.disable}
                    onPress={()=>params.openAddModal_search()}
                    size={28} 
                    color="#ecf0f1"
                />
                <View style={{width:8}}></View>
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
        this.setState({refreshing:true});
        let company = switchToAll ? null : this.props["navigation"].getParam("company");
        if (this.state.items_list){
            this.setState({items_list:[]});
        }
        where = (company && company.fields) ? {company:company.fields.id}: {};
        this.product.filterWithExtra(where,this.state.page,this.items_number_perpage).then(output=>{
        //this.product.filter({}).then(output=>{
            if(output["success"]){
              this.setState({items_list:output["list"],refreshing:false});
            }else{
              this.setState({sql_error:output["error"],refreshing:false});
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
                this.state.product_edit.fields.company = company ? company : code.slice(0,8);
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

        Alert.alert(
            TXT.Confirmation,
            TXT.Are_you_sure_you_want_to_delete + `: \n  [`+this.state.product_edit.fields.name+`] `,
            [

              {
                text: TXT.No, 
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: TXT.Yes, 
                onPress: () => {
                    this.state.product_edit.delete();
                    this.setState({isVisible_modal_add:false});
                    this.loadItems();
                },
              },
            ],
          );
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
    openItem = (item_id)=>{
        this.state.product_edit = new Product();
        this.state.product_edit.fields.id= item_id;
        this.state.product_edit.get({"id":item_id}).then((output)=>{
            if (output["res"]){
                this.setState({
                    isVisible_modal_search : false,
                    isVisible_modal_add : true,
                });
            }
        });
    }
    render_modal_Search(){
        if(this.state.isVisible_modal_search!=true){
            return null;
        }
        return (
            <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.isVisible_modal_search}
            onRequestClose={() => { 
                this.setState({ isVisible_modal_search:false});
             } }
          >

           <View style={{flex:.5,backgroundColor:"#2c3e5066"}}></View>
           <View style={{height:500,width:"99%",backgroundColor:"#7f8c8d"}}>
           <Text style={styles_list.text_k}>{TXT.Product_name}  :</Text>
           <AutoComplite
                      styleTextInput={styles_list.TextInput}
                      placeholder={TXT.Name+" .. "}
                      placeholderTextColor="#ecf0f1"
                      options_pool={this.products_list}
                      action={this.openItem}
                  />
                <Button
                    title={TXT.Close}
                    onPress={()=>{
                        this.setState({isVisible_modal_search:false});
                    }}
                ></Button>
           </View>
           <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>   
          </Modal>
        );
    }
    
    render_modal(){
        if(this.state.product_edit == null || !this.state.isVisible_modal_add){
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
        const bgc = img_length && img_length > 50000 ? "#e67e22" : "#000" ;
        return (
            <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.isVisible_modal_add}
            onRequestClose={() => { this.setState({ isVisible_modal_add:false,}); } }
          >
            <View style={{flex:.5,backgroundColor:"#2c3e5066"}}></View>
            <View style={{height:500,width:"99%",backgroundColor:"#7f8c8d"}}>
                <View style={styles_list.container}>
                    <TouchableHighlight onPress={()=>{
                        this.setState({
                            isVisible_modal_camera:true,
                        });
                    }}>
                        <View style={{width:200,height:150,backgroundColor:bgc,alignSelf:"center",marginTop:20}}>
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
                            autoFocus={true}
                            autoCorrect={false}
                            autoCapitalize="sentences"
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
                            keyboardType="decimal-pad"
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
                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Updated}  :</Text>
                        <Text style={styles_list.text_v}>{this.state.product_edit.fields.updated}</Text>
                    </View>
                    <View style={styles_list.row_view}>
                        <Text style={styles_list.text_k}> {TXT.Entered}  :</Text>
                        <Text style={styles_list.text_v}>{this.state.product_edit.fields.entered}</Text>
                    </View>
                </View>
                <View style={buttons_style.container_row}>
                    <View style={buttons_style.view_btn_row}>

                        <Button
                            title={TXT.Save}
                            color="green"
                            onPress={()=>{
                                this.save();
                            }
                            }
                        ></Button>
                    </View>
                    <View style={buttons_style.view_btn_row}>
                        <Button
                            title={TXT.Cancel}
                            color="orange"
                            onPress={()=>{
                                this.setState({isVisible_modal_add:false});
                            }
                            }
                        ></Button>
                    </View>
                    <View style={buttons_style.view_btn_row}>
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
                </View>
                <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

            </Modal>
        );
    }
    next_previous_handler=(val)=>{
        this.state.page += val;
        this.loadItems();
    }
    render() {
        return (
          <View style={styles.container} >
              <ItemsList 
                items_list={this.state.items_list}
                setItemParent={this.setItemParent}
                ItemClass={Product}
                onRefresh={this.loadItems}
                refreshing={this.state.refreshing}
                 />
            <Next_previous 
                previous_disabled={this.state.page<=0 }
                next_disabled = {this.state.items_list.length < (this.items_number_perpage-1)}
                next_prious_handler={this.next_previous_handler}
                page={this.state.page}
            />   
            {this.render_modal()}
            {this.render_modal_BarcodeScanner()}
            {this.render_modal_Camera()}
            {this.render_modal_Search()}
            
          </View>
        );
      }
}


export default ProductsScreen;