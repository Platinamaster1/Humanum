import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import { useGoogleApi } from 'react-gapi'
import commonStyles from '../commonStyles'
import Comentario from './comentario'
import ipconfig from '../ipconfig'

export default props => {
    const [modalVisible, setModalVisible] = useState(false);
    const [comentario, setComentario] = useState("")
    const [temComentario, setTemComentario] = useState(false)
    const [comentarios, setComentarios] = useState([])

    salvarComentario = async () => {
        const dados = {
            idTexto: props.idTexto,
            conteudo: comentario,
            trecho: props.indice,
            upvotes: 0,
            downvotes: 0
        }
        const response = await axios.post('http://' + ipconfig.ip + ':3002/comentarios/trecho', dados)
        setComentario("")
    }

    getComentarios = async () => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/comentarios/trecho/' + props.idTexto + '/' + props.indice)
        const dados = res.data
        if (dados.length > 0)
            setTemComentario(true)
        else
            return
        var i =0
        dados.forEach(element => {
            if (comentarios.length < dados.length) {
                var aux = comentarios
                aux.push(<Comentario key={element.id} comentario={element} ehTrecho />)
                setComentarios(aux)
                i++
            }
        });
    }

    getComentarios()

    return (
        <TouchableOpacity onPress={() => {
            setModalVisible(true);
        }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centralizarModal}>
                    <View style={styles.modal}>
                        <ScrollView>
                            {comentarios}
                        </ScrollView>
                        <TextInput value={comentario} onChangeText={(texto) => setComentario(texto)} placeholder={"Seu comentário"}/>
                        <TouchableOpacity onPress={() => salvarComentario()} style={styles.fecharModal}>
                            <Text style={[styles.fecharModalTexto, styles.texto]}>ENVIAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false)
                            setComentarios([])
                        }} style={styles.fecharModal}>
                            <Text style={[styles.fecharModalTexto, styles.texto]}>FECHAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={temComentario? [styles.container, styles.backgroundComComentario]: [styles.container, styles.backgroundSemComentario]}>
                <Text style={styles.texto}>{props.conteudo}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    centralizarModal: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Dimensions.get('window').height * 2 / 7
    },
    modal: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    fecharModal: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'red',
        height: 25,
        width: 90
    },
    fecharModalTexto: {
        color: 'white'
    },
    container: {
        margin: 10,
        borderRadius: 5,
        padding: 4,
    },
    backgroundSemComentario: {
        backgroundColor: "#dedede",
    },
    backgroundComComentario: {
        backgroundColor: '#ffd4d4'
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 17
    }
})