<template>
	<div class="game_world_root mob_style dev">
		<div id="menu" class="screen">
			<h1 class="page_title">
				Path of the Gods
			</h1>
			<div id="menu_buttons">
				<div 
					class="button" 
				>
					Pass &amp; Play
				</div>
				<div
					class="button" 
				>
					Play Online
				</div>
				<router-link class="button" to="/rules">
					View Rules
				</router-link>
			</div>
            <Debug_Display/>
		</div>
	</div>
</template>

<script>
// Components
import Debug_Display from '@/components/Debug_Display.vue'


export default {
	name: 'Home',
	components: {
        Debug_Display 
	}
}
</script>
