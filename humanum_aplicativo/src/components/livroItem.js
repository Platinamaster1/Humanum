import React, {useEffect, useState} from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import axios from 'react-native-axios'

export default props => {
    return(
        <View style={styles.container}>
            <Text>teste</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FF0000",
        height: 200,
        width: 100
    }
})