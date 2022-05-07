import { Title, Button, Chip, Snackbar, Portal } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

import valuesToPercentage, { today } from "../components/utilities";
import { screenWidth } from 'react-native-calendars/src/expandableCalendar/commons';

import React, { useState, useContext, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

//Api Client
import axios from 'axios';
import SleepTargetDialog from "./SleepTargetDialog";


const Sleep = ({ navigation, route }) => {
    const { amount, target, progress} = route.params;
    var progressInPercentage = progress*100;

    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials)
    const { name, email, uid } = storedCredentials;
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);

    const [targetdDialogVisible, setTargetDialogVisible] = useState(false);
    const [targetVal, setTargetVal] = React.useState(target);

    //const [target, setTarget] = useState(2000);
    // Api call to get sleep target then setTarget(resultTarget)
    const [targetReach, setTargetReach] = useState(false);
    const [sleep, setSleep] = useState(amount);
    const [percentage, setPercentage] = useState(progressInPercentage);

    const [sleepNap, setSleepNap] = useState(0.5);
    const [sleepLong, setSleepLong] = useState(8);

    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);

    const [targetSnackVisible, setTargetSnackVisible] = useState(false);
    const onToggleTargetSnackBar = () => setTargetSnackVisible(true);
    const onDismissTargetSnackBar = () => setTargetSnackVisible(false);

    const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
    const [isCustomDialogVisible, setIsCustomDialogVisible] = useState(false);
    const screenWidth = Dimensions.get("window").width;
    let sleepAmount, date, sleepPercentage;

    const addSleep = (amount) => {
        if (targetVal == 0) {
            alert("Please set your target.");
        } else {
            if (amount) {
                sleepAmount = parseFloat(sleep) + parseFloat(amount);
                date = today();
               
                sleepPercentage = valuesToPercentage(targetVal, sleepAmount);
                setSleep(sleepAmount);
                setPercentage(sleepPercentage);
                axios
                .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/updateamount/'+uid, {
                    habitName:"sleep",
                    habitAmount:amount
                
                })
                .then((response) => {
                    //setPost(response.data);
                    console.log("UPDATE SLEEP PROGRESS");
                    console.log(response);
                    console.log("END")
                });

                onToggleSnackBar();
            }
            // ).then(() => null);
            if (sleepPercentage >= 100) setTargetReach(true);
        }
    }


    const resetSleep = () => {

        // firebase.database().ref('users/001/' + today() + '/').update(
        //     {'sleepAmount': 0, 'date': today(), 'percentage': 0}
        // ).then(() => null);
        setSleep(0);
        setPercentage(0);
        axios
        .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/resetprogress/' + uid, {
            habitName: "sleep"
        })
        .then((response) => {
            //setPost(response.data);
            console.log("RESET DRINK PROGRESS");
            console.log(response);
            console.log("END")
        });
    }

    React.useEffect(() => {
        console.log("target state change " + targetReach);
        if (targetReach === true) {
            onToggleTargetSnackBar();
            console.log("Target reached!")
        }
    }, [targetReach]);

    return (
        <View style={styles.container}>
            <Title>Today</Title>
            <SleepTargetDialog
                targetdDialogVisible={targetdDialogVisible}
                setTargetDialogVisible={setTargetDialogVisible}
                targetVal={targetVal}
                setTargetVal={setTargetVal}
            />

            <View style={styles.content}>
                <AnimatedCircularProgress
                    style={styles.progress}
                    size={245}
                    width={32}
                    rotation={0.25}
                    arcSweepAngle={360}
                    fill={percentage}
                    tintColor="#6C63FF"
                    backgroundColor="#FFFFFF"
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    childrenContainerStyle={styles.moon}
                    children={
                        () => (

                            <View style={{ alignItems: 'center', transform: [{ rotate: "-45deg" }], }}>
                                <Title>
                                    {sleep} hrs
                                </Title>
                                <Text>
                                   {Math.floor(percentage)} %
                                </Text>
                            </View>
                        )
                    }
                />
                <View style={styles.addContainer}>
                    {/* <Title style={{ marginHorizontal: 0 }}>+ Add a portion of sleep</Title> */}
                    <View style={styles.buttons}>
                        <Button icon="sleep" mode="contained" onPress={() => addSleep(sleepNap)}>
                            Nap
                        </Button>
                        <Button icon="power-sleep" mode="contained" onPress={() => addSleep(sleepLong)}>
                            Sleep
                        </Button>
                    </View>
                </View>
            </View>
            <Snackbar
                visible={visible}
                duration={2500}
                onDismiss={onDismissSnackBar}
                theme={{ colors: { surface: '#FFFFFF' } }}
                action={{
                    label: 'Reset',
                    onPress: () => resetSleep()
                }}>
                Your daily sleep level is now {percentage}%!
            </Snackbar>
            <Snackbar
                visible={targetSnackVisible}
                duration={2500}
                onDismiss={onDismissTargetSnackBar}
                theme={{ colors: { surface: '#FFFFFF', onSurface: '#FDCA40', accent: '#FFFFFF' } }}
                action={{
                    label: 'Yay!',
                    onPress: () => onDismissTargetSnackBar()
                }}>Congrats, you reached your sleeping goal!
            </Snackbar>

        </View>
    );
}
export default Sleep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 20,
        alignItems: 'center',
        height: 100,
    },
    content: {
        flex: 1,
        marginTop: 50,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    addContainer: {
        flex: 1,
        flexGrow: 0.45,
        flexDirection: 'row',
        alignItems: 'center',
        width: 20,
        /* width: screenWidth,*/
        alignContent: 'space-between',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 181,
        /*width: screenWidth-100,*/
        alignContent: 'space-between',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    moon: {
        width: 181,
        height: 181,
        borderRadius: 120,
        borderWidth: 5,
        //backgroundColor: '#ffffff',
        borderColor: "#6C63FF",
        //borderTopLeftRadius: 0,
        //borderBottomWidth: 10,
        //borderRightWidth: 10,
        transform: [{ rotate: "45deg" }],
        shadowColor: "#000000",
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "grey",
        shadowOpacity: 1,
        shadowRadius: 15,
    },

    /*BORDER*/
    progress: {
        width: 264,
        height: 264,
        marginBottom: 10,
        borderRadius: 300,
        borderWidth: 10,
        borderColor: "#6C63FF",
        overflow: 'hidden',
    }
});
