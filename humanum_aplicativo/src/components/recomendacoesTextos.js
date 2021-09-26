import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import LivroItem from './livroItem';
import commonStyles from '../commonStyles'

export default props => {
    const [nomeCategoria, setNomeCategoria] = useState("Categoria")
    getCategoria = async (id) => {
        const res = await axios.get('http://192.168.15.7:3002/categorias/' + id)
        const dado = res.data
        setNomeCategoria(dado[0]["categoria"])
    }
    linhaTextos = (data) => {
        // console.log(data)
        linha = []
        getCategoria(data[0]["categoria"])
        data.forEach(element => {
            // console.log(element)
            // linha.push(
            //     <Text>GENERO: {genero}</Text>
            // )
            linha.push(
                <LivroItem key={element["id"]} livro={element} navigation={props.navigation} />
            )
        });
        // console.log(linha)
        return linha
    }
    return (
        <View>
            <Text style={styles.nome}>{nomeCategoria}</Text>
            <ScrollView style={styles.container} horizontal={true}>
                {/* <Text>jooj {console.log(props.genero)}</Text> */}
                {/* <Text>{props.genero? props.genero[0]["id"]: console.log("ainda n recebi chefe")}</Text> */}
                {props.genero ? linhaTextos(props.genero) : console.log("ainda n recebi chefe")}
                {/* <LivroItem/> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        // backgroundColor: "#dbdbdb",
        flexDirection: "row"
    },
    nome: {
        fontFamily: 'commonStyles.fontFamily2',
        marginLeft: 12,
        fontSize: 18
    }
})