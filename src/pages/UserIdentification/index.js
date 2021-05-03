import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import  AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../components/button';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const UserIdentification = () => {

  const navigation = useNavigation();

  const [isFocused, setIsfocused] = useState(false);
  const [name, setName] = useState('');

  function handleInputBlur() {
    setIsfocused(false);
  }

  function handleInputFocus() {
    setIsfocused(true);
  }

  async function handleSubmit() {
    if (!name) {
      Alert.alert('Nome não preenchido', 'Me diz como chamar você 😢');
      return
    } 

    await AsyncStorage.setItem('@plantManager:user', name);

    navigation.navigate('Confirmation');
  }

  return (
    <SafeAreaView
      style={styles.container}
      behavor={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.form}>

          <Text style={styles.emoji}>
            {name.length > 0 ? '😆' : '😀'}
          </Text>

          <Text style={styles.title}>
            Como podemos {'\n'}
            chamar você?
          </Text>

          <TextInput
            placeholderTextColor={colors.gray}
            placeholder="Digite um nome"
            style={[styles.input, (isFocused || name.length > 0) && { borderColor: colors.green }]}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onChangeText={setName}
            value={name}
          />

          <View style={styles.footer}>
            <Button
              title={"Confirmar"}
              onPress={() => handleSubmit()}
            />
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white
  },
  content: {
    flex: 1,
    width: '100%'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center',
    width: '100%'
  },
  emoji: {
    fontSize: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 32,
    marginTop: 20
  },
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20
  }
})

export default UserIdentification;