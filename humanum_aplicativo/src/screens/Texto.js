import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Dimensions, Modal, SafeAreaView, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback, StatusBar } from 'react-native';
import axios from 'react-native-axios'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Texto from '../components/texto'
import Paragrafo from '../components/paragrafo'
import commonStyles from '../commonStyles';
import { useFocusEffect } from '@react-navigation/native'
//import {  } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome'
import Comentario from '../components/comentario'
import ipconfig from '../ipconfig'

import {MotiView, useAnimationState, AnimatePresence} from 'moti'

export default React.memo(props => {

    const TopButtonHandler = () => {
        navegar.scrollTo({ x: 0, y: 0, animated: true });
    }

    const EndButtonHandler = () => {
        navegar.scrollToEnd({ animated: true, duration: 3 });
    }
    const { texto } = props.route.params
    var jaFoi = 0
    const [categoria, setCategoria] = useState("Categoria")
    const [autor, setAutor] = useState("Autor")
    const [paragrafos, setParagrafos] = useState([])
    const [favorito, setFavorito] = useState(false)
    const [direcao, setDiracao] = useState('down')
    const [comentario, setComentario] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [comentarios, setComentarios] = useState([])

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownAniState = useAnimationState({
        closed: {
            height: 100
        },
        open: {
            height: 300
        },
    })
    function handleDropdown() {
        if(dropdownAniState.current === 'open') {
            dropdownAniState.transitionTo('closed')
            setDropdownOpen(false)
        }
        else {
            dropdownAniState.transitionTo('open')
            setDropdownOpen(true)
        }
    }


    useFocusEffect(
        React.useCallback(() => {
            console.log("entrei")
            setParagrafos([])
            console.log(texto)
            fazerTudo(props.route.params.texto)
            return () => {
                console.log("sai")
                setParagrafos([])
            }
        }, [])
    )
    getCategoria = async (id) => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/categorias/' + id)
        const dado = JSON.stringify(res.data);
        const teste = JSON.parse(dado);
        setCategoria(teste[0].categoria)
    }
    getAutor = async (id) => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/autores/' + id)
        const dado = JSON.stringify(res.data);
        const teste = JSON.parse(dado);
        setAutor(teste[0].nome)
    }
    getParagrafos = async (documento) => {
        var arr
        var url = "https://pastebin.com/raw/" + documento

        await axios.get(url)
            .then(response => response.data.split("\r\n"))
            .then(data => {
                arr = data
            })
            .catch(function (error) {
                console.log(error);
            })

        var i = 0
        arr.forEach(element => {
            if (paragrafos.length < arr.length) {
                paragrafos.push(<Paragrafo key={i} indice={i} conteudo={element} idTexto={texto.id} />)
                setParagrafos(paragrafos)
                i++
            }
        });
        i = 0
        console.log("tamanho -> " + paragrafos.length)
    }

    favoritar = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const url = 'http://' + ipconfig.ip + ':3002/textosfavoritos/' + idusuario + '/' + texto.id
        await axios.post(url)
        console.log("foi!")
        setFavorito(true)
    }

    desfavoritar = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const url = 'http://' + ipconfig.ip + ':3002/textosfavoritos/' + idusuario + '/' + texto.id
        await axios.delete(url)
        console.log("foi!!!")
        setFavorito(false)
    }

    checarFavoritos = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const url = 'http://' + ipconfig.ip + ':3002/textosfavoritos/' + idusuario + '/' + texto.id
        const response = await axios.get(url)
        console.log(response.data)
        const dados = response.data
        if (dados.length > 0)
            setFavorito(true)
    }

    buscarComentarios = async () => {
        const res = await axios.get('http://' + ipconfig.ip + ':3002/comentarios/texto/' + texto.id)
        const dados = res.data
        // dados.forEach(element => {
        //     if (comentarios.length < dados.length) {
        //         var aux = comentarios
        //         // aux.push(<Comentario key={element.id} comentario={element} />)
        //         aux.push(element)
        //         setComentarios(aux)
        //     }
        // });
        setComentarios(dados)
    }

    salvarComentario = async () => {
        console.log("oi")
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const idusuario = dadosuser.id
        const dados = {
            idtexto: texto.id,
            conteudo: comentario,
            idusuario: idusuario,
            upvotes: 0,
            downvotes: 0,
            data: new Date().toLocaleString("en-US")
        }
        const response = await axios.post('http://' + ipconfig.ip + ':3002/comentarios/texto', dados)
        setComentario("")
    }

    fazerTudo = (data) => {
        console.log("oi eu to no fazerTudo")
        checarFavoritos()
        getCategoria(data.categoria)
        getAutor(data.idautor)
        getParagrafos(data.documento)
        buscarComentarios()
    }

    // buscarComentarios()

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView ref={ref => { navegar = ref }}
                onScroll={(event) => {
                    var currentOffset = event.nativeEvent.contentOffset.y;
                    var direction = currentOffset > this.offset ? 'down' : 'up';
                    this.offset = currentOffset;
                    setDiracao(direction)
                }}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centralizarModal}>
                        <View style={styles.modal}>
                            <Text style={styles.texto}>oioioiaaaaaaaaaaaaaaaa</Text>
                            <FlatList data={comentarios} renderItem={({item}) => <Comentario key={item.id} comentario={item} />} />
                            <TextInput value={comentario} onChangeText={(texto) => setComentario(texto)} placeholder={"comentário"} />
                            <TouchableOpacity style={styles.fecharModal}
                                onPress={() => {
                                    console.log('salvar')
                                    salvarComentario()
                                }}
                            >
                                <Text style={[styles.fecharModalTexto, styles.texto]}>SALVAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                console.log('pediu pra sair')
                                setModalVisible(false)
                            }} style={styles.fecharModal}>
                                <Text style={[styles.fecharModalTexto, styles.texto]}>FECHAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <MotiView 
                style={styles.dropdown}
                state={dropdownAniState}>
                    <TouchableWithoutFeedback
                        onPress={handleDropdown}>
                        <View style={styles.dropdownTitulo}>
                            <View style={styles.titulo}>
                                <Text style={styles.tituloTxt} >{texto["nome"]} {"\n"}</Text>
                            </View>
                            <View style={styles.icDropdown}>
                                {
                                    dropdownOpen ?
                                <AnimatePresence>
                                    <MotiView
                                    from={{
                                        rotate: '0deg',
                                        opacity: 0,
                                    }}
                                    animate={{
                                        rotate: '90deg',
                                        opacity: 1,
                                    }}
                                    transition={{
                                        type: 'timing'
                                    }}>
                                        <Icon name='close' color='white' size={30} />
                                    </MotiView>
                                </AnimatePresence>
                                    :
                                <MotiView
                                from={{
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}>
                                    <Icon name='info-circle' color='white' size={30} />
                                </MotiView>
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {
                        dropdownOpen ?
                    <View style={styles.info}>
                        <Text style={styles.texto}>Autor: </Text>
                        <Text style={styles.textoLink}>{autor} {"\n"}</Text>
                        <Text style={styles.texto}>Ano: </Text>
                        <Text style={styles.textoLink}>{texto["ano"]} {"\n"}</Text>
                        <Text style={styles.texto}>Categoria: </Text>
                        <Text style={styles.textoLink}>{categoria + ", " + texto["generoassunto"]} {"\n"}</Text>
                    </View>
                        : null
                    }
                </MotiView>

                <View style={styles.capaEngloba}>
                {texto["capa"] ?
                    <Image style={styles.capa} source={{ uri: texto["capa"] }} /> :
                    <Image style={styles.capa} source={{ uri: 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg' }} />}
                </View>

                <Texto texto={texto} paragrafos={paragrafos} />

                <View style={styles.botoes}>
                    <TouchableOpacity style={styles.botao} onPress={() => {
                        if (favorito)
                            desfavoritar()
                        else
                            favoritar()
                    }} >
                        {!favorito ?
                            <Text style={styles.txtBotao}>Adicionar{'\n'}aos favoritos</Text> :
                            <Text style={styles.txtBotao}>Remover{'\n'}dos favoritos</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botao} onPress={() => {setModalVisible(true)}}>
                        <Text style={styles.txtBotao}>Ver comentários</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight
    },
    dropdown: {
        flex: 15,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#a90a0a',
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50,
        borderTopEndRadius: 50,
    },
    capaEngloba: {
        flex: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    botoes: {
        flex: 15,
        flexDirection: 'row',
        justifyContent: "space-around",
    },



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
        width: 120
    },
    fecharModalTexto: {
        color: 'white'
    },
    icon: {
        color: 'white'
    },
    info: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        flex: 85,
    },
    txtBotao: {
        fontFamily: commonStyles.fontFamily2,
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    botao: {
        backgroundColor: '#a90a0a',
        borderRadius: 100,
        paddingLeft: 20,
        paddingRight: 20,
        padding: 5,
        justifyContent: 'center',
    },
    dropdownTitulo: {
        flex: 15,
        flexDirection: 'row',
        padding: 20,
    },
    titulo: {
        flex: 1,
        alignItems: 'flex-start'
    },
    tituloTxt: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 25,
        color: 'white',
    },
    icDropdown:{
        flex: 1,
        alignItems: 'flex-end',
    },
    texto: {
        fontFamily: commonStyles.fontFamily1,
        fontSize: 18,
        color: 'white'
    },
    textoLink: {
        fontFamily: commonStyles.fontFamily1,
        color: '#00B9FF',
        fontSize: 18,
    },
    capa: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 3 / 4,
    },

    btnScroll: {
        marginTop: 30,
        backgroundColor: '#a90a0a',
        borderRadius: 100,
        height: 45,
        width: 45,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: Dimensions.get('window').width - 70,
    },
    transparente: {
        backgroundColor: '#00000000'
    },
    goToTop: {
        position: 'absolute',
        marginTop: 10,
        marginRight: 10
    },
})