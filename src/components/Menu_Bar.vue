<template>
<div class="menu_bar">
	<div class="s_left">
		<span class="back" @click="$router.back()">
			⬅️
		</span>
	</div>
	<div class="s_middle">
		<h1>
			Path of the Gods
		</h1>
	</div>
	<div class="s_right">
        <span class="dev_button" @click="dev_button()">
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
        dev_button() {
            bus.emit('toggle debug display', null)
        }
    }
}
</script>


<style scoped>

</style>  