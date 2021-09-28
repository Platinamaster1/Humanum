import React, { Component} from 'react'
import {View, Text, StyleSheet ,Image, Dimensions, TouchableOpacity} from 'react-native'
import commonStyles from '../commonStyles'
import TextosFavoritos from '../components/TextosFavoritos'
import Icon from 'react-native-vector-icons/FontAwesome'
import Input from '../components/AutenticacaoInputs'
import * as ImagePicker from 'react-native-image-picker';


const dimensions = Dimensions.get('window');
export default class TelaDePerfil extends Component {
    state = {
        nome: 'Glutão',
        urlFundo: 'https://media.discordapp.net/attachments/854128061121560626/879775458697297940/unknown-6.png?width=384&height=454',
        urlPerfil: 'https://media.discordapp.net/attachments/799316157332717621/890331872469602354/unknown.png?width=774&height=454',
        desc: 'Meu Nome é Glutão e eu gosto de ler',
        dataCriada: '17/05/2021',
        pontos: 420,
        modoEdicao: false,
        editNome: false,
        editDesc: false,
    }
    chooseImage = () => {
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
    
            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            // alert(JSON.stringify(response));s
            console.warn('response', JSON.stringify(response));
            this.setState({
              filePath: response,
              fileData: response.data,
              fileUri: response.uri
            });
          }
        });
    }
    async componentDidMount() {
    }

    render() {
        return (
            <>
                <View style={st.container}>
                    <View style={st.view1}>
                        <View style={st.viewFundo}>
                            <Image style={st.imgFundo} source={{uri:this.state.urlFundo}} resizeMode='stretch'/>
                            {this.state.modoEdicao ? 
                            <TouchableOpacity style={[st.iconCam, st.cam1]}
                                onPress={this.chooseImage}>
                                <Icon name='camera' size={25} />
                            </TouchableOpacity>
                            : null}
                        </View>
                        <View style={st.viewFoto}>
                            <Image style={st.fotoPerfil} source={{uri:this.state.urlPerfil}}/>
                            {this.state.modoEdicao ? 
                            <TouchableOpacity style={[st.iconCam, st.cam2]}
                                onPress={this.chooseImage}>
                                <Icon name='camera' size={25} />
                            </TouchableOpacity>
                            : null}
                        </View>

                        <TouchableOpacity style={st.icon}
                        onPress = {
                            () => {
                                this.setState({ modoEdicao: true })
                            }
                        }>
                            {!this.state.modoEdicao ? <Icon name='cog' size={30}/> : null}
                        </TouchableOpacity>
                        <TouchableOpacity style={st.btnSalvar}
                        onPress = {
                            () => {
                                this.setState({ modoEdicao: false })
                                // Salvar os dados no banco etc
                            }
                        }>
                            {this.state.modoEdicao ? <Text style={st.salvar}>Salvar</Text> : null}
                        </TouchableOpacity>

                        <View style={st.nome}>
                            {!this.state.modoEdicao ? <Text style={st.t1}>{this.state.nome}</Text> : null}
                        </View>
                    </View>

                    <View style={st.view2}>
                        {this.state.modoEdicao ? 
                        <View style={st.camposEdi}>
                                { !this.state.editNome ?
                                <Text style={[st.t1, st.txtCampos]}>Nome: {this.state.nome}</Text> :
                                <Input icon='user' placeholder='Nome' value={this.state.nome} style={[st.txtCampos]}
                                    onChangeText={nome => this.setState({ nome })}/>
                                }
                                <TouchableOpacity style={st.iconCampos}
                                    onPress = {
                                        () => {
                                            this.setState({ editNome: !this.state.editNome })
                                            // Salvar os dados no banco etc
                                        }
                                }>
                                    <Icon name={!this.state.editNome ? 'edit' : 'save'} size={25}/>
                                </TouchableOpacity>
                            </View> 
                        : null}

                        {this.state.modoEdicao ? 
                        <View style={st.camposEdi}>
                                { !this.state.editDesc ?
                                <Text style={[st.t1, st.txtCampos]}>Descrição: {this.state.desc}</Text> :
                                <Input icon='comment' placeholder='Descrição' value={this.state.desc} style={[st.txtCampos]}
                                    onChangeText={desc => this.setState({ desc })}/>
                                }
                                <TouchableOpacity style={st.iconCampos}
                                    onPress = {
                                        () => {
                                            this.setState({ editDesc: !this.state.editDesc })
                                            // Salvar os dados no banco etc
                                        }
                                }>
                                    <Icon name={!this.state.editDesc ? 'edit' : 'save'} size={25}/>
                                </TouchableOpacity>
                            </View> 
                        : null}
                        {!this.state.modoEdicao ? <Text style={st.t2}>{this.state.desc}</Text>: null}
                        {!this.state.modoEdicao ? <Text style={st.t2}>Conta criada em: {this.state.dataCriada}</Text>: null}
                        {!this.state.modoEdicao ? <Text style={st.t1}>{this.state.pontos} Pontos</Text>: null}
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
        top: dimensions.height/3.1,
        left: dimensions.width/1.6
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
        top: dimensions.height/3.7,
        left: dimensions.width/20
    },
    cam2: {
        position: 'absolute',
        top: dimensions.height/5.8,
        left: dimensions.width/50
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
    btnSalvar: {
        position: 'absolute',
        top: dimensions.height/3.1,
        left: dimensions.width/1.3
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
        width: dimensions.width/2
    }
})