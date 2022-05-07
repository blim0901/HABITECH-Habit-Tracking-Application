import React from 'react';
import { Dimensions, KeyboardAvoidingView, SafeAreaView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
let { height, width } = Dimensions.get('window');
const KeyboardAvoidingWrapper = ({ children }) => {
    return (
        <KeyboardAvoidingView behavior={"padding"} enabled style={{ flexGrow: 1, height: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView bounces={false} >
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
export default KeyboardAvoidingWrapper;