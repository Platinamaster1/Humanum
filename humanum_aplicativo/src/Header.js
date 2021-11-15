import React from 'react';
import { StyleSheet } from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from './commonStyles'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {
    logoff = async () => {
        await AsyncStorage.removeItem('dadosUsuario')
        props.navigation.push('Splash')
    }

    return (
        <Header
            placement='right'
            backgroundColor='#fee'
            leftComponent={{ text: 'HUMANUM', style: { color: '#a90a0a', fontSize: 30, fontFamily: commonStyles.fontFamily2 }}}
            rightComponent={<Icon name='power-off' color='black' size={25} style={st.icone} onPress={logoff}/>}
        />
    )
}

const st = StyleSheet.create({
    icone: {
        marginTop: 10,
        marginRight: 15,
    }
})