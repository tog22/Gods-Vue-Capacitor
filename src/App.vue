<template>
  <router-view/>
</template>

<script>
import { defineComponent, provide } from 'vue'
import firebase_messaging from './firebase'

import '@/assets/styles.css'

export default defineComponent({
	name: 'App',
	setup() {
	}
})

</script>

<style>
</style>
