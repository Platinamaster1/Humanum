import React, {useEffect, useState} from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import LivroItem from './livroItem';

export default props => {
    linhaTextos = (data) => {
        // console.log(data)
        linha = []
        data.forEach(element => {
            // console.log(element)
            linha.push(
                <LivroItem key={element["id"]} livro={element}/>
            )
        });
        // console.log(linha)
        return linha
    }
    return(
        <ScrollView style={styles.container} horizontal={true}>
            {/* <Text>jooj {console.log(props.genero)}</Text> */}
            {/* <Text>{props.genero? props.genero[0]["id"]: console.log("ainda n recebi chefe")}</Text> */}
            {props.genero? linhaTextos(props.genero): console.log("ainda n recebi chefe")}
            <Text>teste</Text>
            <Text>teste</Text>
            <Text>teste</Text>
            <Text>teste</Text>
            {/* <LivroItem/> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: "#dbdbdb",
        flexDirection: "row"
    }
})