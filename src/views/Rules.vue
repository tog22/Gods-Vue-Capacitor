<template>
	<div class="game_world_root mob_style dev">
		<div id="rules_page" class="screen">
			<Menu_Bar />
			<div id="rules_content_zone" class="flx">
				<div id="rule_images" class="flx">
					<img :src="page_url" @click="next_page" alt="Board game rules" />
				</div>
				<!-- <div class="pager">
					<div class="medium_button" @click="next_page">
						Next page
					</div>
					<div class="page_button" @click="prev_page">
						⇦
					</div>
					<div class="page_button" @click="next_page">
						⇨
					</div>
				</div> -->
				<div id="bottom_zone">
					<div id="bz_content">
						<div id="info_bar">
							<div id="item_flex_container">
								<div 
									class="s_item large_button"
									@click="next_page"
								>
									<div class="s_text">
										{{button_text}}
									</div>
								</div>
							</div>
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

// Auxiliaries
import bus from '@/auxiliary/bus'
import tog from '@/libraries/tog'
import togvue from '@/libraries/togVue'
import godcloud from '@/auxiliary/api'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	name: 'Rules_Page',
	components: {
		Menu_Bar
	},
	created() {
		godcloud.get('https://godcloud.philosofiles.com/?action=list_games&username=Tomek&userpass=pass').then((response) => {
			console.log('gc resp = ',response)
			togvue.log('gc done')
			togvue.log(tog.debugging.dump(response.data))
		})
	},
    methods: {
		next_page() {
			const last_page = 16
			if (this.page < (last_page - 1)) {
				this.page += 1
				this.button_text = 'Next page'
			} else if (this.page == (last_page - 1)) {
				this.page += 1
				this.button_text = 'First page'
			} else {
				this.page = 1
				this.button_text = 'Next page'
			}
			this.page_url = '/images/rules/' + this.page + '.png'
		},
	},
	data() {
		return {
			page: 			1,
			page_url: 		'/images/rules/1.png',
			button_text:	'Next page',
		}
	},
})
</script>

<style>

.pager {
	text-align: center;
}

.medium_button {
	
	display: inline-block;
	background-color: #7c98b3;
    color: #fff;
	font-weight: bold;
	text-transform: uppercase;

    border-radius: 6px;

    font-size: 1.4rem;
    height: 40px;
    padding: 3px 6px;
}

</style>