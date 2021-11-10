import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, TextInput } from 'react-native'
import commonStyles from '../commonStyles'
import TextosFavoritos from '../components/textosFavoritos'
import Icon from 'react-native-vector-icons/FontAwesome'
import Input from '../components/autenticacaoInputs'
import * as ImagePicker from 'react-native-image-picker';
import LivroItem from '../components/livroItem'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'
import axios from 'react-native-axios'
import ipconfig from '../ipconfig'


const dimensions = Dimensions.get('window');
export default props => {
    const { user } = props.route.params
    const [livrosFav, setLivrosFav] = useState([])
    const [denunciando, setDenunciando] = useState(false)
    const [motivoDenuncia, setMotivoDenuncia] = useState('')
    console.log(user)

    buscarFavoritos = async () => {
        console.log("Tela de Perfil")
        livros = []
        linha = []
        console.log('a')
        const res = await axios.get('http://' + ipconfig.ip + ':3002/textosfavoritos/' + user.id)
        console.log('b')
        const dado = res.data
        console.log('c')

        for (const livroFav of dado) {
            const res2 = await axios.get('http://' + ipconfig.ip + ':3002/textos/' + livroFav.idtexto)
            const dado2 = res2.data
            livros.push(dado2)
        }

        for (const livro of livros) {
            linha.push(
                <LivroItem key={livro[0].id} livro={livro[0]} navigation={props.navigation} />
            )
        }

        setLivrosFav(linha)
    }

    useFocusEffect(
        React.useCallback(() => {
            buscarFavoritos()
        }, [])
    )

    criarDM = async () => {
        console.log('oi')
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const dados = {
            idusuario1: idusuario,
            idusuario2: user.id
        }
        const res = await axios.post('http://' + ipconfig.ip + ':3002/mensagens/criardm', dados)
        const res2 = await axios.get('http://' + ipconfig.ip + ':3002/mensagens/buscardm/' + idusuario + '/' + user.id)
        const dados2 = res2.data
        props.navigation.push("Chat", {destinatario: user, ehDM: true, chat: dados2[0]})
    }

    denunciar = async () => {
        const dadosuser = await AsyncStorage.getItem('dadosUsuario')
        const usuario = JSON.parse(dadosuser)[0]
        const idusuario = usuario.id
        const dados = {
            idusuarioreportado: user.id,
            idusuarioreportante: idusuario,
            motivo: motivoDenuncia
        }
        const res = await axios.post('http://' + ipconfig.ip + ':3002/advertencias/usuario', dados)
    }

    return (
        <>
            <View style={st.container}>
                <View style={st.view1}>
                    <View style={st.viewFundo}>
                        <Image style={st.imgFundo} source={{ uri: user.banner }} resizeMode='stretch' />
                    </View>

                    <TouchableOpacity style={st.iconBan} onPress={() => setDenunciando(true)}>
                        <Icon name='ban' size={30} />
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={denunciando}
                    >
                        <View style={st.modal}>
                            <Text>OI</Text>
                            <TextInput style={st.txtMotivo} placeholder="Motivo da denuncia" onChangeText={(val) => setMotivoDenuncia(val)} />
                            <TouchableOpacity onPress={denunciar} style={st.btn}>
                                <Text style={{color: 'white'}}>DENUNCIAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setDenunciando(false)} style={st.btn}>
                                <Text style={{color: 'white'}}>FECHAR</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    <View style={st.viewFoto}>
                        <Image style={st.fotoPerfil} source={{ uri: user.foto }} />
                    </View>

                    <TouchableOpacity style={st.icon} onPress={criarDM}>
                        <Icon name='envelope' size={30} />
                    </TouchableOpacity>

                    <View style={st.nome}>
                        <Text style={st.t1}>{user.nome}</Text>
                    </View>
                </View>

                <View style={st.view2}>
                    <Text style={st.t2}>{user.descricao}</Text>
                    <Text style={st.t2}>Conta criada em: {user.datacriacao}</Text>
                    <Text style={st.t1}>{user.pontos} Pontos</Text>
                </View>
            </View>
            <View style={st.textosFav}>
                <Text style={[st.t1, { marginLeft: 25 }]}>Textos Favoritos</Text>
                <TextosFavoritos id={user.id} textos={JSON.stringify(livrosFav) !== JSON.stringify([]) ? livrosFav : <Text style={{marginLeft: 15}}>Este Usuário não tem Textos Favoritos atualmente</Text>} navigation={props.navigation} />
            </View>
        </>
    )
}

const st = StyleSheet.create({
    txtMotivo: {
        borderWidth: 2,
        borderColor: 'black',
        width: 200,
        borderRadius: 15
    },
    btn: {
        backgroundColor: 'red',
    },
    modal: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Dimensions.get('window').height * 2 / 7,
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
    iconBan: {
        position: 'absolute',
        top: dimensions.height/3.1,
        left: dimensions.width/3.5
    },
    icon: {
        position: 'absolute',
        top: dimensions.height/3.1,
        left: dimensions.width/1.53
    },
    container: {
        flex: 65,
        alignItems: 'center',
        justifyContent: 'center'
    },
    view1: {
        flex: 65,
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions.width
    },
    nome: {
        flex: 10,
        alignItems: 'center',
        width: dimensions.width
    },
    view2: {
        flex: 35,
        width: dimensions.width,
        marginLeft: 50,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start'
    },
    t1: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 22,
    },
    t2: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 14,
    },
    viewFundo: {
        flex: 25,
    },
    imgFundo: {
        width: dimensions.width,
        height: dimensions.width * 8 / 16,
    },
    viewFoto: {
        justifyContent: 'center',
    },
    fotoPerfil: {
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    textosFav: {
        flex: 35,
    },
})