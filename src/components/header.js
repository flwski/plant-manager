import React,{useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { color } from 'react-native-reanimated';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

// import { Container } from './styles';

const Header = () => {

    const [name, setName] = useState('');


    useEffect(() => {
        async function getName() {
            setName(await AsyncStorage.getItem('@plantManager:user'));
        }

        getName();
    }, [])

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>{name}</Text>
            </View>

            <Image style={styles.image} source={{ uri: 'https://avatars.githubusercontent.com/u/21129244?v=4' }} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    greeting: {
        fontSize: 32,
        fontFamily: fonts.text,
        color: colors.heading
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    }
});

export default Header;