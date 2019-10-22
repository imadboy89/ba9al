import React from 'react';
import {  Text, View, FlatList,ScrollView,TouchableOpacity,Image } from 'react-native';
import {styles_itemRow,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Translation from "../Libs/Translation";

TXT = new Translation("fr").getTranslation();

class ItemRow_ extends React.Component {
    
    render() {
        let desc = "";
        let name = this.props.item.fields.name;
        let leftTxt ="";
        if(this.props.item.fields.company){
          const company_name = (this.props.item.company_ob && this.props.item.company_ob.fields) ? this.props.item.company_ob.fields.name : this.props.item.fields.company;
          name += this.props.isCalculate ? " x"+this.props.item.quantity : "" ;
          desc = company_name +" - " +this.props.item.fields.id;
          leftTxt = this.props.item.fields.price;
        }else{
          name += this.props.isCalculate ? " x"+this.props.item.quantity : "" ;
          desc = this.props.item.fields.country +" - " +this.props.item.fields.id;
          leftTxt = "";
        }
        const img_source = ( this.props.item.photo_ob && ["",null,undefined].indexOf(this.props.item.photo_ob.fields.data)<0 )
                ? { uri:this.props.item.photo_ob.fields.data} 
                : require('../assets/camera.png');
        return (
            <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {
              if(this.props.setItemParent){
                this.props.setItemParent(this.props.item)}
              }
              } >
            <View  style={styles_itemRow.container} >
                {this.props.isCalculate==true &&
                <Text style={styles_itemRow.quantity}>{"x"+this.props.item.quantity}</Text>
                }
                <View style={styles_itemRow.image}>
                  <Image  source={img_source} resizeMode="contain" style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
                <View style={styles_itemRow.container_text}>
                    <View style={styles_itemRow.subContainer_text}>
                      <Text style={styles_itemRow.title}>
                          {name}
                      </Text>
                      <Text style={styles_itemRow.description}>{desc}</Text>
                    </View>
                    <Text style={styles_itemRow.leftTxt}>{leftTxt}</Text>
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
            <ScrollView >
                <FlatList
                    data={this.props.items_list}
                    renderItem={({ item }) =>{
                      return (<ItemRow item={item} setItemParent={this.setItemParent} isCalculate={this.props.isCalculate} />);
                    }}
                    keyExtractor={item => {
                      return this.props.isCalculate ? item.rand+""+item.quantity : item.fields.id+"-"+item.fields.name ;
                    } }
                />
            </ScrollView>
            
          </View>
        );
      }
}


export default ItemsList;