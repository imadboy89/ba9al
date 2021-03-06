import { StyleSheet } from 'react-native';


const styles_list = StyleSheet.create({
    container: {
        //backgroundColor: 'black',
        flex:1,
        flexDirection: 'column',
        
  
  
    },
    title_modals : {
        fontSize:28,
        alignSelf:"center",
        textAlign:"center",
        width:"100%",
        color:"#53b8fb",
        marginBottom:20,
    },
    row_view : {
      //flex: 1, 
      flexDirection: 'row' ,
      alignItems: 'center',
      height : 35 ,
      //marginRight:10,
      //marginLeft:10,
      marginTop:5,
      marginBottom:5,
      borderStyle : "solid",
      borderWidth : 1,
      textAlign: 'right',
      width:"95%",
      justifyContent:"center",
      alignSelf:"center",
    },
    nrml_view : {
        flex: 1, 
        flexDirection: 'column' ,
        alignItems: 'center',
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
      fontSize: 14,
      fontWeight: 'bold',
      width:"35%",
      color:"white",
      textAlign: 'right'
    },
    text_v: {
      //backgroundColor:"#34495e",
      alignSelf: 'center',
      marginLeft:20,
      fontSize: 14,
      fontWeight: 'bold',
      width:"60%",
      color:"white",
      textAlign: 'left'
    },
    image: {
        flex:1,
        backgroundColor:"#95a5a6"
  
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
        width: "70%", 
        borderColor: 'gray', 
        backgroundColor:"#34495e",
        color:"white",
        fontSize:18,
        marginLeft:10
    },
    TextInput_fullWidth:{
        width: "95%", 
        borderColor: 'gray', 
        backgroundColor:"#34495e",
        color:"white",
        fontSize:23,
        marginLeft:10,
        height:40,
    },
  });


const header_style = StyleSheet.create({
    header:{
        backgroundColor : "#34495e",
        color:"white",
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
    container_row : {
        //flex:1,
        flexDirection:"row",
        
        justifyContent:"center" , 
        height:50, 
        width:"100%"
    },
    view_btn_row : {
        flex:1
    },
    vbtn_row : {
        flex:1
    },
    modalAdd : {
        fontSize:11,
        color:"white",
        margin:5
    },
    modalPlus : {
        fontSize:15,
        color:"white",
        width:100
    },
    modalPlus_Minus: {
        fontSize:15,
        color:"black",
        width:50
    },
     button:{
         padding:5,
         fontSize:26,
         color:"white"
     }
 
 });


 const styles_itemRow = StyleSheet.create({
    container: {
        marginTop:8,
        marginLeft:10,
        marginRight:20,
        height:60,
        flexDirection:"row",
        //backgroundColor: '#a4ccf3',
        backgroundColor: "black"
    },
    black_border:{
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#000',
    },
    title: {
        fontSize: 18,
        color : "white",
        
    },
    quantity:{
        fontSize:35,
        color:"#c0392b",
        backgroundColor:"#ecf0f1",
        justifyContent:"center"
    },
    container_text: {
        backgroundColor:"#34495e",
        justifyContent: 'center',
        flex:1,
        flexDirection:"row",
        padding:5,
    },
    subContainer_text:{
        flexDirection:"column",
        width:"65%"
    },
    leftTxt:{
        fontSize:35,
        color:"white",
        alignSelf: 'center',
        width:"35%"
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
    },
    image:{
        flex:1
    },
    textTotal:{
        width:"100%",
        color : "white",
        fontSize : 28,
        fontFamily:"Roboto",
        textAlign:"center",
        justifyContent:"center"
    },
    hist_label:{
        width:"100%",
        color : "white",
        fontSize : 28,
        fontFamily:"Roboto",
        textAlign:"left",
    },
    product_title :{
        fontFamily:"Roboto",
        fontSize:35,
        color:"white",
        textAlign:"center"
    },
    product_desc :{
        fontStyle: 'italic',
        fontSize:18,
        color:"#fad390",
        textAlign:"center"
    },
});



const styles_Btn = StyleSheet.create({
    MainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
    },
  
    TouchableOpacityStyle_float: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 15,
      bottom: 30,
    },
    TouchableOpacityStyle: {
        alignSelf:"center",
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        margin:8,
      },
      ButtonStyle_float: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        borderRadius:30,
        textAlign:"center",
      },
    ButtonStyle: {
      resizeMode: 'contain',
      width: 60,
      height: 60,
      padding:10,
      borderRadius:30,
      textAlign:"center",
    },
  });

  
 //export modules
module.exports = {
    styles,
    styles_list,
    header_style,
    buttons_style,
    styles_itemRow,
    styles_Btn
}