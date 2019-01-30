/**
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import VIForegroundService from "@voximplant/react-native-foreground-service";

type Props = {};
export default class App extends Component<Props> {

    async startService() {
        if (Platform.OS !== 'android') {
            console.log('Only Android platform is supported');
            return;
        }
        if (Platform.Version >= 26) {
            const channelConfig = {
                id: 'ForegroundServiceChannel',
                name: 'Notification Channel',
                description: 'Notification Channel for Foreground Service',
                enableVibration: false,
                importance: 2
            };
            await VIForegroundService.createNotificationChannel(channelConfig);
        }
        const notificationConfig = {
            id: 3456,
            title: 'Foreground Service',
            text: 'Foreground service is running',
            icon: 'ic_notification',
            priority: 0
        };
        if (Platform.Version >= 26) {
            notificationConfig.channelId = 'ForegroundServiceChannel';
        }
        await VIForegroundService.startService(notificationConfig);
    }

    async stopService() {
        await VIForegroundService.stopService();
    }


    render() {
        return (
            <View style={styles.container}>
                <Button title="Start foreground service" onPress={() => this.startService()}/>
                <View style={styles.space}/>
                <Button title="Stop foreground service" onPress={() => this.stopService()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    space: {
        flex: 0.1
    }
});
