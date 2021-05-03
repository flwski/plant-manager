import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList
} from 'react-native';
import colors from '../../styles/colors';

import Header from '../../components/header';
import fonts from '../../styles/fonts';
import EnviromentButton from '../../components/enviromentButton';

import Server from '../../services/server.json';
import PlantCardPrimary from '../../components/plantCardPrimary';
import Load from '../../components/load';
import { useNavigation } from '@react-navigation/core';


const PlantSelect = () => {

    const [enviroments, setEnviroments] = useState([]);
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    function handleEnviromentSelected(enviroment) {
        setEnviromentSelected(enviroment);

        if (enviroment === 'all') {
            return setFilteredPlants(plants);
        }

        const filtered = plants.filter(plant => plant.environments.includes(enviroment));

        setFilteredPlants(filtered);
    }

    useEffect(() => {
        function getEnviroments() {
            let data = Server.plants_environments;
            setEnviroments(data);
        }

        getEnviroments();
    }, []);

    useEffect(() => {
        function getPlants() {
            let data = Server.plants;
            setPlants(data);
            setFilteredPlants(data)
        }

        getPlants();

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    function handlePlantSelect(plant) {
        navigation.navigate('PlantSave', {plant})
    }

    if (loading) {
        return <Load />
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>
                    Em qual ambiente
            </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
            </Text>
            </View>

            <View>
                <FlatList
                    data={enviroments}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                    keyExtractor={item => item.key}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    contentContainerStyle={styles.contentContainerStyle}
                    keyExtractor={item => item.id}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    header: {
        paddingHorizontal: 30
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center'
    }
});

export default PlantSelect;