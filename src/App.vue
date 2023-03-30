<template>
  <router-view/>
</template>

<script>
import { defineComponent, provide } from 'vue'
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';


/******************
**  🔥 FIREBASE  ** 
******************/

// ↓ Non-Capacitor version
// import firebase_messaging from './firebase'

// import {
//     ActionPerformed,
//     PushNotificationSchema,
//     PushNotifications,
//     Token,
// } from '@capacitor/push-notifications';

import '@/assets/styles.css'

/******************
**  🔥 FIREBASE  ** 
******************/

// Based on https://enappd.com/blog/firebase-push-notification-in-ionic-react-capacitor/111/
// Dialog.alert({
//     title: 'Stop',
//     message: 'this is an error',
// });

// if (Capacitor.isNativePlatform()) {
//     PushNotifications.register().then((token) => {
//         alert(2)
//         alert('My token: ' + token);
//     });
// } else {

// }

/*
const addListeners = async () => {
  await PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value);
  });

  await PushNotifications.addListener('registrationError', err => {
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}



const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
}

if (Capacitor.isNativePlatform()) {
  addListeners()
  registerNotifications()
}

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
}
*/


export default defineComponent({
	name: 'App',
	setup() {
        const showAlert = async () => {
            await Dialog.alert({
                message: 'Message goes here',
            });
        };
        Dialog.alert({
            message: 'msg',
        });
	}
})

</script>

<style>
</style>
