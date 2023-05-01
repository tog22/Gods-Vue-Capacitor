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
import fn from '@/auxiliary/functions'
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
</style>
