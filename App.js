import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen  from "./Pages/Home";
import ScanScreen  from "./Pages/Scan";
import BarcodeScannerScreen  from "./Pages/BarcodeScanner";
import CompaniesScreen  from "./Pages/Companies";
import ProductsScreen  from "./Pages/BarcodeScanner";

console.disableYellowBox = true;
const AppNavigator = createStackNavigator(
  {
    Home : HomeScreen,
    Scan : ScanScreen,
    BarcodeScanner : BarcodeScannerScreen,
    Companies : CompaniesScreen,
    Products : ProductsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);

