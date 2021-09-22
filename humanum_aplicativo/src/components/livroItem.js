import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'react-native-axios'

export default props => {
    return (
        <TouchableOpacity 
            onPress={() => {
                const texto = props.livro
                // console.log(texto)
                props.navigation.navigate('Texto', {texto: texto})
                // console.log(props.livro)
            }}>
            <View style={styles.container}>
                {/* <Text>teste</Text> */}
                {/* {console.log(props.livro)} */}
                {props.livro["capa"] ?
                    (<Image style={styles.livro} source={{ uri: props.livro["capa"] }} />) :
                    (<Text>{props.livro["nome"]}</Text>)}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        // backgroundColor: "#FF0000",
        height: 180,
        width: 110
    },
    livro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
})