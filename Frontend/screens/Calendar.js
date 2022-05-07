import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

//Api Client
import axios from 'axios';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const exercise = { key: 'exercise', color: "#87c38f" };
const sleep = { key: 'sleep', color: "#757bc8" };
const drink = { key: 'drink', color: "#a3cef1" };
const read = { key: 'read', color: "#ffdead" };

const baseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/calendar/';

const HabitsCalendar = ({ navigation, route }) => {
    console.log("Calendar Page");
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials);
    let { name, email, uid } = storedCredentials;
    //uid= 'GxDJwfMmyZaRf7PEBtU85hu1VTB3';
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);

    const [post, setPost] = React.useState(null);
    const [dayObj, setDayObj] = React.useState(null);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("Calendar");
            const items = [];
            axios.get("https://us-central1-cz3002power6.cloudfunctions.net/appMethods/calendar/" + uid).then((response) => {
                setPost(response.data);
                var object = response.data;
                for (const property in object) {
                    if (`${property}` != "userId") {
                        //console.log(`${property}: ${object[property]}`);
                        const habitArray = `${object[property]}`.split(",");
                        const habitList = [];
                        for (const x of habitArray) {
                            if (x == "read") {
                                habitList.push(read);
                            } else if (x == "drink") {
                                habitList.push(drink);
                            } else if (x == "sleep") {
                                habitList.push(sleep);
                            } else if (x == "exercise") {
                                habitList.push(exercise);
                            }
                        }
                        let item = {
                            date: `${property}`,
                            habits: habitList
                        }
                        items.push(item);
                    }
                    let newDaysObject = {};
                    items.forEach((item) => {
                        newDaysObject = {
                            ...newDaysObject,
                            [item["date"]]: {
                                dots: item["habits"]
                            }
                        };
                    });
                    console.log(newDaysObject)
                    setDayObj(newDaysObject);
                }
            });
        });
        return unsubscribe;

    }, []);

    return (
        <KeyboardAvoidingWrapper>

            <Calendar
                style={{ height: "100%" }}
                markingType={'multi-dot'}
                markedDates={dayObj}
            />

            <Text style={styles.detailText}>
                <MaterialCommunityIcons name="circle" color="#ffdead" size={10} /> Read  <MaterialCommunityIcons name="circle" color="#a3cef1" size={10} /> Drink  <MaterialCommunityIcons name="circle" color="#87c38f" size={10} /> Exercise  <MaterialCommunityIcons name="circle" color="#757bc8" size={10} /> Sleep</Text>
        </KeyboardAvoidingWrapper>
    );
}
export default HabitsCalendar;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F8F8',
        height: '0%'
    },
    detailText: {
        textAlign: 'left',
        fontSize: 14,
        marginTop: 5,
        paddingLeft: 20,
    },
    title: {
        fontSize: 20,
        color: '#34434D',
        fontWeight: 'bold',
    },
    linkText: {
        fontWeight: 'bold'
    },
    forgotPassword: {
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