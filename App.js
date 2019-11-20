import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen  from "./Pages/Home";
import ScanScreen  from "./Pages/Scan";
import CompaniesScreen  from "./Pages/Companies";
import ProductsScreen  from "./Pages/Products";
import {header_style} from "./Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import Translation from "./Libs/Translation";

Translation_ = new Translation();
TXT = Translation_.getTranslation();
const tabBarOptions= {
  activeTintColor: '#ecf0f1',
  activeBackgroundColor : '#596d82',
  showIcon :true, 
  labelStyle: {
    fontSize: 16,
  },
  style: {
    backgroundColor: '#3b4a59',
  },
}
tarballLabel_style= {
  fontSize: 15,
  color: '#95a5a6',
  textAlign:"center"
}
const headerTitleStyle = {
  fontWeight: 'bold',
  color:"white"
};
console.disableYellowBox = true;

navigationOptions = (IconName="")=>{
  let TXT  ={};
  new Translation().getTranslation().then(t=>{TXT=t});
  
  navigationOptions_ =  ({ navigation }) => {
    options = {
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  }

  if (IconName!=""){
    options["tabBarLabel"] =  ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      return focused ? null : <Text  color={tintColor} style={tarballLabel_style}>{TXT[routeName]+""}</Text>;
    };
  
  options["tabBarIcon"] =  (({focused, tintColor}) => {
    const iconSize = focused ? 30 : 24;
    return <Icon name={IconName}   color={tintColor} size={iconSize} /> 
  }) ;
    options["tabBarOptions"] =tabBarOptions;
  }

  return options;
  }
  return navigationOptions_ ;
}


const Home_Stack = createStackNavigator({Home : {
  screen : HomeScreen,
  navigationOptions : navigationOptions()
}  });
const Scan_Stack = createStackNavigator({ Scan_ :{
  screen : ScanScreen,
  navigationOptions : navigationOptions()
} });
const Companies_Stack = createStackNavigator({ Companies: {
  screen : CompaniesScreen,
  navigationOptions : navigationOptions()
} });
const Products_Stack = createStackNavigator({ Products_: {
  screen : ProductsScreen,
  navigationOptions : navigationOptions()
  } });

  
const AppNavigator = createBottomTabNavigator(
  {
    Home      : {screen : Home_Stack,navigationOptions :navigationOptions("home")} ,
    Scan      : {screen : Scan_Stack,navigationOptions :navigationOptions("barcode") },
    Companies : {screen : Companies_Stack,navigationOptions :navigationOptions("folder-open") },
    Products  : {screen : Products_Stack,navigationOptions :navigationOptions("cube") },
  },
  
  {
    
    initialRouteName: 'Home',
    tabBarOptions :tabBarOptions,
    
  }
);



export default createAppContainer(AppNavigator);

