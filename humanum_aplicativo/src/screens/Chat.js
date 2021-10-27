import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipconfig from '../ipconfig'
import commonStyles from '../commonStyles';

export default props => {
    const [mensagens, setMensagens] = useState([])
    const [mensagem, setMensagem] = useState('')
    // const [idUsuario, setIdUsuario] = useState(0)
    const { ehDM, destinatario, idUsuario, chat } = props.route.params

    useEffect(() => {
        buscarMensagens()
    })

    async function buscarMensagens() {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/dm/' + chat.id)
        const dados = res.data
        setMensagens(dados)
    }

    enviarDM = async () => {
        const dados = {
            iddm: chat.id,
            texto: mensagem,
            data: new Date(),
            idusuarioremetente: idUsuario,
            idusuariodestinatario: destinatario.id
        }
        const res = await axios.post('http://' + ipconfig.ip + ':3002/mensagens/dm', dados)
    }

    // useState(async () => {
    //     const id = await AsyncStorage.getItem('idLogado')
    //     setIdUsuario(id)
    // })

    return (
        <View style={styles.container}>
            <View style={styles.horizontal}>
                <TouchableOpacity style={[styles.center, styles.btnvoltar]} onPress={() => props.navigation.pop()}>
                    <Icon name='arrow-left' size={20} />
                </TouchableOpacity>
                {destinatario.foto ?
                    <Image source={{ uri: destinatario.foto }} style={[styles.foto, styles.center]} /> :
                    <Image source={{ uri: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' }} style={styles.foto} />}
                <Text style={[styles.center, styles.titulo]}>{ehDM ? destinatario.nome : null}</Text>
            </View>
            <FlatList data={mensagens} renderItem={({ item }) => {
                if (idUsuario != item.idusuariodestinatario)
                    return (<Text style={styles.remetente}>{item.texto + " (" + item.data + ") "}</Text>)
                else
                    return (<Text style={styles.destinatario}>{item.texto + " (" + item.data + ") "}</Text>)
            }} />
            <View style={styles.horizontalEmbaixo}>
                <TextInput value={mensagem} onChangeText={(msg) => setMensagem(msg)} style={styles.txtmsg} placeholder={'Mensagem'} />
                <TouchableOpacity style={styles.btnenviarDM} onPress={enviarDM}>
                    <Icon color={'#fddddd'} name='arrow-right' size={25} />
                </TouchableOpacity>
            </View>
            {/* <TextInput /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    btnenviarDM: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderColor: 'black',
        // borderWidth: 3,
        borderRadius: 100,
        marginRight: 15,
        marginBottom: 10
    },
    horizontalEmbaixo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtmsg: {
        width: Dimensions.get('window').width * (6 / 8),
        backgroundColor: '#fddddd',
        height: 40,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 20,
        marginLeft: 10,
        marginBottom: 10
    },
    btnvoltar: {
        marginLeft: 5
    },
    titulo: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 5
    },
    center: {
        justifyContent: 'center'
    },
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
        paddingBottom: 5,
        flexDirection: 'row'
    },
    foto: {
        borderRadius: 100,
        height: 50,
        width: 50,
        marginLeft: 5
    }
})