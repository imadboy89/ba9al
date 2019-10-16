import React from 'react';
import { StyleSheet, Text, View, Button, FlatList,TextInput,ScrollView,Modal,TouchableHighlight,Image } from 'react-native';
import {header_style,styles_list,styles_itemRow,styles} from "../Styles/styles";
import { withNavigation } from 'react-navigation';
import Translation from "../Libs/Translation";

TXT = new Translation("fr").getTranslation();

class ItemRow_ extends React.Component {
    render() {
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
                        {this.props.item.fields.country} - {this.props.item.fields.code}
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
        ItemsObject_list:null,
        isVisible_modal_scan : false,
        isVisible_modal_add : false,
        sql_error:null,
      };
      this.ItemClass = this.props.ItemClass;
      this.ItemObject = new this.ItemClass();
      this.loadItems();
      this.setItemParent = this.props.setItemParent;
    }
    openAddModal = (ItemObject) => {
        if(ItemObject){
            this.setState({isVisible_modal_add:true,ItemObject_edit:ItemObject});
        }else{
            this.setState({isVisible_modal_add:true,ItemObject_edit:new this.ItemClass()});
        }
      };

    componentDidMount(){
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
        this.setState({ItemsObject_list:[]});
        this.ItemObject.filter({}).then(output=>{
            if(output["success"]){
              this.setState({ItemsObject_list:output["list"]});
            }else{
              this.setState({sql_error:output["error"]});
            }
        });
    }
    setCode(type,code){
        this.state.ItemObject_edit.fields.code= ""+code;
        this.state.ItemObject_edit.fields.code = this.state.ItemObject_edit.fields.code.slice(1,7);
    }
    save(){
        this.state.ItemObject_edit.save();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
    }
    delete(){
        this.state.ItemObject_edit.delete();
        this.setState({isVisible_modal_add:false});
        this.loadItems();
    }
    render() {
      
        return (
            <View style={styles.container} >
            <ScrollView >
                <FlatList
                    data={this.state.ItemsObject_list}
                    renderItem={({ item }) => <ItemRow key={item.fields.id} item={item} setItemParent={this.setItemParent} />}
                />
            </ScrollView>
      
            {this.render_modal()}
          </View>
        );
      }
}


export default ItemsList;