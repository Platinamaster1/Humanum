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
import commonStyles from '../commonStyles';

export default props => {

    const [chats, setChats] = useState([])
    const [grupos, setGrupos] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            buscarChats()
        }, [])
    )

    async function buscarChats() {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const res = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/usuario/' + usuario.id)
        const dados = res.data
        setChats(dados)

        const res2 = await axios.get('http://' + ipconfig.ip + ':3002/chatsusuario/' + usuario.id)
        const dados2 = res2.data
        setGrupos(dados2)
    }

    return (
        <View style={{flex: 1}}>
            <FlatList data={chats} renderItem={({ item }) => <ChatItem chat={item} navigation={props.navigation} ehDM={true} />} />
            <Text style={styles.txtGrupos}>Grupos:</Text>
            <FlatList data={grupos} renderItem={({ item }) => <ChatItem grupo={item} navigation={props.navigation} ehDM={false} />} />
            <TouchableOpacity style={styles.btnCriarGrupo} onPress={() => {
                props.navigation.push("CriarGrupo", {navigation: props.navigation})
            }}>
                <Text style={styles.txtBotao}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    txtGrupos: {
        marginLeft: 10,
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20
    },
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