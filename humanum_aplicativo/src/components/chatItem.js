import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../commonStyles';
import ipconfig from '../ipconfig'
import IconBadge from 'react-native-icon-badge';
import { useFocusEffect } from '@react-navigation/native'

export default props => {
    const { chat, ehDM, grupo } = props
    const [destinatario, setDestinatario] = useState([])
    const [idUsuario, setIdUsuario] = useState(0)
    const [qtdMsg, setQtdMsg] = useState(0)
    const [ultima, setUltima] = useState('')
    const [horaUltima, setHoraUltima] = useState('')
    const [ultimaEnviada, setUltimaEnviada] = useState(false)

    fazerTudoDM = async (setid, setdest, setqtd, setult, sethora, setultenv) => {
        if (ehDM) {
            const dadosuser = await AsyncStorage.getItem('dadosUsuario')
            const usuario = JSON.parse(dadosuser)[0]
            setid(usuario.id)
            const iddestinatario = (chat.idusuario1 == usuario.id ? chat.idusuario2 : chat.idusuario1)
            const res = await axios.get('http://' + ipconfig.ip + ':3002/usuarios/id/' + iddestinatario)
            const dados = res.data
            setdest(dados[0])

            const res2 = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/dm/naovisualizado/' + chat.id + '/' + usuario.id)
            const dados2 = res2.data
            setqtd(dados2.length)

            const res3 = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/dm/ultima/' + chat.id)
            const dados3 = res3.data
            if (dados3.length > 0) {
                setult(dados3[0].texto)
                var date = new Date(dados3[0].data)
                var data = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':'
                var min = date.getMinutes()

                if (min < 10)
                    data = data + '0' + min
                else
                    data = data + min
                sethora(data)
                if (dados3[0].idusuarioremetente == usuario.id)
                    setultenv(true)
            }
        }
    }

    fazerTudoGrupo = async (setid, setult, setqtd) => {
        if (!ehDM) {
            const dadosuser = await AsyncStorage.getItem('dadosUsuario')
            const usuario = JSON.parse(dadosuser)[0]
            const iduser = usuario.id
            setid(iduser)

            const res = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/grupo/ultima/' + grupo.id)
            const dados = res.data
            if (dados.length > 0) {
                setult(dados[0].nome + ": " + dados[0].texto)
            }

            const res2 = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/grupo/naovisualizado/' + grupo.id + '/' + usuario.id)
            const dados2 = res2.data
            setqtd(dados2.length)
        }
    }

    useEffect(() => {
        fazerTudoDM(setIdUsuario, setDestinatario, setQtdMsg, setUltima, setHoraUltima, setUltimaEnviada)
        fazerTudoGrupo(setIdUsuario, setUltima, setQtdMsg)
    })

    return (
        <TouchableOpacity onPress={() => {
            props.navigation.push('Chat', {
                destinatario: destinatario,
                ehDM: ehDM,
                idUsuario: idUsuario,
                chat: ehDM ? chat : grupo
            })

        }}>
            <View style={styles.container}>
                <View style={styles.fotoView}>
                    <Image style={styles.fotoPerfil} source={ehDM ? { uri: (destinatario.foto ? destinatario.foto : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg') } : { uri: grupo.foto }} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.texto}>{ehDM ? destinatario.nome : grupo.nome}</Text>
                    <View style={styles.lastMsgView}>
                        {ultimaEnviada && <Icon name={'check'} color='gray' />}
                        <Text style={styles.lastMsg}>{ultima}</Text>
                    </View>
                </View>
                <View style={styles.notificationTime}>
                    <Text style={styles.hora}>{horaUltima}</Text>
                    {qtdMsg != 0 &&
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
                        />}
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
        flex: 20,
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
        fontSize: 12,
        textAlign: 'right'
    }
})
