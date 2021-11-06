import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, KeyboardAvoidingView, Image, StatusBar } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipconfig from '../ipconfig'
import commonStyles from '../commonStyles';
import { useFocusEffect } from '@react-navigation/native'

const dimensions = Dimensions.get('window')
export default props => {
    const [mensagens, setMensagens] = useState([])
    const [mensagem, setMensagem] = useState('')
    // const [idUsuario, setIdUsuario] = useState(0)
    const { ehDM, destinatario, idUsuario, chat } = props.route.params
    const [primeiro, setPrimeiro] = useState(0)

    useEffect(() => {
        buscarMensagens()
    })

    async function buscarMensagens() {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/dm/' + chat.id)
        const dados = res.data
        setMensagens(dados)
        mensagens.forEach(async (mensagem) => {
            if(!mensagem.visualizado && mensagem.idusuarioremetente != idUsuario) {
                console.log(mensagem.texto)
                const info = {
                    id: mensagem.id,
                    visualizado: true
                }
                const res = await axios.put('http://' + ipconfig.ip + ':3002/mensagens/dm', info)
            }
        });
        if(primeiro == 0)
            navegar.scrollToEnd({ animated: true, duration: 3 });
        setPrimeiro(1)
    }

    enviarDM = async () => {
        if(mensagem != '') {
            const dados = {
                iddm: chat.id,
                texto: mensagem,
                data: new Date(),
                idusuarioremetente: idUsuario,
                idusuariodestinatario: destinatario.id,
                visualizado: false
            }
            const res = await axios.post('http://' + ipconfig.ip + ':3002/mensagens/dm', dados)
            setMensagem('')
            setPrimeiro(0)
        }
    }

    formatarData = (d) => {
        var date = new Date(d)
        var data = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':'
        var min = date.getMinutes()
        
        if(min < 10)
            data = data + '0' + min
        else 
            data = data + min

        return data
    }

    // useState(async () => {
    //     const id = await AsyncStorage.getItem('idLogado')
    //     setIdUsuario(id)
    // })

    return (
        <>
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.icone} onPress={() => props.navigation.pop()}>
                    <Icon name='arrow-left' size={25} />
                {destinatario.foto ?
                    <Image source={{ uri: destinatario.foto }} style={styles.foto} /> :
                    <Image source={{ uri: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' }} style={styles.foto} />}
                </TouchableOpacity> 
                <Text style={[styles.center, styles.titulo]}>{ehDM ? destinatario.nome : null}</Text>
            </View>
            <View style={styles.mensagens}>
                <FlatList data={mensagens} renderItem={({ item }) => {
                    if (idUsuario != item.idusuariodestinatario)
                        return (
                            <View style={styles.remetente}>
                                <Text style={styles.msg}>{item.texto}</Text>
                                <Text style={styles.txtDataR}>{formatarData(item.data)}</Text>
                            </View>
                        )
                    else
                        return (
                            <View style={styles.destinatario}>
                                <Text style={styles.msg}>{item.texto}</Text>
                                <Text style={styles.txtDataD}>{formatarData(item.data)}</Text>
                            </View>
                        )
                }} ref={ref => { navegar = ref }} />
            </View>
            <View style={styles.enviarMsg}>
                <TextInput value={mensagem} onChangeText={(msg) => setMensagem(msg)} style={styles.txtmsg} placeholder={'Mensagem'} placeholderTextColor='gray' multiline={true} />
                <TouchableOpacity style={styles.btnenviarDM} onPress={enviarDM}>
                    <Icon color={'#fddddd'} name='arrow-right' size={25} />
                </TouchableOpacity>
            </View>
            {/* <TextInput /> */}
        </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#fdf7f0',
        flex: 1
    },
    mensagens: {
        flex: 80,
    },
    enviarMsg: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    cabecalho: {
        flex: 10,
        backgroundColor: '#fdf0f0',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    icone: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
    },
    txtDataD: {
        textAlign: 'right',
        fontSize: 11,
        color: 'gray'
    },
    txtDataR: {
        textAlign: 'right',
        fontSize: 11,
        color: 'gray'
    },
    btnenviarDM: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderColor: 'black',
        borderRadius: 100,
        marginRight: 15,
        marginBottom: 10,
        marginTop: 10
    },
    txtmsg: {
        width: dimensions.width * (6 / 7.5),
        fontFamily: commonStyles.fontFamily1,
        backgroundColor: '#fddddd',
        lineHeight: 15,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        padding: 10,
        paddingLeft: 15,
        fontSize: 15,
        color: 'black'
    },
    titulo: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 22,
        alignSelf: 'center',
        marginLeft: 10
    },
    center: {
        justifyContent: 'center'
    },
    remetente: {
        minWidth: dimensions.width / 2.5,
        borderColor: 'black',
        alignSelf: 'flex-end',
        backgroundColor: '#fddddd',
        marginRight: 10,
        marginTop: 4,

        padding: 5,
        paddingLeft: 12,
        paddingRight: 9,

        borderRadius: 10,
        borderWidth: 1,
    },
    destinatario: {
        minWidth: dimensions.width / 2.5,
        marginLeft: 10,
        marginTop: 4,
        padding: 5,
        paddingLeft: 12,
        paddingRight: 9,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignSelf: 'flex-start'
    },
    foto: {
        borderRadius: 100,
        height: 50,
        width: 50,
        marginLeft: 10
    },
    msg: {
        fontFamily: commonStyles.fontFamily1,
        fontSize: 14,
    }
})