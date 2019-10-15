import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,ScrollView,Modal } from 'react-native';
import {header_style} from "../Styles/styles";
import Company from "../Libs/Company_module"
  
class CompaniesScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible:false,
        company : null,
      };
      this.company = new Company();
    }
    saveCompany(){
        console.log(this.company);
        this.company.save();
    }
    render() {
      
        return (
          <View >
            <ScrollView >
                <View style={styles.container}>

                    <View style={styles.row_view}>
                        <Text style={styles.text_k}> Name  :</Text>
                        <View style={styles.text_v}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Company Name"
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={a=>{
                                this.company.fields.name=a;
                            }}
                            
                        />
                        </View>
                    </View>

                    <View style={styles.row_view}>
                        <Text style={styles.text_k}> Country  :</Text>
                        <View style={styles.text_v}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Country"
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={a=>{
                                this.company.fields.country=a;
                            }}
                            
                        />
                        </View>
                    </View>
                    <View style={styles.row_view}>
                        <Text style={styles.text_k}> Code  :</Text>
                        <View style={styles.text_v}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Company Name"
                            placeholderTextColor="#ecf0f1"
                            onChangeText ={a=>{
                                this.company.fields.code=a;
                            }}
                            
                        />
                        </View>
                    </View>
                </View>

                <Button
                    title="Save"
                    color="green"
                    onPress={()=>{
                        this.saveCompany();
                    }
                    }
                ></Button>
            </ScrollView>
      
          </View>
        );
      }
}


const styles = StyleSheet.create({
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
        color:"white",
        fontSize:18,
        marginLeft:10
    },
  });


export default CompaniesScreen;