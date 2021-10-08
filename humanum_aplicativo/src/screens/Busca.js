import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Header'
import LivroItem from '../components/livroItem'
import UsuarioItem from '../components/usuarioItem'

const dimensions = Dimensions.get('window');
export default props => {
    const [busca, setBusca] = useState("")
    const [resultadosTextos, setResultadosTextos] = useState([])
    const [resultadosUsuarios, setResultadosUsuarios] = useState([])
    const [pesquisando, setPesquisando] = useState(false)

    buscarTextos = async (text) => {
        const res = await axios.get('http://192.168.15.7:3002/textos/nome/' + text)
        const dados = res.data
        // console.log(dados)
        setResultadosTextos(dados)
    }

    buscarUsuarios = async (text) => {
        const res = await axios.get('http://192.168.15.7:3002/usuariosnome/' + text)
        const dados = res.data
        // console.log(dados)
        setResultadosUsuarios(dados)
    }

    return (
        <View>
            <Header navigation={props.navigation} />
            <View style={styles.busca}>
                <TextInput onChangeText={(data) => {
                    setPesquisando(true)
                    setBusca(data)
                    if(data.length > 0){
                        buscarTextos(data)
                        buscarUsuarios(data)
                    }
                    // console.log(data)
                }} value={busca} placeholder={"Digite aqui sua busca..."} style={styles.input}/>
                <Icon name={"search"} size={20} style={styles.icon} />
            </View>
            <View>
                {pesquisando && <Text style={styles.texto}>TEXTOS</Text>}
                <FlatList data={resultadosTextos} horizontal={true} renderItem={({item}) => <LivroItem livro={item} navigation={props.navigation} />} />
                {pesquisando && <Text style={styles.texto}>USUÁRIOS</Text>}
                <FlatList data={resultadosUsuarios} horizontal={true} renderItem={({item}) => <UsuarioItem usuario={item} navigation={props.navigation} />} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    busca: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: dimensions.width,
        borderWidth: 1,
        borderRadius: 10,
    },
    icon: {
        color: '#000',
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20
    }
})