import React from 'react';
import { View,TextInput, TouchableOpacity ,Text, ScrollView } from 'react-native';
import {styles_list} from "../Styles/styles";
import { withNavigation } from 'react-navigation';


class AutoComplite extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        q:"",
        options:[],
        options_pool:this.props.options_pool,
        done:false,
        focusAutoCompliteInput:true,
      };

    }
    componentDidMount(){
        this.setState({focusAutoCompliteInput:true});
    }
    getoptions(){
        items_list_added = [];
        items_list_middle_match = [];
        this.state.options = [];
        
        const keys = Object.keys(this.state.options_pool);
        for (let i = 0; i < keys.length; i++) {
            const option_key = keys[i];
            const option_value = this.state.options_pool[option_key];
            option_key = Object.keys(option_value)[0];
            option_value = option_value[option_key];
            if(this.state.q.length>=2 && option_value.toLowerCase().startsWith(this.state.q.toLowerCase()) && items_list_added.indexOf(option_key)==-1){
                let option_dict = {};
                option_dict[option_key] = option_value ;
                this.state.options.push(option_dict);
                items_list_added.push(option_key);
            }else if(this.state.q.length>=2 && option_value.toLowerCase().indexOf(this.state.q.toLowerCase())>=1  && items_list_added.indexOf(option_key)==-1){
                let option_dict = {};
                option_dict[option_key] = option_value ;
                items_list_middle_match.push(option_dict);
                items_list_added.push(option_key);
            }
            
        }
        this.state.options = this.state.options.concat(items_list_middle_match);
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
                      <Text style={{color:"white",backgroundColor:"#7f8c8d",fontSize:14,borderRadius: 4,borderWidth: 0.2,borderColor: '#d6d7da',height:30}}>
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
                    autoFocus={true}
                    autoCompleteType="off"
                    autoCorrect={false}
                    focus={this.state.focusAutoCompliteInput}
                />
                <ScrollView style={{marginRight:5,marginLeft:5,height:200,}}>
                    {this.render_options()}
                </ScrollView>

            </View>
        );
    }
}

export default withNavigation(AutoComplite);