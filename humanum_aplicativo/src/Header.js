import React from 'react';
import { StyleSheet } from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from './commonStyles'

export default props => {
    return (
        <Header
            placement='right'
            backgroundColor='#fee'
            leftComponent={{ text: 'HUMANUM', style: { color: '#a90a0a', fontSize: 30, fontFamily: commonStyles.fontFamily2 }}}
            centerComponent={<Icon name='bell' color='black' size={25} style={st.icone} />}
            rightComponent={<Icon name='ellipsis-v' color='black' size={25} style={st.icone} />}
        />
    )
}

const st = StyleSheet.create({
    icone: {
        marginTop: 10,
        marginRight: 15,
    }
})