import { StyleSheet } from 'react-native';


const styles_list = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex:1,
        flexDirection: 'column',
        
  
  
    },
    row_view : {
      flex: 1, 
      flexDirection: 'row' ,
      alignItems: 'center',
      height : 30 ,
      marginRight:20,
      marginLeft:20,
      marginBottom:10,
      borderStyle : "solid",
      borderWidth : 1,
      textAlign: 'right',
      width:"95%",
    },
    row_q : {
      flex: 1, 
      flexDirection: 'column' ,
      height : 30 ,
      width : 100,
      borderStyle : "solid",
      borderWidth : 1,
      textAlign: 'right',
      
    },
    title: {
        
        fontSize: 18,
        color: '#000',
    },

    text_k: {
      //backgroundColor:"#34495e",
      fontSize: 16,
      fontWeight: 'bold',
      width:"30%",
      color:"white",
      textAlign: 'right'
    },
    text_v: {
      //backgroundColor:"#34495e",
      marginLeft:20,
      fontSize: 14,
      fontWeight: 'bold',
      width:"65%",
      color:"white",
      textAlign: 'left'
    },
    image: {
        flex:1,
  
    },
    row : {
        flex:1,
        flexDirection:"row"
    },
    small_elemnt:{
        width:60,
        justifyContent:"center"
    },
    TextInput:{
        width: "80%", 
        borderColor: 'gray', 
        backgroundColor:"#34495e",
        color:"white",
        fontSize:18,
        marginLeft:10
    },
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


 const styles_itemRow = StyleSheet.create({
    container: {
        marginTop:8,
        marginLeft:20,
        marginRight:20,
        height:60,
        flexDirection:"row",
        //backgroundColor: '#a4ccf3',
        backgroundColor: "black"
    },
    title: {
        fontSize: 18,
        color : "white",
        
    },
    container_text: {
        backgroundColor:"#34495e",
        justifyContent: 'center',
        flex:1,
        padding:5,
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
        color:"white",
    },
    image: {
        width:60,
        height:60,

    },
});

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#3c6382",
        flex:1
    }

});

 //export modules
module.exports = {
    styles,
    styles_list,
    header_style,
    buttons_style,
    styles_itemRow
}