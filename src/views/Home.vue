<template>
	<div class="game_world_root mob_style dev">
		<div id="home_menu" class="screen">
			<h1 class="page_title">
				<span class="s_small">
					Path of the
				</span>
				<span class="s_large">
					Gods
				</span>
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
	}
}
</script>