import React from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    return (
        <View style={[st.container, props.style]}>
            <Icon name={props.icon} size={20} style={st.icon} />
            <TextInput {...props} style={st.input} autoCapitalize='none' />
        </View>
    )
}

const st = StyleSheet.create({
    container: {
        backgroundColor: "#EEE",
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#333',
        marginLeft: 15,
    },
    input: {
        marginLeft: 10,
        width: '80%',
        fontSize: 14,
        color: 'black'
    }
})