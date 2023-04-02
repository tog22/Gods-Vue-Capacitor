<template>
  <router-view/>
</template>

<script>
// External libraries
import { defineComponent } from 'vue'
import '@/assets/styles.css'

// Internal libraries and services
import bus from '@/auxiliary/bus'


export default defineComponent({
	name: 'App',
	setup() {
        // ↓ Timeout necessary to allow the DOM to load
        setTimeout(function(){
            bus.emit('debug display', 'Hello world')
        }, 500); 
	}
})

</script>

<style>
</style>
