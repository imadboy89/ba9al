import React from 'react';
import { View,TextInput, TouchableOpacity ,Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles_floatBtn,styles_list,buttons_style,styles} from "../Styles/styles";



class Next_previous extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render(){
        return (
            <View style={{flexDirection:"row",justifyContent:"center"}}>
                <Icon 
                    size={30}
                    name="chevron-left" 
                    disabled={this.props.previous_disabled} 
                    color={ this.props.previous_disabled ?"white":"#1abc9c" }
                    onPress={()=>this.props.next_prious_handler(-1)}
    
                />
                    <Text style={{width:30,color:"yellow",textAlign:"center",fontSize:14}}>{this.state.page}</Text>
                <Icon 
                    size={30}
                    name="chevron-right" 
                    disabled={this.props.next_disabled} 
                    color={ this.props.next_disabled ?"white":"#1abc9c" }
                    onPress={()=>this.props.next_prious_handler(1)}
                />
            </View>
                    );
    }
}

export default Next_previous;