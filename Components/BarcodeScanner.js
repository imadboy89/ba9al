import * as React from 'react';
import { Text, View, Button, ActivityIndicator, Modal,TouchableOpacity, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Translation from "../Libs/Translation";
import * as ImageManipulator from 'expo-image-manipulator';
import LocalStorage from "../Libs/LocalStorage";
import Product from "../Libs/Product_module";
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles_Btn} from "../Styles/styles";
import { Audio } from 'expo-av';


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
      isVisible_modal_loader:true
    };
    TXT = this.props.TXT;
    this.getRatios = false;
    this.LS = new LocalStorage();
    this.LS.getSettings().then(settings=>{
      if("availableRatios" in settings && settings["availableRatios"].length > 0){
        this.getRatios = false;
      }else{
        this.getRatios = true;
      }
      this.setState({
        image_quality : settings.image_quality,
        autoFocus     : this.props.setImgB64 ? settings.autoFocus : true,
        ratio         : settings.ratio,
      });
    });
    this.state.cameraStatus = "starting Camera ...";
    this.loadMp3();
    
  }
  state = {
    hasCameraPermission: null,
    scanned: false,
  };
  loadMp3(){
    this.soundScanned = new Audio.Sound();
    this.soundCamera = new Audio.Sound();
    this.soundScanned.loadAsync(require('../assets/scanned.mp3'));
    this.soundCamera.loadAsync(require('../assets/camera.mp3'));
  }
  async componentDidMount() {
    this.getPermissionsAsync();
  }
  isValidChecksum(s){
    var i, checksum;
    var actual = parseInt(s.charAt(s.length-1));
  
    checksum=0;
    for(i=s.length-2; i >= 0; i--)
    {
      if ((s.length + i) % 2 == 0)
      {
        checksum += 3 * parseInt(s.charAt(i));
      }
      else
      {
        checksum += parseInt(s.charAt(i));
      }
    }
    checksum %= 10;
    checksum = (10 - checksum) % 10;
    return (actual == checksum);
  }
  
  playSoundBArCodeScanned (){
    try {
      return this.soundScanned.replayAsync().catch(err=>console.log(err));
      // Your sound is playing!
    } catch (error) {
      console.log(error);
      alert(`cannot play the sound file`, error);
    }
  }
  playSoundCamera (){
    try {
      return this.soundCamera.replayAsync().catch(err=>console.log(err));
      // Your sound is playing!
    } catch (error) {
      alert(`cannot play the sound file`, error);
    }
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
  render_modal_Loader(){
    return (
      <Modal 
      transparent={true}
      visible={this.state.isVisible_modal_loader}
      onRequestClose={() => { this.setState({ isVisible_modal_loader:false,}); } }
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
          
          <Text style={{fontSize:25,width:"100%",textAlign:"center",color:"#ecf0f1",margin:10,backgroundColor:"#2c3e50",textDecorationStyle:"solid"}}> 
          {this.props.setImgB64 ? TXT.Take_Photo+" - "+this.state.ratio : TXT.Scan_product_bar_code}
          </Text>
        <Camera
          onBarCodeScanned={ (scanned || !this.props.setCode ) ? undefined : this.handleBarCodeScanned}
          style={{width:"100%",height:"70%"}}
          autoFocus={this.state.autoFocus ? Camera.Constants.AutoFocus.on : Camera.Constants.AutoFocus.off}
          ratio={this.state.ratio}
          onCameraReady ={async ()=>{
            console.log("camera ready");
            if(this.getRatios){
              const availableRatios = await this.camera.getSupportedRatiosAsync ();
              this.LS.setSetting("availableRatios",availableRatios);
            }
            this.setState({isVisible_modal_loader:false});
            
          }}
          ref={ref => {
            this.camera = ref;
          }}
        />
        <Button 
          title='Fake scann'
          color="green"
          onPress={() => this.handleBarCodeScanned({"type":"dddtype", "data":"61199999002"})} />
          <View style={{justifyContent:"center",flex:1,alignContent:"center",flexDirection:"row"}}>
            <View style={{flex:1,justifyContent:"center",alignContent:"center"}}>
              {this.props.setCode && 
              <View>
                  {this.props.IsCalc != true &&
                  <Button 
                    title={TXT.No_Bar_Code+""} 
                    onPress={() => this.handleBarCodeScanned({"type":"NoBarCode", "data":-1})}
                    />
                  }
                  {this.props.IsCalc == true &&
                  <Button 
                    title={TXT.No_Bar_Code+"."} 
                    onPress={() => this.handleBarCodeScanned({"type":"NoBarCode", "data":-2})}
                    />
                  }
                  {scanned && 
                  <TouchableOpacity  
                    disabled={!scanned}
                    style={styles_Btn.TouchableOpacityStyle}
                    title={TXT.Scan+""} 
                    onPress={() => this.setState({ scanned: false })} >
                      <View style={[styles_Btn.ButtonStyle,{backgroundColor:'#2c3e50',}]} >
                        <Icon name="barcode" size={40} style={{alignSelf:"center",color:"#ecf0f1"}}></Icon>
                      </View>
                  </TouchableOpacity>
                  }
              </View>
              }
              {this.props.setImgB64 && 
              <TouchableOpacity  
                style={styles_Btn.TouchableOpacityStyle}
                disabled={this.state.snaping}
                title={TXT.Snap+""} 
                onPress={() => this.snap()} >
                  <View style={[styles_Btn.ButtonStyle,{backgroundColor:'#16a085',}]} >
                    <Icon name="camera" size={40} style={{alignSelf:"center",color:"#ecf0f1"}}></Icon>
                  </View>
              </TouchableOpacity>
              }

            </View>
          </View>
          {this.getLoadingModal()}
          {this.render_modal_Loader()}
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
      { compress: this.state.image_quality, format: ImageManipulator.SaveFormat.JPEG , base64 :true }
    );
    return manipResult ;
  };

  snap = async () => {

    this.setState({snaping:true,cameraStatus:"Snapping picture"});
    const options= {
      quality : this.state.image_quality,
      //base64  : true
    };
    if (this.camera) {
      let photo = await this.camera.takePictureAsync(options);
      await this.playSoundCamera();
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
    }else if (type=="NoBarCode" && data==-2){
      this.props.setCode(null, null, null,null,null,true); 
      return ;
    }else{
      await this.playSoundBArCodeScanned();
    }
    if(data.length>=11 && data.length<=13){
      data = "0".repeat(13-data.length) + data;
    }
    data = ""+data;
    const country = data.slice(0,3)
    const company = data.slice(0,8)
    const product = data.slice(7)


    if(!this.isValidChecksum(data) && data.length>12){
      Alert.alert(
        "Scanner",
        TXT.Incorect_barcode_please_try_again,
        [
          {
            text: TXT.Ok, 
            onPress: () => {
              this.props.setCode(type, data, country,company,product,isNoBarCode); 
            },
            style: 'cancel',
          },
          {
            text: TXT.Try_again, 
            onPress: () => {
              this.setState({ scanned: false });
            },
          },
        ],
      );
      return ;
    }
    
    this.setState({ scanned: true });
    this.props.setCode(type, data, country,company,product,isNoBarCode); 

  };
}


export default BarcodeScanner;