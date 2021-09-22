import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'react-native-axios'
import {useGoogleApi} from 'react-gapi'

export default props => {
    var CLIENT_ID = '17632860320-g7dnnkp959s8g3877fu7jgtjnpv9k4fl.apps.googleusercontent.com'
    var API_KEY = 'AIzaSyBTOTZsBfn62HNZElBY0adco9JGSYU5sa0'
    var SCOPES = 'https://www.googleapis.com/auth/documents'
    var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];

    const gapi = useGoogleApi({
        discoveryDocs: [
            'https://docs.googleapis.com/$discovery/rest?version=v1',
        ],
        scopes: [
            'https://www.googleapis.com/auth/documents',
        ],
        apiKey: [
            'AIzaSyBTOTZsBfn62HNZElBY0adco9JGSYU5sa0'
        ],
        clientId: [
            '17632860320-g7dnnkp959s8g3877fu7jgtjnpv9k4fl.apps.googleusercontent.com'
        ]
    })

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init().then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    testarAPI = () => {
        handleClientLoad()
    }

    return (
        <View>
            {/* {testarAPI()} */}
            <Text>oi</Text>
        </View>
    )
}