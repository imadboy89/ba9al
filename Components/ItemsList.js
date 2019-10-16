import React from 'react';
import { StyleSheet, Text, View, Button, FlatList,TextInput,ScrollView,Modal,TouchableHighlight,Image } from 'react-native';
import {header_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Translation from "../Libs/Translation";

TXT = new Translation("fr").getTranslation();

class ItemRow_ extends React.Component {
    render() {
        let desc = "";
        if(this.props.item.fields.company){
          desc = this.props.item.fields.company +" - " +this.props.item.fields.price;
        }else{
          desc = this.props.item.fields.country +" - " +this.props.item.fields.code;
        }
        return (
            <TouchableHighlight 
            onPress={() => {this.props.setItemParent(this.props.item)}} >
            <View  style={styles_itemRow.container} >
                { this.props.item.fields.img!="" &&
                <Image source={{ uri: this.props.item.fields.img }} style={styles_itemRow.image} />
                }
                <View style={styles_itemRow.container_text}>
                    <Text style={styles_itemRow.title}>
                        {this.props.item.fields.name}
                    </Text>
                    <Text style={styles_itemRow.description}>
                        {desc}
                    </Text>
                </View>
    
             </View>
             </TouchableHighlight>
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
      this.ItemClass = this.props.ItemClass;
      this.ItemObject = new this.ItemClass();
      this.setItemParent = this.props.setItemParent;
    }

    render() {
      
        return (
        <View style={styles.container} >
            <ScrollView >
                <FlatList
                    data={this.props.items_list}
                    renderItem={({ item }) => <ItemRow key={item.fields.id} item={item} setItemParent={this.setItemParent} />}
                />
            </ScrollView>
          </View>
        );
      }
}


export default ItemsList;