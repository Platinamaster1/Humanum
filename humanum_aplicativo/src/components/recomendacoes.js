import React, {useEffect, useState} from 'react'
import { Component } from 'react';
import { Text, View } from 'react-native';
import axios from 'react-native-axios'
import ipconfig from '../ipconfig'

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default props => {
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

    var exibicao = (<Text>a</Text>)
    var obras
    const setDados = (dados) => {
        obras = dados
        console.log(obras)
        for(var i = 0; i < obras.length; i++){
            exibicao += (<Text>{obras[i]}</Text>)
        }
    }

    const search = (genero, set) => {
        buscar(genero, set)
        //console.log(obras)
        // var url = 'http://192.168.15.7:3002/textos/categoria/' + props.genero
        // const response = await axios.get(url);
        // var textos = response.data
        // console.log(textos)
        //setData(textos)
    }

    return (
        <View>
            <Text>teste: {props.genero? search(props.genero, setDados): console.log("b")}</Text>
            <View>{obras? obras: console.log(obras)}</View>
        </View>
    )
}

async function buscar(genero, set) {
    // try{
        var url = 'http://' + ipconfig.ip + ':3002/textos/categoria/' + genero
        const response = await axios.get(url);
        var textos = response.data
        set(textos)
        //console.log(textos)
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