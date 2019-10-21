import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity,TextInput,Image,Modal,Alert } from 'react-native';
import {styles_floatBtn,styles_list,buttons_style,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Company from "../Libs/Company_module";
import Product from "../Libs/Product_module";
import Translation from "../Libs/Translation";
import ItemsList from '../Components/ItemsList';
import BarcodeScanner from "../Components/BarcodeScanner";
import Icon from 'react-native-vector-icons/FontAwesome';

TXT = new Translation("fr").getTranslation();


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
        
      };
      this.counter = 0;
      this.company = new Company();
      this.product = new Product();
      this.continue_list=[];
    }

    openAddModal = (company) => {
        if(company){
            this.setState({isVisible_modal_add:true});
        }else{
            this.props.navigation.setParams({disable:true});
            this.setState({isVisible_modal_scan:true,});
        }
      };
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
          Total : 0
        });
        this.state.items_list = [] ;
      }
    setProductObjet(prod_dict){
      let product = new Product();
      product.fields = prod_dict;
      return product;
    }
    plusProd(){
      this.state.items_list.push(this.state.scanned);
      this.setState({scanned:null});
    }
    Total(){
      this.plusProd();
      this.state.items_list = this.state.items_list.concat(this.continue_list);
      let total = 0 ;
      for (let i = 0; i < this.state.items_list.length; i++) {
        const prod = this.state.items_list[i];
        total+= parseFloat(prod.fields.price)>0 ? parseFloat(prod.fields.price) * prod.quantity : 0;
      }
      this.setState({scanned:null,Total:total,isVisible_modal_scan:false});
    }
    setCode = (type, code, country,company,product) => {
        this.setState({disable_btns:false});
        let new_prod = new Product();
        new_prod.get({id:code}).then((output)=>{
          
            if(output["success"] && output["res"]!=false){
              if(this.state.method===0){
                Alert.alert(TXT.Product_found , new_prod.name+" : "+output["doesExist"].price+" DH");
              }else if (this.state.method===1){
                //const product = this.setProductObjet(output["doesExist"]) ;
                this.setState({scanned:new_prod});

              }
            }else{
              Alert.alert(TXT.Product_not_found,TXT.Product_does_not_exist);
            }


        });

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

                <View style={{width:200,height:150,backgroundColor:"#bdc3c7",alignSelf:"center"}}>
                    <Image  source={img_source} resizeMode="contain" style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
                <View style={styles_list.container}>
                  <Text style={styles.product_title}>{this.state.scanned.fields.name} : {this.state.scanned.fields.price}</Text>
                  <Text style={styles.product_desc}>{this.state.scanned.fields.company+" - "+this.state.scanned.fields.country}</Text>
                </View>
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
                          title={TXT.Delete}
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
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <View style={[{ width: 60,height:40,}]}>
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
                    <View style={[{ width: 60,height:40,}]}>
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
             } }
          >
              <BarcodeScanner setCode={this.setCode}></BarcodeScanner>
          </Modal>
        );
    }
    setItemParent = (item) => {
      //console.log(item);
    }
    render() {
      
        return (
          <View style={styles.container} >
            <View  style={{flexDirection:"row",alignContent:"center",justifyContent:"center"}}>
                <View style={{margin:10,width:"40%"}}>
                  <Button disable ={this.state.disable_btns} title={TXT.Check_price} onPress={()=>{this.startScan(0);}}></Button>
                </View>
                  
                <View style={{margin:10,width:"40%"}}>
                  <Button disable ={this.state.disable_btns} title={TXT.Calculate} onPress={()=>{this.startScan(1);}} ></Button>
                </View>
            </View>
            <View  style={{flexDirection:"row",alignContent:"center"}}> 
            </View>
            
            
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
            { this.state.items_list.length>0 && this.state.Total>0 &&
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={()=>{this.startScan(2);}}
              style={styles_floatBtn.TouchableOpacityStyle}>
                <View style={styles_floatBtn.FloatingButtonStyle} >
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