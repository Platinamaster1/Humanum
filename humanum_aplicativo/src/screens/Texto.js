import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Dimensions, BackHandler } from 'react-native';
import axios from 'react-native-axios'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Texto from '../components/texto'
import Paragrafo from '../components/paragrafo'
import commonStyles from '../commonStyles';
import { useFocusEffect } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ScrollToBottom, {useScrollToBottom} from 'react-scroll-to-bottom';

export default React.memo(props => {
    // const scrollToBottom = useScrollToBottom();

    const TopButtonHandler=()=>{
        a.scrollTo({ x: 0, y: 0, animated: true });
    }

    const EndButtonHandler =()=>{
        a.scrollToEnd({animated:true,duration:3});
    }
    const { texto } = props.route.params
    // console.log(texto)
    var jaFoi = 0
    // console.log(texto)
    const [categoria, setCategoria] = useState("Categoria")
    const [autor, setAutor] = useState("Autor")
    const [paragrafos, setParagrafos] = useState([])
    const [favorito, setFavorito] = useState(false)
    // useEffect(() => {
    //     setParagrafos([])
    // }, [])
    // function zerar() {
    //     console.log("oi")
    //     setParagrafos([])
    // }
    // useEffect(() => {
    //     BackHandler.addEventListener('zerarParagrafos', zerar);
    //     return () => {
    //         BackHandler.removeEventListener('zerarParagrafos', zerar);
    //     };
    // }, []);
    // useEffect(() => {
    //     console.log("entrei")
    //     setParagrafos([])
    //     console.log(texto)
    //     fazerTudo(props.route.params.texto)
    //     return () => {
    //         console.log("sai")
    //         setParagrafos([])
    //     };
    // }, []);
    useFocusEffect(
        React.useCallback(() => {
            console.log("entrei")
            setParagrafos([])
            // console.log("texto -> " + texto.nome)
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
        // console.log(teste[0].categoria)
        setCategoria(teste[0].categoria)
    }
    getAutor = async (id) => {
        const res = await axios.get('http://192.168.15.7:3002/autores/' + id)
        const dado = JSON.stringify(res.data);
        const teste = JSON.parse(dado);
        // console.log(teste[0].nome)
        setAutor(teste[0].nome)
    }
    getParagrafos = async (documento) => {
        // console.log("documento -> " + documento)
        var arr
        // console.log(documento)
        var url = "https://pastebin.com/raw/" + documento  // ateneu
        // var url = "https://pastebin.com/raw/iRAHB6K5"

        await axios.get(url)
            .then(response => response.data.split("\r\n"))
            .then(data => {
                arr = data
            })
            .catch(function (error) {
                console.log(error);
            })

        var i = 0
        // if (jaFoi == 0) {
        arr.forEach(element => {
            if (paragrafos.length < arr.length) {
                paragrafos.push(<Paragrafo key={i} indice={i} conteudo={element} idTexto={texto.id} />)
                setParagrafos(paragrafos)
                i++
            }
        });
        // }
        i = 0
        // console.log("paragrafos -> " + paragrafos)
        // console.log(arr)
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
        if(dados.length > 0)
            setFavorito(true)
    }

    fazerTudo = (data) => {
        // jaFoi++
        console.log("oi eu to no fazerTudo")
        // console.log(data)
        checarFavoritos()
        getCategoria(data.categoria)
        getAutor(data.idautor)
        getParagrafos(data.documento)
        // console.log("tamanho -> " + paragrafos.length)
        // console.log("vez -> " + jaFoi)
        // console.log("olha os props aqui o -> " + props)
        // return (<Text>{"\n"}</Text>)
    }

    // BackHandler.addEventListener('zerarParagrafos', () => {setParagrafos([])});

    return (
        // <ScrollToBottom>
        
        <ScrollView ref={ref => {a = this.scrollView = ref }}>
             <TouchableOpacity style = {styles.gotobottom} onPress={EndButtonHandler} >
                <View>

                    <Text>

                        Tetstgdeudnhdygtwyhujde                        
                    </Text>
                </View>

                </TouchableOpacity> 
            {/* {console.log("PARAMETROS -> " + props)} */}
            {/* {console.log(texto)} */}
            {/* {fazerTudo(texto)} */}
            {/* {getCategoria(texto["categoria"])}
            {getAutor(texto["idautor"])} */}
            {/* <Text>salve</Text> */}
            <Text style={styles.titulo}>{texto["nome"]} {"\n"}</Text>
            <Text style={styles.texto}>Autor: </Text>
            <Text style={styles.textoLink}>{autor} {"\n"}</Text>
            <Text style={styles.texto}>Ano: </Text>
            <Text style={styles.textoLink}>{texto["ano"]} {"\n"}</Text>
            <Text style={styles.texto}>Categoria: </Text>
            <Text style={styles.textoLink}>{categoria + ", " + texto["generoassunto"]} {"\n"}</Text>
            <View style={styles.center}>
                <TouchableOpacity style={styles.botao} onPress={() => {
                    if(favorito)
                        desfavoritar()
                    else
                        favoritar()
                }} >
                    {!favorito?
                        <Text style={styles.txtBotao}>Adicionar{'\n'}aos favoritos</Text>:
                        <Text style={styles.txtBotao}>Remover{'\n'}dos favoritos</Text>}
                </TouchableOpacity>
            </View> 
            {texto["capa"] ?
                <View style={styles.capaEngloba}><Image style={styles.capa} source={{ uri: texto["capa"] }} /></View> :
                console.log()}
            {/* {texto && paragrafos ? (<Texto texto={texto} paragrafos={paragrafos} />) : console.log("ainda n recebi")} */}
            <Texto texto={texto} paragrafos={paragrafos} />

            <TouchableOpacity style = {styles.gotobottom} onPress={TopButtonHandler} >
                <View>

                    <Text>
WBVYWDUYGVWVGDYGYVTWYG7DYVWBGDVYWBDGH7GV                       
                    </Text>
                </View>

                </TouchableOpacity>

        </ScrollView>
        // </ScrollToBottom>
    )
})

const styles = StyleSheet.create({
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
        // fontWeight: 'bold'
    },
    capa: {
        width: Dimensions.get('window').width * 3 / 4,
        height: Dimensions.get('window').height * 3 / 4,
    },
    capaEngloba: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    gotobottom: {
        marginTop: 30
    }
})