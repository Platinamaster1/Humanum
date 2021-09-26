import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, BackHandler } from 'react-native';
import axios from 'react-native-axios'
import { useGoogleApi } from 'react-gapi'

export default props => {
    const {texto} = props
    const [paragrafos, setParagrafos] = useState([])
    // var CLIENT_ID = '17632860320-g7dnnkp959s8g3877fu7jgtjnpv9k4fl.apps.googleusercontent.com'
    // var API_KEY = 'AIzaSyBTOTZsBfn62HNZElBY0adco9JGSYU5sa0'
    // var SCOPES = 'https://www.googleapis.com/auth/documents'
    // var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];

    // const gapi = useGoogleApi({
    //     discoveryDocs: [
    //         'https://docs.googleapis.com/$discovery/rest?version=v1',
    //     ],
    //     scopes: [
    //         'https://www.googleapis.com/auth/documents',
    //     ],
    //     apiKey: [
    //         'AIzaSyBTOTZsBfn62HNZElBY0adco9JGSYU5sa0'
    //     ],
    //     clientId: [
    //         '17632860320-g7dnnkp959s8g3877fu7jgtjnpv9k4fl.apps.googleusercontent.com'
    //     ]
    // })
    // console.log("gapi -> " + gapi)

    // function handleClientLoad() {
    //     gapi.load('client:auth2', initClient);
    // }

    // function initClient() {
    //     gapi.client.init().then(function () {
    //         gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    //         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    //     });
    // }

    // function testarAPI () {
    //     // handleClientLoad()
    //     initClient()
    // }

    buscaTexto = async (dados) => {
        // var url = "https://pastebin.com/raw/wHN94kPC";
        // var url = "https://pastebin.com/raw/iRAHB6K5";
        // var url = "https://pastebin.com/raw/HKMw4UcF";
        var arr
        // var url = "https://pastebin.com/raw/" + dados.documento;  // ateneu
        var url = "https://pastebin.com/raw/iRAHB6K5"

        // await axios.get(url)
        //     .then(function (response) {
        //         arr = response.data.split("\r\n")
        //         // response.status(200).json(results.rows);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     })

        await axios.get(url)
            .then(response => response.data.split("\r\n"))
            .then(data => {
                // console.log(data)
                arr = data
            })
            .catch(function (error) {
                console.log(error);
            })
        
        var i = 0
        arr.forEach(element => {
            paragrafos.push(<Text key={i}>{element}</Text>)
            setParagrafos(paragrafos)
            // console.log(element)
            i++
        });
        i = 0
        console.log(paragrafos)
        // console.log(url)
        // return paragrafos
        // return (<Text>salve</Text>)
    }

    fazTudo = (dados) => {
        buscaTexto(dados)
        // return paragrafos
    }

    // BackHandler.addEventListener('hardwareBackPress', () => {setParagrafos([])})

    return (
        <View>
            {/* {console.log("gapi -> " + gapi)} */}
            {/* {props.texto? buscaTexto(): console.log("ainda não recebi patrão")} */}
            {fazTudo(props.texto)}
            <View>
                {paragrafos}
            </View>
            <Text>oi</Text>
        </View>
    )
}