

import React, {useState} from 'react';
import {Platform, StyleSheet, View, Button} from 'react-native';
// @ts-ignore
import VIForegroundService from "@voximplant/react-native-foreground-service";

export interface Props {

}


const App: React.FC<Props> = (props) => {

    const [isRunningService_State, set_IsRunningService_State] =useState<boolean>(true);


    // class App extends Component {
    const foregroundService = VIForegroundService.getInstance();

   /* state = {
        isRunningService: false,
    };*/

    const startService= async ()=> {
    // async startService() {
        if (Platform.OS !== 'android') {
            console.log('Only Android platform is supported');
            return;
        }
        if (isRunningService_State) {
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
            await foregroundService.createNotificationChannel(channelConfig);
        }
        const notificationConfig = {
            channelId: 'ForegroundServiceChannel',
            id: 3456,
            title: 'Foreground Service',
            text: 'Foreground service is running',
            icon: 'ic_notification',
            priority: 0,
            button: 'Stop service'
        };
        try {
            subscribeForegroundButtonPressedEvent();
            await foregroundService.startService(notificationConfig);
            // this.setState({isRunningService: true});
            set_IsRunningService_State(true);
        } catch (error:any) {
            // this.
            console.log("error: ",error);
            foregroundService.off();
        }
    };

    const stopService= async ()=> {
        if (!isRunningService_State) {
            return;
        }
        set_IsRunningService_State(false);
        // this.setState({isRunningService: false});
        await foregroundService.stopService();
        foregroundService.off();
    };
    const subscribeForegroundButtonPressedEvent=  ()=> {
    // subscribeForegroundButtonPressedEvent() {
        foregroundService.on('VIForegroundServiceButtonPressed', async () => {
            await stopService();
        });
    };


    // render() {
        return (
            <View style={styles.container}>
                <Button title="Start foreground service" onPress={() => startService()}/>
                <View style={styles.space}/>
                <Button title="Stop foreground service" onPress={() => stopService()}/>
            </View>
        );
    // }
};

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
