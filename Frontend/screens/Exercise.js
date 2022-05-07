import { Title, Button, Chip, Snackbar, Portal } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

/*import ChangeTargetDialog from "./ChangeTargetDialog";
import CustomSleepDialog from "./CustomSleepDialog";
import valuesToPercentage, {today} from "./Utilities.js";*/
//async-storage
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
import ExerciseTargetDialog from "./ExerciseTargetDialog";
import LottieView from 'lottie-react-native';

const Exercise = ({ navigation, route }) => {
    const { amount, target, progress } = route.params;
    var progressInPercentage = progress * 100;

    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials)
    const { name, email, uid } = storedCredentials;
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);

    const [targetdDialogVisible, setTargetDialogVisible] = useState(false);
    const [targetVal, setTargetVal] = React.useState(target);

    //const [target, setTarget] = useState(2000);
    // Api call to get sleep target then setTarget(resultTarget)
    const [targetReach, setTargetReach] = useState(false);
    const [exercise, setExercise] = useState(amount);
    const [percentage, setPercentage] = useState(progressInPercentage);

    const [exerciseTime, setExerciseTime] = useState(0.25);

    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);

    const [targetSnackVisible, setTargetSnackVisible] = useState(false);
    const onToggleTargetSnackBar = () => setTargetSnackVisible(true);
    const onDismissTargetSnackBar = () => setTargetSnackVisible(false);

    const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
    const [isCustomDialogVisible, setIsCustomDialogVisible] = useState(false);
    const screenWidth = Dimensions.get("window").width;
    let exerciseAmount, date, exercisePercentage;

    // const defineTarget = (userTarget) => {
    //     firebase.database().ref('users/001/').update(
    //         {'sleepTarget': userTarget}
    //     ).then(() => null);
    //     firebase.database().ref('targets/001/').update(
    //         {'sleepTarget': userTarget}
    //     ).then(() => null);
    // }

    const addExercise = (amount) => {
        if (targetVal == 0) {
            alert("Please set your target.");
        } else {
            if (amount) {
                exerciseAmount = parseFloat(exercise) + parseFloat(amount);
                date = today();

                exercisePercentage = valuesToPercentage(targetVal, exerciseAmount);
                setExercise(exerciseAmount);
                setPercentage(exercisePercentage);
                axios
                    .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/updateamount/' + uid, {
                        habitName: "exercise",
                        habitAmount: amount

                    })
                    .then((response) => {
                        //setPost(response.data);
                        console.log("UPDATE EXERCISE PROGRESS");
                        console.log(response);
                        console.log("END")
                    });

                onToggleSnackBar();
            }
            // ).then(() => null);
            if (exercisePercentage >= 100) setTargetReach(true);
        }
    }

    const resetExercise = () => {

        // firebase.database().ref('users/001/' + today() + '/').update(
        //     {'sleepAmount': 0, 'date': today(), 'percentage': 0}
        // ).then(() => null);
        setExercise(0);
        setPercentage(0);
        axios
            .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/resetprogress/' + uid, {
                habitName: "exercise"
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

    let exerciseanimation = React.createRef();

    return (
        <View style={styles.container}>
            <Title>Today</Title>
            <ExerciseTargetDialog
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
                    tintColor="#87c38f"
                    backgroundColor="#FFFFFF"
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    childrenContainerStyle={styles.exerciseanimation}
                    children={
                        () => (

                            <View style={{ alignItems: 'center' }}>
                                <LottieView
                                    loop={true}
                                    autoPlay={true}
                                    ref={exerciseanimation}
                                    style={{ width: '100%', height: '97%', marginTop: 3, marginLeft: 2, opacity: 0.5, position: 'relative' }}
                                    source={require("../assets/exercise.json")}
                                />
                                <Title style={{ fontSize: 17, marginTop: 50, marginRight: 10, position: 'absolute' }}>
                                    {exercise} hrs
                                </Title>
                                <Text style={{ fontSize: 18, marginTop: 85, marginRight: 50, position: 'absolute' }}>
                                    {Math.floor(percentage)} %
                                </Text>
                            </View>

                        )
                    }
                />
                <View style={styles.addContainer}>
                    {/* <Title style={{ marginHorizontal: 0 }}>+ Add a portion of sleep</Title> */}
                    <View style={styles.buttons}>
                        <Button icon="run" color="#87c38f" mode="contained" onPress={() => addExercise(exerciseTime)}>
                            Exercise
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
                    onPress: () => resetExercise()
                }}>
                Your daily Exercise time is now {percentage}%!
            </Snackbar>
            <Snackbar
                visible={targetSnackVisible}
                duration={2500}
                onDismiss={onDismissTargetSnackBar}
                theme={{ colors: { surface: '#FFFFFF', onSurface: '#FFC56F', accent: '#FFFFFF' } }}
                action={{
                    label: 'Yay!',
                    onPress: () => onDismissTargetSnackBar()
                }}>Congrats, you reached your exercise goal!
            </Snackbar>

        </View>
    );
}
export default Exercise;

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
        marginTop: 20,
        /*width: screenWidth-100,*/
        alignContent: 'space-between',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',

    },
    exerciseanimation: {
        borderRadius: 120,
        borderWidth: 5,
        borderColor: "#55a960",
        marginRight: 30,
        width: 181,
        height: 181,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    /*BORDER*/
    progress: {
        width: 264,
        height: 264,
        marginBottom: 10,
        borderRadius: 300,
        borderWidth: 10,
        borderColor: "#55a960",
        overflow: 'hidden',
    }
});
