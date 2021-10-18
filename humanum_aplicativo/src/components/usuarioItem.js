import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'

export default props => {
    const {usuario} = props
    console.log(usuario)
    return (
        <TouchableOpacity onPress={() => {
            props.navigation.push('PerfilOutros', {user: usuario})
        }}>
            <View style={styles.container}>
                {usuario.foto? 
                (<Image style={styles.icone} source={{ uri: usuario.foto }} />): 
                (<Image style={styles.icone} source={{ uri: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' }} />)}
                {usuario.nome.length > 8?
                <Text style={styles.texto}>{usuario.nome.substring(0, 7)}...</Text>:
                <Text style={styles.texto}>{usuario.nome}</Text>}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    icone: {
        height: 80,
        width: 80,
        borderRadius: 100
    },
    container: {
        margin: 6
    },
    texto: {
        fontFamily: commonStyles.fontFamily2
    }
})