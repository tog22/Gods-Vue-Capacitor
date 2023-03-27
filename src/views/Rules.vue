<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">
				<h2>
					Online Games
				</h2>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'

import Menu_Bar from '../components/Menu_Bar.vue'

export default defineComponent({
	name: 'Rules_Page',
	components: {
		Menu_Bar
	}
})
</script>