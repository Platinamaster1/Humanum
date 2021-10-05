import React from 'react';
import { Header } from 'react-native-elements'
import commonStyles from './commonStyles'

export default props => {
    return (
        <Header
            placement='right'
            backgroundColor='#fee'
            leftComponent={{ icon: 'menu', color: '#000', iconStyle: { color: '#000', fontSize: 50 }, 
                onPress:() => {props.navigation.openDrawer()}}}
            centerComponent={{ text: 'HUMANUM',
            style: { color: '#a90a0a', fontSize: 30, fontFamily: commonStyles.fontFamily2, marginTop: 6 }}}
            // rightComponent={{ icon: 'home', color: '#fff', onPress:() => {console.log("jooj")} }}
        />
    )
}