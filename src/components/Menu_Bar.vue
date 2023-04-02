<template>
<div class="menu_bar">
	<div class="s_left">
		<span class="back" @click="$router.back()">
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
<Debug_Display/>
</template>

<script>
// Components
import Debug_Display from '@/components/Debug_Display.vue'

export default {
	name: 'Menu_Bar',
    components: { 
        Debug_Display 
    }
}
</script>


<style scoped>

</style>  