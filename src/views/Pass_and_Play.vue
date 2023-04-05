<template>
	<div class="game_world_root mob_style dev">
		<div id="pnp_game" class="screen">
			<Menu_Bar />
			<Game_World :online_screen="false"  />
		</div>
	</div>
</template>

<script>
/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { defineComponent } from 'vue'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'
import Game_World from '../components/Game_World.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	name: 'Pass_and_Play_Page',
	components: {
		Menu_Bar,
        Game_World
	}
})
</script>