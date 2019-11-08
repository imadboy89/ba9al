import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity,TextInput,Image,Modal,Alert } from 'react-native';
import {styles_Btn,styles_list,buttons_style,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Company from "../Libs/Company_module";
import Product from "../Libs/Product_module";
import Translation from "../Libs/Translation";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderButton from "../Components/HeaderButton";
import LocalStorage from "../Libs/LocalStorage";
import AutoComplite from "../Components/autoComplite";
TXT = null;


class ScanScreen extends React.Component {
    constructor(props) {
      super(props);
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
        hist_label:null
        
      };
      this.counter = 0;
      this.company = new Company();
      this.product = new Product();
      this.continue_list=[];
      this.LS = new LocalStorage();

      const didBlurSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          new Translation().getTranslation().then(tr=>{
            if(TXT != tr){
              TXT = tr;
              this.props.navigation.setParams({title:TXT.Scan});
            }
          });
          if(!this.state.items_list ||this.state.items_list.length == 0){
            this.loadLastP();
          }
        }
      );
    }
    saveLS(){
      let items_list = [];
      this.state.items_list.forEach(item => {
        item.fields.quantity = item.quantity;
        items_list.push(item.fields);
      });
      this.state.items_list[0].is_hist = true;
      const LastP = {"list":items_list,"title":"","total":this.state.Total};
      this.LS.setPurchaseHistory(LastP).then(PurchaseList=>{
        console.log("saving Done");
        this.props.navigation.setParams({showSaveBtn : false ,});
      });
      this.setState({});
    }
    loadLastP = async()=>{
      this.state.items_list = [];
      let lastPurchaseList = await this.LS.getLastPurchaseList();
      //console.log(lastPurchaseList);
      if(lastPurchaseList && "list" in lastPurchaseList){
        this.setState({hist_label:lastPurchaseList["title"]});
        //lastPurchaseList["list"].forEach(prodValues => {

        //});
        for (let i = 0; i < lastPurchaseList["list"].length; i++) {
          const prodValues = lastPurchaseList["list"][i];
          let prod_h = new Product(prodValues);
          prod_h.is_hist = true;
          prod_h.quantity = prodValues.quantity;
          await prod_h.getPhoto();
          this.state.items_list.push(prod_h);
        }
        this.Total(2);
      }
      this.props.navigation.setParams({
          TXT  : TXT,
          disable:false,
          check_price : ()=>{this.startScan(0);} ,
          calculate : ()=>{this.startScan(1);} ,
          saveLS : ()=>{this.saveLS()} ,
          showSaveBtn : false,
       })
    }
    componentDidMount(){
      
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
            { params.showSaveBtn && 
            <HeaderButton 
            name="save"
            disabled={params.disable}
            onPress={()=>params.saveLS()}
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
      }else{
        this.continue_list = [];
      }
        this.setState({
          isVisible_modal_scan:true,
          method:method,
          disable_btns:true,
          Total : 0,
          hist_label : null,
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
      this.props.navigation.setParams({showSaveBtn : this.state.items_list.length>0 && this.state.items_list[0].is_hist==undefined ,});
    }
    loadItemsForSearch(){
      if(this.products_list && this.products_list.length>0){
        return new Promise(resolve=>{resolve(this.products_list);});
      }
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
    setCode = (type, code, country,company,product,isNoBarCode) => {
        this.setState({disable_btns:false});
        if(isNoBarCode){
          let new_prod = new Product();
          new_prod.fields.desc = "PickProduct";
          new_prod.fields.price = "";
          new_prod.list=[]
          /*
          new_prod.filterWithExtra({"products.desc":"NoBarCode"}).then(output=>{
            if(output["list"] && output["list"].length > 0){
              for (let j = 0; j < output["list"].length; j++) {
                const prod = output["list"][j];
                let prod_dict = {};
                prod_dict[prod.fields.id] = prod.fields.name 
                new_prod.list.push(prod_dict);
              }
            }
          });*/
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
              this.state.items_list.splice(index,1)
              this.Total();
            },
          },
        ],
      );
    }
    render() {
      
        return (
          <View style={styles.container} >
            {this.state.hist_label &&
            <Text  style={styles.textTotal}>{this.state.hist_label}</Text>
            }
            {this.state.items_list.length>0 && this.state.Total>0 && 
              <ItemsList 
                items_list={this.state.items_list}
                setItemParent={this.setItemParent}
                ItemClass={Product}
                isCalculate={true}
                 />

            }
            {this.state.items_list.length>0 &&
              <Text style={styles.textTotal}>
                {TXT.Total} : {this.state.Total}
              </Text>
                 
            }
            { this.state.items_list.length>0 && this.state.Total>0 && this.state.items_list[0].is_hist!=true &&
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
            {this.render_modal_ScanResult()}
            
          </View>
        );
      }
}


export default ScanScreen;