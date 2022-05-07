import { Title, Button, Chip, Snackbar, Portal } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

/*import ChangeTargetDialog from "./ChangeTargetDialog";
import CustomWaterDialog from "./CustomWaterDialog";
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
import DrinkTargetDialog from "./DrinkTargetDialog";


const Drink = ({ navigation, route }) => {
    const { amount, target, progress } = route.params;
    var progressInPercentage = progress * 100;

    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials)
    const { name, email, uid } = storedCredentials;
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);
    //uid = 'GxDJwfMmyZaRf7PEBtU85hu1VTB3';

    const [targetdDialogVisible, setTargetDialogVisible] = useState(false);
    const [targetVal, setTargetVal] = React.useState(target);

    const [targetReach, setTargetReach] = useState(false);
    const [water, setWater] = useState(amount);
    const [percentage, setPercentage] = useState(progressInPercentage);

    const [waterCup, setWaterCup] = useState(250);
    const [waterBottle, setWaterBottle] = useState(500);

    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);

    const [targetSnackVisible, setTargetSnackVisible] = useState(false);
    const onToggleTargetSnackBar = () => setTargetSnackVisible(true);
    const onDismissTargetSnackBar = () => setTargetSnackVisible(false);

    const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
    const [isCustomDialogVisible, setIsCustomDialogVisible] = useState(false);
    const screenWidth = Dimensions.get("window").width;
    let waterAmount, date, waterPercentage;

    const addWater = (amount) => {
        if (targetVal == 0) {
            alert("Please set your target.");
        } else {
            if (amount) {
                waterAmount = parseInt(water) + parseInt(amount);
                date = today();
                //console.log("Water amount: "+water);
                //console.log(targetVal);
                waterPercentage = valuesToPercentage(targetVal, waterAmount);
                setWater(waterAmount);
                setPercentage(waterPercentage);
                axios
                    .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/updateamount/' + uid, {
                        habitName: "drink",
                        habitAmount: amount
                    })
                    .then((response) => {
                        //setPost(response.data);
                        console.log("UPDATE DRINK PROGRESS");
                        console.log(response);
                        console.log("END")
                    });
                onToggleSnackBar();
            }
            // ).then(() => null);
            if (waterPercentage >= 100) {
                console.log("REACHHHHHHHHHH");
                setTargetReach(true);

            }
        }
    }

    React.useEffect(() => {
        console.log("target state change " + targetReach);
        if (targetReach === true) {
            onToggleTargetSnackBar();
            console.log("Target reached!")
        }
    }, [targetReach]);

    /*     React.useEffect(() => {
            axios.get(baseURL + uid).then((response) => {
                console.log("Drink page");
                //console.log(response.data);
                //setPost(response.data);
                var i = 1;
                var color, icon;
                var object = response.data;
                for (const property in object) {
                    //console.log(`${property}: ${object[property]}`);
                    if (`${property}` == "drink") {
                        setTargetVal(`${object[property]["target"]}`);
                        setPercentage(`${object[property]["progress"]}`);
                    }
                }
            });
        }, []); */


    const resetWater = () => {
        setWater(0);
        setPercentage(0);
        axios
            .post('https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/resetprogress/' + uid, {
                habitName: "drink"
            })
            .then((response) => {
                //setPost(response.data);
                console.log("RESET DRINK PROGRESS");
                console.log(response);
                console.log("END")
            });

    }


    return (
        <View style={styles.container}>
            <Title>Today</Title>
            <DrinkTargetDialog
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
                    tintColor="#6baeec"
                    backgroundColor="#FFFFFF"
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    childrenContainerStyle={styles.circle}
                    children={
                        () => (
                            <View style={{ alignItems: 'center', transform: [{ rotate: "-45deg" }], }}>
                                <Title>
                                    {water} ml
                                </Title>
                                <Text>
                                    {Math.floor(percentage)} %
                                </Text>
                            </View>
                        )
                    }
                />
                <View style={styles.addContainer}>
                    {/* <Title style={{ marginHorizontal: 0 }}>+ Add a portion of water</Title> */}
                    <View style={styles.buttons}>
                        <Button icon="cup" color="#0051d4" mode="contained" onPress={() => addWater(waterCup)}>
                            Cup
                        </Button>
                        <Button icon="glass-stange" color="#0051d4" mode="contained" onPress={() => addWater(waterBottle)}>
                            Bottle
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
                    onPress: () => resetWater()
                }}>
                Your daily water intake level is now {percentage}%!
            </Snackbar>
            <Snackbar
                visible={targetSnackVisible}
                duration={2500}
                onDismiss={onDismissTargetSnackBar}
                theme={{ colors: { surface: '#FFFFFF', onSurface: '#FDCA40', accent: '#FFFFFF' } }}
                action={{
                    label: 'Yay!',
                    onPress: () => onDismissTargetSnackBar()
                }}>Congrats, you reached your water intake goal!
            </Snackbar>
            {/*   <Portal>
             <ChangeTargetDialog
                isDialogVisible={isTargetDialogVisible}
                setIsDialogVisible={setIsTargetDialogVisible}
                //setTarget={defineTarget}
            />
             <CustomWaterDialog
                isDialogVisible={isCustomDialogVisible}
                setIsDialogVisible={setIsCustomDialogVisible}
                //addWater={addWater}
            />  
            </Portal>  */}

        </View>
    );
}
export default Drink;

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
    circle: {
        width: 181,
        height: 181,
        borderRadius: 120,
        borderWidth: 5,
        backgroundColor: '#ffffff',
        borderColor: "#0051d4",
        borderTopLeftRadius: 10,
        borderBottomWidth: 10,
        borderRightWidth: 10,
        transform: [{ rotate: "45deg" }],
        shadowColor: "#000000",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.9,
        shadowRadius: 10.00,
        elevation: 10,
    },
    /*BORDER*/
    progress: {
        width: 264,
        height: 264,
        marginBottom: 10,
        borderRadius: 300,
        borderWidth: 10,
        borderColor: "#0051d4",
        overflow: 'hidden',
    }
});
