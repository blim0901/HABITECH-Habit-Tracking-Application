import React, { useState, useContext } from 'react';
import { Text } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ListView, TodoText, TodoDate, ListViewHidden, HiddenButton, SwipedTodoText, Colors } from '../components/styles';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
//Api Client
import axios from 'axios';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';
const postBaseURL = 'https://us-central1-cz3002power6.cloudfunctions.net/appMethods/habit/deletehabit/';

const ListItems = ({ todos, setTodos }) => {
    console.log("List Items Page");
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    console.log("Stored Credentials: ", storedCredentials)
    let { name, email, uid } = storedCredentials;
    //uid = 'GxDJwfMmyZaRf7PEBtU85hu1VTB3';
    console.log("Name: " + name, ", Email: " + email, ", Uid: " + uid);


    const [swipedRow, setSwipedRow] = useState(null);
    const handleDeleteTodo = (rowMap, rowKey, rowTitle) => {
        axios
            .post(postBaseURL + uid, {
                habitName: rowTitle.toLowerCase()
            })
            .then((response) => {
                alert("Deleted Successfully.");
                const newTodos = [...todos];
                const todoIndex = todos.findIndex((todo) => todo.key === rowKey);
                newTodos.splice(todoIndex, 1);
                setTodos(newTodos);

            });
    }

    const navigation = useNavigation();
    return (
        <SwipeListView
            data={todos}
            renderItem={(data) => {
                let pageNavigate = data.item.title;

                const RowText = data.item.key == swipedRow ? SwipedTodoText : TodoText
                return (
                    <ListView style={{ backgroundColor: data.item.color }} underlayColor={Colors.primary} onPress={() => navigation.navigate(pageNavigate, { amount: data.item.amount, target: data.item.target, progress: data.item.progress })}>

                        <>
                            <TodoText> <MaterialCommunityIcons name={data.item.icon} color="black" size={20} /> {data.item.title} </TodoText>
                            <TodoDate> Target: {data.item.target}</TodoDate>
                            <TodoDate> Progress: {Math.floor(data.item.progress*100)}%</TodoDate>
                        </>

                    </ListView>
                )
            }}
            renderHiddenItem={(data, rowMap) => {
                return (
                    <ListViewHidden>
                        <HiddenButton
                            onPress={() => handleDeleteTodo(rowMap, data.item.key, data.item.title)}>
                            <Entypo name="trash" size={25} color="#00bfa6" />
                        </HiddenButton>
                    </ListViewHidden>
                )
            }}
            leftOpenValue={80}
            previewRowKey={"1"}
            previewOpenDelay={3000}
            disableLeftSwipe={true}
            showsVerticalScrollIndicator={false}
            style={{
                flex: 1, paddingBottom: 30, marginBottom: 40
            }}
            onRowOpen={(rowKey) => {
                setSwipedRow(rowKey);
            }}
            onRowClose={(rowKey) => {
                setSwipedRow(null);
            }}
        />

    );

}

export default ListItems;