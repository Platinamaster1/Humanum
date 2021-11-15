import React, { Component, useEffect, useState } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import commonStyles from '../commonStyles'
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import LivroItem from './livroItem';
import ipconfig from '../ipconfig'



export default props => {
    useEffect(() => {
        console.log("Textos favoritos")
        console.log(props.textos)
    })
    return (
        <View style={st.bigContainer}>
            <ScrollView style={st.container} horizontal={true}>
                {props.id ? props.textos : null}
            </ScrollView>
        </View>
    )
}



const st = StyleSheet.create({
    bigContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        margin: 10,
        flexDirection: "row",
    },
})