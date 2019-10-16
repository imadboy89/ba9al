import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,ScrollView,Modal } from 'react-native';
import {header_style} from "../Styles/styles";

  
class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        openSidMenu: false,
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
              <Button
                color="green"
                title="Companies"
                onPress={()=>{
                  this.props.navigation.navigate('Companies',{});
                }}
              ></Button>     
              <Button
                color="black"
                title="Products"
                onPress={()=>{
                  this.props.navigation.navigate('Products',{});
                }}
              ></Button>  
          </View>
        );
      }
}

export default HomeScreen;