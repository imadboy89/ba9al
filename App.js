import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen  from "./Pages/Home";
import ScanScreen  from "./Pages/Scan";
import BarcodeScanner  from "./Components/BarcodeScanner";
import CompaniesScreen  from "./Pages/Companies";
import ProductsScreen  from "./Pages/Products";

console.disableYellowBox = true;
const AppNavigator = createStackNavigator(
  {
    Home : HomeScreen,
    Scan : ScanScreen,
    BarcodeScanner : BarcodeScanner,
    Companies : CompaniesScreen,
    Products : ProductsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);

