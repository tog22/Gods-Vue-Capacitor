<template>
  <router-view/>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { defineComponent, provide, inject } from 'vue'
import firebase_messaging from './firebase'

// Auxiliaries
import store from './store/Store'

// Styles, etc.
import '@/assets/styles.css'

export default defineComponent({
	name: 'App',
	setup() {

		/*******************
        **  📦 DATA STORE **
        *******************/

        provide('store',store)

        /******************
		**  🔥 FIREBASE  **
		******************/

		let get_token = firebase_messaging.getToken({vapidKey: "BACyAFjs1KoHzgCkmXllHlmBBqj6yLbxcJSD4wjxjN-bJKl6zaWSevcaxkanK0RD05GJrPK-1yHodls6kGoaf4w"});

		get_token.then(
			function (result) {
				
				store.state.token = result

				lo('🔥 FCM registration token:')
				lo(result)
				
				// if (store.logged_in) {
				// 	var server_request = new XMLHttpRequest()

				// 	let get_url = 'http://godcloud.philosofiles.com/?action=report_token&token='+result.token+'&user='+store.user;
				// 	lo(get_url);

				// 	server_request.open("GET", get_url, false) // false = synchronous
				// 	server_request.send()
				// }

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
})

/****************
**	FUNCTIONS  **
*****************/

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
