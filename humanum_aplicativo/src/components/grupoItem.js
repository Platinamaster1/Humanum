import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipconfig from '../ipconfig';

export default props => {
    const { grupo } = props

    entrarGrupo = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const dados = {
            idchat: grupo.id,
            idusuario: idusuario
        }
        const res = await axios.post('http://' + ipconfig.ip + ':3002/chats/usuarios', dados)
        props.navigation.push('Chat', {
            ehDM: false,
            idUsuario: idusuario,
            chat: grupo
        })
    }

    return (
        <View style={styles.container}>
            <Image style={styles.icone} source={{ uri: grupo.foto }} />
            {grupo.nome.length > 8 ?
                <Text style={styles.texto}>{grupo.nome.substring(0, 7)}...</Text> :
                <Text style={styles.texto}>{grupo.nome}</Text>}
            <TouchableOpacity style={styles.botao} onPress={entrarGrupo}>
                <Text style={{ color: 'white' }}>ENTRAR</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    botao: {
        backgroundColor: 'red',
        justifyContent: "center",
        alignItems: "center",
    },
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