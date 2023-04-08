<template>
  <router-view/>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { defineComponent, provide, inject } from 'vue';
import { Capacitor } from '@capacitor/core';
import {
	ActionPerformed,
	PushNotificationSchema,
	PushNotifications,
	Token,
} from '@capacitor/push-notifications';
import firebase_messaging from '@/auxiliary/firebase'
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar'


// Auxiliaries
import '@/assets/styles.css'
import bus from '@/auxiliary/bus'
import store from './store/Store'
import togvue from '@/libraries/togVue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

NavigationBar.hide()

export default defineComponent({
	name: 'App',
	setup() {
        
        /*******************
        **  📦 DATA STORE **
        *******************/
        provide('store',store)
		let store_state = store.state
		
		/******************
		**  🔥 FIREBASE  **
		******************/

		if (Capacitor.isNativePlatform()) {
			
			
			PushNotifications.requestPermissions().then(result => {
				if (result.receive === 'granted') {
					// Register with Apple / Google to receive push via APNS/FCM
					// alert('Push notifications are enabled')
					PushNotifications.register();
				} else {
					// alert('Push notifications are not enabled')
				}
			});
			
			PushNotifications.addListener('registration', (token) => {
				// alert('Push registration success, token: ' + token.value);
				togvue.log(token.value)
			});
			
			PushNotifications.addListener('registrationError', (error) => {
				alert('Error on registration: ' + JSON.stringify(error));
			});
			
			PushNotifications.addListener(
			'pushNotificationReceived',
			(notification) => {
				alert('Push received: ' + JSON.stringify(notification));
			},
			);
			
			PushNotifications.addListener(
			'pushNotificationActionPerformed',
			(notification) => {
				alert('Push action performed: ' + JSON.stringify(notification));
			},
			);
			
		} else {
			// Firebase web version
			let get_token = firebase_messaging.getToken({vapidKey: "BACyAFjs1KoHzgCkmXllHlmBBqj6yLbxcJSD4wjxjN-bJKl6zaWSevcaxkanK0RD05GJrPK-1yHodls6kGoaf4w"});
			
			get_token.then(
				function (result) {
					
					store_state.token = result
					lo('🔥 FCM registration token:')
					lo(store_state.token)
					
					if (store_state.logged_in) {
						var server_request = new XMLHttpRequest()
						let get_url = 'http://godcloud.philosofiles.com/?action=report_token&token='+store_state.token+'&user='+store_state.online.user;
						lo(get_url);
						server_request.open("GET", get_url, false) // false = synchronous
						server_request.send()
					}
				},
				function (error) {
					lo('🔥 FCM: error getting token')
				}
			);
			firebase_messaging.onMessage((message) => {
				alert('FCM received ')
				console.log('FCM message = ',message)
				// let msg_body = fcm_body_to_object(message.notification.body)
				// switch (message.notification.title) {
				// 	case 'move':
				// 		// bus.$emit('move', msg_body)
				// 		console.log('move', msg_body)
				// 		break
				// 	default: { // {} to allow `let`
				// 		let alert_text = 'Unknown firebase message received: '+JSON.stringify(message.notification)
				// 		alert(alert_text)
				// 		break
				// 	}
				// }
			})
			provide('messaging', firebase_messaging)
		}
        
	}
})

/*******************
**	🛠 FUNCTIONS  **
*******************/

function fcm_body_to_object(string) {
	
	string.replace('\"', '"')  // eslint-disable-line
	let object = JSON.parse(string)
	return object
	
}

function lo(to_log) { 
	console.log(to_log) 
}

</script>

<style>
</style>
