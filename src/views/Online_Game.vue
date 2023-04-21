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
						Would you like to get notified when it's your turn?
					</div>
					<div class="s_options">
						<div class="s_option" @click="allow_notifications">
							Yes
						</div>
						<div class="s_option" @click="deny_notifications">
							No
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
import togvue from '@/libraries/togVue'
import bus from '@/auxiliary/bus'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'
import Game_World from '../components/Game_World.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	name: 'Online_Game_Page',
	components: {
		Menu_Bar,
        Game_World
	},
	methods: {
		allow_notifications() {
			if (this.push_notifications_supported) {
				this.store.show_notifications_banner = false
			}
			alert(68)
			if (Capacitor.isNativePlatform()) {
			
				alert('native')
				PushNotifications.requestPermissions().then(result => {
					if (result.receive === 'granted') {
						// Register with Apple / Google to receive push via APNS/FCM
						// alert('Push notifications are enabled')
						PushNotifications.register();
						alert(77)
					} else {
						// alert('Push notifications are not enabled')
					}
				});
				
				PushNotifications.addListener('registration', (token) => {
					alert('Push registration success, token: ' + token.value);
					togvue.log(token.value)
					bus.emit('debug display','Push registration success, token: ' + token.value)
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
				
			}
		},
		deny_notifications() {
			this.store.show_notifications_banner = false
		}
	},
	data() {
        
        const store_parent = inject("store")
		return {
			store: 							store_parent.state,
			push_notifications_supported: 	true
		}
	}
})
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