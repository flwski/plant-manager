import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

import wateringImg from '../../assets/img/watering.png';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const Welcome = () => {

    const navigation = useNavigation();

    function handleStart(){
        navigation.navigate('UserIdentification');
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.wrapper}>

                    <Text
                        style={styles.title}>
                        Gerencie  {'\n'}
                    suas plantas de {'\n'}
                    forma fácil
                    </Text>

                    <Image
                        source={wateringImg}
                        style={styles.imagem} />

                    <Text
                        style={styles.subtitle}>
                        Não esqueça mais de regar suas plantas.
                        Nós cuidamos de lembrar você sempre que precisar
                </Text>

                    <TouchableOpacity
                        onPress={()=> handleStart()}
                        activeOpacity={0.8}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                            <Icon name="chevron-right" size={25} color={colors.white} />
                        </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    wrapper:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingHorizontal:20
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        color: colors.heading,
        marginTop: 38,
        fontFamily: fonts.heading,
        lineHeight: 34
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 20,
        color: colors.heading,
        fontFamily: fonts.text
    },
    imagem: {
        height: dWidth * 0.7,
        resizeMode: 'contain'
    },
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 30,
        height: 56,
        width: 56
    },
    buttonText: {
        color: colors.white,
        fontSize: 24
    }
})

export default Welcome;