import { AntDesign } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { Modal, Text, TouchableOpacity, View, FlatList, SafeAreaView } from 'react-native';

import { color, shadowColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import {
    ModalButton,
    ModalContainer,
    ModalView,
    ModalAction,
    ModalActionGroup,
    ModalIcon,
    HeaderTitle,
    StyledInput,
    handleAddTodo,
    todos,
    buttonColor
} from '../components/styles';

import { MaterialCommunityIcons } from '@expo/vector-icons';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Api Client
import axios from 'axios';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';


const baseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/';
const postBaseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/addhabit/';

var createTitle, itemColor, itemIcon, itemIndex=0;

const InputModal = ({ modalVisible, setModalVisible, todoInputValue, setTodoInputValue, handleAddTodo, todos }) => {
    console.log("Input Modal Page");
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    //console.log("Stored Credentials: ", storedCredentials)
    let { name, email, uid } = storedCredentials;
    //uid = 'GxDJwfMmyZaRf7PEBtU85hu1VTB3';
    //console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);
    const [edit, setEdit] = React.useState(false);
    //console.log("joke");
    //console.log(todos);

    const [post, setPost] = React.useState(null);
    const [checkS, setChkS] = React.useState(false);
    const [checkD, setChkD] = React.useState(false);
    const [checkR, setChkR] = React.useState(false);
    const [checkE, setChkE] = React.useState(false);
    const [selectedButton, setBtnState] = useState({ Read: '#FFFFFF', Sleep: '#FFFFFF', Drink: '#FFFFFF', Exercise: '#FFFFFF' });

    React.useEffect(() => {
        setChkD(false);
        setChkE(false);
        setChkR(false);
        setChkS(false)
        console.log("todos state change ");
        console.log(todos);
        axios.get(baseURL + uid).then((response) => {
            setPost(response.data);
            var object = response.data;
            for (const property in object) {
                if (`${property}` == "sleep") {
                    console.log("S1");
                    setChkS(true);
                } else if (`${property}` == "drink") {
                    console.log("D1");
                    setChkD(true);
                } else if (`${property}` == "read") {
                    console.log("R1");
                    setChkR(true);
                } else if (`${property}` == "exercise") {
                    console.log("e1");
                    setChkE(true);
                }
            }
        });
    }, [todos]);

   /*  React.useEffect(() => {
        axios.get(baseURL + uid).then((response) => {
            setPost(response.data);
            var object = response.data;
            for (const property in object) {
                if (`${property}` == "sleep") {
                    setChkS(true);
                } else if (`${property}` == "drink") {
                    setChkD(true);
                } else if (`${property}` == "read") {
                    setChkR(true);
                } else if (`${property}` == "exercise") {
                    setChkE(true);
                }
            }
        });

    }, []); */

    if (!post) return null;

    const handleSleep = () => {
        createTitle = "Sleep";
        itemColor = "#757bc8";
        itemIcon = "sleep";
        itemIndex = 4; 
        setBtnState({ Read: '#FFFFFF', Sleep: '#757bc8', Drink: '#FFFFFF', Exercise: '#FFFFFF' });
    }
    const handleDrink = () => {
        createTitle = "Drink";
        itemColor = "#a3cef1";
        itemIcon = "water";
        itemIndex = 1;
        setBtnState({ Read: '#FFFFFF', Sleep: '#FFFFFF', Drink: '#a3cef1', Exercise: '#FFFFFF' });
    }
    const handleRead = () => {
        createTitle = "Read";
        itemColor = "#ffdead";
        itemIcon = "book-open-variant";
        itemIndex = 3;
        setBtnState({ Read: '#ffdead', Sleep: '#FFFFFF', Drink: '#FFFFFF', Exercise: '#FFFFFF' });
    }
    const handleExercise = () => {
        createTitle = "Exercise";
        itemColor = "#87c38f";
        itemIcon = "run";
        itemIndex = 2;
        setBtnState({ Read: '#FFFFFF', Sleep: '#FFFFFF', Drink: '#FFFFFF', Exercise: '#87c38f' });
    }

    const handleCloseModal = () => {
        createTitle = undefined;
        setBtnState({ Read: '#FFFFFF', Sleep: '#FFFFFF', Drink: '#FFFFFF', Exercise: '#FFFFFF' });
        setModalVisible(false);

    }
    const addTodo = () => {

    }

    const handleSubmit = () => {
        console.log("TITLE: " + createTitle);
        console.log(uid);
        //console.log(createTitle.toLowerCase());
        if (createTitle == undefined) {
            alert("Please select a habit");
        } else {
            console.log(createTitle);
            var titleHabit = createTitle;
            axios
                .post(postBaseURL + uid, {
                    habitName: createTitle.toLowerCase()
                })
                .then((response) => {
                    console.log("ADD HABIT");
                    console.log(itemIndex);

                    console.log(response);
                    handleAddTodo({
                        title: titleHabit,
                        amount: 0, 
                        progress: 0,
                        target: 0,
                        color: itemColor,
                        icon: itemIcon,
                        key: itemIndex
                    });
                    setBtnState({ Read: '#FFFFFF', Sleep: '#FFFFFF', Drink: '#FFFFFF', Exercise: '#FFFFFF' });

                });
            /*             handleAddTodo({
                            title: createTitle,
                            progress: 0,
                            target: "-",
                            key: `${(todos[todos.length - 1] && parseInt(todos[todos.length - 1].key) + 1) || 1} `,
                            color: itemColor,
                            icon: itemIcon
                            //title: todoInputValue,
                            //date: new Date().toUTCString(),
                            //key: length
                        }); */
            alert("Created Successfully");
            createTitle = undefined;
        }
    };

    return (
        <>
            <ModalButton onPress={() => { setModalVisible(true) }}>
                <AntDesign name="plus" size={30} color={"#FFFFFF"} />
            </ModalButton>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <ModalContainer>
                    <ModalView style={{ height: "75%" }}>
                        <HeaderTitle style={{ color: "#fce5cd" }} size={40}>Add Habit</HeaderTitle>

                        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, alignItems: 'space-between' }}>
                                <View style={{ width: '50%' }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: selectedButton.Sleep,
                                            opacity: checkS ? 0.3 : 1,
                                            width: '80%',
                                            height: 100,
                                            borderRadius: 10,
                                            margin: 10,
                                            padding: 15,
                                            elevation: 5,
                                            shadowColor: '#9c9898',
                                        }}
                                        onPress={handleSleep}
                                        disabled={checkS}
                                    >
                                        <MaterialCommunityIcons name="sleep" color="#6C63FF" size={40} />
                                        <Text>Sleep</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ width: '50%' }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: selectedButton.Drink,
                                            opacity: checkD ? 0.3 : 1,
                                            width: '80%',
                                            height: 100,
                                            borderRadius: 10,
                                            margin: 10,
                                            padding: 15,
                                            elevation: 5,
                                            shadowColor: '#9c9898',
                                        }}
                                        onPress={handleDrink}
                                        disabled={checkD}
                                    >
                                        <MaterialCommunityIcons name="water" color="#7abbde" size={40} />
                                        <Text>Drink</Text>

                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, alignItems: 'space-between' }}>
                                <View style={{ width: '50%' }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: selectedButton.Read,
                                            opacity: checkR ? 0.3 : 1,
                                            width: '80%',
                                            height: 100,
                                            borderRadius: 10,
                                            margin: 10,
                                            padding: 15,
                                            elevation: 5,
                                            shadowColor: '#9c9898',
                                        }}
                                        onPress={handleRead}
                                        disabled={checkR}
                                    >
                                        <MaterialCommunityIcons name="book-open-variant" color="#f593e4" size={40} />
                                        <Text>Read</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '50%' }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: selectedButton.Exercise,
                                            opacity: checkE ? 0.3 : 1,
                                            width: '80%',
                                            height: 100,
                                            borderRadius: 10,
                                            margin: 10,
                                            padding: 15,
                                            elevation: 5,
                                            shadowColor: '#9c9898',
                                        }}
                                        onPress={handleExercise}
                                        disabled={checkE}
                                    >
                                        <MaterialCommunityIcons name="run" color="#76ab7a" size={40} />
                                        <Text>Exercise</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </SafeAreaView>
                        <ModalActionGroup>
                            <ModalAction color={"#c8dee6"} style={{ margin: "5%" }} onPress={handleCloseModal}>

                                <AntDesign name="close" size={28} color={"#FFFFFF"} />

                            </ModalAction>
                            <ModalAction color={"#c8dee6"} style={{ margin: "5%" }} onPress={handleSubmit}>
                                <AntDesign name="check" size={28} color={"#FFFFFF"} />

                            </ModalAction>
                        </ModalActionGroup>
                    </ModalView>
                </ModalContainer>

            </Modal>
        </>
    );
}
export default InputModal;