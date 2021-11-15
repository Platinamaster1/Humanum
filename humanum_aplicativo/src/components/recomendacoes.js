import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View } from 'react-native';
import axios from 'react-native-axios'
import ipconfig from '../ipconfig'

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default props => {

    var exibicao = (<Text>a</Text>)
    var obras
    const setDados = (dados) => {
        obras = dados
        for (var i = 0; i < obras.length; i++) {
            exibicao += (<Text>{obras[i]}</Text>)
        }
    }

    const search = (genero, set) => {
        buscar(genero, set)
    }

    return (
        <View>
            <Text>teste: {props.genero ? search(props.genero, setDados) : null}</Text>
            <View>{obras ? obras : null}</View>
        </View>
    )
}

async function buscar(genero, set) {
    var url = 'http://' + ipconfig.ip + ':3002/textos/categoria/' + genero
    const response = await axios.get(url);
    var textos = response.data
    set(textos)
}