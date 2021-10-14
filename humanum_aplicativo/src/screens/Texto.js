import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Dimensions, Modal, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
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

export default React.memo(props => {

    const TopButtonHandler = () => {
        a.scrollTo({ x: 0, y: 0, animated: true });
    }

    const EndButtonHandler = () => {
        a.scrollToEnd({ animated: true, duration: 3 });
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
        const res = await axios.get('http://192.168.15.7:3002/categorias/' + id)
        const dado = JSON.stringify(res.data);
        const teste = JSON.parse(dado);
        setCategoria(teste[0].categoria)
    }
    getAutor = async (id) => {
        const res = await axios.get('http://192.168.15.7:3002/autores/' + id)
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
        const idusuario = await AsyncStorage.getItem('idLogado')
        const url = 'http://192.168.15.7:3002/textosfavoritos/' + idusuario + '/' + texto.id
        await axios.post(url)
        console.log("foi!")
        setFavorito(true)
    }

    desfavoritar = async () => {
        const idusuario = await AsyncStorage.getItem('idLogado')
        const url = 'http://192.168.15.7:3002/textosfavoritos/' + idusuario + '/' + texto.id
        await axios.delete(url)
        console.log("foi!!!")
        setFavorito(false)
    }

    checarFavoritos = async () => {
        const idusuario = await AsyncStorage.getItem('idLogado')
        const url = 'http://192.168.15.7:3002/textosfavoritos/' + idusuario + '/' + texto.id
        const response = await axios.get(url)
        console.log(response.data)
        const dados = response.data
        if (dados.length > 0)
            setFavorito(true)
    }

    buscarComentarios = async () => {
        const res = await axios.get('http://192.168.15.7:3002/comentarios/texto/' + texto.id)
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
        const idusuario = await AsyncStorage.getItem('idLogado')
        const dados = {
            idtexto: texto.id,
            conteudo: comentario,
            idusuario: idusuario,
            upvotes: 0,
            downvotes: 0,
            data: new Date().toLocaleString("en-US")
        }
        const response = await axios.post('http://192.168.15.7:3002/comentarios/texto', dados)
        setComentario("")
    }

    fazerTudo = (data) => {
        console.log("oi eu to no fazerTudo")
        checarFavoritos()
        getCategoria(data.categoria)
        getAutor(data.idautor)
        getParagrafos(data.documento)
    }

    buscarComentarios()

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.btnScroll}
                onPress={() => {
                    if (direcao == 'down')
                        EndButtonHandler()
                    else
                        TopButtonHandler()
                }}
            >
                <View style={styles.transparente}>
                    <Icon name={"arrow-circle-o-" + direcao} size={50} style={styles.icon} />
                </View>
            </TouchableOpacity>

            <ScrollView ref={ref => { a = ref }}
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
                    {/* <View> */}
                        <View style={styles.modal}>
                            <Text style={styles.texto}>oioioiaaaaaaaaaaaaaaaa</Text>
                            <FlatList data={comentarios} renderItem={({item}) => <Comentario comentario={item} />} />
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

                <Text style={styles.titulo}>{texto["nome"]} {"\n"}</Text>
                <Text style={styles.texto}>Autor: </Text>
                <Text style={styles.textoLink}>{autor} {"\n"}</Text>
                <Text style={styles.texto}>Ano: </Text>
                <Text style={styles.textoLink}>{texto["ano"]} {"\n"}</Text>
                <Text style={styles.texto}>Categoria: </Text>
                <Text style={styles.textoLink}>{categoria + ", " + texto["generoassunto"]} {"\n"}</Text>
                <View style={styles.center}>
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
                {texto["capa"] ?
                    <View style={styles.capaEngloba}><Image style={styles.capa} source={{ uri: texto["capa"] }} /></View> :
                    console.log()}
                <Texto texto={texto} paragrafos={paragrafos} />
            </ScrollView>

        </SafeAreaView>
    )
})

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
        width: 120
    },
    fecharModalTexto: {
        color: 'white'
    },
    icon: {
        color: 'white'
    },
    txtBotao: {
        fontFamily: commonStyles.fontFamily2,
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    botao: {
        backgroundColor: '#a90a0a',
        width: 100,
        borderRadius: 8,
        marginBottom: 20
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    titulo: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 25,
        marginLeft: 10,
        marginTop: 10
    },
    texto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 18,
        marginLeft: 10
    },
    textoLink: {
        fontFamily: commonStyles.fontFamily2,
        color: '#32347F',
        fontSize: 18,
        marginLeft: 10
    },
    capa: {
        width: Dimensions.get('window').width * 3 / 4,
        height: Dimensions.get('window').height * 3 / 4,
    },
    capaEngloba: {
        justifyContent: 'center',
        alignItems: 'center'
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
    container: {
        flex: 1,
    }
})