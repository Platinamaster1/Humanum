import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import ipconfig from '../ipconfig'

export default props => {
    const { comentario, ehTrecho } = props
    const [com, setCom] = useState([])
    const [upvotes, setUpvotes] = useState(0)
    const [downvotes, setDownvotes] = useState(0)
    const [deuUpvote, setDeuUptove] = useState(false)
   
    upvote = async (votes, func, jaDeu) => {
        console.log('antes')
        console.log(votes)
        console.log('depois')
        console.log(com)
        const dados = {
            id: votes.id,
            upvotes: !jaDeu? votes.upvotes + 1: votes.upvotes,
            downvotes: votes.downvotes
        }
        if (ehTrecho)
            var response = await axios.put('http://' + ipconfig.ip + ':3002/comentarios/trecho', dados)
        else
            var response = await axios.put('http://' + ipconfig.ip + ':3002/comentarios/texto', dados)
        // setUpvotes(upvotes + 1)
        func(upvotes + 1)
    }

    buscarUsuario = async () => {
        const url = 'http://' + ipconfig.ip + ':3002/usuarios/id/22'
        console.log(url)
        const res = await axios.get(url)
        const dados = res.data
        setUsuario(dados[0].nome)
    }
    
    useEffect(() => {
        console.log('SAAAAAAAAAAAALVEEEEEEEEEEEEEEEE')
        setCom(comentario)
        setUpvotes(!deuUpvote? com.upvotes: com.upvotes + 1)
        setDownvotes(com.downvotes)
    })

    checarUpvote = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        if(ehTrecho){
            const dados = {

            }
            var response = await axios.get('http://' + ipconfig.ip + ':3002/upvote/trecho')
        }
    }

    return (
        <View>
            <Text style={styles.texto}>{com.nome}</Text>
            <Text style={styles.texto}>{com.conteudo}</Text>
            <View style={styles.votes}>
                <TouchableOpacity onPress={() => {
                    mudarUpvote = (val) => {
                        setUpvotes(val)
                    }
                    setDeuUptove(!deuUpvote)
                    upvote(com, mudarUpvote, deuUpvote)
                }}>
                    <Icon name={"arrow-circle-o-up"} size={20} style={!deuUpvote? styles.iconN: styles.iconS} />
                </TouchableOpacity>
                <Text style={styles.texto}>{upvotes}</Text>
                <TouchableOpacity>
                    <Icon name={"arrow-circle-o-down"} size={20} style={styles.iconN} />
                </TouchableOpacity>
                <Text style={styles.texto}>{downvotes}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconN: {
        color: '#a90a0a'
    },
    iconS: {
        color: '#3da859'
    },
    votes: {
        flexDirection: 'row',
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20
    }
})