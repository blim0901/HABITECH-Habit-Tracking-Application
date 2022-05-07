import React, { useState, useContext, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar, Colors } from 'react-native-paper';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

import { Container } from "../components/styles"
import HeaderApp from './Header';
import ListItems from './ListItems';
import InputModal from './InputModal';

//Api Client
import axios from 'axios';

const baseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/';

const Home = ({ navigation }) => {
    console.log("HOMEEEEE page");
    //context
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials)
    const { name, email, uid } = storedCredentials;
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);
    //uid = 'GxDJwfMmyZaRf7PEBtU85hu1VTB3';
    //const [post, setPost] = React.useState(null);
    const [initialTodos, setinitialTodos] = React.useState(null);
    const [todos, setTodos] = useState(initialTodos);

    let habitsExist = [];

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            habitsExist = [];
            // The screen is focused
            axios.get(baseURL + uid).then((response) => {
                console.log("Home page");

                //setPost(response.data);
                var i = 0;
                var color, icon;
                const object = response.data;
                //console.log(object);
                for (const property in object) {
                    //console.log(`${property}: ${object[property]}` + " " + i);

                    if (`${property}` == "sleep" || `${property}` == "drink" || `${property}` == "read" || `${property}` == "exercise") {
                        if (`${property}` == "sleep") {
                            color = "#757bc8";
                            icon = "sleep";
                            i = 4;
                        } else if (`${property}` == "drink") {
                            color = "#a3cef1";
                            icon = "water";
                            i = 1;
                        } else if (`${property}` == "read") {
                            color = "#ffdead";
                            icon = "book-open-variant";
                            i = 3;
                        } else if (`${property}` == "exercise") {
                            color = "#87c38f";
                            icon = "run";
                            i= 2;
                        }
                        var value = `${property}`.charAt(0).toUpperCase() + `${property}`.slice(1);
                        //console.log(`${object[property]["progress"]}`);
                        habitsExist.push({ title: value, amount:`${object[property]["amount"]}`, progress: `${object[property]["progress"]}`, target: `${object[property]["target"]}`, color: color, icon: icon, key:i });
                        //i += 1;
                    }
                    //console.log(habitsExist);
                }
                let habitsExistS =  habitsExist.sort((h1, h2) => (h1.title<h2.title) ? 1 : (h1.title>h2.title) ? -1 : 0);
                console.log(habitsExistS)
                setinitialTodos(habitsExistS);
                setTodos(habitsExistS);
            });
            // Call any action
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, []);


    /* React.useEffect(() => {
        axios.get(baseURL + uid).then((response) => {
            console.log("Home page");
            //console.log(response.data);
            //setPost(response.data);
            var i = 1;
            var color, icon;
            var object = response.data;
            for (const property in object) {
                //console.log(`${property}: ${object[property]}`);

                if (`${property}` == "sleep" || `${property}` == "drink" || `${property}` == "read" || `${property}` == "exercise") {
                    if (`${property}` == "sleep") {
                        color = "#6C63FF";
                        icon = "sleep";
                    } else if (`${property}` == "drink") {
                        color = "#7abbde";
                        icon = "water";
                    } else if (`${property}` == "read") {
                        color = "#f593e4";
                        icon = "book-open-variant";
                    } else if (`${property}` == "exercise") {
                        color = "#76ab7a";
                        icon = "run";
                    }
                    var value = `${property}`.charAt(0).toUpperCase() + `${property}`.slice(1);
                    //console.log(`${object[property]["progress"]}`);
                    habitsExist.push({ title: value, progress: `${object[property]["progress"]}`, target: `${object[property]["target"]}`, key: i, color: color, icon: icon });
                    i += 1;
                }
                console.log(habitsExist);
            }
            setinitialTodos(habitsExist);
            setTodos(habitsExist);
        });

    }, []); */
    // if (!post) return null;


    const clearLogin = () => {
        AsyncStorage.removeItem('habitechCredentials')
            .then(() => {
                //removed successfully
                setStoredCredentials("");
            })
            .catch(error => console.log(error))
    }

    // Modal visibility and input value
    const [modalVisible, setModalVisible] = useState(false);
    const [todoInputValue, setTodoInputValue] = useState();

    //Function to add new items
    const handleAddTodo = (todo) => {
        //console.log("HOME OLD TODOS: ");
        //console.log(todos);
        const newTodos = [...todos, todo];
        habitsExistS =  newTodos.sort((h1, h2) => (h1.title<h2.title) ? 1 : (h1.title>h2.title) ? -1 : 0);
        setTodos(newTodos);
        setModalVisible(false);
        //console.log("HOME NEW TODOS: ");
        //console.log(newTodos);
    }

    const handleDelTodo = (rowTitle) => {
        const newTodos = [...todos];
        const todoIndex = todos.findIndex((todo) => todo.title === rowTitle);
        newTodos.splice(todoIndex, 1);
        setTodos(newTodos);
    }


    return (
        <>
            <Container>

                <ListItems
                    todos={todos}
                    setTodos={setTodos} 
                    />
                <InputModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    todoInputValue={todoInputValue}
                    setTodoInputValue={setTodoInputValue}
                    handleAddTodo={handleAddTodo}
                    todos={todos}
                />
            </Container>
        </>
    );
}
export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#F8F8F8',
    },
    componentContainer: {
        //alignItems: 'center',
        flex: 1,
        width: '80%',
        height: 90,
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderColor: "#6C63FF",
        borderWidth: 1,
    },
    progContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progBar: {
        marginTop: 0,
        width: 250,
        height: 10
    },
    title: {
        fontSize: 20,
        color: '#34434D',
        fontWeight: 'bold',
        textAlign: 'left',
        paddingLeft: 10,
        paddingBottom: 10,
        paddingTop: 10,
    },
    text: {
        fontSize: 14,
        color: '#fff',
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
        width: '100%',
        height: 90,
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        //alignItems: 'center',
        // width: 200,
        marginTop: 20,
        width: '80%',
        /*        height: 90,
               marginTop: 20,
               borderRadius: 20,
               backgroundColor: '#fff' */
    },
    buttonContainer1: {
        width: '100%',
        height: 90,
    },
});