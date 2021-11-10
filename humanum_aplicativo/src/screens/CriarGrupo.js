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
import CheckBox from '@react-native-community/checkbox';
import commonStyles from '../commonStyles';
import UsuarioItem from '../components/usuarioItem';

export default props => {
    const [privado, setPrivado] = useState(false)
    const [busca, setBusca] = useState('')
    const [usuariosEncontrados, setUsuariosEncontrados] = useState([])
    const [usuariosAdicionados, setUsuariosAdicionados] = useState([])
    const [num, setNum] = useState(0)

    buscarUsuarios = async (val) => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const res = await axios.get('http://' + ipconfig.ip + ':3002/usuariosnome/' + val)
        const dados = res.data
        const dados2 = dados.filter(item => item.id != idusuario)
        setUsuariosEncontrados(dados2)
    }

    adicionarUsuario = (usuario) => {
        var aux = usuariosAdicionados
        aux.push(usuario)
        // const aux = [...usuariosAdicionados, usuario]
        setUsuariosAdicionados(aux)
        // setBusca('')
        // var n = num
        // n++
        // setNum(n)
        // setUsuariosEncontrados([])
        console.log('aaa')
        console.log(usuariosAdicionados)
        console.log('bbb')
    }

    removerUsuario = (usuario) => {
        var aux = usuariosAdicionados
        var aux2 = aux.filter(item => item.id != usuario.id)
        setUsuariosAdicionados(aux2)
        console.log(usuariosAdicionados)
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.texto}>Nome do grupo:</Text>
                <TextInput placeholder="Nome" style={styles.txtNome} />
                <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                        disabled={false}
                        value={privado}
                        onValueChange={(val) => setPrivado(val)}
                    />
                    <Text style={styles.texto}>Privado</Text>
                </View>
                <Text style={styles.texto}>Integrantes:</Text>
                {/* <FlatList data={usuariosAdicionados} horizontal={true} renderItem={({item}) => <UsuarioItem key={item.id} usuario={item} navigation={props.navigation} remover={removerUsuario} />} /> */}
                {console.log(usuariosAdicionados)}
                {usuariosAdicionados.map(item => {
                    console.log('coe')
                    return (
                        <UsuarioItem key={item.id} usuario={item} navigation={props.navigation} remover={removerUsuario} />
                    )
                })}
                <View style={styles.txtPesquisar}>
                    <Icon name={"search"} size={20} style={styles.icon} />
                    <TextInput placeholder="Pesquisar" value={busca} onChangeText={(val) => {
                        setBusca(val)
                        if (val.length > 0)
                            buscarUsuarios(val)
                    }} />
                </View>
                <FlatList data={usuariosEncontrados} horizontal={true} renderItem={({item}) => <UsuarioItem key={item.id} usuario={item} navigation={props.navigation} add={adicionarUsuario} />} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    txtPesquisar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 5,
        width: Dimensions.get('window').width - 40
    },
    txtNome: {
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 5,
        width: Dimensions.get('window').width - 40
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20
    },
    container: {
        marginTop: 30,
        marginLeft: 20,
    }
})