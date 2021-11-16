import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import commonStyles from '../commonStyles'
import TextosFavoritos from '../components/textosFavoritos'
import Icon from 'react-native-vector-icons/FontAwesome'
import Input from '../components/autenticacaoInputs'
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'react-native-axios'
import ipconfig from '../ipconfig'
import LivroItem from '../components/livroItem';
import { withNavigationFocus } from "react-navigation";
import { useFocusEffect } from '@react-navigation/native'
import Header from '../Header'

const dimensions = Dimensions.get('window');
export default props => {

    const [nome, setNome] = useState(props.nome)
    const [urlFundo, setUrlFundo] = useState(props.banner ? props.banner : 'https://i2.wp.com/www.multarte.com.br/wp-content/uploads/2018/12/fundo-cinza-claro5.jpg?resize=696%2C696&ssl=1')
    const [urlPerfil, setUrlPerfil] = useState(props.foto ? props.foto : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg')
    const [desc, setDesc] = useState(props.desc)
    const [dataCriada, setDataCriada] = useState(props.data)
    const [pontos, setPontos] = useState(props.pontos)
    const [livrosFav, setLivrosFav] = useState([])
    const [modoEdicao, setModoEdicao] = useState(false)
    const [editNome, setEditNome] = useState(false)
    const [editDesc, setEditDesc] = useState(false)
    const [selecionandoImagem, setSelecionandoImagem] = useState(false)
    const [filePath, setFilePath] = useState('')
    const [fileData, setFileData] = useState('')
    const [fileUri, setFileUri] = useState('')

    launchCamera = () => {
        let options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (response) => {
            console.warn('Response = ', response);

            if (response.didCancel) {
                console.warn('User cancelled image picker');
            } else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.warn('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.warn('response', JSON.stringify(response));
                setFilePath(response)
                setFileData(response.data)
                setFileUri(response.uri)
            }
        });
    }

    launchGallery = () => {
        let options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            console.warn('Response = ', response);

            if (response.didCancel) {
                console.warn('User cancelled image picker');
            } else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.warn('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.warn('response', JSON.stringify(response));
                setFilePath(response)
                setFileData(response.data)
                setFileUri(response.uri)
            }
        });
    }

    buscarFavoritos = async () => {
        livros = []
        linha = []
        const res = await axios.get('http://' + ipconfig.ip + ':3002/textosfavoritos/' + props.id)
        const dado = res.data

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

    salvarAlteracoes = async () => {
        const idusuario = props.id
        const dados = {
            id: idusuario,
            nome: nome,
            descricao: desc,
            foto: urlPerfil,
            banner: urlFundo
        }
        const res = await axios.put('http://' + ipconfig.ip + ':3002/usuario', dados)
        await AsyncStorage.removeItem('dadosUsuario')
        const res2 = await axios.get('http://' + ipconfig.ip + ':3002/usuarios/id/' + idusuario)
        const data = res2.data
        const dadosuser = data[0]
        console.log(dadosuser)
        await AsyncStorage.setItem('dadosUsuario', JSON.stringify(dadosuser))
    }

    return (
        <ScrollView>
            <View style={st.container}>
                <View style={st.view1}>
                    <View style={st.viewFundo}>
                        <Image style={st.imgFundo} source={{ uri: urlFundo }} resizeMode='stretch' />
                        {modoEdicao ?
                            // <TouchableOpacity style={[st.iconCam, st.cam1]}
                            //     onPress={() => { setSelecionandoImagem(true) }}>
                            //     <Icon name='camera' size={25} />
                            // </TouchableOpacity>
                            <TextInput val={urlFundo} onChangeText={(val) => setUrlFundo(val)} placeholder='Link da foto do fundo' />
                            : null}
                    </View>
                    <View style={st.viewFoto}>
                        <Image style={st.fotoPerfil} source={{ uri: urlPerfil }} />
                        {modoEdicao ?
                            // <TouchableOpacity style={[st.iconCam, st.cam2]}
                            //     onPress={() => { setSelecionandoImagem(true) }}>
                            //     <Icon name='camera' size={25} />
                            // </TouchableOpacity>
                            <TextInput val={urlPerfil} onChangeText={(val) => setUrlPerfil(val)} placeholder='Link da foto de perfil' />
                            : null}
                    </View>

                    <TouchableOpacity style={st.icon}
                        onPress={
                            () => {
                                setModoEdicao(true)
                            }
                        }>
                        {!modoEdicao ? <Icon name='cog' size={30} /> : null}
                    </TouchableOpacity>
                    <TouchableOpacity style={st.btnSalvar}
                        onPress={
                            () => {
                                setModoEdicao(false)
                                salvarAlteracoes()
                            }
                        }>
                        {modoEdicao ? <Text style={st.salvar}>Salvar</Text> : null}
                    </TouchableOpacity>

                    <View style={st.nome}>
                        {!modoEdicao ? <Text style={st.t1}>{nome}</Text> : null}
                    </View>
                </View>

                <View style={st.view2}>
                    {modoEdicao ?
                        <View style={st.camposEdi}>
                            {!editNome ?
                                <Text style={[st.t1, st.txtCampos]}>Nome: {nome}</Text> :
                                <Input icon='user' placeholder='Nome' value={nome} style={[st.txtCampos]}
                                    onChangeText={nome => setNome(nome)} />
                            }
                            <TouchableOpacity style={st.iconCampos}
                                onPress={
                                    () => {
                                        setEditNome(!editNome)
                                    }
                                }>
                                <Icon name={!editNome ? 'edit' : 'save'} size={25} />
                            </TouchableOpacity>
                        </View>
                        : null}

                    {modoEdicao ?
                        <View style={st.camposEdi}>
                            {!editDesc ?
                                <Text style={[st.t1, st.txtCampos]}>Descrição: {desc}</Text> :
                                <Input icon='comment' placeholder='Descrição' value={desc} style={[st.txtCampos]}
                                    onChangeText={desc => setDesc(desc)} />
                            }
                            <TouchableOpacity style={st.iconCampos}
                                onPress={
                                    () => {
                                        setEditDesc(!editDesc)
                                    }
                                }>
                                <Icon name={!editDesc ? 'edit' : 'save'} size={25} />
                            </TouchableOpacity>
                        </View>
                        : null}
                    {!modoEdicao ? <Text style={st.t2}>{desc}</Text> : null}
                    {!modoEdicao ? <Text style={st.t2}>Conta criada em: {dataCriada}</Text> : null}
                    {!modoEdicao ? <Text style={st.t1}>{pontos} Pontos</Text> : null}
                </View>
            </View>
            <View style={st.textosFav}>
                <Text style={[st.t1, { marginLeft: 25 }]}>Textos Favoritos</Text>
                <TextosFavoritos id={props.id} textos={livrosFav ? livrosFav : []} navigation={props.navigation} />
            </View>

            {selecionandoImagem ?
                <View style={st.fundoPopUp}>
                    <View style={st.popup}>
                        <TouchableOpacity style={st.btnImagePicker}
                            onPress={() => {
                                setSelecionandoImagem(false)
                                launchCamera()
                            }}>
                            <Icon name='camera' size={20} />
                            <Text>Tire uma Foto!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={st.btnImagePicker}
                            onPress={() => {
                                setSelecionandoImagem(false)
                                launchGallery()
                            }}>
                            <Icon name='image' size={20} />
                            <Text>Pegar da Galeria!</Text>
                        </TouchableOpacity>
                    </View>
                </View> : null
            }
        </ScrollView>
    )

}

const st = StyleSheet.create({
    container: {
        flex: 75,
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
    icon: {
        position: 'absolute',
        top: dimensions.height / 3.9,
        left: dimensions.width / 1.6
    },
    iconCam: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
    },
    cam1: {
        position: 'absolute',
        top: dimensions.height / 3.7,
        left: dimensions.width / 20
    },
    cam2: {
        position: 'absolute',
        top: dimensions.height / 5.8,
        left: dimensions.width / 50
    },
    view2: {
        flex: 35,
        marginRight: 10,
        marginLeft: 10,
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
        marginTop: -dimensions.height / 8,
    },
    fotoPerfil: {
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    textosFav: {
        flex: 25,
    },
    btnSalvar: {
        position: 'absolute',
        top: dimensions.height / 3.1,
        left: dimensions.width / 1.3
    },
    salvar: {
        fontSize: 22,
        color: '#A90A0A',
        fontFamily: commonStyles.fontFamily2
    },
    camposEdi: {
        flexDirection: 'row',
        width: dimensions.width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtCampos: {
        flex: 3,
    },
    iconCampos: {
        flex: 1,
        marginLeft: 10
    },
    campo: {
        width: dimensions.width / 2
    },
    fundoPopUp: {
        position: 'absolute',
        top: 0,
        width: dimensions.width,
        height: dimensions.height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
    },
    popup: {
        height: dimensions.height / 3,
        width: dimensions.width / 2,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    btnImagePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        width: dimensions.width / 2.3,
        borderColor: 'black'
    }
})