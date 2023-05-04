<template>
  <router-view/>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { defineComponent, provide, inject } from 'vue'
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar'


// Auxiliaries
import '@/assets/styles.css'
import bus from '@/auxiliary/bus'
import store from './store/Store'


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
