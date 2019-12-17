import React from 'react';
import {  Text, View, Button,TextInput, Modal, ActivityIndicator,ScrollView } from 'react-native';
import {buttons_style,styles_list} from "../Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderButton from "../Components/HeaderButton";

TXT = null;


class Users extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        user_username : "",
        users : [],
        usersLoading : true,
        actionRunning : false,
        msg_text : "",
        modalVisible_msg : false,

      };
      this.loadUsers();
    } 
    setUser_admin_tmp(user_username,action="tmp_admin"){
      this.setState({actionRunning:true});
      this.props.backup.partnersManager(action,user_username).then(res=>{
        this.setState({actionRunning:false});
        this.loadUsers();
        if (res[1] && res[1]!=""){
          alert(res[1]); 
        }
      }); 
    }
    sendMsg = async()=>{
      this.setState({actionRunning:true});
      const out = await this.props.backup.pushNotification(this.props.backup.email,this.state.msg_text,{"action":"msg","msg":this.state.msg_text,"by":this.props.backup.email},[this.msg_user,]);
      this.setState({actionRunning:false,modalVisible_msg:false});
    }
    loadUsers(){
      this.props.backup.partnersManager("getAll").then(res=>{
        if (res[1] && res[1]!=""){
          alert(res[1]);
        }
        this.setState({users:res[0],usersLoading:false,actionRunning:false});
      });
    }
    updateUserStatus(user){
      this.setState({actionRunning:true});
      this.props.backup.usersManager(user.email,user.disabled).then(res=>{
        this.loadUsers();
      });
    }
    render_users(){
      if (this.state.usersLoading){
        return <ActivityIndicator size="large" color="#00ff00" /> ;
      }
      if(!this.state.users.map){
        return null;
      }
      return this.state.users.map( (value,i) =>{
        const user = value.email ;
        const is_tmp_admin = value.is_tmp_adm ? value.is_tmp_adm : false ;
        //return (<View></View>);
        return (
          <View style={{flexDirection:"row",width:"95%",height:40,borderStyle:"solid",borderWidth:1,margin:3}} key={user+i}>
            <Text style={[styles_list.text_v,{color: value.disabled  ? "#95a5a6" : styles_list.text_v.color}]}> {user} </Text>
        
                <View style={{flexDirection:"row",alignSelf: 'center',}}>
                  <HeaderButton
                      name={ is_tmp_admin ? "minus" : "plus"}
                      disabled={this.state.actionRunning}
                      size ={28}
                      color={ this.state.actionRunning ? "#bdc3c7" : (is_tmp_admin ? "#e74c3c" : "#2ecc71")}
                      onPress={()=>{
                        if(is_tmp_admin){
                            this.setUser_admin_tmp(user,"remove_tmp_admin");
                        }else{
                            this.setUser_admin_tmp(user,"tmp_admin");
                        }
                      }
                      }
                  />
                  <HeaderButton
                      name="paper-plane"
                      disabled={this.state.actionRunning}
                      size ={28}
                      color={this.state.actionRunning ? "#bdc3c7" : "#3498db"}
                      onPress={()=>{
                        this.msg_user = user;
                        this.setState({modalVisible_msg:true});
                      }
                      }
                  />

                  <HeaderButton 
                    name={ value.disabled  ? "unlock" : "lock"}
                    onPress={()=>this.updateUserStatus(value)}
                    size={28} 
                    color={this.state.actionRunning ? "#bdc3c7" : "#3498db"}
                    disabled={this.state.actionRunning}
                    />
                </View>
                
          </View>
        );
      });

    }
      render_modal_msg(){
        return (          
          <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible_msg}
            onRequestClose={() => { 
                this.setState({ modalVisible_msg:false,});
            } }
          >
          <View style={{flex:.4,backgroundColor:"#2c3e5066"}}></View>
          <View style={{height:350,width:"100%",backgroundColor:"#646c78",alignItems:"center"}}>
            <Text style={styles_list.title_modals}> {TXT.Message_to} : {this.msg_user}</Text>
            <TextInput
              style={{width:"95%",height:200,backgroundColor:"#95a5a6",padding:5,marginBottom:10,fontSize:25,color:"white",textAlignVertical: 'top'}}
              multiline={true}
              editable
              maxLength={40}
              onChangeText={text => this.setState({msg_text : text})}
              value={this.state.msg_text}
            />

            <Icon.Button 
              name="paper-plane"
              disabled={this.state.actionRunning}
              onPress={()=>{
                this.sendMsg();
              }}
            >{TXT.Send}</Icon.Button>
          </View>
          <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>

          </Modal>
          );
      }

      render(){
        //return (<View></View>);
        return (
          <View style={{height:"100%",width:"100%",backgroundColor:"#646c78"}}>

            <View style={{width:"100%",height:250}}>
              <ScrollView style={{width:"100%",backgroundColor:"#646c78"}}>
                {this.render_users()}
              </ScrollView> 
            </View>

            <View style={buttons_style.container_row}>

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
              </View>
                  

              {this.render_modal_msg()}
          </View>
        );
      }
  }

  export default Users ;