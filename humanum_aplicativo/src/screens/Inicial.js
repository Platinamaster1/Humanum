import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import commonStyles from '../commonStyles'
import Recomendacoes from '../components/recomendacoesTextos'
import axios from 'react-native-axios'
import Header from '../Header'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipconfig from '../ipconfig'

// import ListaLivros from '../components/ListaLivros'

export default class Inicial extends Component {
    state = {
        data: [],
        dataTextos: []
    }

    async componentDidMount() {
        let livrosRecomendados = JSON.parse(await AsyncStorage.getItem('livrosRecomendados'))
        this.setState({data: livrosRecomendados})
    }

    render() {
        return (
            <ScrollView style={st.container}>
                <Recomendacoes genero={this.state.data[0]} navigation={this.props.navigation} />
                <Recomendacoes genero={this.state.data[1]} navigation={this.props.navigation} />
                <Recomendacoes genero={this.state.data[2]} navigation={this.props.navigation} />
                <Recomendacoes genero={this.state.data[3]} navigation={this.props.navigation} />
            </ScrollView>
        )
    }
}

async function buscarCategorias() {
    try {
        var url = 'http://' + ipconfig.ip + ':3002/categorias'
        const response = await axios.get(url);
        var categorias = response.data
        var catRandom = []
        var i = 5
        while (i--) {
            var j = Math.floor(Math.random() * categorias.length)
            catRandom.push(categorias[j]["id"])
            categorias.splice(j, 1)
        }
        return catRandom
    }
    catch (error) {
        console.error(error)
    }
}

async function buscarTextos(dados) {
    try {
        var ret = []
        dados.forEach(async (element) => {
            var url = 'http://' + ipconfig.ip + ':3002/textos/categoria/' + element
            const response = await axios.get(url);
            ret.push(response.data)
        });
        return ret
    }
    catch (error) {
        console.error(error)
    }
}

async function esperarCategorias() {
    var ret = await buscarCategorias()
    return ret
}

const st = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    texto: {
        fontFamily: 'commonStyles.fontFamily2'
    }
})