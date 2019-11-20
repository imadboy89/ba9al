import React from 'react';
import {  Text, View, Button,TextInput } from 'react-native';
import {buttons_style,styles_list} from "../Styles/styles";
import LocalStorage from "../Libs/LocalStorage";
TXT = null;


class Credentials extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        email:"",
        password:""
      };
      this.LS = new LocalStorage();
      this.LS.getCredentials().then(output=>{
        this.setState({email:output.email, password:output.password});
      });
      }
      saveCredentials(){
        this.LS.setCredentials(this.state.email,this.state.password);
        this.props.closeModal();
      }
      render(){
        return (
          <View style={{height:"100%",width:"100%",backgroundColor:"#646c78"}}>
            <View style={styles_list.row_view}>
            <TextInput
                style={styles_list.TextInput}
                placeholder={TXT.User_name+" .. "}
                placeholderTextColor="#ecf0f1"
                onChangeText ={newValue=>{
                    this.setState({email:newValue.toLowerCase()});
                }}
                value={this.state.email}
                autoCompleteType="email"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            </View>
  
            <View style={styles_list.row_view}>
            <TextInput
                style={styles_list.TextInput}
                placeholder={TXT.Password+" .. "}
                placeholderTextColor="#ecf0f1"
                onChangeText ={newValue=>{
                    this.setState({password:newValue});
                }}
                value={this.state.password}
                type="password"
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
            />
            </View>
            <View style={buttons_style.container_row}>
              <View style={buttons_style.view_btn_row}>
                <Button
                    style={buttons_style.btn_row}
                    title={TXT.Sign_in+""}
                    disabled={this.props.savingCredents}
                    color="#2ecc71"
                    onPress={()=>{
                      this.props.saveCredents(this.state.email,this.state.password);
                    }
                    }
                ></Button>
              </View>
              <View style={buttons_style.view_btn_row}>
                <Button
                    style={buttons_style.btn_row}
                    title={TXT.Cancel+""}
                    
                    color="#f39c12"
                    onPress={()=>{
                        this.props.closeModal();
                    }
                    }
                ></Button>
              </View>
              <View style={buttons_style.view_btn_row}>
                <Button
                    style={buttons_style.btn_row}
                    title={TXT.Sign_up+""}
                    disabled={this.props.savingCredents}
                    color="#3498db"
                    onPress={()=>{
                        this.props.signUp(this.state.email,this.state.password);
                    }
                    }
                ></Button>
                </View>
              </View>
  
          </View>
        );
      }
  }

  export default Credentials ;