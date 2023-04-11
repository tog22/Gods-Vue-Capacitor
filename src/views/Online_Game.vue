<template>
	<div class="game_world_root mob_style dev">
		<div id="pnp_game" class="screen">
			<Menu_Bar />
			<Game_World :online_screen="true"  />
			<div id="permission_request_container">
				<div id="permission_request">
					<div class="s_text">
						Would you like to get notified when it's your turn while not in the app? (We recommend this.)
					</div>
					<div class="s_options">
						<div class="s_option" @click="allow_notifications">
							Yes
						</div>
						<div class="s_option" @click="deny_notifications">
							No
						</div>
					</div>
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
import Game_World from '../components/Game_World.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	name: 'Online_Game_Page',
	components: {
		Menu_Bar,
        Game_World
	}
})
</script>

<style>

#permission_request_container {
	position: relative;
}

#permission_request {
	position: absolute;
    bottom: 0px;
    width: 100vw;

    background: blue;
	color: white;
	font-weight: bold;
}

</style>