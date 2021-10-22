import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import commonStyles from '../commonStyles'
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'



export default props => {
    return (
        <View style={st.container}>
            <Text>Aqui ficarão os Textos Favoritados pelo Usuário</Text>
        </View>
    )
}



const st = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})