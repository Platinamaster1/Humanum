import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../commonStyles';
import ipconfig from '../ipconfig'
import IconBadge from 'react-native-icon-badge';


export default props => {
    const { chat } = props
    const [destinatario, setDestinatario] = useState([])
    const [idUsuario, setIdUsuario] = useState(0)
    const [qtdMsg, setQtdMsg] = useState('1.789')

    useState(async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        setIdUsuario(usuario.id)
        const iddestinatario = (chat.idusuario1 == usuario.id ? chat.idusuario2 : chat.idusuario1)
        const res = await axios.get('http://' + ipconfig.ip + ':3002/usuarios/id/' + iddestinatario)
        const dados = res.data
        setDestinatario(dados[0])
    })

    return (
        <TouchableOpacity onPress={() => {
            props.navigation.push('Chat', {
                destinatario: destinatario, 
                ehDM: true, 
                idUsuario: idUsuario,
                chat: chat
            })
            
        }}>
            <View style={styles.container}>
                    <View style={styles.fotoView}>
                        <Image style={styles.fotoPerfil} source={{ uri: (destinatario.foto ? destinatario.foto : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg') }} />
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.texto}>{destinatario.nome}</Text>
                        <View style={styles.lastMsgView}>
                            <Icon name={'check'} color='gray'/>
                            <Text style={styles.lastMsg}>Faala Vitão</Text>
                        </View>
                    </View>
                    <View style={styles.notificationTime}>
                        <Text style={styles.hora}>10:20</Text>
                        <IconBadge
                            MainElement={null}
                            BadgeElement={<Text style={{ color: 'white', fontSize: 10 }}>{qtdMsg}</Text>}
                            IconBadgeStyle={{
                                backgroundColor: '#a90a0a',
                                minWidth: 25,
                                height: 25,
                                padding: 3,
                                top: 1,
                                left: 0,
                                position: 'relative'
                            }}
                            Hidden={qtdMsg === '0'}
                        />
                    </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderColor: '#c5c5c5',
        borderBottomWidth: 1,
    },
    fotoView: {
        flex: 15,
    },
    content: {
        flex: 65,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    notificationTime: {
        flex: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fotoPerfil: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 24,
    },
    lastMsgView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
    },
    lastMsg: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 14,
        marginLeft: 5,
        color: 'gray'
    },
    hora: {
        color: 'gray',
        fontSize: 12
    }
})
