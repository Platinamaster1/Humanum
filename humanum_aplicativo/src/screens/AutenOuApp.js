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

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const dadosUsuarioLogado = await AsyncStorage.getItem('dadosUsuario')
        
        let dadosUsuario = null

        try {
            console.log("Data: " + dadosUsuarioLogado)
            dadosUsuario = JSON.parse(dadosUsuarioLogado)
            
        } catch (e) {
            // userData está inválido
        }
        if (dadosUsuario /*&& dadosUsuario.token*/) {
            //axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            console.log("AAAAAAAAAAA")
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
            console.log("BBBBBBBBBBBB")
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