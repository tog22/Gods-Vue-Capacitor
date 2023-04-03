<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">
				<div id="menu_buttons">
                    add v-if buttons 
                </div>
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

// Components
import Menu_Bar from '../components/Menu_Bar.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	name: 'Online_Games_Menu_Page',
	components: {
		Menu_Bar
	}
})
</script>