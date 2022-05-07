import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Screens
import Login from './../screens/Login';
import ForgotPassword from './../screens/ForgotPassword';
import Register from './../screens/Register';
import Home from './../screens/Home';
import HabitsCalendar from '../screens/Calendar';
import Profile from '../screens/Profile';
import Read from '../screens/Read';
import Sleep from '../screens/Sleep';
import Drink from '../screens/Drink';
import Exercise from '../screens/Exercise';


//Credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      //primary: 'rgb(255, 45, 85)',
      background: 'rgb(255, 255, 255)'
      //'#F8F8F8'
    },
  };

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={Home} />
        <HomeStack.Screen name="Read" component={Read} />
        <HomeStack.Screen name="Sleep" component={Sleep} />
        <HomeStack.Screen name="Drink" component={Drink} />
        <HomeStack.Screen name="Exercise" component={Exercise} />
      </HomeStack.Navigator>
    );
  }

const RootStack = () => {
    return (
        <CredentialsContext.Consumer>
            {({ storedCredentials }) => (
                <NavigationContainer theme={MyTheme}>
                    {storedCredentials ?
                        (
                            <Tab.Navigator screenOptions={
                                {
                                    "tabBarActiveTintColor": "#00BFA6",
                                    "tabBarStyle": [
                                        {
                                            "display": "flex"
                                        },
                                        null
                                    ]
                                }}>
                                <Tab.Screen
                                    name="HomeStack"
                                    component={HomeStackScreen}
                                    options={{
                                        tabBarLabel: 'Home',
                                        headerShown: false,
                                        tabBarIcon: ({ color, size }) => (
                                            <MaterialCommunityIcons name="home" color={color} size={size} />
                                        ),
                                    }}
                                />
                                <Tab.Screen
                                    name="Calendar"
                                    component={HabitsCalendar}
                                    options={{
                                        tabBarLabel: 'Calendar',
                                        tabBarIcon: ({ color, size }) => (
                                            <MaterialCommunityIcons name="calendar" color={color} size={size} />
                                        ),
                                    }}
                                />
                                <Tab.Screen
                                    name="Profile"
                                    component={Profile}
                                    options={{
                                        tabBarLabel: 'Profile',
                                        tabBarIcon: ({ color, size }) => (
                                            <MaterialCommunityIcons name="account" color={color} size={size} />
                                        ),
                                    }}
                                />
                            </Tab.Navigator>
                        )
                        : (<>
                            <Stack.Navigator
                                screenOptions={{
                                    headerStyled: {
                                        backgroundColor: 'transparent'
                                    },
                                    headerTransparent: true,
                                    headerTitle: ''
                                }}
                                initialRouteName="Login">
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="Register" component={Register} />
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                            </Stack.Navigator>
                        </>)

                    }
                </NavigationContainer>
            )}
        </CredentialsContext.Consumer>
    );
}

export default RootStack;