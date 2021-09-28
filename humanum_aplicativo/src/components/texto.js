import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, BackHandler } from 'react-native';
import axios from 'react-native-axios'
import { useGoogleApi } from 'react-gapi'

export default props => {
    const parag = props.paragrafos
    return (
        <View>
            {parag}
        </View>
    )
}