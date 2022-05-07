import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

//React navigation stack
import RootStack from './navigators/RootStack';

//Apploading
import AppLoading from 'expo-app-loading';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './components/CredentialsContext';

import { LogBox } from 'react-native';

export default function App() {

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
  //AsyncStorage.clear();
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage
      .getItem('habitechCredentials')
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch(error => console.log(error))
      
  }

  if (!appReady) {
    return (<AppLoading
      startAsync={checkLoginCredentials}
      onFinish={() => setAppReady(true)}
      onError={console.warn}
    />)
  } return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <RootStack />
    </CredentialsContext.Provider>
  );

  //<BottomTab/>;
  /*(
    <RootStack/>
    //<Login/>
    //<ForgotPassword/>
    //<Register/>
  );*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});