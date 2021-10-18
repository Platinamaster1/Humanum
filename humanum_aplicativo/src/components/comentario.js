import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'


export default props => {
    const { comentario, ehTrecho } = props
    const [upvotes, setUpvotes] = useState(comentario.upvotes)
    const [downvotes, setDownvotes] = useState(comentario.downvotes)
    const [usuario, setUsuario] = useState("")

    // console.log(props.jooj + ": upvotes - " + upvotes + " , downvotes - " + downvotes + " Finale: " + comentario)


    upvote = async (votes) => {
        const dados = {
            id: votes.id,
            upvotes: votes.upvotes + 1,
            downvotes: votes.downvotes
        }
        if (ehTrecho)
            var response = await axios.put('http://192.168.15.7:3002/comentarios/trecho', dados)
        else
            var response = await axios.put('http://192.168.15.7:3002/comentarios/texto', dados)
        setUpvotes(upvotes + 1)
        // console.log("IRINEU: " + upvotes)
    }

    buscarUsuario = async () => {
        const url = 'http://192.168.15.7:3002/usuarios/id/22'
        console.log(url)
        // const res = await axios.get('http://192.168.15.7:3002/usuarios/id/' + comentario.idusuario)
        const res = await axios.get(url)
        const dados = res.data
        setUsuario(dados[0].nome)
        // axios.get('http://192.168.15.7:3002/usuarios/id/22')
        // .then((res) => {
        //     const dados = res.data
        //     console.log("aaaaaaa " + dados)
        // })
        // .catch((error) => {
        //     console.log("erro -> " + error)
        // })
    }

    // buscarUsuario()

    return (
        <View>
            <Text style={styles.texto}>{comentario.nome}</Text>
            <Text style={styles.texto}>{comentario.conteudo}</Text>
            <View style={styles.votes}>
                <TouchableOpacity onPress={() => {
                    upvote(comentario)
                    // console.log(props.jooj + " | " + upvotes)
                }}>
                    <Icon name={"arrow-circle-o-up"} size={20} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.texto}>{upvotes}</Text>
                <TouchableOpacity>
                    <Icon name={"arrow-circle-o-down"} size={20} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.texto}>{downvotes}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        color: '#a90a0a'
    },
    votes: {
        flexDirection: 'row',
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20
    }
})