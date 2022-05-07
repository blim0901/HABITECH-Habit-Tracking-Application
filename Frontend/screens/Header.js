import React from "react";

import {
    HeaderView,
    HeaderTitle,
    HeaderButton,
    colors
} from "./../components/styles"

import { Entypo } from "@expo/vector-icons"; 

const HeaderApp = () => {
    return (
        <HeaderView>
            <HeaderTitle>Todos</HeaderTitle>
            <HeaderButton>
            <Entypo name="trash" size={25} color="#00bfa6"/>
            </HeaderButton>
        </HeaderView>
    );
}

export default HeaderApp;