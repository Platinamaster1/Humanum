import React, { Component, useEffect } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import commonStyles from '../commonStyles'
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import LivroItem from './livroItem';
import ipconfig from '../ipconfig'



export default props => {
    linhaTextosFavoritos = () => {
        for(const livro of props.textos) {
            linha.push(
                <LivroItem key={livro.id} livro={livro} navigation={props.navigation} />
            )
        }
        console.log(linha)
        return linha
    }
    return (
        <View>
            <ScrollView style={st.container} horizontal={true}>
                {props.id ? linhaTextosFavoritos() : console.log("ainda n recebi chefe")}
            </ScrollView>
        </View>
    )
}



const st = StyleSheet.create({
    container: {
        margin: 10,
        flexDirection: "row"
    },
})