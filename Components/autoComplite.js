import React from 'react';
import { View,TextInput, TouchableOpacity ,Text } from 'react-native';
import {styles_list} from "../Styles/styles";



class AutoComplite extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        q:"",
        options:[],
        options_pool:this.props.options_pool,
        done:false,
      };
    }
    getoptions(){
        this.state.options = [];
        const keys = Object.keys(this.state.options_pool);
        for (let i = 0; i < keys.length; i++) {
            const option_key = keys[i];
            const option_value = this.state.options_pool[option_key];
            option_key = Object.keys(option_value)[0];
            option_value = option_value[option_key];
            if(this.state.q.length>=2 && option_value.startsWith(this.state.q) ){
                let option_dict = {};
                option_dict[option_key] = option_value ;
                this.state.options.push(option_dict);
            }
        }
        return this.state.options;
    }
    onPressHandler = (option_key, option_value,option)=>{
        this.props.action(option_key);
        this.setState({q:option_value,done:true});
    }
    render_options(){
        if(this.state.done){
            return null;
        }
        this.getoptions();
        return this.state.options.map((option,i)=>{
            const option_key   = Object.keys(option)[0];
            const option_value = option[option_key];
           return (
                <TouchableOpacity
                    key={option_key+option_value}
                    disabled={this.props.disabled ? this.props.disabled : false}
                    activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0.5}
                    onPress={()=>{
                        this.onPressHandler(option_key, option_value, option);
                    }}
                    style={{marginRight:20,}}>
                  <View style={{}} >
                      <Text style={{color:"white",backgroundColor:"#7f8c8d",fontSize:18,borderRadius: 4,borderWidth: 0.2,borderColor: '#d6d7da'}}>
                      {option_value}
                      </Text>
                  </View>
                </TouchableOpacity>
            );
        });
    }
    render(){
        return (
            <View style={{flex:1}}>
                <TextInput
                    style={styles_list.TextInput_fullWidth}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    onChangeText ={newValue=>{this.setState({q:newValue});}}
                    value={this.state.q}
                />
                <View style={{/*position:"absolute",*/marginRight:30,height:"60%"}}>
                    {this.render_options()}
                </View>

            </View>
        );
    }
}

export default AutoComplite;