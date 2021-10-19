import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    const [mensagens, setMensagens] = useState([])
    const { ehDM, destinatario } = props.route.params
    
    useEffect(async () => {
        const res = await axios.get('http://192.168.15.7:3002/mensagens/dm/1')
        const dados = res.data
        setMensagens(dados)
    })
    
    return (
        <View style={styles.container}>
            <View style={styles.horizontal}>
                <Icon name='arrow-left' size={20} />
                <Image source={{ uri: destinatario.foto }} style={styles.foto} />
                <Text>{!ehDM ? destinatario.nome : null}</Text>
            </View>
            <FlatList data={mensagens} renderItem={({ item }) => <Text style={styles.remetente}>{item.texto}</Text>} />
            {/* <TextInput /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fdf7f0',
        flex: 1
    },
    remetente: {
        marginRight: 10,
        marginTop: 4,
        padding: 5,
        paddingLeft: 12,
        paddingRight: 9,
        backgroundColor: '#fddddd',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'black',
        alignSelf: 'flex-end'
    },
    destinatario: {
        marginLeft: 10,
        marginTop: 4,
        padding: 5,
        paddingLeft: 12,
        paddingRight: 9,
        backgroundColor: 'white',
        borderRadius: 45,
        borderWidth: 1.5,
        borderColor: 'black',
        alignSelf: 'flex-start'
    },
    horizontal: {
        backgroundColor: 'white',
        paddingTop: 30,
        flexDirection: 'row'
    },
    foto: {
        borderRadius: 100,
        height: 50,
        width: 50
    }
})