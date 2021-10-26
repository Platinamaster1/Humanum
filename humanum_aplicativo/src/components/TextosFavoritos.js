import React, { Component, useEffect, useState } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import commonStyles from '../commonStyles'
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import LivroItem from './livroItem';
import ipconfig from '../ipconfig'



export default props => {
    const [livrosFav, setLivros] = useState([])
    useEffect(() => {
        console.log("Textos favoritos")
        console.log(props.textos)
    })

    linhaTextosFavoritos = () => {
        
    }
    return (
        <View>
            <ScrollView style={st.container} horizontal={true}>
                {props.id ? props.textos : console.log("ainda n recebi chefe")}
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