import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {
    const { chat } = props
    const [destinatario, setDestinatario] = useState([])

    useState(async () => {
        const idusuario = await AsyncStorage.getItem('idLogado')
        const iddestinatario = (chat.idusuario1 == idusuario ? chat.idusuario2 : chat.idusuario1)
        const res = await axios.get('http://192.168.15.7:3002/usuarios/id/' + iddestinatario)
        const dados = res.data
        setDestinatario(dados[0])
    })

    return (
        <View>
            <View style={styles.horizontal}>
                <Image style={styles.fotoPerfil} source={{ uri: (destinatario.foto ? destinatario.foto : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg') }} />
                <Text>{destinatario.nome}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: 'row'
    },
    fotoPerfil: {
        width: 70,
        height: 70,
        borderRadius: 65,
    },
})
