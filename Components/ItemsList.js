import React from 'react';
import {  Text, View, FlatList,ScrollView,TouchableOpacity,Image,RefreshControl } from 'react-native';
import {styles_itemRow,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Translation from "../Libs/Translation";

TXT = new Translation("fr").getTranslation();

class ItemRow_ extends React.Component {
    getName(name){
      try {
        return name.charAt(0).toLocaleUpperCase()+name.slice(1) ;
      } catch (error) {
        return name;
      }
    }
    render() {
        let desc = "";
        let name = this.getName(this.props.item.fields.name);
        let leftTxt ="";
        if(this.props.item.fields.id==null){
          return null;
        }
        if(this.props.item.fields.company){
          const company_name = (this.props.item.company_ob && this.props.item.company_ob.fields) ? this.props.item.company_ob.fields.name : this.props.item.fields.company;
          const country_name = (this.props.item.company_ob && this.props.item.company_ob.fields) ? this.props.item.company_ob.fields.country : this.props.item.fields.id;
          name += this.props.isCalculate ? " x"+this.props.item.quantity : "" ;
          desc = country_name +" - " +company_name;
          leftTxt = this.props.item.fields.price;
        }else{
          name += this.props.isCalculate ? " x"+this.props.item.quantity : "" ;
          const prodects_count  = this.props.item.Products_count>0 ? this.props.item.Products_count + " products" : "";
          desc = this.props.item.fields.country +" - " + prodects_count;
          leftTxt = "["+this.props.item.Products_count+"]";
        }
        const img_source = ( this.props.item.photo_ob && ["",null,undefined].indexOf(this.props.item.photo_ob.fields.data)<0 )
                ? { uri:this.props.item.photo_ob.fields.data} 
                : require('../assets/camera.png');
        const img_length = ( this.props.item.photo_ob && ["",null,undefined].indexOf(this.props.item.photo_ob.fields.data)<0 )
                ? this.props.item.photo_ob.fields.data.length
                : 0;
        const bgc = img_length && img_length > 50000 ? "#e67e22" : "#000" ;
        return (
            <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {
              if(this.props.setItemParent){
                this.props.setItemParent(this.props.item,this.props.index_)}
              }
              } >
            <View  style={styles_itemRow.container} >
                {this.props.isCalculate==true &&
                <Text style={styles_itemRow.quantity}>{"x"+this.props.item.quantity}</Text>
                }
                <View style={[styles_itemRow.image]}>
                  <Image  source={img_source} resizeMode="contain" style={[{backgroundColor:bgc},{ flex: 1, height: undefined, width: undefined }]} />
                </View>
                <View style={styles_itemRow.container_text}>
                    <View style={styles_itemRow.subContainer_text}>
                      <Text style={styles_itemRow.title}>
                          {name}
                      </Text>
                      <Text style={styles_itemRow.description}>{desc}</Text>
                    </View>
                    {this.props.showProducts==undefined && 
                      <Text style={styles_itemRow.leftTxt}>{leftTxt}</Text>
                    }
                    {this.props.showProducts && 
                      <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={(e) => {
                        if(this.props.showProducts){
                          this.props.showProducts(this.props.item)}
                        }
                        } 
                        style={[styles_itemRow.leftTxt,{backgroundColor:"#4694c885"}]}
                        >
                          <Text style={{color:"white",fontSize:20,textAlign:"right",alignSelf: 'stretch'}} >
                            {leftTxt}
                          </Text>
                      </TouchableOpacity>
                      
                    }
                </View>
    
             </View>
             </TouchableOpacity>
        );
      }
    
    }
export const ItemRow = withNavigation(ItemRow_);


class ItemsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible:false,
        ItemObject_edit : null,
        isVisible_modal_scan : false,
        isVisible_modal_add : false,
        sql_error:null,
      };
      this.setItemParent = this.props.setItemParent;
    }
    render() {
        return (
        <View style={styles.container} >
            <Text style={{color:"white",fontSize:18}}> {TXT.Items_count} : {this.props.items_list.length}</Text>
            <ScrollView 
              refreshControl={ this.props.onRefresh ? <RefreshControl refreshing={this.props.refreshing} onRefresh={this.props.onRefresh} /> : null }
            >
                <FlatList
                    data={this.props.items_list}
                    renderItem={({ item,index  }) =>{
                      if(!item){return null;}
                      return (<ItemRow 
                                item={item} 
                                index_={index}
                                setItemParent={this.setItemParent} 
                                isCalculate={this.props.isCalculate} 
                                showProducts={this.props.showProducts}
                              />);
                    }}
                    keyExtractor={ (item,i) => {
                      if(!item){return i;}
                      return this.props.isCalculate  ? item.rand+""+item.quantity : item.fields.id+"-"+item.fields.name ;
                    } }
                />
            </ScrollView>
            
          </View>
        );
      }
}


export default ItemsList;