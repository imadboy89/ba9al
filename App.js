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
import BackUp from "./Libs/backUp"

new BackUp()._loadClient();

TXT = new Translation().getTranslation();

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
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  } 
}  });
const Scan_Stack = createStackNavigator({ Scan :{
  screen : ScanScreen,
  navigationOptions :{ 
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  }, 
} });
const Companies_Stack = createStackNavigator({ Companies: {
  screen : CompaniesScreen,
  navigationOptions :{ 
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  }
} });
const Products_Stack = createStackNavigator({ Products_: {
  screen : ProductsScreen,
  navigationOptions :{ 
    headerStyle: header_style.header,
    headerTitleStyle: headerTitleStyle,
  },
  } });

  
const AppNavigator = createBottomTabNavigator(
  {
    Home      : {screen : Home_Stack,navigationOptions :{ tabBarLabel:TXT.Home,tabBarIcon:(({tintColor}) => (<Icon name="home"   color={tintColor} size={24} /> )) }} ,
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

