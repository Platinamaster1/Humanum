import React from 'react'
import {View, 
        Text, 
        StyleSheet, 
        TouchableWithoutFeedback,
        TouchableOpacity,} from 'react-native'

import commonStyles from '../commonStyles'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    const getRightContent = () => {
        return (
            <TouchableOpacity style={style.right}
                onPress={() => props.onFinish && props.onFinish(props.id)}>
                <Icon name='check' size={20} color='#FFF' />
            </TouchableOpacity>
        )
    }
    const getLeftContent = () => {
        return (
            <TouchableOpacity style={style.left}>
                <Icon name='trash' size={20} color='#FFF' style={style.excludeIcon}/>
            </TouchableOpacity>
        )
    }

    return (
        <Swipeable renderRightActions={getRightContent} 
                   renderLeftActions={getLeftContent}
                   onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
            <TouchableWithoutFeedback
                onPress={() => props.showModal && props.showModal(props.idcomentario, props.trecho)}>
            <View style={[style.container, {backgroundColor: props.resolvido ? 'green' : '#FFF'}]}>
                <Text style={style.assunto}>{props.assunto}</Text>
                <Text style={style.desc}>{props.descricao}</Text>
                <Text style={[style.tipo, {color: props.resolvido ? 'white' : 'gray'}]}>{props.tipo}</Text>
            </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    )
}


const style = StyleSheet.create({
    container: {
        borderColor: '#AAA',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,  
    },
    assunto: {
        fontFamily: commonStyles.fontFamily2,
        fontSize: 18,
        marginBottom: 10,
    },
    desc: {
        fontFamily: commonStyles.fontFamily1,
        fontSize: 14,
        textAlign: 'justify'
    },
    tipo: {
        fontFamily: commonStyles.fontFamily1,
        fontSize: 16,
        color: 'gray',
        textAlign: 'right',
    },
    right: {
        backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 40,
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center'
    },
    excludeIcon: {
        marginLeft: 10
    }
})