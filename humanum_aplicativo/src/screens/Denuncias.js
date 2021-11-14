import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import { useFocusEffect } from '@react-navigation/native'
import { useGoogleApi } from 'react-gapi'
import commonStyles from '../commonStyles'
import ipconfig from '../ipconfig'

import Denuncia from '../components/denunciaItem'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    useFocusEffect(
        React.useCallback(() => {
            loadDenuncias()
        }, [])
    )
    const[modal, setModal] = useState(false)
    const[modalExcluir, setModalExcluir] = useState(false)
    const[idDenunciaExcluir, setIdDenunciaExcluir] = useState(0)
    const[showResolvedDenuncias, setShowResolvedDenuncias] = useState(true)
    const[comentarioModal, setComentarioModal] = useState({
        conteudo: '',
        nome: ''
    })
    const[comentarioModalTrecho, setComentarioModalTrecho] = useState(false)
    const[denuncias, setDenuncias] = useState()
    const[denunciasVisiveis, setDenunciasVisiveis] = useState(denuncias)


    loadDenuncias = async () => {
        try {
            const res = await axios.get('http://' + ipconfig.ip + ':3002/denuncias')
            console.log(res)
            setDenuncias(res.data)
            setShowResolvedDenuncias(false)
            filterDenuncias()
            console.log(res.data)
        } catch(err) {
            console.log(err)
        }
    }

    finishDenuncias = async denunciaId => {
        console.log("Entrou")
        try {
            for (const denuncia of denuncias) {
                if (denuncia.id === denunciaId) {
                    const res = await axios.put('http://' + ipconfig.ip + ':3002/denuncias/', {id: denunciaId, resolvido: 1})
                }
            }
            await loadDenuncias()
        } catch(err) {
            console.log(err)
        }
    }
    modalDenuncia = denunciaId  => {
        setModalExcluir(true)
        setIdDenunciaExcluir(denunciaId)
    }
    deleteDenuncia = async () => {
        try {
            await axios.delete('http://' + ipconfig.ip + ':3002/denuncias/' + idDenunciaExcluir)
            await loadDenuncias()
        } catch(err) {
            console.log(err)
        }
    }
    filterDenuncias = () => {
        var pending
        if(!showResolvedDenuncias) {
            pending = denuncia => denuncia.resolvido === 0
            setDenunciasVisiveis(denuncias.filter(pending))
        }
        else {
            setDenunciasVisiveis(denuncias)
        }
        console.log("DDDDD")
        console.log(denunciasVisiveis)
    }
    removerComentario = async () => {
        console.log("Removendo...")
        const msgRemocao = "Um Moderador removeu o Comentário"
        if(comentarioModal.conteudo != msgRemocao) {
            try {
                if(comentarioModalTrecho)
                    await axios.put('http://' + ipconfig.ip + ':3002/comentariotrecho/' + comentarioModal.id + '/' + msgRemocao)
                else
                    await axios.put('http://' + ipconfig.ip + ':3002/comentario/' + comentarioModal.id + '/' + msgRemocao)
                setComentarioModal({conteudo: msgRemocao})
                await loadDenuncias()
            } catch(err) {
                console.log(err)
            }
        }
    }

    showModal = async (idComentario, ehTrecho) => {
        setModal(true)
        console.log("AAAAAAAAA")
        console.log(idComentario)
        var res
        if(!ehTrecho) {
            setComentarioModalTrecho(ehTrecho)
            res = await axios.get('http://' + ipconfig.ip + ':3002/comentario/'+idComentario)
        }
        else {
            setComentarioModalTrecho(ehTrecho)
            res = await axios.get('http://' + ipconfig.ip + ':3002/comentariotrecho/'+idComentario) 
        }
        setComentarioModal(res.data[0])
    }
    hideModal = () => {
        setModal(false)
    }
    toggleFilter = () => {
        console.log(showResolvedDenuncias)
        if(showResolvedDenuncias)
            setShowResolvedDenuncias(false)
        else
            setShowResolvedDenuncias(true)
        filterDenuncias()
    }
    
    return (
        <View style={style.container}>
            <View style={[style.toggleButton, {backgroundColor: showResolvedDenuncias ? 'green' : '#a90a0a'}]}>
                <TouchableOpacity onPress={toggleFilter}>
                    <Icon name={showResolvedDenuncias ? 'eye' : 'eye-slash'} size={30} color={'white'}/>
                </TouchableOpacity>
            </View>
            <View style={style.denunciaList}>
                <FlatList data={denunciasVisiveis}
                          keyExtractor={item => `${item.id}`}
                          renderItem={({item}) => <Denuncia {...item} onFinish={finishDenuncias} onDelete={modalDenuncia} showModal={showModal} />} />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
            >
                <View style={style.modalMaior}>
                    <View style={style.modal}>
                        <TouchableOpacity style={style.modalButton} 
                            onPress={() => hideModal()}>
                            <Icon name={'close'} size={30} color='black' />
                        </TouchableOpacity>
                        {comentarioModalTrecho ? <Text style={style.trechotexto}>Comentário de Trecho</Text> : <Text style={style.trechotexto}>Comentário de Texto</Text>}
                        <Text style={[style.conteudoModal, {color: comentarioModal.conteudo == "Um Moderador removeu o Comentário" ? 'gray' : 'black'}]}>"{comentarioModal.conteudo}"</Text>
                        <Text style={style.updownvote}>Upvotes: {comentarioModal.upvotes} - Downvotes: {comentarioModal.downvotes}</Text>
                        <Text style={style.nomeUsuarioModal}>Feito por {comentarioModal.nome}</Text>
                        <TouchableOpacity style={style.removerButton}
                            onPress={() => {
                                removerComentario()
                            }}>
                            <Text style={style.removerButtonTxt}>Remover</Text>
                            <Icon name={'ban'} size={30} />
                        </TouchableOpacity>
                </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalExcluir}
            >
                <View style={style.modalMaior}>
                    <View style={style.modal}>
                        <Text style={style.excluirModalTxt}>Tem certeza de que deseja excluir esta denuncia?</Text>
                        <View style={style.excluirModalButtons}>
                            <TouchableOpacity style={style.cancelarButton}
                                onPress={() => {
                                    setModalExcluir(false)
                                }}>
                                <Text style={style.removerButtonTxt}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={style.excluirButton}
                                onPress={() => {
                                    deleteDenuncia()
                                    setModalExcluir(false)
                                }}>
                                <Text style={style.removerButtonTxt}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                </View>
            </Modal>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalMaior: {
        justifyContent: 'center',
        height: Dimensions.get('window').height
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
    modalButton: {
        alignSelf: 'flex-start'
    },
    toggleButton: {
        alignSelf: 'flex-end',
        marginRight: 10,
        padding: 10,
        marginVertical: 10,
        borderRadius: 100,
    },
    removerButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: '#a90a0a',
        paddingVertical: 5,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginTop: 10,
    },
    removerButtonTxt: {
        marginRight: 10,
        fontSize: 20,
        fontFamily: commonStyles.fontFamily1
    },
    excluirModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    excluirModalTxt: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: commonStyles.fontFamily2
    },
    cancelarButton: {
        backgroundColor: '#fee',
        paddingVertical: 5,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginTop: 10,
        marginRight: 10,
    },
    excluirButton: {
        backgroundColor: '#fee',
        paddingVertical: 5,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginTop: 10,
        marginLeft: 10,
    },
    trechotexto: {
        alignSelf: 'flex-start',
        fontSize: 12,
        fontFamily: commonStyles.fontFamily1,
        marginTop: 10,
    },
    conteudoModal: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    updownvote: {
        color: 'red',
        fontSize: 18,
        fontFamily: commonStyles.fontFamily2
    },
    nomeUsuarioModal: {
        alignSelf: 'flex-end',
        fontFamily: commonStyles.fontFamily1,
        fontSize: 12,
        marginTop: 10,
    },
    denunciaList: {
        flex: 1,
    }
})