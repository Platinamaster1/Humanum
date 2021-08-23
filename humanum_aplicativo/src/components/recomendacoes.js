import React from 'react'
import { Component } from 'react';
import { Text } from 'react-native';

export default class Recomendacoes extends Component{
    render() {
        const genero = this.props.genero
        return(
            <Text>genero: {genero}</Text>
        )
    }

    async buscar(genero) {
        
    }
}