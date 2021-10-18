import React, { useEffect, useState } from 'react'
import { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, FlatList, ScrollView, Image } from 'react-native';
import axios from 'react-native-axios'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    const { ehDM, destinatario } = props.route.params
    var a = ['oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi', 'oi']
    return (
        <View>
            <View style={styles.horizontal}>
                <Icon name='arrow-left' size={20} />
                <Image source={{ uri: destinatario.foto }} style={styles.foto} />
                <Text>{!ehDM ? destinatario.nome : null}</Text>
            </View>
            <FlatList data={a} renderItem={({ item }) => <Text>{item}</Text>} />
        </View>
    )
}

const styles = StyleSheet.create({
    horizontal: {
        marginTop: 30,
        flexDirection: 'row'
    },
    foto: {
        borderRadius: 100,
        height: 50,
        width: 50
    }
})