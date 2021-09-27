import React, { Component} from 'react'
import {View, Text, StyleSheet, ScrollView,Image, Dimensions} from 'react-native'
import commonStyles from '../commonStyles'
import TextosFavoritos from '../components/TextosFavoritos'
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'

const dimensions = Dimensions.get('window');
export default class TelaDePerfil extends Component {
    state = {
        nome: 'Glutão',
        urlFundo: 'https://media.discordapp.net/attachments/854128061121560626/879775458697297940/unknown-6.png?width=384&height=454',
        urlPerfil: 'https://media.discordapp.net/attachments/799316157332717621/890331872469602354/unknown.png?width=774&height=454',
        desc: 'Meu Nome é Glutão e eu gosto de ler',
        dataCriada: '17/05/2021',
        pontos: 420
    }

    async componentDidMount() {
    }

    render() {
        return (
            <>
                <View style={st.container}>
                    <View style={st.view1}>
                        <View style={st.viewFundo}>
                            <Image style={st.imgFundo  } source={{uri:this.state.urlFundo}} resizeMode='stretch'/>
                        </View>
                        <View style={st.viewFoto}>
                            <Image style={st.fotoPerfil} source={{uri:this.state.urlPerfil}}/>
                        </View>

                        <Icon name='cog' size={30} style={st.icon} />

                        <View style={st.nome}>
                            <Text style={st.t1}>{this.state.nome}</Text>
                        </View>
                    </View>

                    <View style={st.view2}>
                        <Text style={st.t2}>{this.state.desc}</Text>
                        <Text style={st.t2}>Conta criada em: {this.state.dataCriada}</Text>
                        <Text style={st.t1}>{this.state.pontos} Pontos</Text>
                    </View>
                </View>
                <View style={st.textosFav}>
                    <Text style={st.t1}>Textos Favoritos</Text>
                    <TextosFavoritos />
                </View>
            </>
        )
    }
}

const st = StyleSheet.create({
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
    icon: {
        position: 'absolute',
        top: 190,
        left: 230
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
    imgFundo:{
        width: dimensions.width,
        height: dimensions.width * 8 / 16,        
    },
    viewFoto: {
        justifyContent: 'center',
    },
    fotoPerfil:{
        width: 130,
        height: 130,
        borderRadius:65,
    },
    textosFav: {
        flex: 35,
        width: dimensions.width,
        marginLeft: 25,
    },
})