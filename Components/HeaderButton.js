import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class HeaderButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }


    render(){
        return (
            <TouchableOpacity
                disabled={this.props.disabled ? this.props.disabled : false}
                activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0.5}
                onPress={this.props.onPress}
                style={{marginRight:20}}>
              <View style={{}} >
                <Icon 
                    name={this.props.name?this.props.name:"home"} 
                    size={this.props.size?this.props.size:28} 
                    color={this.props.color?this.props.color:"#ecf0f1"} />
              </View>
            </TouchableOpacity>
        );
    }
}

export default HeaderButton;