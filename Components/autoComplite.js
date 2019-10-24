import React from 'react';
import { View,TextInput, TouchableOpacity ,Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles_floatBtn,styles_list,buttons_style,styles} from "../Styles/styles";



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
        for (let i = 0; i < this.state.options_pool.length; i++) {
            const option = this.state.options_pool[i];
            if(this.state.q.length>=2 && option.startsWith(this.state.q) ){
                this.state.options.push(option);
            }
        }
        return this.state.options;
    }
    render_options(){
        if(this.state.done){
            return null;
        }
        this.getoptions();
        return this.state.options.map((option,i)=>{
           return (
                <TouchableOpacity
                    key={option}
                    disabled={this.props.disabled ? this.props.disabled : false}
                    activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0.7}
                    onPress={()=>this.setState({q:option,done:true})}
                    style={{marginRight:10,zIndex: 100,}}>
                  <View style={{}} >
                      <Text style={{color:"white",backgroundColor:"#7f8c8d",fontSize:18,borderRadius: 4,borderWidth: 0.2,borderColor: '#d6d7da'}}>{option}</Text>
                  </View>
                </TouchableOpacity>
            );
        });
    }
    render(){
        return (
            <View>
                <View style={{position:"absolute",marginTop:30,zIndex: 99,}}>
                    {this.render_options()}
                </View>
                <TextInput
                    style={this.props.style}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    onChangeText ={newValue=>{this.setState({q:newValue});}}
                    value={this.state.q}
                />

            </View>
        );
    }
}

export default AutoComplite;