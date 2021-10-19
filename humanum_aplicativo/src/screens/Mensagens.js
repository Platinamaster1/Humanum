import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatItem from '../components/chatItem';

export default props => {
    const [chats, setChats] = useState([])

    useEffect(async () => {
        const idusuario = await AsyncStorage.getItem('idLogado')
        const res = await axios.get('http://192.168.15.7:3002/mensagens/usuario/' + idusuario)
        const dados = res.data
        setChats(dados)
    })

    return (
        <View>
            <Text>oi</Text>
            <FlatList style={styles.borda} data={chats} renderItem={({item}) => <ChatItem chat={item} />} />
        </View>
    )
}

const styles = StyleSheet.create({
    borda: {
        marginTop: 50
    }
})