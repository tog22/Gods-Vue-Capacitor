<template>
	<div class="game_world_root mob_style dev">
		<div id="pnp_game" class="screen">
			<Menu_Bar />
			<Game_World />
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'

import Menu_Bar from '../components/Menu_Bar.vue'
import Game_World from '../components/Game_World.vue'

export default defineComponent({
	name: 'Pass_and_Play_Page',
	components: {
		Menu_Bar,
        Game_World
	}
})
</script>