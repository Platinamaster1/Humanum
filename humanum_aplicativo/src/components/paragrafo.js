import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, ToastAndroid } from 'react-native';
import axios from 'react-native-axios'
import { useGoogleApi } from 'react-gapi'
import commonStyles from '../commonStyles'
import Comentario from './comentario'
import ipconfig from '../ipconfig'
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {
    const [modalVisible, setModalVisible] = useState(false);
    const [comentario, setComentario] = useState("")
    const [temComentario, setTemComentario] = useState(false)
    const [comentarios, setComentarios] = useState([])

    const [modalDenuncia, setModalDenuncia] = useState(false)
    const [comentarioDenuncia, setComentarioDenuncia] = useState(0)
    const [denuncia, setDenuncia] = useState({
        assunto: '',
        descricao: '',
        tipo: 'Discurso de Ódio',
        resolvido: 0,
        idusuario: 0,
        idcomentario: 0,
        ehtrecho: 1
    })

    salvarComentario = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        console.log('id do usuario -> ' + idusuario)
        const dados = {
            idusuario: idusuario,
            idTexto: props.idTexto,
            conteudo: comentario,
            trecho: props.indice,
            upvotes: 0,
            downvotes: 0
        }
        const response = await axios.post('http://' + ipconfig.ip + ':3002/comentarios/trecho', dados)
        setComentario("")
    }

    denunciarComentario = comentario => {
        setModalDenuncia(true)
        setComentarioDenuncia(comentario)
    }
    fazerDenuncia = async denunciaNova => {
        if (denunciaNova.assunto != '' && denunciaNova.descricao != '' && denunciaNova.tipo != '') {
            try {
                await axios.post('http://' + ipconfig.ip + ':3002/denuncias/', denunciaNova)
            } catch (err) {
                console.log(err)
            }
        } else {
            ToastAndroid.show("Complete todos os dados de sua denúncia!", 1500)
        }
    }
    resetarValuesDenuncia = () => {
        setDenuncia({
            assunto: '',
            descricao: '',
            tipo: '',
            resolvido: 0,
            idusuario: 0,
            idcomentario: 0,
            ehtrecho: 1
        })
    }

    getComentarios = async () => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/comentarios/trecho/' + props.idTexto + '/' + props.indice)
        const dados = res.data
        if (dados.length > 0)
            setTemComentario(true)
        else
            return
        var i = 0
        dados.forEach(element => {
            if (comentarios.length < dados.length) {
                var aux = comentarios
                aux.push(<Comentario key={element.id} comentario={element} onDenuncia={denunciarComentario} ehTrecho={true} />)
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
            {/* <Modal
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
            </Modal> */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centralizarModal}>
                    {comentarios.length > 0 ?
                        <View style={styles.modal}>
                            <ScrollView style={styles.containerComentarios}>
                                {comentarios}
                            </ScrollView>
                            <TextInput value={comentario} onChangeText={(texto) => setComentario(texto)} placeholder={"Seu comentário"} placeholderTextColor='gray' style={styles.addComentario} />
                            <View style={styles.comentariosModalButtons}>
                                <TouchableOpacity style={styles.fecharModal}
                                    onPress={() => {
                                        salvarComentario()
                                    }}
                                >
                                    <Text style={[styles.fecharModalTexto, styles.texto]}>Enviar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(false)
                                    setComentarios([])
                                }} style={styles.fecharModal}>
                                    <Text style={[styles.fecharModalTexto, styles.texto]}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={styles.modal}>
                            <Text style={styles.txt}>Esse Texto não tem Comentários</Text>
                            <TextInput value={comentario} onChangeText={(texto) => setComentario(texto)} placeholder={"Seu comentário"} placeholderTextColor='gray' style={styles.addComentario} />
                            <TouchableOpacity style={styles.fecharModal}
                                onPress={() => {
                                    salvarComentario()
                                }}
                            >
                                <Text style={[styles.fecharModalTexto, styles.texto]}>Enviar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                            }} style={styles.fecharModal}>
                                <Text style={[styles.fecharModalTexto, styles.texto]}>Fechar</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDenuncia}
            >
                <View style={styles.centralizarModalDenuncia}>
                    <View style={styles.modalDenuncia}>
                        <TouchableOpacity style={styles.modalDenunciaLeaveButton}
                            onPress={() => setModalDenuncia(false)}>
                            <Icon name={'close'} size={30} color='black' />
                        </TouchableOpacity>
                        <Text style={styles.modalDenunciaTxt}>Denúncia do Seguinte comentário</Text>
                        <Text style={styles.modalDenunciaTxt2}>"{comentarioDenuncia.conteudo}"</Text>
                        <Text style={styles.modalDenunciaTxt3}>Feito por: {comentarioDenuncia.nome}</Text>

                        <TextInput placeholder='Assunto' placeholderTextColor='gray' value={denuncia.assunto} style={styles.inputModalDenuncia}
                            onChangeText={assunto => {
                                setDenuncia({
                                    assunto: assunto,
                                    descricao: denuncia.descricao,
                                    tipo: denuncia.tipo,
                                    resolvido: denuncia.resolvido,
                                    idusuario: denuncia.idusuario,
                                    idcomentario: denuncia.idcomentario,
                                    ehtrecho: denuncia.ehtrecho
                                })
                            }} />
                        <TextInput placeholder='Descrição' placeholderTextColor='gray' value={denuncia.descricao} style={styles.inputModalDenuncia}
                            onChangeText={descricao => {
                                setDenuncia({
                                    assunto: denuncia.assunto,
                                    descricao: descricao,
                                    tipo: denuncia.tipo,
                                    resolvido: denuncia.resolvido,
                                    idusuario: denuncia.idusuario,
                                    idcomentario: denuncia.idcomentario,
                                    ehtrecho: denuncia.ehtrecho
                                })
                            }} />
                        <View style={styles.modalDenunciaPickerView}>
                            <Picker
                                selectedValue={denuncia.tipo}
                                mode={'dropdown'}
                                style={styles.modalDenunciaPicker}
                                itemStyle={{ color: 'white' }}
                                onValueChange={tipo => {
                                    setDenuncia({
                                        assunto: denuncia.assunto,
                                        descricao: denuncia.descricao,
                                        tipo: tipo,
                                        resolvido: denuncia.resolvido,
                                        idusuario: denuncia.idusuario,
                                        idcomentario: denuncia.idcomentario,
                                        ehtrecho: denuncia.ehtrecho
                                    })
                                }}
                            >
                                <Picker.Item label="Discurso de Ódio" value="Discurso de Ódio" />
                                <Picker.Item label="Spam" value="Spam" />
                                <Picker.Item label="Abuso Verbal" value="Abuso Verbal" />
                                <Picker.Item label="Conteudo Enganoso" value="Conteudo Enganoso" />
                                <Picker.Item label="Outro" value="Outro" />
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.modalDenunciaButton}
                            onPress={() => {
                                setModalDenuncia(false)
                                const denunciaNova = {
                                    assunto: denuncia.assunto,
                                    descricao: denuncia.descricao,
                                    tipo: denuncia.tipo,
                                    resolvido: denuncia.resolvido,
                                    idusuario: comentarioDenuncia.idusuario,
                                    idcomentario: comentarioDenuncia.id,
                                    ehtrecho: denuncia.ehtrecho
                                }
                                fazerDenuncia(denunciaNova)
                                resetarValuesDenuncia()
                            }}>
                            <Text style={styles.modalDenunciaButtonTxt}>Denunciar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={temComentario ? [styles.container, styles.backgroundComComentario] : [styles.container, styles.backgroundSemComentario]}>
                <Text style={styles.texto}>{props.conteudo}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerComentarios: {
        width: Dimensions.get('window').width / 1.5,
    },
    centralizarModal: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Dimensions.get('window').height * 2 / 7
    },
    centralizarModalDenuncia: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalDenuncia: {
        width: Dimensions.get('window').width / 1.1,
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
        elevation: 6,
        padding: 20
    },
    modalDenunciaLeaveButton: {
        alignSelf: 'flex-start'
    },
    modalDenunciaButton: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalDenunciaButtonTxt: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 60,
        fontSize: 20,
        fontFamily: commonStyles.fontFamily1,
        color: 'white'
    },
    txt: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20,
        textAlign: 'center'
    },
    modalDenunciaTxt: {
        fontSize: 18,
        fontFamily: commonStyles.fontFamily2,
        marginTop: 10,
    },
    modalDenunciaTxt2: {
        fontSize: 20,
        fontFamily: commonStyles.fontFamily1,
        paddingVertical: 20,
        width: Dimensions.get('window').width / 1.1,
        textAlign: 'center'
    },
    modalDenunciaTxt3: {
        fontSize: 12,
        fontFamily: commonStyles.fontFamily2,
        alignSelf: 'flex-end'
    },
    inputModalDenuncia: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 60,
        paddingHorizontal: 20,
        marginTop: 10,
        width: Dimensions.get('window').width / 1.25,
        color: 'black'
    },
    modalDenunciaPickerView: {
        color: 'black',
        borderWidth: 2,
        borderRadius: 50,
        marginTop: 20,
        marginBottom: 30,
    },
    modalDenunciaPicker: {
        width: Dimensions.get('window').width / 1.25,
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
    comentariosModalButtons: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 20,
    },
    fecharModal: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'red',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 10,
        marginHorizontal: 10,
    },
    fecharModalTexto: {
        color: 'white'
    },

    addComentario: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        width: Dimensions.get('window').width / 1.5,
        alignItems: 'center',
        color: 'black'
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