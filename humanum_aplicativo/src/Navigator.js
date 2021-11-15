import React, { useState } from 'react'
import { Text, StatusBar } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IconBadge from 'react-native-icon-badge';




// import TaskList from './screens/TaskList'
// import Auth from './screens/Auth'
// import AuthOrApp from './screens/AuthOrApp'
// import Menu from './screens/Menu'
import Inicial from './screens/Inicial'
import Autenticacao from './screens/Autenticacao'
import commonStyles from './commonStyles'
import Texto from './screens/Texto';
import TelaDePerfil from './screens/TelaDePerfil'
import Busca from './screens/Busca'
import PerfilOutros from './screens/PerfilOutros';
import Chat from './screens/Chat'
import Mensagens from './screens/Mensagens';
import AutenOuApp from './screens/AutenOuApp'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from './Header';
import CriarGrupo from './screens/CriarGrupo';
import Denuncias from './screens/Denuncias';

const menuConfig = {
    activeTintColor: '#A90A0A',
    labelStyle: {
        fontFamily: commonStyles.fontFamily2,
        fontWeight: 'normal',
        fontSize: 24
    }
}


const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator();

const TabNav = props => {
    console.log("VINDOS DO BAGULHETE")
    console.log(props.route.params)
    const {id, nome, descricao, datacriacao, pontos, banner, foto, moderador} = props.route.params[0] ? props.route.params[0] : props.route.params.dadosusuario[0]
    console.log("DADOS VINDOS DO PUSH HOME")
    console.log(id, nome, descricao, datacriacao, pontos, banner, foto, moderador)
    return (
        <>
        <Header navigation={props.navigation}/>
        <Tab.Navigator initialRouteName="Inicial"
            tabBarPosition={'bottom'}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {     
                    let iconName
                    let mensagens
                    if (route.name === 'Inicial') {
                        iconName = 'home'
                        mensagens = '0'
                    } 
                    else if (route.name === 'Busca') {
                        iconName = 'search'
                        mensagens = '0'
                    }
                    else if (route.name === 'Mensagens') {
                        iconName = 'comments'
                        mensagens = '0'
                    }
                    else if (route.name === 'Perfil') {
                        iconName = 'user'
                        mensagens = '0'
                    }
                    else if (route.name === 'Denuncias') {
                        iconName = 'ban'
                        mensagens = '0'
                    }
      
                    return<IconBadge
                        MainElement={<Icon name={iconName} size={20} color={color} />}
                        BadgeElement={<Text style={{ color: 'white', fontSize: 9 }}>{mensagens}</Text>}
                        IconBadgeStyle={{
                            backgroundColor: '#a90a0a',
                            top: -10,
                            right: -15,
                        }}
                        Hidden={mensagens === '0'}
                    />
                },
                tabBarActiveTintColor: '#a90a0a',
                tabBarInactiveTintColor: 'black',
                tabBarShowLabel: false,
                swipeEnabled: true,
                tabBarIconStyle: {alignItems: 'center', justifyContent: 'center'},
                tabBarIndicatorStyle: {borderColor: '#a90a0a', borderWidth: 1},
            })}>
            <Tab.Screen name="Inicial" component={Inicial} />
            <Tab.Screen name="Busca" component={Busca} options={{headerShown: false}}/>
            <Tab.Screen name="Mensagens" component={Mensagens} /*options={{tabBarBadge: 3}}*//>
            <Tab.Screen name="Perfil">
                {props => <TelaDePerfil {...props} nome={nome} desc={descricao}
                           data={datacriacao} pontos={pontos}
                           banner={banner} foto={foto} id={id}/>}
            </Tab.Screen>
            {moderador > 0 &&
                <Tab.Screen name="Denuncias" component={Denuncias} />
            }
        </Tab.Navigator>
        </>
    )
}

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={AutenOuApp} />
            <Stack.Screen name="Autenticacao" component={Autenticacao} />
            <Stack.Screen name="Home" component={TabNav} />
            <Stack.Screen name="Texto" component={Texto} />
            <Stack.Screen name="PerfilOutros" component={PerfilOutros} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="CriarGrupo" component={CriarGrupo} />
        </Stack.Navigator>
    )
}

const Navigator = () => {
    return (
        <NavigationContainer>
            <AuthNavigator />
        </NavigationContainer>
    )
}

export default Navigator;