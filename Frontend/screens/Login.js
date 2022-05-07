import React, { useState, useContext } from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import { MsgBox } from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//Api Client
import axios from 'axios';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

//Firebase
import { authentication } from '../firebase/firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";

let { height, width } = Dimensions.get('window');
const Login = ({ navigation }) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    //context
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);


    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        signInWithEmailAndPassword(authentication, credentials.email, credentials.password)
            .then((re) => {
                console.log(re);
                persistLogin({ name: credentials.name, email: credentials.email, uid:re.user.uid}, "Register successfully", "SUCCESS");
                setSubmitting(false);
            })
            .catch((re) => {
                console.log(re);
                setSubmitting(false);
                handleMessage("Invalid accouunt.");
            })
        // persistLogin({name:"Maria", email:"maria@gmail.com"}, "message", "SUCCESS");
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
        <KeyboardAvoidingView behavior={"padding"} enabled style={{ flexGrow: 1, height: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Image
                        resizeMode="contain"
                        style={{
                            height: 230,
                            width: 230,
                        }}
                        source={require("../assets/images/Login.png")}
                    />
                    <Text style={styles.title}>Welcome back!</Text>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            if (values.email == '' || values.password == '') {
                                handleMessage("Please fill all the fields");
                                setSubmitting(false);
                            } else {
                                handleLogin(values, setSubmitting);
                            }
                            console.log(values);
                            //navigation.navigate("Home");
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput placeholder='Email' style={styles.textInput} onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
                                <TextInput placeholder='Password' style={styles.textInput} secureTextEntry={true} onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
                                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}><Text style={styles.forgotPassword} > Forgot Password?</Text></TouchableOpacity>
                                <MsgBox type={messageType}>{message}</MsgBox>
                                {!isSubmitting && <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                                    <LinearGradient
                                        colors={['#00bfa6', '#b0e5a4']}
                                        start={{ x: 1, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={styles.button}>
                                        <Text style={styles.text}>SIGN IN</Text>
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
                    <Text style={styles.bottomText}>Don't have an account? <TouchableOpacity onPress={() => navigation.navigate("Register")}><Text style={styles.linkText}> Register Now</Text></TouchableOpacity></Text>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F8F8',
        height: '100%',
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
        fontWeight: 'bold'
    },
    forgotPassword: {
        fontSize: 14,
        color: 'gray',
        marginTop: 20,
    },
    bottomText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 20,
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