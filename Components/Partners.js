import React from 'react';
import {  Text, View, Button,TextInput, ActivityIndicator,ScrollView } from 'react-native';
import {buttons_style,styles_list} from "../Styles/styles";
import LocalStorage from "../Libs/LocalStorage";
TXT = null;


class Partners extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        partner_username : "",
        partners : [],
        partnersLoading : true,
        actionRunning : false,
      };
      this.loadPartners();
    } 
    invitePartner(partner_username){
      this.setState({actionRunning:true});
      this.props.backup.partnersManager("invite",partner_username).then(res=>{
        this.setState({actionRunning:false,partnersLoading:true});
        this.loadPartners();
        if (res[1] && res[1]!=""){
          alert(res[1]); 
        }
      }); 
    }
    deletePartner(partner_username){
      this.setState({actionRunning:true});
      this.props.backup.partnersManager("delete",partner_username).then(res=>{
        this.setState({actionRunning:false,partnersLoading:true});
        this.loadPartners();
        if (res[1] && res[1]!=""){
          alert(res[1]); 
        }
      });
    }
    acceptPartner(partner_username){
      this.setState({actionRunning:true});
      this.props.backup.partnersManager("accept",partner_username).then(res=>{
        this.setState({actionRunning:false,partnersLoading:true});
        this.loadPartners();
        if (res[1] && res[1]!=""){
          alert(res[1]); 
        }
      });
    }
    loadPartners(){
      this.props.backup.partnersManager("get").then(res=>{
        if (res[1] && res[1]!=""){
          alert(res[1]);
        }
        this.setState({partners:res[0],partnersLoading:false});
      });
    }
    render_partners(){
      if (this.state.partnersLoading){
        return <ActivityIndicator size="large" color="#00ff00" /> ;
      }
      if(!this.state.partners.map){
        return null;
      }
      return this.state.partners.map( (value,i) =>{
        const is_invited = value.user1 == this.props.backup.email ? true : false;
        const partner = value.user1 == this.props.backup.email ? value.user2 : value.user1 ;
        console.log(partner,value.is_active);
        //return (<View></View>);
        return (
          <View style={{flexDirection:"row",width:"100%"}} key={partner+i}>
            <Text style={styles_list.text_v}> {partner} </Text>
            
              { value.is_active==false && is_invited==false &&
                <View >
                  <Button
                      style={buttons_style.btn_row}
                      title={TXT.Accept+""}
                      disabled={this.state.actionRunning}
                      color="#2ecc71"
                      onPress={()=>{
                        this.acceptPartner(partner);
                      }}
                  ></Button>
                </View>
              }
              { value.is_active==false && is_invited==true &&
                <Text style={{width:60,color:"black",textAlignVertical: "center",backgroundColor:"#ffd798",alignSelf: 'center',}}>{TXT.Pending}</Text>
              }
              { value.is_active==true &&
                <Text style={{width:60,height:"98%",textAlignVertical: "center" ,color:"black",backgroundColor:"#03ce58",alignSelf: 'center',}}>{TXT.Partner}</Text>
              }
                <View >
                  <Button
                      style={buttons_style.btn_row}
                      title={TXT.Delete+""}
                      disabled={this.state.actionRunning}
                      color="#e55039"
                      onPress={()=>{
                        this.deletePartner(partner);
                      }
                      }
                  ></Button>
                </View>
          </View>
        );
      });

    }

      render(){
        //return (<View></View>);
        return (
          <View style={{height:"100%",width:"100%",backgroundColor:"#646c78"}}>
            <View style={styles_list.row_view}>
            <TextInput
                style={[styles_list.TextInput,{backgroundColor : !this.state.actionRunning ? styles_list.TextInput.backgroundColor:"#95a5a6" }]}
                placeholder={TXT.User_name+" .. "}
                placeholderTextColor="#ecf0f1"
                onChangeText ={newValue=>{
                  if(this.state.actionRunning) return false;
                  this.setState({partner_username:newValue});
                }}
                value={this.state.partner_username}
                type="username"
                autoCorrect={false}
                disabled={this.state.actionRunning}
            />
              <View style={buttons_style.view_btn_row}>
                <Button
                    style={buttons_style.btn_row}
                    title={TXT.Invite+""}
                    disabled={this.state.actionRunning}
                    color="#2ecc71"
                    onPress={()=>{
                      this.invitePartner(this.state.partner_username);
                    }
                    }
                ></Button>
              </View>
            </View>
            <View style={{width:"100%",height:200}}>
              <ScrollView style={{width:"100%",backgroundColor:"#646c78"}}>
                {this.render_partners()}
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

  export default Partners ;