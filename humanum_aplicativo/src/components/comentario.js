import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions } from 'react-native';
import axios from 'react-native-axios'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'


export default props => {
    const { comentario } = props
    const [upvotes, setUpvotes] = useState(comentario.upvotes)
    const [downvotes, setDownvotes] = useState(comentario.downvotes)

    console.log(props.jooj + ": upvotes - " + upvotes + " , downvotes - " + downvotes + " Finale: " + comentario)


    upvote = async (votes) => {
        const dados = {
            id: votes.id,
            upvotes: votes.upvotes + 1,
            downvotes: votes.downvotes
        }
        const response = await axios.put('http://192.168.15.7:3002/comentarios/trecho', dados)
        setUpvotes(upvotes + 1)
        console.log("IRINEU: " + upvotes)
    }

    return (
        <View>
            <Text style={styles.texto}>{comentario.conteudo}</Text>
            <View style={styles.votes}>
                <TouchableOpacity onPress={() => {
                    upvote(comentario)
                    console.log(props.jooj + " | " + upvotes)
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