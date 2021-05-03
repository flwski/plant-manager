import React, {useState, useEffect} from 'react';
import { View, StatusBar } from 'react-native';
import Notifications from 'react-native-push-notification';

import Routes from './routes';

const src = () => {  

    return (
        <>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Routes />
        </>
    );
}

export default src;