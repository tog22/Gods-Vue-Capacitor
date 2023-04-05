<template>
	<div class="game_world_root mob_style dev">
		<div id="menu" class="screen">
			<h1 class="page_title">
				Gods
			</h1>
			<div id="menu_buttons">
				<router-link 
					class="button" 
					to="/play"
				>
					Pass &amp; Play
				</router-link>
				<router-link
					class="button" 
					to="/online"
				>
					Play Online
				</router-link>
				<router-link 
					class="button" 
					to="/rules"
				>
					View Rules
				</router-link>
			</div>
            <br />
            <Debug_Display/>
		</div>
	</div>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { inject } from 'vue'

// Auxiliaries
import bus from '@/auxiliary/bus'

// Components
import Debug_Display from '@/components/Debug_Display.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default {
	name: 'Home',
	components: {
		Debug_Display
	},
    data() 
    {
		const store_parent = inject("store")
		
		return {
			store:					store_parent.state,
			// turn: 					turn,
			// current_player: 		current_player,
			// piece_has_moved: 		false,
			// inspiration_has_moved: 	false,
			// selected_row: 			null,
			// selected_col: 			null,
			// row_delta: 				null,
			// col_delta: 				null,
			// winner:					null,
			// win_type: 				null,
			// online_game:			this.online_screen,
			// sotw: 					sotw,
		};
		
	}
}
</script>