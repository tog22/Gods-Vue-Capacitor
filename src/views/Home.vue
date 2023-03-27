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
		</div>
	</div>
</template>

<script>
// @ is an alias to /src

export default {
	name: 'Home',
	components: {
		
	}
}
</script>
