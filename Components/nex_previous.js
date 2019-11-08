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
            <View style={{flexDirection:"row",justifyContent:"center",margin:5}}>
                <Icon 
                    size={33}
                    name="chevron-left" 
                    disabled={this.props.previous_disabled} 
                    color={ this.props.previous_disabled ?"#f9f9f973":"#1abc9c" }
                    onPress={()=>this.props.next_prious_handler(-1)}
    
                />
                <Text style={{width:30,color:"yellow",textAlign:"center",fontSize:18}}>{this.props.page}</Text>
                <Icon 
                    size={33}
                    name="chevron-right" 
                    disabled={this.props.next_disabled} 
                    color={ this.props.next_disabled ?"#f9f9f973":"#1abc9c" }
                    onPress={()=>this.props.next_prious_handler(1)}
                />
            </View>
                    );
    }
}

export default Next_previous;