import React, { Component } from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native'

import Input from '../components/autenticacaoInputs'
import commonStyles from '../commonStyles'
import axios from 'react-native-axios'
import DatePicker from 'react-native-datepicker'
import {Picker} from '@react-native-picker/picker'
import ipconfig from '../ipconfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
const initialState = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    dataNascimento: '2000-01-01',
    sexo: 'Masculino',
    novoUsuario: false,
    escreveuErrado: false,
    logou: false
}

export default class Autenticacao extends Component {
    state = {
        ...initialState,
        dadosUsuario: [{}]
    }

    buscar = async (email, senha) => {
        try {
            var url = 'http://' + ipconfig.ip + ':3002/usuarios'
            const response = await axios.get(url);
            const dados = response.data
            console.log("BUSCAR / LOGIN")
            console.log(dados)
            let usuario = await dados.filter(objeto => objeto["email"].trim() === email.trim() && objeto["senha"] === senha)
            if(usuario.length == 0) {
                this.setState({escreveuErrado: true, senha: ''})
            }
            else {
                this.setState({logou: true, dadosUsuario: usuario})
                console.log("DadosUsurio no buscar da classe Autenticacao")
                console.log(this.state.dadosUsuario)
                await AsyncStorage.setItem('dadosUsuario', JSON.stringify(usuario))
            }
        } catch (error) {
            console.error(error);
        }
    }

    cadastrar = () => {
        var today = new Date()
        var data = today.getFullYear().toString() + '/' + today.getMonth().toString() + '/' + today.getDay()
        let usuarioCadastrado = {
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
            datacriacao: data,
            senha: this.state.senha
        }
        axios.post('http://' + ipconfig.ip + ':3002/usuarios', {
            usuarioCadastrado
        })
        .then(async function (response) {
            ToastAndroid.show('Usuario cadastrado com sucesso!', ToastAndroid.LONG)
            await AsyncStorage.setItem('dadosUsuario', JSON.stringify(usuarioCadastrado))
        })
          .catch(function (error) {
            console.log(error);
        });
    }
    
    render() {
        return (
            <SafeAreaView style={st.container}>
                <Text style={st.title}>HUMANUM</Text>
                <View style={[st.loginLogout, {
                    height: this.state.novoUsuario ? '70%' : '70%',
                }]}>
                    <Text style={st.subtitle}>{this.state.novoUsuario ? 'Cadastro' : 'Login'}</Text>
                    <View style={st.logInformation}>
                        {this.state.escreveuErrado ? <Text style={{color: 'red', fontSize: 16}}>Email ou Senha Incorretos</Text> : null}
                        {this.state.novoUsuario ? 
                        <ScrollView>
                            <View>
                                {this.state.novoUsuario ? <Input icon='user' placeholder='Nome' placeholderTextColor='gray' value={this.state.nome} style={[st.label]}
                                    onChangeText={nome => this.setState({ nome })}/> : null}
                                <Input icon='at' placeholder='E-Mail' placeholderTextColor='gray' keyboardType='email-address' value={this.state.email} style={st.label}
                                    onChangeText={email => this.setState({ email })}/>
                                <Input icon='lock' placeholder='Senha' placeholderTextColor='gray' value={this.state.senha} style={st.label}
                                    onChangeText={senha => this.setState({ senha })} secureTextEntry={true}/>
                                {this.state.novoUsuario ? <Input icon='asterisk' placeholder='Confirmar Senha' placeholderTextColor='gray' value={this.state.confirmarSenha} style={st.label}
                                    onChangeText={confirmarSenha => this.setState({ confirmarSenha })} secureTextEntry={true}/> : null}
                                {this.state.novoUsuario ? <Input icon='phone' placeholder='Telefone' placeholderTextColor='gray' keyboardType='phone-pad' value={this.state.telefone} style={st.label}
                                    onChangeText={telefone => this.setState({ telefone })}/> : null}
                                {this.state.novoUsuario ? <DatePicker date={this.state.dataNascimento} format="YYYY-MM-DD"
                                    onDateChange={(dataNascimento) => this.setState({ dataNascimento })}
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginTop: 4,
                                            marginLeft: 36
                                        }
                                    }}/> : null}
                                <Picker
                                selectedValue={this.state.sexo}
                                onValueChange={sexo => this.setState({sexo})}
                                >
                                    <Picker.Item label="Masculino" value = "Masculino"/>
                                    <Picker.Item label="Feminino" value = "Feminino"/>
                                    <Picker.Item label="Outro" value = "Outro"/>
                                </Picker>
                            </View>
                        </ScrollView> :
                        <View style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                            <Input icon='at' placeholder='E-Mail' placeholderTextColor='gray' keyboardType='email-address' value={this.state.email} style={st.label}
                                onChangeText={email => this.setState({ email })}/>
                            <Input icon='lock' placeholder='Senha' placeholderTextColor='gray' value={this.state.senha} style={st.label}
                                onChangeText={senha => this.setState({ senha })} secureTextEntry={true}/>
                        </View>}
                        <TouchableOpacity style={st.botao}
                            onPress = {
                                () => {
                                    if(this.state.novoUsuario){
                                        if(this.state.nome === '' || this.state.email === ''
                                        || this.state.senha === '' || this.state.confirmarSenha === ''
                                        || this.state.dataNascimento === '' || this.state.sexo === ''){
                                            ToastAndroid.show('Preencha todos os campos!', ToastAndroid.LONG)
                                            return 0
                                        }
                                        if(this.state.senha === this.state.confirmarSenha)
                                            this.cadastrar()
                                        else
                                            ToastAndroid.show('Confirme sua senha corretamente!', ToastAndroid.LONG)
                                    }
                                    else{
                                        this.buscar(this.state.email, this.state.senha)

                                        setTimeout(() => {
                                            console.log("IRIRIRIR")
                                            console.log(this.state.dadosUsuario)
                                            if(this.state.dadosUsuario) 
                                                this.props.navigation.push("Home", {dadosusuario: this.state.dadosUsuario})
                                        }, 3000)
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
        justifyContent: 'center',
        //alignItems: 'center',
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