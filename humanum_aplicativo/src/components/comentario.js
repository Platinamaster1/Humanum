import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import ipconfig from '../ipconfig'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {
    const { comentario, ehTrecho } = props
    const [com, setCom] = useState([])
    const [upvotes, setUpvotes] = useState(0)
    const [downvotes, setDownvotes] = useState(0)
    const [deuUpvote, setDeuUpvote] = useState(false)
    const [deuDownvote, setDeuDownvote] = useState(false)

    upvote = async (votes, func, jaDeu) => {
        const dados = {
            id: votes.id,
            upvotes: !jaDeu ? votes.upvotes + 1 : votes.upvotes,
            downvotes: votes.downvotes
        }
        if (ehTrecho) {
            var response = await axios.put('http://' + ipconfig.ip + ':3002/comentarios/trecho', dados)
            const dadosuser = await AsyncStorage.getItem('dadosUsuario')
            const usuario = JSON.parse(dadosuser)[0]
            const idusuario = usuario.id
            const dadosUpvotes = {
                idcomentariotrecho: votes.id,
                idusuario: idusuario
            }
            var response = await axios.post('http://' + ipconfig.ip + ':3002/upvote/trecho', dadosUpvotes)
            if(jaDeu)
                var response2 = await axios.delete('http://' + ipconfig.ip + ':3002/upvote/trecho/' + votes.id + '/' + idusuario)
        }
        else {
            var response = await axios.put('http://' + ipconfig.ip + ':3002/comentarios/texto', dados)
            const dadosuser = await AsyncStorage.getItem('dadosUsuario')
            const usuario = JSON.parse(dadosuser)[0]
            const idusuario = usuario.id
            const dadosUpvotes = {
                idcomentario: votes.id,
                idusuario: idusuario
            }
            var response = await axios.post('http://' + ipconfig.ip + ':3002/upvote/texto', dadosUpvotes)
            if(jaDeu)
                var response2 = await axios.delete('http://' + ipconfig.ip + ':3002/upvote/texto/' + votes.id + '/' + idusuario)
        }
        func(upvotes + 1, !jaDeu)
    }

    downvote = async (votes, func, jaDeu) => {
        const dados = {
            id: votes.id,
            upvotes: votes.upvotes,
            downvotes: !jaDeu ? votes.downvotes + 1 : votes.downvotes
        }
        if (ehTrecho) {
            var response = await axios.put('http://' + ipconfig.ip + ':3002/comentarios/trecho', dados)
            const dadosuser = await AsyncStorage.getItem('dadosUsuario')
            const usuario = JSON.parse(dadosuser)[0]
            const idusuario = usuario.id
            const dadosDownvotes = {
                idcomentariotrecho: votes.id,
                idusuario: idusuario
            }
            var response = await axios.post('http://' + ipconfig.ip + ':3002/downvote/trecho', dadosDownvotes)
            if(jaDeu)
                var response2 = await axios.delete('http://' + ipconfig.ip + ':3002/downvote/trecho/' + votes.id + '/' + idusuario)
        }
        else {
            var response = await axios.put('http://' + ipconfig.ip + ':3002/comentarios/texto', dados)
            const dadosuser = await AsyncStorage.getItem('dadosUsuario')
            const usuario = JSON.parse(dadosuser)[0]
            const idusuario = usuario.id
            const dadosDownvotes = {
                idcomentario: votes.id,
                idusuario: idusuario
            }
            var response = await axios.post('http://' + ipconfig.ip + ':3002/downvote/texto', dadosDownvotes)
            if(jaDeu)
                var response2 = await axios.delete('http://' + ipconfig.ip + ':3002/downvote/texto/' + votes.id + '/' + idusuario)
        }
        func(downvotes + 1, !jaDeu)
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
        setUpvotes(!deuUpvote? com.upvotes : com.upvotes + 1)
        setDownvotes(!deuDownvote? com.downvotes : com.downvotes + 1)
        checarUpvote(comentario.id, setDeuUpvote)
        checarDownvote(comentario.id, setDeuDownvote)
    })

    checarUpvote = async (id, func) => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        if (id > 0) {
            if (ehTrecho) {
                var response = await axios.get('http://' + ipconfig.ip + ':3002/upvote/trecho/' + id + '/' + idusuario)
                const data = response.data
                if (data.length > 0) {
                    func(true)
                    console.log('oioi')
                }
            }
            else {
                var response = await axios.get('http://' + ipconfig.ip + ':3002/upvote/texto/' + id + '/' + idusuario)
                const data = response.data
                if (data.length > 0) {
                    func(true)
                    console.log('oioi')
                }
            }
        }
    }

    checarDownvote = async (id, func) => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        if (id > 0) {
            if (ehTrecho) {
                var response = await axios.get('http://' + ipconfig.ip + ':3002/downvote/trecho/' + id + '/' + idusuario)
                const data = response.data
                if (data.length > 0) {
                    func(true)
                    console.log('oioi')
                }
            }
            else {
                var response = await axios.get('http://' + ipconfig.ip + ':3002/downvote/texto/' + id + '/' + idusuario)
                const data = response.data
                if (data.length > 0) {
                    func(true)
                    console.log('oioi')
                }
            }
        }
    }

    return (
        <View>
            <Text style={styles.texto}>{com.nome}</Text>
            <Text style={styles.texto}>{com.conteudo}</Text>
            <View style={styles.votes}>
                <TouchableOpacity onPress={() => {
                    mudarUpvote = (val, val2) => {
                        setUpvotes(val)
                        setDeuUpvote(val2)
                    }
                    upvote(com, mudarUpvote, deuUpvote)
                }}>
                    <Icon name={"arrow-circle-o-up"} size={20} style={!deuUpvote ? styles.iconN : styles.iconS} />
                </TouchableOpacity>
                <Text style={styles.texto}>{upvotes}</Text>
                <TouchableOpacity onPress={() => {
                    mudarDownvote = (val, val2) => {
                        setDownvotes(val)
                        setDeuDownvote(val2)
                    }
                    downvote(com, mudarDownvote, deuDownvote)
                }}>
                    <Icon name={"arrow-circle-o-down"} size={20} style={!deuDownvote ? styles.iconN : styles.iconS} />
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