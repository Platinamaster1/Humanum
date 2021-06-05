import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'

// import ListaLivros from '../components/ListaLivros'

export default class Inicial extends Component {
    render() {
        return (
            <View style={st.container}>
                <ScrollView>
                    
                </ScrollView>
            </View>
        )
    }
}

const st = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A90A0A'
    }
})