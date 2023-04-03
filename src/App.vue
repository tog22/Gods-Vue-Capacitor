<template>
  <router-view/>
</template>

<script>
// External libraries
import { defineComponent, provide, inject } from 'vue'
import '@/assets/styles.css'

// Auxiliaries
import bus from '@/auxiliary/bus'
import store from './store/Store'

export default defineComponent({
	name: 'App',
	setup() {
        
        /*******************
        **  📦 DATA STORE **
        *******************/
        provide('store',store)

        // ↓ Timeout necessary to allow the DOM to load
        setTimeout(function(){
            bus.emit('debug display', 'Hello world')
        }, 500); 
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
