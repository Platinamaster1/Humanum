import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatItem from '../components/chatItem';
import Header from '../Header'
import ipconfig from '../ipconfig'

export default props => {
    const [chats, setChats] = useState([])

    // useEffect(() => {
    //     buscarChats()
    // })

    useFocusEffect(
        React.useCallback(() => {
            buscarChats()
        }, [])
    )

    async function buscarChats() {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        console.log(usuario.id)
        const res = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/usuario/' + usuario.id)
        const dados = res.data
        // console.log(dados)
        setChats(dados)
    }

    return (
        <View>
            <FlatList data={chats} renderItem={({ item }) => <ChatItem chat={item} navigation={props.navigation} />} />
        </View>
    )
}

const styles = StyleSheet.create({
    msg: {
        marginTop: 20,
        marginLeft: 10,
        borderColor: '#c5c5c5',
        borderTopWidth: 1,
        borderBottomWidth: 1
    }
})