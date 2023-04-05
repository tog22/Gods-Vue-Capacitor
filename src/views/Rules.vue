<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">
				<h2>
					Rules
				</h2>
			</div>
		</div>
	</div>
</template>

<script>
/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { defineComponent } from 'vue'

// Auxiliaries
import bus from '@/auxiliary/bus'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	name: 'Rules_Page',
	components: {
		Menu_Bar
	},
    created() {
        setTimeout(() => {
            bus.emit('debug display', '2Rules_Page created')
        }, 1000)
    },
})
</script>