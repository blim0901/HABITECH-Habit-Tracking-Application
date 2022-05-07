import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Formik } from 'formik';
import { MsgBox } from '../components/styles';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

//Firebase
import { authentication } from '../firebase/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

//Api Client
import axios from 'axios';

const baseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/user/updateprofile/';
const Register = ({ navigation }) => {
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  //context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  // Firebase auth
  const handleRegisterFirebase = (credentials, setSubmitting) => {
    createUserWithEmailAndPassword(authentication, credentials.email, credentials.password)
      .then((re) => {
        console.log(re);
        setTimeout(function () {
          axios
            .post(baseURL + re.user.uid, {
              name: credentials.name,
              age: credentials.age,
              height: credentials.height,
              weight: credentials.weight
            })
            .then((response) => {
              console.log("ADD USER DATA");
              console.log(response.data);
              persistLogin({ name: credentials.name, email: credentials.email, uid: re.user.uid }, "Register successfully", "SUCCESS");
              setSubmitting(false);
            });

        }, 600);

      })
      .catch((re) => {
        console.log(re);
        setSubmitting(false);
        handleMessage("Email is already in use.");
      })
  }

  const handleRegister = (credentials, setSubmitting) => {
    console.log(credentials);
    handleMessage(null);
    handleRegisterFirebase(credentials, setSubmitting);
  }

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  }

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('habitechCredentials', JSON.stringify(credentials))
      .then(() => {
        //successful
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
        handleMessage('Persisting login failed');
      })
  }

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={{
            height: 230,
            width: 230,
          }}
          source={require("../assets/images/Register.png")}
        />
        <Text style={styles.title}>Register</Text>
        <Formik
          initialValues={{ name: '', age: '', height: '', weight: '', email: '', password: '', cfmpassword: '' }}
          onSubmit={(values, { setSubmitting }) => {

            var passwReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (values.name == '' || values.age == '' || values.height == '' || values.weight == '' || values.email == '' || values.password == '' || values.cfmpassword == '') {
              handleMessage("Please fill all the fields");
              setSubmitting(false);
            }
            else if (!values.email.match(emailReg)) {
              handleMessage("Invalid email address");
              setSubmitting(false);
            }
            else if (values.age <= 0 || values.age >= 130) {
              handleMessage("Age must be more than 0 and less than 130");
              setSubmitting(false);
            }
            else if (values.height <= 0 || values.height >= 300) {
              handleMessage("Height must be more than 0 and less than 300");
              setSubmitting(false);
            }
            else if (values.weight <= 0 || values.age >= 700) {
              handleMessage("Weight must be more than 0 and less than 700");
              setSubmitting(false);
            }
            else if (!values.password.match(passwReg)) {
              handleMessage("Password must be at least 8 characters long with at least a numeric charcter, special character, uppercase character and lowercase character.");
              setSubmitting(false);
            }
            else if (values.password !== values.cfmpassword) {
              handleMessage("Passwords do not match");
              setSubmitting(false);
            }
            else {
              handleRegister(values, setSubmitting);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput placeholder='Name' style={styles.textInput} onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} />
              <TextInput placeholder='Age' style={styles.textInput} keyboardType='numeric' maxLength={3} onChangeText={handleChange('age')} onBlur={handleBlur('age')} value={values.age} />
              <TextInput placeholder='Height (cm)' style={styles.textInput} keyboardType='numeric' onChangeText={handleChange('height')} onBlur={handleBlur('height')} value={values.height} />
              <TextInput placeholder='Weight (kg)' style={styles.textInput} keyboardType='numeric' onChangeText={handleChange('weight')} onBlur={handleBlur('weight')} value={values.weight} />
              <TextInput placeholder='Email' style={styles.textInput} keyboardType='email-address' onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
              <TextInput placeholder='Password' style={styles.textInput} secureTextEntry={true} onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
              <TextInput placeholder='Confirm Password' style={styles.textInput} secureTextEntry={true} onChangeText={handleChange('cfmpassword')} onBlur={handleBlur('cfmpassword')} value={values.cfmpassword} />
              <MsgBox type={messageType}>{message}</MsgBox>
              {!isSubmitting && <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#00bfa6', '#b0e5a4']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.button}>
                  <Text style={styles.text}>REGISTER</Text>
                </LinearGradient>
              </TouchableOpacity>}
              {isSubmitting && <TouchableOpacity style={styles.buttonContainer} disabled={true}>
                <LinearGradient
                  colors={['#00bfa6', '#b0e5a4']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.button}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>}
            </View>
          )}
        </Formik>
        <Text style={styles.forgotPassword}>Already have an account? <TouchableOpacity onPress={() => navigation.navigate("Login")}><Text style={styles.linkText}> Login here</Text></TouchableOpacity></Text>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
export default Register;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
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
  textInput: {
    padding: 10,
    paddingStart: 30,
    width: '80%',
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: '#fff'
  },
  linkText: {
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 14,
    color: 'gray',
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: 200,
    marginTop: 20,
  },
});

