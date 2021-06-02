import React, { Component } from 'react'
import {View, Text, StyleSheet, Image, SafeAreaView} from 'react-native'

export default class Splash extends Component {
    componentDidMount = () => {
        setTimeout(
            () => loadAsync({
                'FrankRuhlLibre-Regular': require('../../assets/fonts/FrankRuhlLibre-Regular.ttf'),
                'JacquesFrancois-Regular': require('../../assets/fonts/JacquesFrancois-Regular.ttf')
            }), 3000
        )
    }

    render() {
        return(
            <SafeAreaView style={style.container}>
                <Text>HUMANUM</Text>
                <Image source='../../assets/splashImage.png'/>
            </SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 50,
        fontFamily: commonStyles.fontFamily2,
    }
})