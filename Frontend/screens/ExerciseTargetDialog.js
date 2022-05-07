import { AntDesign } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { Modal, Text, TouchableOpacity, View, FlatList, SafeAreaView } from 'react-native';
import { Chip, TextInput, Button } from "react-native-paper";

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

var createTitle, itemColor, itemIcon;

const ExerciseTargetDialog = ({ targetdDialogVisible, setTargetDialogVisible, targetVal, setTargetVal }) => {

    console.log("Input Modal Page");
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials)
    let { name, email, uid } = storedCredentials;
    //uid = 'GxDJwfMmyZaRf7PEBtU85hu1VTB3';
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);

    const [inputVal, setInputVal] = React.useState(false);




    const handleCloseModal = () => {
        setTargetDialogVisible(false);

    }
    const handleSubmit = () => {
        if (parseFloat(inputVal) < 0.25) {
            alert("Target is at least 15 mins");

        }
        else if (parseFloat(inputVal) > 12) {
            alert("Maximum target should be less than 12 hrs");

        }
        else {
            axios
                .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/updatetarget/' + uid, {
                    habitName: "exercise",
                    habitTarget: inputVal
                })
                .then((response) => {
                    console.log("UPDATE READ TARGET");
                    console.log(response.data);
                    setTargetVal(inputVal);
                    setTargetDialogVisible(false);

                });
        }

    }


    return (
        <>
            <Chip
                mode='outlined'
                icon='information'
                selectedColor='#2176FF'
                style={{ marginTop: 10, height: '5%' }}
                onPress={() => { setTargetDialogVisible(true) }}>
                Exercise target: {targetVal} hrs
            </Chip>

            <Modal
                animationType='slide'
                transparent={true}
                visible={targetdDialogVisible}
            //onRequestClose={handleCloseModal}
            >
                <ModalContainer>
                    <ModalView style={{ height: "75%" }}>
                        <HeaderTitle style={{ color: "#fce5cd" }} size={40}>Add Target</HeaderTitle>

                        <SafeAreaView style={{ flex: 1, position: 'relative' }}>



                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, alignItems: 'space-between' }}>
                                <View style={{ width: '100%' }}>
                                    <Text style={{ marginBottom: 20 }} >
                                        Exercise Target:{"\n\n"}
                                        15mins-12hrs{"\n\n"}

                                      {/*   Current exercise time: {"\n\n"}

                                        Exercise: 0.25hrs {"\n"} */}

                                    </Text>

                                    <TextInput
                                        //keyboardType='numeric'
                                        label="Set exercise target"
                                        placeholder="in hours"
                                        underlineColor="#2176FF"
                                        theme={{ colors: { primary: '#2176FF' } }}
                                        onChangeText={text => setInputVal(text)}
                                    />
                                    {/* <Button
                                        theme={{ colors: { primary: '#2176FF' } }}
                                        onPress={() => {
                                            /*  props.setIsDialogVisible(false);
                                             if (!isNaN(inputVal)) props.setTarget(parseInt(inputVal)); 
                                        }}>Done</Button> */}
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
export default ExerciseTargetDialog;