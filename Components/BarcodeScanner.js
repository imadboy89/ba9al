import * as React from 'react';
import { Text, View, Button, ActivityIndicator, Modal } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Translation from "../Libs/Translation";
import * as ImageManipulator from 'expo-image-manipulator';
import LocalStorage from "../Libs/LocalStorage";
import Product from "../Libs/Product_module";
TXT = null;

class BarcodeScanner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openSidMenu: false,
      cat:"movies",
      modalVisible:false,
      snaping : false,
      autoFocus: true,
      ratio : "4:3",
      image_quality:0.2,
    };
    TXT = this.props.TXT;
    this.getRatios = false;
    this.LS = new LocalStorage();
    this.LS.getSettings().then(settings=>{
      if("availableRatios" in settings){
        this.getRatios = false;
      }else{
        this.getRatios = true;
      }
      this.setState({
        image_quality : settings.image_quality,
        autoFocus     : settings.autoFocus,
        ratio         : settings.ratio,
      });
    });
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
  getLoadingModal(){
    return (
      <Modal 
      animationType="slide"
      transparent={true}
      visible={this.state.snaping}
      onRequestClose={() => { this.setState({ snaping:false,}); } }
      >
        <View style={{flex:.9,backgroundColor:"#00000099"}}></View>
        <View style={{height:100,width:"100%",justifyContent:"center",backgroundColor:"black"}}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={{color:"#7f8c8d",textAlign:"center",width:"100%"}}>{this.state.cameraStatus}</Text>
        </View>
        <View style={{flex:.9,backgroundColor:"#00000099"}}></View>
      </Modal>
    );
  }
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
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <Text style={{fontSize:25,width:"100%",textAlign:"center",color:"#f1c40f",margin:10,backgroundColor:"#2c3e50",textDecorationStyle:"solid"}}> {TXT.Scan_product_bare_code} </Text>
        <Camera
          onBarCodeScanned={ (scanned && this.props.setCode ) ? undefined : this.handleBarCodeScanned}
          style={{width:"100%",height:"70%"}}
          autoFocus={this.state.autoFocus ? Camera.Constants.AutoFocus.On : Camera.Constants.AutoFocus.Off}
          ratio={this.state.ratio}
          ref={ref => {
            this.camera = ref;
          }}
        />
        <Button 
          title='Fake scann'
          color="green"
          onPress={() => this.handleBarCodeScanned({"type":"dddtype", "data":6119999900002})} />
          <View style={{justifyContent:"center",flex:1,alignContent:"center",flexDirection:"row"}}>
            <View style={{width:60,height:50}}>
              {this.props.setCode && 
              <View>
                <Button 
                  title={TXT.Scan+""} 
                  disabled={!scanned}
                  onPress={() => this.setState({ scanned: false })} />
                <Button 
                  title={TXT.No_Bar_Code+""} 
                  onPress={() => this.handleBarCodeScanned({"type":"NoBarCode", "data":-1})}
                   />
              </View>
              }
              {this.props.setImgB64 && 
              <Button 
                disabled={this.state.snaping}
                title={TXT.Snap+""} 
                onPress={() => this.snap()} />
              }

            </View>
          </View>
          {this.getLoadingModal()}
      </View>
    );
  }
  _resize = async (photo) => {
    const X = photo.width / 300 ;
    const width = photo.width/X;
    const height = photo.height/X;

    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [ {resize :{ width:width, height:height }} ],
      { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG , base64 :true }
    );
    return manipResult ;
  };

  snap = async () => {
    const availableRatios = await this.camera.getSupportedRatiosAsync ();
    this.LS.setSetting("availableRatios",availableRatios);

    this.setState({snaping:true,cameraStatus:"Snapping picture"});
    const options= {
      quality : 0.2,
      //base64  : true
    };
    if (this.camera) {
      let photo = await this.camera.takePictureAsync(options);
      this.setState({cameraStatus:"Adjusting picture"});
      const final_photo = await this._resize(photo) ;
      this.setState({snaping:false});
      this.props.setImgB64(  final_photo  );
    }
  };
  handleBarCodeScanned = async ({ type, data }) => {
    let isNoBarCode = false;
    if(type=="NoBarCode" && data==-1){
      const product = new Product();
      const output = await product.getMaxBarCode_noBarCode()
      if( "maxId" in output && output["maxId"]>0){
        data  = output["maxId"]+1;
        isNoBarCode = true;
      }
    }
    data = ""+data;
    const country = data.slice(0,3)
    const company = data.slice(3,7)
    const product = data.slice(7)
    this.setState({ scanned: true });
    this.props.setCode(type, data, country,company,product,isNoBarCode); 

  };
}


export default BarcodeScanner;