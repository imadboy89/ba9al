import { StyleSheet } from 'react-native';


const style_global = StyleSheet.create({

});
const header_style = StyleSheet.create({
    header:{
        backgroundColor : "#34495e",
    },
    container : {
     flex:1,flexDirection:"row",
    },
    title:{
        fontSize:16,
        color:"#e67e22",
        width:"80%",
    },
    title_home:{
        fontSize:20,
        color:"#e67e22",
        marginLeft:10,
        width:"80%",
    }
 
 });
 const buttons_style = StyleSheet.create({
     button:{
         padding:5,
         fontSize:26,
         color:"white"
     }
 
 });


 //export modules
module.exports = {
    style_global,
    header_style,
    buttons_style 
}