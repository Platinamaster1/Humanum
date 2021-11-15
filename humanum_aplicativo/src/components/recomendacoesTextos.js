import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import LivroItem from './livroItem';
import commonStyles from '../commonStyles'
import ipconfig from '../ipconfig'

export default props => {
    const [nomeCategoria, setNomeCategoria] = useState("Categoria")
    getCategoria = async (id) => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/categorias/' + id)
        const dado = res.data
        setNomeCategoria(dado[0]["categoria"])
    }
    linhaTextos = (data) => {
        linha = []
        getCategoria(data[0]["categoria"])
        data.forEach(element => {
            linha.push(
                <LivroItem key={element["id"]} livro={element} navigation={props.navigation} />
            )
        });
        return linha
    }
    return (
        <View>
            <Text style={styles.nome}>{nomeCategoria}</Text>
            <ScrollView style={styles.container} horizontal={true}>
                {props.genero ? linhaTextos(props.genero) : null}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flexDirection: "row"
    },
    nome: {
        fontFamily: 'commonStyles.fontFamily2',
        marginLeft: 12,
        fontSize: 18
    }
})