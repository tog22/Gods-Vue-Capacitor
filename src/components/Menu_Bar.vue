<template>
<div class="menu_bar">
	<div class="s_left">
		<span class="back s_button" @click="$router.back()">
			⬅️
		</span>
	</div>
	<div class="s_middle">
		<h1>
			Path of the Gods
		</h1>
	</div>
	<div class="s_right">
        <span 
			v-if="$route.name == 'Pass & Play'" 
			@click="restart"
			class="s_button"
		>
			🔄
		</span>
		<span 
			v-else 
			@click="dev_button()"
			class="s_button"
		>
            #️⃣ 
        </span>
	</div>
</div>
<Debug_Display/>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// Auxiliaries
import bus from '@/auxiliary/bus'

// Components
import Debug_Display from '@/components/Debug_Display.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default {
	name: 'Menu_Bar',
    components: { 
        Debug_Display 
    },
    methods: {
        restart() {
			bus.emit('restart game', null)
			alert('Restarting game not implemented yet')
		},
		dev_button() {
            bus.emit('toggle debug display', null)
        }
    }
}
</script>


<style scoped>

</style>  