import React, {useEffect, useState} from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

export default props => {
    const {texto} = props.route.params
    var jaFoi = 1
    // console.log(texto)
    const[categoria, setCategoria] = useState("Categoria")
    const[autor, setAutor] = useState("Autor")
    getCategoria = async (id) => {
        const res = await axios.get('http://192.168.15.7:3002/categorias/'+ id)
        const dado = JSON.stringify(res.data);
        const teste = JSON.parse(dado);
        // console.log(teste[0].categoria)
        setCategoria(teste[0].categoria)
    }
    getAutor = async (id) => {
        const res = await axios.get('http://192.168.15.7:3002/autores/' + id)
        const dado = JSON.stringify(res.data);
        const teste = JSON.parse(dado);
        // console.log(teste[0].nome)
        setAutor(teste[0].nome)
    }
    fazerTudo = (data) => {
        console.log(data)
        getCategoria(data.categoria)
        getAutor(data.idautor)
        // console.log("olha os props aqui o -> " + props)
        return (<Text>salve</Text>)
    }
    return(
        <ScrollView>
            {/* {console.log("PARAMETROS -> " + props)} */}
            {/* {console.log(texto)} */}
            {fazerTudo(texto)}
            {/* {getCategoria(texto["categoria"])}
            {getAutor(texto["idautor"])} */}
            {/* <Text>salve</Text> */}
            <Text>{texto["nome"]} {"\n"}</Text>
            <Text>Autor: </Text><Text>{autor} {"\n"}</Text>
            <Text>Ano: </Text><Text>{texto["ano"]} {"\n"}</Text>
            <Text>Categoria: </Text><Text>{categoria + ", " + texto["generoassunto"]} {"\n"}</Text>
        </ScrollView>
    )
}