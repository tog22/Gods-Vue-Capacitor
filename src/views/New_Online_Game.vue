<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">
				
				<!-- <h1 class="page_title">
					Continue
				</h1> -->
				
				<div class="form">

					<div class="input_with_label">
						<div class="s_label">
							Opponent's username
						</div>
						<div class="s_input">
							<input name="opponent" id="newg_opponent" type="text" required />
						</div>
					</div>
					<div class="s_input">
						<button type="button" @click="select_opponent">
							Start game
						</button>
					</div>

					<div 
						v-if="error"
						class="form_error_container"
					>
						<div class="form_error">
							{{error}}
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
import { defineComponent, inject } from 'vue'

// Auxiliaries
import bus from '@/auxiliary/bus'
import godcloud from '@/auxiliary/api'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	
	name: 'New_Online_Game',

	components: {
		Menu_Bar
	},

	methods: {
		
		select_opponent() {

			var opp = document.getElementById('newg_opponent').value

			let get_url = 'http://godcloud.philosofiles.com/?action=find_user&user='+opp
			lo(get_url)

			godcloud.get(get_url).then((api_response) => {
				
				const response = JSON.parse(api_response)
				console.log(response)

				if (response.result === 'failure') {
					this.error = 'Opponent not found'
				} else if (response.result === 'success') {

					let pw = Math.floor(Math.random() * 32000)

					let second_get_url = 'http://godcloud.philosofiles.com/?action=create&pw='+pw+'&p1='+this.store.online.user+'&p2='+opp
					godcloud.get(second_get_url).then((api_response) => {
						
						const response = JSON.parse(api_response)

						if (response.result === 'success') {
							this.store.online.side =  1
							this.store.online.game_id = response.game_id
							this.store.online.game_pass = pw
							this.$router.push('/online/play')
						} else {
							this.error = 'Failed to create game'
						}

					})

				} else {
					this.error = 'Unknown error'
				}

			})

			/*
			Old synchronous code:
			var server_request = new XMLHttpRequest()
			server_request.open("GET", get_url, false)
			server_request.send()

			const response = JSON.parse(server_request.responseText)

			if (response.result === 'failure') {
				this.error = 'Opponent not found'
			} else if (response.result === 'success') {

				let pw = Math.floor(Math.random() * 32000)

				server_request = new XMLHttpRequest()
				get_url = 'http://godcloud.philosofiles.com/?action=create&pw='+pw+'&p1='+this.store.online.user+'&p2='+opp

				server_request.open("GET", get_url, false)
				server_request.send()

				const response = JSON.parse(server_request.responseText)

				if (response.result === 'success') {
					this.store.online.side =  1
					this.store.online.game_id = response.game_id
					this.store.online.game_pass = pw
					this.$router.push('/online/play')
				} else {
					this.error = 'Failed to create game'
				}

			} else {
				this.error = 'Unknown error'
			}
			*/

		}

	},

	data() {
		const store_parent = inject("store")
		
		return {
			store: 		store_parent.state,
			error: 		false
		}
	}
})


/*******************
**	🛠 FUNCTIONS  **
*******************/


function lo(to_log) { 
	console.log(to_log) 
}


</script>