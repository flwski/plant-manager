import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Text,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity,

} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';

import waterdrop from '../../assets/img/waterdrop.png';

import { Button } from '../../components/button';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Notifications from 'react-native-push-notification';

const PlantSave = ({ navigation }) => {

    const [selectDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const route = useRoute();
    const { plant } = route.params;


    function handleChangeTime(event, dateTime) {
        setShowDatePicker(oldState => !oldState);

        if (dateTime) {
            setSelectedDateTime(dateTime);
        }
    }

    function handleOpenDateTimePicker() {
        setShowDatePicker(oldState => !oldState);
    }

    async function savePlant(plant) {
        try {

            const nextTime = new Date(plant.dateTimeNotification);
            const now = new Date();

            const { times, repeat_every } = plant.frequency;
            if (repeat_every === 'week') {
                const interval = Math.trunc(1 / times);
                nextTime.setDate(now.getDate() + interval);
            }
            // else{
            //     nextTime.setDate(nextTime.getDate() + 1);
            // }

            const seconds = Math.abs(
                Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
            );

            Notifications.channelExists('default', (exists)=>{
                console.log('channels', exists);
                if(!exists){
                    Notifications.createChannel(
                        {
                          channelId: "default", // (required)
                          channelName: "Default Channel", // (required)
                          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                          playSound: true, // (optional) default: true
                          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                          importance: 4, // (optional) default: 4. Int value of the Android notification importance
                          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                        },
                        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
                      );
                }
            });
 
            Notifications.localNotificationSchedule({
                playSound: true,
                channelId: 'default',
                priority: 'high',
                title: 'Heeey, 🌱',
                message: `Está na hora de cuidar da sua ${plant.name}`,
                userInfo: {
                    plant
                },
                date: new Date(Date.now() + seconds * 1000),
                repeatType: repeat_every,
                ignoreInForeground: false
            });           

            const data = await AsyncStorage.getItem('@plantManager:plants');
            const oldPlants = data ? (JSON.parse(data)) : {};

            const newPlant = {
                [plant.id]: {
                    data: plant,
                    // notificationId
                }
            }

            await AsyncStorage.setItem('@plantManager:plants', JSON.stringify({
                ...newPlant,
                ...oldPlants
            }));

        } catch (error) {
            throw new Error(error);
        }
    }

    async function handleSave() {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectDateTime
            });
            navigation.replace('MyPlants');

        } catch (error) {
            Alert.alert('Erro', error.toString());
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.plantInfo}>
                <SvgFromUri
                    uri={plant.photo}
                    height={150}
                    width={150}
                />

                <Text style={styles.plantName}>
                    {plant.name}
                </Text>

                <Text style={styles.plantAbout}>
                    {plant.about}
                </Text>
            </View>

            <View style={styles.controller}>
                <View style={styles.tipContainer}>
                    <Image
                        source={waterdrop}
                        style={styles.tipImage} />

                    <Text style={styles.tiptext}>
                        {plant.water_tips}
                    </Text>
                </View>

                <Text style={styles.alertLabel}>
                    Escolha o melhor horário para ser lembrado:
                </Text>

                {showDatePicker &&
                    <DateTimePicker
                        value={selectDateTime}
                        mode="time"
                        display="spinner"
                        onChange={handleChangeTime}

                    />}

                {
                    <TouchableOpacity onPress={() => handleOpenDateTimePicker()} style={styles.dateTimePickerButton}>

                        <View style={styles.inputHour}>
                            <Text style={styles.dateTimePickertext}>
                                {`${(selectDateTime.getHours() <= 9 ? '0' : '') + selectDateTime.getHours()}`}
                            </Text>
                        </View>

                        <Text style={styles.dateTimePickertext}>
                            :
                            </Text>

                        <View style={styles.inputHour}>
                            <Text style={styles.dateTimePickertext}>
                                {`${(selectDateTime.getMinutes() <= 9 ? '0' : '') + selectDateTime.getMinutes()}`}
                            </Text>
                        </View>

                    </TouchableOpacity>
                }

                <Button
                    title={"Cadastrar Planta"}
                    onPress={() => handleSave()} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56,
    },
    tiptext: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickertext: {
        color: colors.heading,
        fontSize: 40,
        fontFamily: fonts.text
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inputHour: {
        backgroundColor: colors.shape,
        paddingHorizontal: 10,
        margin: 5,
        borderRadius: 10
    }
});

export default PlantSave;