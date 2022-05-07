import styled from 'styled-components'
import { StyleSheet, Text } from 'react-native';

export const Colors = {
    primary: '#ffffff',
    green: '#10B981',
    red: '#EF4444',
};
const { primary, green, red } = Colors;

export const MsgBox = styled.Text`
    font-size: 14px;
    marginTop: 20px;
    font-weight: bold;
    width: 80%;
    text-align: center;
    color: ${(props) => (props.type == 'SUCCESS' ? green : '#EF4444')};
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const InnerContainer = styled.View`
    flex:1;
    width: 100%;
    align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
    padding: 25px;
    padding-top: 10px;
    justify-content: center;
    bottom: 0px;
`;

export const Avatar = styled.Image`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const WelcomeImage = styled.Image`
    height: 58%;
    min-width:100%;
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: gray;
    margin-vertical: 10px;
`;

export const Container = styled.SafeAreaView`
    margin: 20px;
    padding-bottom:0px;
    flex:1;
`

export const HeaderView = styled.View`
    padding-vertical: 10px;
    margin-bottom: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: grey;
    letter-spacing: 2px;
    margin-bottom: 10px;
    text-align: center;
    
`;

export const HeaderButton = styled.TouchableOpacity`
    font-weight: bold;
    color: 'rgb(0, 191, 166)';
`;

export const ListContainer = styled.View`
    margin-bottom: 30px;
    flex:1;
    padding-bottom: 40px;
`;

export const ListView = styled.TouchableHighlight`
    background-color:  rgb(230, 255, 252);
    min-height: 85px;
    width:100%;
    justify-content: space-around;
    margin-bottom: 15px;
    border-radius: 10px;
`

export const ListViewHidden = styled.TouchableHighlight`
    background-color: rgb(240, 242, 242);
    min-height: 85px;
    width: 100%;
    padding: 15px;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 15px;
    border-radius: 11px;
`

export const HiddenButton = styled.TouchableOpacity`
    width: 55px;
    align-items: center;
`;

export const TodoText = styled.Text`
    font-size: 20px;
    letter-spacing 1px;
    color: black;
    margin-top: 10px;
    margin-left: 10px;
`

export const TodoDate = styled.Text`
    font-size: 10px;
    letter-spacing 1px;
    color: black;
    text-align: right;
    text-transform: uppercase;
    margin-right: 10px;
    margin-bottom:10px;
`

export const SwipedTodoText = styled(TodoText)`
    color: 'rgb(0, 191, 166)';
    font-style: italic;
    text-decoration: line-through;
`
export const ModalButton = styled.TouchableOpacity`
    width: 60px;
    height: 60px;
    background-color: 'rgb(227, 227, 227)';
    border-radius:50px;
    justify-content: center;
    align-items: center;
    align-self: center;
    position: absolute;
    bottom: 0px;
`

export const ModalContainer = styled.View`
    padding:20px;
    justify-content: center;
    align-items: center;
    flex:1;
    background-color: rgb(243, 246, 244);
`
//green
export const ModalView = styled.View`
    background-color: rgb(160, 194, 147);
    border-radius: 20px;
    padding: 35px;
`


export const StyledInput = styled.TextInput`
    width: 300px;
    height: 50px;
    background-color: 'rgb(0, 191, 166)';
    padding: 10px;
    font-size: 16px;
    border-radius:10px;
    color: "rgb(3, 3, 3)";
    letter-spacing: 1px;
`

export const ModalAction = styled.TouchableOpacity`
    width: 60px;
    height: 60px;
    background-color: ${(props) => props.color};
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    align-self: center;
`

export const ModalActionGroup = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: 30px;
`

export const ModalIcon = styled.View`
    align-items: center;
    margin-bottom: 30px;
`

export const buttonColor = styled.View`
    color: #c8dee6;
`