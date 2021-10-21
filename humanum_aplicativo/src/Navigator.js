import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

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

function DrawerNav() {
    //const {email, name} = props.route.params
    return (
        <Drawer.Navigator initialRouteName="Inicial"
            drawerContentOptions={menuConfig}
            /*drawerContent={(props) => {
                return <Menu {...props} email={email} name={name}/>
            }}*/>
            <Drawer.Screen name="Inicial" component={Inicial} />
            {/* <Drawer.Screen name="Texto" component={Texto} /> */}
            <Drawer.Screen name="Perfil" component={TelaDePerfil} />
            <Drawer.Screen name="Busca" component={Busca}/>
            <Drawer.Screen name="Mensagens" component={Mensagens}/>
            {/*<Drawer.Screen name="Amanhã">
                {props => <TaskList title='Amanhã' daysAhead={1} {...props}/>}
            </Drawer.Screen>
            <Drawer.Screen name="Esta Semana">
                {props => <TaskList title='Semana' daysAhead={7} {...props}/>}
            </Drawer.Screen>
            <Drawer.Screen name="Este Mês">
                {props => <TaskList title='Mês' daysAhead={30} {...props}/>}
            </Drawer.Screen>*/}
        </Drawer.Navigator>
    )
}

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={AutenOuApp} />
            <Stack.Screen name="Autenticacao" component={Autenticacao} />
            <Stack.Screen name="Home" component={DrawerNav} />
            <Stack.Screen name="Texto" component={Texto} />
            <Stack.Screen name="PerfilOutros" component={PerfilOutros} />
            <Stack.Screen name="Chat" component={Chat} />
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