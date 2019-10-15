import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,ScrollView,Modal } from 'react-native';
import {header_style} from "../Styles/styles";

  
class ProductsScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible:false,
      };
    }
    
    render() {
      
        return (
          <View >
              <Text>Hello world app</Text>   
              <Button
                title="Scan"
                onPress={()=>{
                  this.props.navigation.navigate('Scan',{});
                }}
              ></Button>     
              <Button
                color="green"
                title="BarcodeScanner"
                onPress={()=>{
                  this.props.navigation.navigate('BarcodeScanner',{});
                }}
              ></Button>       
          </View>
        );
      }
}

export default ProductsScreen;