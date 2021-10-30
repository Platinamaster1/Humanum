import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Header'
import LivroItem from '../components/livroItem'
import UsuarioItem from '../components/usuarioItem'
import ipconfig from '../ipconfig'

const dimensions = Dimensions.get('window');
export default props => {
    const [busca, setBusca] = useState("")
    const [resultadosTextos, setResultadosTextos] = useState([])
    const [resultadosUsuarios, setResultadosUsuarios] = useState([])
    const [textosFundo, setTextosFundo] = useState([])
    const [pesquisando, setPesquisando] = useState(false)

    // useEffect(() => {
    //     textosIniciais()
    // })
    useFocusEffect(
        React.useCallback(() => {
            textosIniciais()
        }, [])
    )

    textosIniciais = async () => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/textos/')
        const dados = res.data
        // console.log(dados)
        setTextosFundo(dados)
    }

    buscarTextos = async (text) => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/textos/nome/' + text)
        const dados = res.data
        // console.log(dados)
        setResultadosTextos(dados)
    }

    buscarUsuarios = async (text) => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/usuariosnome/' + text)
        const dados = res.data
        // console.log(dados)
        setResultadosUsuarios(dados)
    }

    return (
        <View style={styles.container}>
            <View style={styles.busca}>
                <Icon name={"search"} size={20} style={styles.icon} />
                <TextInput onChangeText={(data) => {
                    if(data == '')
                        setPesquisando(false)
                    else
                        setPesquisando(true)

                    setBusca(data)
                    if(data.length > 0){
                        buscarTextos(data)
                        buscarUsuarios(data)
                    }
                }} value={busca} placeholder={"Pesquisar"} placeholderTextColor='#000' style={styles.input}/>
            </View>
            <View>
                {!pesquisando && <FlatList data={textosFundo} 
                    renderItem={({item}) => <LivroItem key={item.id} livro={item} navigation={props.navigation} />} 
                    numColumns={Math.floor(dimensions.width/120)}
                    />}
                {pesquisando && <Text style={styles.texto}>TEXTOS</Text>}
                {pesquisando && <FlatList data={resultadosTextos} horizontal={true} renderItem={({item}) => <LivroItem key={item.id} livro={item} navigation={props.navigation} />} />}
                {pesquisando && <Text style={styles.texto}>USUÁRIOS</Text>}
                {pesquisando && <FlatList data={resultadosUsuarios} horizontal={true} renderItem={({item}) => <UsuarioItem key={item.id} usuario={item} navigation={props.navigation} />} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        marginLeft: 10,
    },
    busca: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
        borderWidth: 2,
        borderRadius: 20,
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: 18,
    },
    icon: {
        color: '#000',
        marginRight: 20,
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20,
        marginTop: 10,
        marginBottom: 5,
    }
})