import React, {useEffect, useState} from 'react'
import { Component } from 'react';
import { Text } from 'react-native';
import axios from 'react-native-axios'

export default props => {
    const [data, setData] = useState([])
    // const getTextos = async() => {
    //     console.log('aaaaaaaaaaaaa' + props.genero)
    //     var url = 'http://192.168.15.7:3002/textos/categoria/' + props.genero
    //     const response = await axios.get(url);
    //     var textos = response.data
    //     setData(textos)
    // }
    // useEffect(() => {
    //     getTextos()
    // }, [])
    // let textos = buscar(props.genero)
    // console.log(textos)
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.genero != undefined) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    // }

    var jooj
    const setJooj = (dados) => {
        jooj = dados
        console.log(jooj)
    }

    const teste = (genero, set) => {
        buscar(genero, set)
        // var url = 'http://192.168.15.7:3002/textos/categoria/' + props.genero
        // const response = await axios.get(url);
        // var textos = response.data
        // console.log(textos)
        //setData(textos)
    }

    return (
        <Text>teste: {props.genero? teste(props.genero, setJooj): console.log("b")}</Text>
    )
}

async function buscar(genero, set) {
    // try{
        var url = 'http://192.168.15.7:3002/textos/categoria/' + genero
        const response = await axios.get(url);
        var textos = response.data
        set(textos)
        console.log(textos)
        // var textosRandom = []
        // var i
        // textos.length > 1 ? i = Math.floor(textos.length / 2) : i = 1
        // while(i--){
        //     var j = Math.floor(Math.random() * textos.length)
        //     textosRandom.push(textos[j])
        //     textosRandom.splice(j, 1)
        // }
        //return textos
    // }
    // catch(error){
    //     console.error(error)
    // }
}