<template>
	<div class="game_world_root mob_style dev">
		<div id="pnp_game" class="screen">
			<Menu_Bar />
			<div>
				<p>
                    Pass and play goes here
                </p>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'

import Menu_Bar from '../components/Menu_Bar.vue'

export default defineComponent({
	name: 'Pass_and_Play_Page',
	components: {
		Menu_Bar
	}
})
</script>