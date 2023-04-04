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


// Auxiliaries
import '@/assets/styles.css'
import bus from '@/auxiliary/bus'
import store from './store/Store'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

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

        if (Capacitor.isNativePlatform()) {
			
			setTimeout(function(){
				bus.emit('debug display', 'isNativePlatform')
			}, 2000);

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
