import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../commonStyles';
import ipconfig from '../ipconfig'

export default props => {
    const { chat } = props
    const [destinatario, setDestinatario] = useState([])
    const [idUsuario, setIdUsuario] = useState(0)

    useState(async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        setIdUsuario(dadosuser.id)
        const iddestinatario = (chat.idusuario1 == id ? chat.idusuario2 : chat.idusuario1)
        const res = await axios.get('http://' + ipconfig.ip + ':3002/usuarios/id/' + iddestinatario)
        const dados = res.data
        setDestinatario(dados[0])
    })

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                props.navigation.push('Chat', {
                    destinatario: destinatario, 
                    ehDM: true, 
                    idUsuario: idUsuario,
                    chat: chat
                })
                
            }}>
                <View style={styles.horizontal}>
                    <Image style={styles.fotoPerfil} source={{ uri: (destinatario.foto ? destinatario.foto : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg') }} />
                    <Text style={styles.texto}>{destinatario.nome}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 25
    },
    container: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        borderColor: '#c5c5c5',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    horizontal: {
        flexDirection: 'row'
    },
    fotoPerfil: {
        width: 70,
        height: 70,
        borderRadius: 65,
    },
})
