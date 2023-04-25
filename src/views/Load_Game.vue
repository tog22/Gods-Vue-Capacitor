<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">
				
				<h1 class="page_title">
					Continue
				</h1>
				
				<div v-if="store.online.has_current_games">
					<div
						v-for="(listed_game, lg_index) in store.online.games"
							:key="'lg'+lg_index"
							@click="load_game(listed_game.id, listed_game.game_pass, listed_game.side)"
							class="button continue_game_button"
					>
						{{listed_game.opponent}}
					</div>
				</div>

				<div v-else>
					<div class="no_current_games">
						No current games
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
import tog from '@/libraries/tog'
import togvue from '@/libraries/togVue'
import godcloud from '@/auxiliary/api'

// Components
import Menu_Bar from '../components/Menu_Bar.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	
	name: 'Load_Game',

	components: {
		Menu_Bar
	},

	created() {
		
		let get_url = 'https://godcloud.philosofiles.com/?action=list_games&username='+this.store.online.user+'&userpass='+this.store.online.userpass
		lo(get_url)

		// New asynchronous code

		godcloud.get(get_url).then((response) => {

			bus.emit('debug display', '.then triggered')
			console.log('gc resp = ',response)
			togvue.log(tog.debugging.dump(response.data))
			if (response.result === 'failure' || !response.games_found) {
				alert("You don't have any active games")
			} else {
				this.store.online.games = response.games
			}

		})

		// Old synchronous code

		// let server_request = new XMLHttpRequest()
		// try {
		// 	server_request.open("GET", get_url, false)
		// 	server_request.send()
		// } catch (error) {
		// 	alert('Error connecting to server')
		// 	console.log('error', error)
		// 	return
		// }
		// console.log('server_request', JSON.stringify(server_request))

		// const response = JSON.parse(server_request.responseText)

		// if (response.result === 'failure' || !response.games_found) {
		// 	alert("You don't have any active games")
		// 	return
		// 	// todo: change
		// }

		// this.store.online.games = response.games

	},

	methods: {
		
		
		new_online() {
			this.store.online.subscreen = 'select opponent'
		},
		/*
		
		not used atm:

		select_opponent() {

			var opp = document.getElementById('newg_opponent').value
			
			let get_url = 'http://godcloud.philosofiles.com/?action=find_user&user='+opp
			lo(get_url)

			godcloud.get(get_url).then((api_response) => {
				const response = JSON.parse(api_response)
				console.log()
				const response = JSON.parse(api_response)
			})

		 	// Old synchronous code
			// var server_request = new XMLHttpRequest()
			// server_request.open("GET", get_url, false)
			// server_request.send()
			// const response = JSON.parse(server_request.responseText)
			

			if (response.result === 'failure') {
				this.store.online.error = 'Opponent not found'
			} else if (response.result === 'success') {

				let pw = Math.floor(Math.random() * 32000)

				server_request = new XMLHttpRequest()
				get_url = 'http://godcloud.philosofiles.com/?action=create&pw='+pw+'&p1='+this.store.online.user+'&p2='+opp

				server_request.open("GET", get_url, false)
				server_request.send()

				const response = JSON.parse(server_request.responseText)

				if (response.result === 'success') {
					this.game_type = 'online'
					this.which_screen =  'show_online'
					this.store.online.side =  1
					this.store.online.game_id = response.game_id
					this.store.online.game_pass = pw
				} else {
					this.store.online.error = 'Failed to create game'
				}

			} else {
				this.store.online.error = 'Unknown error'
			}

		},
		*/
		/*
		
		not used atm:

		continue_online() {

			let server_request = new XMLHttpRequest()
			let get_url = 'https://godcloud.philosofiles.com/?action=list_games&username='+this.store.online.user+'&userpass='+this.store.online.userpass
			lo(get_url)

			server_request.open("GET", get_url, false)
			server_request.send()

			const response = JSON.parse(server_request.responseText)

			if (response.result === 'failure' || !response.games_found) {
				alert("You don't have any active games")
				return
				// todo: change
			}

			this.store.online.games = response.games
			this.store.online.subscreen = 'continue online'

		},
		*/
		load_game(id, pw, side) {
			this.store.online.game_id = id
			this.store.online.game_pass = pw
			this.store.online.side =  side
			this.$router.push('/online/play')
		},
	},

	data() {
		const store_parent = inject("store")
		
		return {
			store: 		store_parent.state,
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