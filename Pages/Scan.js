import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,TouchableOpacity,Modal } from 'react-native';
//import { RNCamera } from 'react-native-camera';
import { Camera } from 'expo-camera';
//import {PermissionsAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
  bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
});



class ScanScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleTourch = this.handleTourch.bind(this);
        this.state = {
          FlashMode: false,
          hasCameraPermission: null,
          type: Camera.Constants.Type.back,
      
         }
   
        this.state = {
            openSidMenu: false,
            modalVisible:false,
        };
    }
    handleTourch(_this){
      console.log(_this);
    }
    onBarCodeRead = (e) => {
      Alert.alert("Barcode value is"+e.data ,"Barcode type is"+e.type);
    }
    handleTourch(value) {
      if (value === true) {
          this.setState({ FlashMode: false });
      } else {
          this.setState({ FlashMode: true });
      }
  }

    async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
    }
    render() {
      const { hasCameraPermission } = this.state;
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.type}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                    });
                  }}>
                  <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        );
  
      }
    }
}

export default ScanScreen;