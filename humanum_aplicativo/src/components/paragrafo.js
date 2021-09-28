import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, BackHandler } from 'react-native';
import axios from 'react-native-axios'
import { useGoogleApi } from 'react-gapi'
import commonStyles from '../commonStyles'

export default props => {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>{props.conteudo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#dedede",
        margin: 10,
        borderRadius: 5,
        padding: 4,
        // borderColor: 'black',
        // borderWidth: 2
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 17
    }
})