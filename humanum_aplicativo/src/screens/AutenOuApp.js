import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
    Image
} from 'react-native'
import { CommonActions } from '@react-navigation/native';

import axios from 'axios'
import {MotiImage, MotiText} from 'moti'
import AsyncStorage from '@react-native-async-storage/async-storage'

import commonStyles from '../commonStyles'
import ipconfig from '../ipconfig'
import { transform } from '@babel/core';

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const dadosUsuarioLogado = await AsyncStorage.getItem('dadosUsuario')
        buscarCategoriasETextos()
        setTimeout(() => {

            let dadosUsuario = null

            try {
                dadosUsuario = JSON.parse(dadosUsuarioLogado)
                
            } catch (e) {
                // userData está inválido
            }
            if (dadosUsuario /*&& dadosUsuario.token*/) {
                //axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Home',
                                params: dadosUsuario,
                            },
                        ],
                    })
                );
            } else {
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'Autenticacao',
                                params: []
                            },
                        ],
                    })
                )
            }
        }, 1500)
    }

    render() {
        return (
            <View style={st.container}>
                <MotiText 
                from={{
                    opacity: 0,
                    transform: [{scale: 0}, {rotate: '00deg'}]
                }}
                animate={{
                    opacity: 1,
                    transform: [{scale: 1}, {rotate: '360deg'}]
                }}
                transition={{
                    type: 'timing',
                    duration: 2000
                }}
                style={st.txt}>HUMANUM</MotiText>
                <MotiImage 
                from={{
                    opacity: 0,
                    transform: [{scale: 0}, {translateY: 80}]
                }}
                animate={{
                    opacity: 1,
                    transform: [{scale: 1}, {translateY: -80}]
                }}
                transition={{
                    type: 'timing',
                    delay: 500,
                    duration: 1500
                }}
                style={st.img} source={require('../../assets/splashImage.png')} resizeMode='stretch'/>
            </View>
        )
    }
}

async function buscarCategoriasETextos() {
    try {
        var url = 'http://' + ipconfig.ip + ':3002/categorias'
        const response = await axios.get(url);
        var categorias = response.data
        var catRandom = []
        var i = 4  // mudar pra 5 depois
        while (i--) {
            var j = Math.floor(Math.random() * categorias.length)
            catRandom.push(categorias[j])
            categorias.splice(j, 1)
        }
        var ret = []
        const promArr = catRandom.map(async (element) => {
            const url = 'http://' + ipconfig.ip + ':3002/textos/categoria/' + element["id"];
            const response = await axios.get(url);
            const dado = response.data
            return dado;
        });
        const res = await Promise.all(promArr);

        await AsyncStorage.setItem('livrosRecomendados', JSON.stringify(res))
        return res;
    }
    catch (error) {
        console.error(error)
    }
}

const st = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEF2F2'
    },
    txt: {
        fontFamily: commonStyles.fontFamily1,
        fontSize: 50,
        marginBottom: 100,
        color: '#A90A0A'
    },
})