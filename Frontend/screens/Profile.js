import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InnerContainer, Line, StyledFormArea, WelcomeContainer, WelcomeImage } from '../components/styles';
import { AntDesign } from '@expo/vector-icons'
//Animations
import LottieView from 'lottie-react-native';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

//Api Client
import axios from 'axios';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/user/';

const ImageItem = ({ petStage }) => {
    let animation = React.createRef();

    useEffect(() => {
        animation.current.play()
    }, [])

    let s;
    let image;
    if (petStage == "chick") {
        image = require("../assets/chick.json");
        s = { width: '100%', height: '90%' };
    }
    else if (petStage == "chicken") {
        image = require("../assets/chicken.json");
        s = { width: '100%', height: '100%' };
    }
    else {
        image = require("../assets/egg.json");
        s = { width: '100%', height: '100%' };
    }

    return (
        <View style={styles.animationContainer}>
            <LottieView
                ref={animation}
                style={s}
                source={image}
            />
        </View>
    );
}

const Profile = ({ navigation, route }) => {
    console.log("Profile Page");
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials);
    let { name, email, uid } = storedCredentials;

    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);

    const [post, setPost] = React.useState(null);
    const [pet, setPet] = useState("egg");
    const [postName, setPostName] = useState(name);
    const [postAge, setPostAge] = useState(null);
    const [postWeight, setPostWeight] = useState(null);
    const [postHeight, setPostHeight] = useState(null);
    const [postEmail, setPostEmail] = useState(email);

    /*   axios.get(baseURL + uid).then((response) => {
          setPost(response.data);
          console.log("PET STAGE: ", response.data.petstage);
          setPostName(response.data.name);
          //setPet(response.data.petstage);
      }); */
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("Profile999");
            axios.get(baseURL + uid).then((response) => {
                setPost(response.data);
                setPet(response.data.petstage)
                setPostName(response.data.name);
                setPostAge(response.data.age);
                setPostWeight(response.data.weight);
                setPostHeight(response.data.height);
                console.log("PET STAGE: ", response.data.petstage)
                //setPet(response.data.petstage);
            });

        });
        return unsubscribe;

    }, []);

    const clearLogin = () => {
        AsyncStorage.removeItem('habitechCredentials')
            .then(() => {
                //removed successfully
                setStoredCredentials("");
            })
            .catch(error => console.log(error))
    }

    return (
        <KeyboardAvoidingWrapper>
            <InnerContainer>
                <ImageItem petStage={pet} /> 

                <WelcomeContainer>
                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, alignItems: 'space-between' }}>
                        <View style={{ width: '85%' }}>
                            <Text style={styles.title}>{postName}</Text>
                        </View>
                        <View style={{ width: '15%' }}>
                            {/*     <TouchableOpacity>
                            <AntDesign name="edit" size={25} color="#00BFA6" />
                        </TouchableOpacity> */}
                        </View>
                    </View>
                    <View style={{ width: '100%', marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '100%' }}>
                            < Text style={styles.detailText}>Age: {postAge}</Text>
                            <Text style={styles.detailText}>Weight: {postWeight}kg</Text>
                            <Text style={styles.detailText}>Height: {postHeight}cm</Text>
                            <Text style={styles.detailText}>Email: {postEmail}</Text>
                            {/*< Text style={styles.detailText}>Age: {post.age}</Text>
                            <Text style={styles.detailText}>Weight: {post.weight}kg</Text>
                            <Text style={styles.detailText}>Height: {post.height}cm</Text>
                            <Text style={styles.detailText}>Email: {post.email}</Text> */}
                        </View>
                    </View>
                    <StyledFormArea>
                        <Line />
                        <TouchableOpacity style={styles.buttonContainer} onPress={clearLogin}>
                            <LinearGradient
                                colors={['#00bfa6', '#b0e5a4']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.button}>
                                <Text style={styles.text}>LOGOUT</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </StyledFormArea>
                </WelcomeContainer>

            </InnerContainer>

        </KeyboardAvoidingWrapper>
    );
}
export default Profile;
const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#E6A819',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '55%',
    },
    addButton: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 300,
        left: 180
    },
    heartContainer: {
        position: 'absolute',
        bottom: 30,
        backgroundColor: "transparent"
    },
    heart: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    detailText: {
        textAlign: 'left',
        fontSize: 14,
        color: 'gray',
        marginTop: 10,
        paddingLeft: 30,
    },
    text: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        //width: 330,
        marginTop: 3,
    },
    title: {
        fontSize: 20,
        color: '#00BFA6',
        fontWeight: 'bold',
        paddingLeft: 30,
    },
});