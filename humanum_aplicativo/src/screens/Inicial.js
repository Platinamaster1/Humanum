import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import commonStyles from '../commonStyles'
import Recomendacoes from '../components/recomendacoes'

// import ListaLivros from '../components/ListaLivros'

export default class Inicial extends Component {
    render() {
        return (
            <View style={st.container}>
                <ScrollView>
                    {/* <Text style={st.texto}>teste</Text> */}
                    <Recomendacoes genero='poesia'/>
                </ScrollView>
            </View>
        )
    }
}

const st = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    texto: {
        fontFamily: 'commonStyles.fontFamily2'
    }
})