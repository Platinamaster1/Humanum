import React, { Component } from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native'

import Input from '../components/AutenticacaoInputs'
import commonStyles from '../commonStyles'
import axios from 'axios'
const initialState = {
    nome: '',
    email: 'enzo.spinella@gmail.com',
    senha: '01212012120',
    confirmarSenha: '',
    telefone: '',
    dataNascimento: '',
    sexo: '',
    novoUsuario: false
}

export default class Autenticacao extends Component {
    state = {
        // nome: '',
        // email: '',
        // senha: '',
        // confirmarSenha: '',
        // telefone: '',
        // dataNascimento: '',
        // sexo: '',
        // novoUsuario: false
        ...initialState
    }

    cadastrar = () => {
        // console.log('ae')
        var today = new Date()
        var data = today.getFullYear().toString() + '/' + today.getMonth().toString() + '/' + today.getDay()
        axios.post('http://192.168.15.7:3002/usuarios', {
            nome: this.state.nome,
            email: this.state.email,
            telefone: this.state.telefone,
            datanascimento: this.state.dataNascimento,
            sexo: this.state.sexo,
            foto: null,
            banner: null,
            descricao: null,
            pontos: 0,
            moderador: 0,
            datacriacao: data
        })
        .then(function (response) {
            console.log(response);
        })
          .catch(function (error) {
            console.log(error);
        });
    }

    // componentDidMount = async () => {~
    //     await setTimeout(
    //         () => loadAsync({
    //             'FrankRuhlLibre-Regular': require('../../assets/fonts/FrankRuhlLibre-Regular.ttf'),
    //             'JacquesFrancois-Regular': require('../../assets/fonts/JacquesFrancois-Regular.ttf')
    //         }), 3000
    //     )
    // }
    
    render() {
        return (
            <SafeAreaView style={st.container}>
                <Text style={st.title}>HUMANUM</Text>
                <View style={[st.loginLogout, {
                    height: this.state.novoUsuario ? '70%' : '70%',
                }]}>
                    <Text style={st.subtitle}>{this.state.novoUsuario ? 'Cadastro' : 'Login'}</Text>
                    <View style={st.logInformation}>
                        {this.state.novoUsuario ? 
                        <ScrollView>
                            <View>
                                {this.state.novoUsuario ? <Input icon='user' placeholder='Nome' value={this.state.nome} style={[st.label]}
                                    onChangeText={nome => this.setState({ nome })}/> : null}
                                <Input icon='at' placeholder='E-Mail' value={this.state.email} style={st.label}
                                    onChangeText={email => this.setState({ email })}/>
                                <Input icon='lock' placeholder='Senha' value={this.state.senha} style={st.label}
                                    onChangeText={senha => this.setState({ senha })} secureTextEntry={true}/>
                                {this.state.novoUsuario ? <Input icon='asterisk' placeholder='Confirmar Senha' value={this.state.confirmarSenha} style={st.label}
                                    onChangeText={confirmarSenha => this.setState({ confirmarSenha })} secureTextEntry={true}/> : null}
                                {this.state.novoUsuario ? <Input icon='phone' placeholder='Telefone' value={this.state.telefone} style={st.label}
                                    onChangeText={telefone => this.setState({ telefone })}/> : null}
                                {this.state.novoUsuario ? <Input icon='birthday-cake' placeholder='Data de Nascimento' value={this.state.dataNascimento} style={st.label}
                                    onChangeText={dataNascimento => this.setState({ dataNascimento })}/> : null}
                                {this.state.novoUsuario ? <Input icon='venus-mars' placeholder='Sexo' value={this.state.sexo} style={st.label}
                                    onChangeText={sexo => this.setState({ sexo })}/> : null}
                            </View>
                        </ScrollView> :
                        <View style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                            <Input icon='at' placeholder='E-Mail' value={this.state.email} style={st.label}
                                onChangeText={email => this.setState({ email })}/>
                            <Input icon='lock' placeholder='Senha' value={this.state.senha} style={st.label}
                                onChangeText={senha => this.setState({ senha })} secureTextEntry={true}/>
                        </View>}
                        <TouchableOpacity style={st.botao}
                            onPress = {
                                () => {
                                    if(this.state.novoUsuario){
                                        if(this.state.senha === this.state.confirmarSenha)
                                            this.cadastrar()
                                    }
                                }
                            }>
                                <View>
                                    <Text style={st.labelBotao}>{this.state.novoUsuario ? 'Registrar' :  'Entrar'}</Text>
                                </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        onPress={
                            () => {
                                this.setState({ novoUsuario: !this.state.novoUsuario })
                            }
                        }>
                        <Text style={st.labelDeBaixo}>
                            {this.state.novoUsuario ? 'Já possuo conta' : 'Não possuo conta'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const st = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily1,
        fontSize: 50,
        color: '#A90A0A',
        marginBottom: 30
    },
    loginLogout: {
        padding: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent:'center'
    },
    subtitle: {
        fontSize: 36,
        fontFamily: commonStyles.fontFamily2,
    },
    logInformation: {
        flex: 1,
        width: '100%',
        marginTop: 15,
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
    },
    label: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 24,
        marginHorizontal: 10,
        height: 40,
        marginTop: 10,
    },
    botao: {
        flexDirection: 'row',
        backgroundColor: '#A90A0A',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 10
    },
    labelBotao: {
        fontFamily: commonStyles.fontFamily2,
        color: '#FFFFFF',
        fontSize: 24,
    },
    labelDeBaixo: {
        fontFamily: commonStyles.fontFamily2,
        color: '#A90A0A',
        fontSize: 24, 
        marginTop: 10
    }
})