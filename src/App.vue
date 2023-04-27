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
import godcloud from '@/auxiliary/api'
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

		// Code for mobiles is in Online_Game.vue
		if (!Capacitor.isNativePlatform()) {
			// Firebase web version
			let get_token = firebase_messaging.getToken({vapidKey: "BACyAFjs1KoHzgCkmXllHlmBBqj6yLbxcJSD4wjxjN-bJKl6zaWSevcaxkanK0RD05GJrPK-1yHodls6kGoaf4w"});
			
			get_token.then(
				function (result) {
					
					store_state.token = result
					lo('🔥 FCM registration token:')
					lo(store_state.token)
					
					if (store_state.logged_in) {
						
						let get_url = 'https://godcloud.philosofiles.com/?action=report_token&token='+store_state.token+'&user='+store_state.online.user;
						lo(get_url);
						godcloud.get(get_url) // no then condition
						
						// Old synchronous code
						// var server_request = new XMLHttpRequest()
						// server_request.open("GET", get_url, false) // false = synchronous
						// server_request.send()
					}
				},
				function (error) {
					lo('🔥 FCM: error getting token')
					lo(error)
				}
			);
			firebase_messaging.onMessage((message) => {
				console.log('📨 Message received', message)
				let msg_data = message.notification.data
				switch (message.notification.title) {
					case 'move':
					case "It's your turn":
						bus.emit('move', msg_data)
						break
					default: { // {} to allow `let`
						let alert_text = 'Unknown firebase message received: '+JSON.stringify(message.notification)
						alert(alert_text)
						break
					}
				}
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

function alo(to_log) {
	bus.emit('debug display', to_log)
}

</script>

<style>
</style>
