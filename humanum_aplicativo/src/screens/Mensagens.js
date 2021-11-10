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
        console.log(JSON.parse(await AsyncStorage.getItem('qtdMsg')))
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        // const usuario = dadosuser[0]
        console.log(usuario.id)
        const res = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/usuario/' + usuario.id)
        const dados = res.data
        // console.log(dados)
        setChats(dados)
    }

    return (
        <View style={{flex: 1}}>
            <FlatList data={chats} renderItem={({ item }) => <ChatItem chat={item} navigation={props.navigation} />} />
            <TouchableOpacity style={styles.btnCriarGrupo} onPress={() => {
                console.log("eae")
                props.navigation.push("CriarGrupo")
            }}>
                <Text style={styles.txtBotao}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    txtBotao: {
        color: 'white',
        fontSize: 30
    },
    btnCriarGrupo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ee6e73',
        // position: 'absolute',
        marginBottom: 10,
        marginLeft: Dimensions.get('window').width * (4 / 5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    msg: {
        marginTop: 20,
        marginLeft: 10,
        borderColor: '#c5c5c5',
        borderTopWidth: 1,
        borderBottomWidth: 1
    }
})