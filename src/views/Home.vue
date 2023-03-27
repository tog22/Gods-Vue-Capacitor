<template>
	<div class="game_world_root mob_style dev">
		<div class="menu_bar">
			<div class="s_left">
				<span class="back" @click="back_from_pnp">
					⬅️
				</span>
			</div>
			<div class="s_middle">
				<h1>
					Path of the Gods
				</h1>
			</div>
			<div class="s_right">
			</div>
		</div>
		<div id="menu" class="screen">
			<h1>
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
				<div class="button">
					View Rules
				</div>
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
