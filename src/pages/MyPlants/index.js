import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert
} from 'react-native';
import {formatDistance} from 'date-fns';
import {pt} from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import  Header  from '../../components/header';
import PlantCardSecondary from '../../components/plantCardSecondary';
import colors from '../../styles/colors';
import waterdrop from '../../assets/img/waterdrop.png';
import fonts from '../../styles/fonts';
import Load from '../../components/load';


const MyPlants = () => { 
    const [loading, setLoading] = useState(true);
    const [myPlants, setMyPlants] = useState([]);
    const [newWatered, setNewWatered] = useState('');

    useEffect(() => {
        loadPlants();
    }, []);

    async function loadPlants() {
        try {
            const data = await AsyncStorage.getItem('@plantManager:plants');
            const plants = data ? (JSON.parse(data)) : {};

            const plantsStoraged = Object
                .keys(plants)
                .map(plant => {
                    return {
                        ...plants[plant].data,
                        hour: moment(new Date(plants[plant].data.dateTimeNotification)).format('HH:mm')
                    }
                })
                .sort((a, b) => {
                    Math.floor(
                        new Date(a.dateTimeNotification).getTime() / 1000 -
                        Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
                    )
                });

                const nextTime = formatDistance(
                    new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                    new Date().getTime(),
                    {locale: pt}
                );

                setNewWatered(
                    `Não esqueça de regar a ${plantsStoraged[0].name} em ${nextTime}.`
                );

                setMyPlants(plantsStoraged);

                setTimeout(() => {
                    setLoading(false);    
                }, 1500);
                
                

        } catch (error) {
            throw new Error(error);
        }
    }

    function handleRemove(planta){
        Alert.alert('Remover', `Deseja remover a ${planta.name}?`,[
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text:'Sim',
                onPress: async ()=>{
                    try {
                        const data = await AsyncStorage.getItem('@plantManager:plants');
                        const plants = data ? (JSON.parse(data)) : {};

                        delete plants[planta.id];

                        await AsyncStorage.setItem(
                            '@plantManager:plants',
                            JSON.stringify(plants)
                        );

                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id !== planta.id)
                        )

                    } catch (error) {
                        Alert.alert('Não foi Possível Remover', error.toString());
                    }
                }
            }
        ])
    }

    if(loading){
        return <Load/>
    }

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {newWatered}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas Regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={item => String(item.id)}
                    renderItem={({item}) => (
                       <PlantCardSecondary 
                       data={item}
                       handleRemove={()=>{handleRemove(item)}}
                       />
                    )}
                    contentContainerStyle={{paddingBottom:20}}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        //paddingTop: 50,
        backgroundColor: colors.background

    },
    spotlight:{
        backgroundColor:colors.blue_light,
        paddingHorizontal:20,
        borderRadius: 20,
        height:110,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    spotlightImage:{
        width:60,
        height:60
    },
    spotlightText:{
        flex:1,
        color:colors.blue,
        paddingHorizontal:20,
        fontFamily:fonts.text
        
    },
    plants:{
        flex:1,
        width:'100%'
    },
    plantsTitle:{
        fontSize:24,
        fontFamily:fonts.heading,
        color: colors.heading,
        marginVertical:20
    }
});

export default MyPlants;