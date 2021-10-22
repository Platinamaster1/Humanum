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
import AsyncStorage from '@react-native-async-storage/async-storage'

import commonStyles from '../commonStyles'
import ipconfig from '../ipconfig'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const dadosUsuarioLogado = await AsyncStorage.getItem('dadosUsuario')
        buscarCategoriasETextos()

        let dadosUsuario = null

        try {
            console.log("Data: " + dadosUsuarioLogado)
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
        
    }

    render() {
        return (
            <View style={st.container}>
                <ActivityIndicator/>
                <Text style={st.txt}>HUMANUM</Text>
                <Image style={st.img} source={require('../../assets/splashImage.png')} resizeMode='stretch'/>
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
        // console.log(ret)
        // return ret
        // return catRandom
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