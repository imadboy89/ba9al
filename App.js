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
import LocalStorage from "./Libs/LocalStorage";

LS = new LocalStorage();
TXT = new Translation(LS.settings["language"]).getTranslation();

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

const headerTitleStyle = {
  fontWeight: 'bold',
  color:"white"
};
console.disableYellowBox = true;

const Home_Stack = createStackNavigator({Home : {
  screen : HomeScreen,
  navigationOptions :{ 
    title:"Home",
    tabBarLabel:"Home",
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  } 
}  });
const Scan_Stack = createStackNavigator({ Scan :{
  screen : ScanScreen,
  navigationOptions :{ 
    title:"Scan",
    tabBarLabel:"Scan",
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  }, 
} });
const Companies_Stack = createStackNavigator({ Companies: {
  screen : CompaniesScreen,
  navigationOptions :{ 
    title:"Companies",
    tabBarLabel:"Companies",
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  }
} });
const Products_Stack = createStackNavigator({ Products: {
  screen : ProductsScreen,
  navigationOptions :{ 
    title:"Products",
    tabBarLabel:"Products",
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  },
  } });

  
const AppNavigator = createBottomTabNavigator(
  {
    Home      : {screen : Home_Stack,screenProps : LS,navigationOptions :{ tabBarLabel:TXT.Home,tabBarIcon:(({tintColor}) => (<Icon name="home"   color={tintColor} size={24} /> )) }} ,
    Scan      : {screen : Scan_Stack,navigationOptions :{ tabBarLabel:TXT.Scan,tabBarIcon:(({tintColor}) => (<Icon name="barcode"   color={tintColor} size={24} /> ))}} ,
    Companies : {screen : Companies_Stack,navigationOptions :{ tabBarLabel:TXT.Companies,tabBarIcon:(({tintColor}) => (<Icon name="folder-open"   color={tintColor} size={24} /> ))}} ,
    Products  : {screen : Products_Stack,navigationOptions :{ tabBarLabel:TXT.Products,tabBarIcon:(({tintColor}) => (<Icon name="cube"   color={tintColor} size={24} /> ))}} ,
  },
  
  {
    initialRouteName: 'Home',
    tabBarOptions :tabBarOptions
  }
);



export default createAppContainer(AppNavigator);

