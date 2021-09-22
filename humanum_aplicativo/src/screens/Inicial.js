import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import commonStyles from '../commonStyles'
import Recomendacoes from '../components/recomendacoesTextos'
import axios from 'react-native-axios'

// import ListaLivros from '../components/ListaLivros'

export default class Inicial extends Component {
    state = {
        data: [],
        dataTextos: []
    }

    async componentDidMount() {
        //buscarCategorias().then(result => categorias = result)
        //categorias = await esperarCategorias()
        buscarCategoriasETextos().then((data) => {
            this.setState({data})
            // console.log(this.state.data)
        })
    }

    render() {
        //console.log(categorias)
        return (
            // <View style={st.container}>
                <ScrollView style={st.container}>
                    {/* <Text style={st.texto}>teste</Text> */}
                    <Recomendacoes genero={this.state.data[0]} navigation={this.props.navigation}/>
                    {/* {console.log(this.state.data)} */}
                    <Recomendacoes genero={this.state.data[1]} navigation={this.props.navigation}/>
                    <Recomendacoes genero={this.state.data[2]} navigation={this.props.navigation}/>
                    <Recomendacoes genero={this.state.data[3]} navigation={this.props.navigation}/>
                    <Recomendacoes genero={this.state.data[4]} navigation={this.props.navigation}/>
                    {/* <Text>{this.state.data}</Text> */}
                </ScrollView>
            // </View>
        )
    }
}

async function buscarCategorias(){
    try{
        var url = 'http://192.168.15.7:3002/categorias'
        const response = await axios.get(url);
        var categorias = response.data
        var catRandom = []
        var i = 5
        while(i--){
            var j = Math.floor(Math.random() * categorias.length)
            catRandom.push(categorias[j]["id"])
            categorias.splice(j, 1)
        }
        return catRandom
    }
    catch(error){
        console.error(error)
    }
}

async function buscarTextos(dados){
    try{
        var ret = []
        dados.forEach(async (element) => {
            var url = 'http://192.168.15.7:3002/textos/categoria/' + element
            const response = await axios.get(url);
            ret.push(response.data)
        });
        return ret
    }
    catch(error){
        console.error(error)
    }
}

async function buscarCategoriasETextos(){
    try{
        var url = 'http://192.168.15.7:3002/categorias'
        const response = await axios.get(url);
        var categorias = response.data
        var catRandom = []
        var i = 5
        while(i--){
            var j = Math.floor(Math.random() * categorias.length)
            catRandom.push(categorias[j])
            categorias.splice(j, 1)
        }
        var ret = []
        const promArr = catRandom.map(async (element) => {
            const url = 'http://192.168.15.7:3002/textos/categoria/' + element["id"];
            const response = await axios.get(url);
            const dado = response.data
            return dado;
        });
        const res = await Promise.all(promArr);
        return res;
        // console.log(ret)
        // return ret
        // return catRandom
    }
    catch(error){
        console.error(error)
    }
}

async function esperarCategorias(){
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