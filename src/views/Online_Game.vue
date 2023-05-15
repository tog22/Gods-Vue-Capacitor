<template>
	<div class="game_world_root mob_style dev">
		<div id="pnp_game" class="screen">
			<Menu_Bar />
			<Game_World :online_screen="true"  />
			<div id="permission_request_container">
				<div 
					v-if="store.show_notifications_banner && push_notifications_supported"
					id="permission_request" 
					class="banner_notification"
				>
					<div class="s_text">
						To play online, you need to allow notifications when the other player takes their turn.
					</div>
					<div class="s_options">
						<div class="s_option" @click="allow_notifications">
							Allow
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { defineComponent, inject } from 'vue'
import { Capacitor } from '@capacitor/core';
import {
	ActionPerformed,
	PushNotificationSchema,
	PushNotifications,
	Token,
} from '@capacitor/push-notifications';
import firebase_messaging from '@/auxiliary/firebase'

// Auxiliaries
import bus from '@/auxiliary/bus'
import fn from '@/auxiliary/functions'
import godcloud from '@/auxiliary/api'
import tog from '@/libraries/tog'
import togvue from '@/libraries/togVue'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'
import Game_World from '../components/Game_World.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/
if (Capacitor.isNativePlatform()) {
	PushNotifications.addListener(
		'pushNotificationReceived',
		(notification) => {
			// fn.handle_notification(notification)
			alo('📨 Message received', notification)
			switch (notification.title) {
				case 'move':
				case "It's your turn":
					bus.emit('move', notification.data)
					break
				case 'Game invitation':
					bus.emit('game_invitation', notification.data)
					break
				default: { // {} to allow `let`
					let alert_text = 'Unknown firebase message received: '+JSON.stringify(notification)
					alert(alert_text)
					break
				}
			}
		},
	);
	
	PushNotifications.addListener(
		'pushNotificationActionPerformed',
		(notification) => {
			alert('Push action performed: ' + JSON.stringify(notification));
		},
	);
} else {
	firebase_messaging.onMessage((message) => {
		// fn.handle_notification(message.notification)
		console.log('📨 Message received', message)
		switch (message.notification.title) {
			case 'move':
			case "It's your turn":
				bus.emit('move', message.data)
				break
			case 'Game invitation':
				bus.emit('game_invitation', message.notification.data)
				break
			default: { // {} to allow `let`
				let alert_text = 'Unknown firebase message received: '+JSON.stringify(message.notification)
				alert(alert_text)
				break
			}
		}
	})
}

export default defineComponent({
	name: 'Online_Game_Page',
	components: {
		Menu_Bar,
        Game_World
	},
	setup() {

	},
	methods: {
		allow_notifications() {
			
			if (this.push_notifications_supported) {
				this.store.show_notifications_banner = false
			}

			/******************
			**  🔥 FIREBASE  **
			******************/

			if (Capacitor.isNativePlatform()) {
			
				PushNotifications.requestPermissions().then(result => {
					if (result.receive === 'granted') {
						// Register with Apple / Google to receive push via APNS/FCM
						// alert('Push notifications are enabled')
						PushNotifications.register();
						alo('ran PushNotifications.register()')
					} else {
						// alert('Push notifications are not enabled')
					}
				});
				
				PushNotifications.addListener('registration', (token) => {
					if (this.store.logged_in) {
						this.store.token = token.value
						let get_url = 'https://godcloud.philosofiles.com/?action=report_token&token='+this.store.token+'&user='+this.store.online.user;
						alo(get_url)
						godcloud.get(get_url).then((response) => {
							togvue.log(response)
						})
					} else {
						alert('error: not logged in')
					}
				});
				
				PushNotifications.addListener('registrationError', (error) => {
					alert('Error on registration: ' + JSON.stringify(error));
				});
				
				// PushNotifications.addListener(
				// 	'pushNotificationReceived',
				// 	(notification) => {
				// 		// fn.handle_notification(notification)
				// 		alo('📨 Message received', notification)
				// 		switch (notification.title) {
				// 			case 'move':
				// 			case "It's your turn":
				// 				bus.emit('move', notification.data)
				// 				break
				// 			default: { // {} to allow `let`
				// 				let alert_text = 'Unknown firebase message received: '+JSON.stringify(notification)
				// 				alert(alert_text)
				// 				break
				// 			}
				// 		}
				// 	},
				// );
				
				// PushNotifications.addListener(
				// 'pushNotificationActionPerformed',
				// (notification) => {
				// 	alert('Push action performed: ' + JSON.stringify(notification));
				// },
				// );
				
			} else {
				// Firebase web version
				let get_token = firebase_messaging.getToken({vapidKey: "BACyAFjs1KoHzgCkmXllHlmBBqj6yLbxcJSD4wjxjN-bJKl6zaWSevcaxkanK0RD05GJrPK-1yHodls6kGoaf4w"});
				
				get_token.then(
					function (result) {
						this.store.token = result
						lo('🔥 FCM registration token:')
						lo(this.store.token)

						let get_url = 'https://godcloud.philosofiles.com/?action=report_token&token='+this.store.token+'&user='+this.store.online.user;
						lo(get_url);
						godcloud.get(get_url) // no then condition

					}.bind(this),
					function (error) {
						lo('🔥 FCM: error getting token')
						lo(error)
					}
				);
			}
		},
		deny_notifications() {
			this.store.show_notifications_banner = false
		}
	},
	data() {
        
        const store_parent = inject("store")
		// store_parent.state.show_notifications_banner = true // for testing - todo: remove
		return {
			store: 							store_parent.state,
			push_notifications_supported: 	true
		}
	}
})


/*******************
**	🛠 FUNCTIONS  **
*******************/

function lo(to_log) { 
	console.log(to_log) 
}

function alo(to_log) {
	bus.emit('debug display', to_log)
}

</script>

<style>

#permission_request_container {
	position: relative;
}

.banner_notification {
	position: absolute;
    bottom: 0px;
    width: 100vw;

	padding: 14px 16px 8px;
	box-sizing: border-box;

    background: blue;
	color: white;
	font-weight: bold;
}

.banner_notification .s_options {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.banner_notification .s_option {
	padding: 8px 4px;
	margin-left: 4px;
	margin-top: 4px;
	text-transform: uppercase;
}


</style>