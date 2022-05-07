import React from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,Dimensions,StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';

let {height, width} = Dimensions.get('window');
const ForgotPassword = ({navigation}) => {
  return (
    <KeyboardAvoidingView behavior={"padding"} enabled  style={{flexGrow:1,height:'100%'}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
             <Image
              resizeMode="contain"
              style={{
                height: 230,
                width: 230,
              }}
              source={require("../assets/images/ForgotPassword.png")}
            />
            <Text style={styles.title}>Forgot Password</Text>
            <Formik
                initialValues={{ email: ''}}
                onSubmit={(values) =>{
                    console.log(values);
                    navigation.navigate("Home");
                } }
            >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{width: '100%',  justifyContent: 'center', alignItems: 'center'}}>
                  <TextInput placeholder='Email'style={styles.textInput} onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email}/>
                  <TouchableOpacity style= {styles.buttonContainer} onPress={handleSubmit}>
                      <LinearGradient
                          colors = {['#00bfa6', '#b0e5a4']}
                          start = {{x:1, y:0}}
                          end = {{x:0, y:1}}
                          style = {styles.button}>
                          <Text style={styles.text}>SEND EMAIL</Text>
                      </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
              </Formik>
            <Text style={styles.forgotPassword}>Already have an account?<TouchableOpacity onPress={()=> navigation.navigate("Login")}><Text style={styles.linkText}> Login here</Text></TouchableOpacity></Text>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
  );
}
export default ForgotPassword;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8F8F8'
    },
    title: {
      fontSize: 20,
      color: '#34434D',
      fontWeight: 'bold',
    },
    subTitle: {
      fontSize: 20,
      color: 'gray',
    },
    textInput:{
      padding: 10,
      paddingStart: 30,
      width: '80%',
      height: 50,
      marginTop: 20,
      borderRadius: 30,
      backgroundColor: '#fff'
    },
    linkText:{
      fontWeight:'bold'
    },
    forgotPassword:{
      fontSize: 14,
      color: 'gray',
      marginTop: 20,
    },
    text: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 'bold',
    },
    button:{
        width: '80%',
        height: 50,
        borderRadius: 25,
        padding:10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer:{
      alignItems: 'center',
      width: 200,
      marginTop: 20, 
    },
  });