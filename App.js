/**
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Button} from 'react-native';
import VIForegroundService from "@voximplant/react-native-foreground-service";

class App extends Component {
    state = {
        foregroundService: null,
        isRunningService: false,
        channelConfig: {
            id: 'ForegroundServiceChannel',
            name: 'Notification Channel',
            description: 'Notification Channel for Foreground Service',
            enableVibration: false,
            importance: 2
        },
        notificationConfig: {
            channelId: 'ForegroundServiceChannel',
            id: 3456,
            title: 'Foreground Service',
            text: 'Foreground service is running',
            icon: 'ic_notification',
            priority: 0,
            button: 'Stop service'
        },
    };

    componentDidMount() {
        this.setState({foregroundService: VIForegroundService.getInstance()});
    }

    async startService() {
        if (Platform.OS !== 'android') {
            console.log('Only Android platform is supported');
            return;
        }
        if (this.state.isRunningService) return;
        if (Platform.Version >= 26) {
            await this.state.foregroundService.createNotificationChannel(this.state.channelConfig);
        }
        await this.state.foregroundService.startService(this.state.notificationConfig);
        this.setState({isRunningService: true});
        this.subscribeForegroundButtonPressedEvent();
    }

    async stopService() {
        if (!this.state.isRunningService) return;
        await this.state.foregroundService.stopService();
        this.setState({isRunningService: false});
    }

    subscribeForegroundButtonPressedEvent() {
        this.state.foregroundService.on('VIForegroundServiceButtonPressed', async () => {
            await this.state.foregroundService.stopService();
            this.setState({isRunningService: false});
        })
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

export default App;

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
