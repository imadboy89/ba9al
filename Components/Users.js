import React from 'react';
import {  Text, View, Button,TextInput, ActivityIndicator,ScrollView } from 'react-native';
import {buttons_style,styles_list} from "../Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';

TXT = null;


class Users extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        user_username : "",
        users : [],
        usersLoading : true,
        actionRunning : false,
      };
      this.loadUsers();
    } 
    setUser_admin_tmp(user_username,action="tmp_admin"){
        console.log(user_username,action);
      this.setState({actionRunning:true});
      this.props.backup.partnersManager(action,user_username).then(res=>{
        this.setState({actionRunning:false,usersLoading:true});
        console.log(res);
        this.loadUsers();
        if (res[1] && res[1]!=""){
          alert(res[1]); 
        }
      }); 
    }

    loadUsers(){
      this.props.backup.partnersManager("getAll").then(res=>{
        if (res[1] && res[1]!=""){
          alert(res[1]);
        }
        this.setState({users:res[0],usersLoading:false});
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
        console.log(user,value.is_active);
        //return (<View></View>);
        return (
          <View style={{flexDirection:"row",width:"100%"}} key={user+i}>
            <Text style={styles_list.text_v}> {user} </Text>
        

                <View >
                  <Icon
                      name={ is_tmp_admin ? "minus" : "plus"}
                      disabled={this.state.actionRunning}
                      size ={28}
                      color={ is_tmp_admin ? "#e74c3c" : "#2ecc71"}
                      onPress={()=>{
                        if(is_tmp_admin){
                            this.setUser_admin_tmp(user,"remove_tmp_admin");
                        }else{
                            this.setUser_admin_tmp(user,"tmp_admin");
                        }
                      }
                      }
                  />
                </View>
          </View>
        );
      });

    }

      render(){
        //return (<View></View>);
        return (
          <View style={{height:"100%",width:"100%",backgroundColor:"#646c78"}}>

            <View style={{width:"100%",height:200}}>
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
  
          </View>
        );
      }
  }

  export default Users ;