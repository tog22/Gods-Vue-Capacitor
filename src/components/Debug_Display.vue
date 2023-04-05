<template>
	<div class="debug_display" v-if="show">
		<div id="container_for_copy_to_clipboard">
			<div id="copy_to_clipboard" @click="copyToClipboard">
				📋
			</div>
		</div>
		<div v-for="(message, index) in messages" :key="'i'+index">
			{{ message }}
		</div>
	</div>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { Clipboard } from '@capacitor/clipboard';

// Auxiliaries
import bus from '@/auxiliary/bus'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default {
	name: 'Debug_Display',
	created() {
		bus.on('debug display', (message) => {
			this.messages.push(message)
		})
		
		bus.on('toggle debug display', () => {
			this.show = this.show ? false : true
		})
	},
	methods: {
		copyToClipboard() {
			Clipboard.write({
				string: this.messages.join('\n')
			})
		}
	},
	data() {
		return {
			messages:   [],
			show:       false
		}
	},
}
</script>

<style scoped>

.debug_display {
	
	width: 100%;
	height: 2.8em;
	font-size: 0.8em;
	background: #7c98b3;
	
	position: absolute;
	top: 58px;
	z-index: 2;
	
	overflow-y: scroll;
	overflow-x: hidden;
	word-break: break-all;
	text-overflow: ellipsis;
	hyphens: auto;
	
}

#container_for_copy_to_clipboard {
	position: relative;
}

#copy_to_clipboard {
	position: absolute;
	top: 2px;
	right: 4px;
}

</style>