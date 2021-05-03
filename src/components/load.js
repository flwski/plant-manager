import React from 'react';
import {
    View,
    StyleSheet,
    Image
} from 'react-native';

import loadAnimation from '../assets/img/load.json';
import LotieView from 'lottie-react-native';

// import { Container } from './styles';

const Load = () => {
    return (
        <View style={styles.container}>
            <LotieView
                source={loadAnimation}
                autoPlay
                loop
                style={styles.animation}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    animation:{
        backgroundColor:'transparent',
        width:200,
        height:200
    }
})

export default Load;