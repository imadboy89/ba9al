import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { Camera } from 'expo-camera';

class CameraComp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openSidMenu: false,
      modalVisible:false,
    };
    console.log("Camera");
  }
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };
  snap = async () => {
    const options ={quality:0,base64 :true,};
    if (this.camera) {
      let photo = await this.camera.takePictureAsync(options);
      console.log(photo);
    }
  };
  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: .8,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <Camera  style={StyleSheet.absoluteFillObject}
            ref={ref => {
                this.camera = ref;
            }}
        />
        
        <Text>Camera</Text>
        <Button title={'Take picture'} onPress={() => this.snap()} />
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
}


export default CameraComp;