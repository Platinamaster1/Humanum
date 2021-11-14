import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Dimensions, Modal, SafeAreaView, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback, StatusBar } from 'react-native';
import axios from 'react-native-axios'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Texto from '../components/texto'
import Paragrafo from '../components/paragrafo'
import commonStyles from '../commonStyles';
import { useFocusEffect } from '@react-navigation/native'
import {Picker} from '@react-native-picker/picker'
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
    const [modalDenuncia, setModalDenuncia] = useState(false)
    const [comentarioDenuncia, setComentarioDenuncia] = useState(0)
    const [denuncia, setDenuncia] = useState({
        assunto: '',
        descricao: '',
        tipo: 'Discurso de Ódio',
        resolvido: 0,
        idusuario: 0,
        idcomentario: 0,
        ehtrecho: 0
    })
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
        console.log("buscarComentarios")
        console.log(texto)
        const res = await axios.get('http://' + ipconfig.ip + ':3002/comentarios/texto/' + texto.id)
        const dados = res.data
        console.log(dados)
        setComentarios(dados)
    }

    salvarComentario = async () => {
        console.log("oi")
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
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

    denunciarComentario = comentario => {
        setModalDenuncia(true)
        setComentarioDenuncia(comentario)
        console.log("AAAAAAAAAAAAA")
        console.log(comentario)
    }
    fazerDenuncia = async denunciaNova => {
        console.log(denunciaNova)
        try {
            await axios.post('http://' + ipconfig.ip + ':3002/denuncias/', denunciaNova)
        } catch(err) {
            console.log(err)
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
            ehtrecho: 0
        })
    }

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
                            <FlatList data={comentarios} renderItem={({item}) => <Comentario key={item.id} comentario={item} />} />
                            <TextInput value={comentario} onChangeText={(texto) => setComentario(texto)} placeholder={"Seu comentário"} />
                            <TouchableOpacity style={styles.fecharModal}
                                onPress={() => {
                                    console.log('salvar')
                                    salvarComentario()
                                }}
                            >
                                <Text style={[styles.fecharModalTexto, styles.texto]}>ENVIAR</Text>
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
                                    }}/>
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
                                    }}/>
                            <View style={styles.modalDenunciaPickerView}>
                                <Picker
                                    selectedValue={denuncia.tipo}
                                    mode={'dropdown'}
                                    style={styles.modalDenunciaPicker}
                                    itemStyle={{color: 'white'}}
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
                                        <Picker.Item label="Discurso de Ódio" value = "Discurso de Ódio"/>
                                        <Picker.Item label="Spam" value = "Spam"/>
                                        <Picker.Item label="Abuso Verbal" value = "Abuso Verbal"/>
                                        <Picker.Item label="Conteudo Enganoso" value = "Conteudo Enganoso"/>
                                        <Picker.Item label="Outro" value = "Outro"/>
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
                                    console.log("COMENTARIO DENUNCIA")
                                    console.log(comentarioDenuncia)
                                    fazerDenuncia(denunciaNova)
                                    resetarValuesDenuncia()
                                }}>
                                <Text style={styles.modalDenunciaButtonTxt}>Denunciar</Text>
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

                <Texto texto={texto} paragrafos={paragrafos} />

                
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
        width: Dimensions.get('window').width / 2,
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