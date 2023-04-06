<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">

				<h1 class="page_title">
					Play Online
				</h1>
				
				<div id="menu_buttons">
					
					<div v-if="!store.online.user" class="button" @click="to_log_in">
						Log In
					</div>

					<div v-if="!store.online.user" class="button" @click="to_sign_up">
						Sign Up
					</div>

					<div v-else>
						
						<div v-if="store.online.subscreen === 'user menu' ">
							<div class="button" @click="new_online">
								New Game
							</div>
							<div class="button" @click="continue_online">
								Continue Game
							</div>
							<div class="button" @click="logout">
								Log out
							</div>
						</div>

						<div v-else-if="store.online.subscreen === 'select opponent' ">
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
								<div class="form_error">
									{{store.online.error}}
								</div>
							</div>
						</div>

						<div v-else-if="store.online.subscreen === 'continue online' ">

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

						<div v-else>
							Error: no recognised online.subscreen set
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

// Components
import Menu_Bar from '../components/Menu_Bar.vue'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default defineComponent({
	
	name: 'Online_Games_Menu_Page',

	components: {
		Menu_Bar
	},

	methods: {
		back_after_end_game() {
			this.which_screen = 'show_menu'
			this.win_type = null
			this.victory_or_defeat =  ''
			this.type_of_victory =  ''
		},
		back_from_pnp() {
			this.back_after_end_game()
		},
		back_within_selecting_online() {
			
			switch (this.store.online.subscreen) {
				case 'login or signup':
				case 'user menu':
					this.which_screen =  'show_menu'
					break
				case 'select opponent':
				case 'continue online':
					this.store.online.subscreen = 'user menu'
					break
				default:
					this.which_screen =  'show_menu'
					break
			}

			if (this.store.online.user === 'logging_in' || this.store.online.user === 'signing_up') {
				this.store.online.user = ''
			}

		},
		back_from_online() {
			this.which_screen =  'show_selecting_online'
		},
		online_games() {
			this.which_screen =  'show_selecting_online'
			this.store.online.subscreen = 'user menu' // is this right? was 'login or signup'
		},
		to_log_in() {
			this.store.online.user = 'logging_in'
		},
		to_sign_up() {
			this.store.online.user = 'signing_up'
		},
		logout() {
			this.store.online.user = ''
			// todo - remove token from db
		},
		debug() {
			lo(this)
		},
		log_in_button(error = false) {

			var user
			var pw
			if (error) {
				user = document.getElementById('log_err_u').value
				pw = document.getElementById('log_err_p').value
			} else {
				user = document.getElementById('log_u').value
				pw = document.getElementById('log_p').value
			}

			var server_request = new XMLHttpRequest()

			let get_url = 'http://godcloud.philosofiles.com/?action=login&username='+user+'&pw='+pw
			//lo(get_url)

			server_request.open("GET", get_url, false)
			server_request.send()

			const response = JSON.parse(server_request.responseText)
			lo(response)

			if (response.result === 'success') {
				
				this.store.online.user = user
				this.store.user = user
				this.store.online.userpass = pw
				this.store.online.subscreen = 'user menu'

				this.report_token(user, this.store.token)

			} else if (response.result === "un or pw wrong") {
				this.which_screen = 'show_selecting_online'
				this.store.online.user = 'login_error'
				this.store.online.login_error='Wrong username or password'
			} else {
				// todo: general error message
				alert('other error')
			}

		},
		sign_up_button(error = false) {

			var user
			var pw
			if (error) {
				user = document.getElementById('su_err_u').value
				pw = document.getElementById('su_err_p').value
			} else {
				user = document.getElementById('su_u').value
				pw = document.getElementById('su_p').value
			}

			var server_request = new XMLHttpRequest()

			let get_url = 'http://godcloud.philosofiles.com/?action=signup&username='+user+'&pw='+pw
			//lo(get_url)

			server_request.open("GET", get_url, false)
			server_request.send()

			const response = JSON.parse(server_request.responseText)
			lo(response)

			if (response.result === 'success') {
				
				this.store.online.user = user
				this.store.user = user
				this.store.online.subscreen = 'user menu'

				this.report_token(user, this.store.token)

			} else if (response.result === "sql error") {
				this.which_screen = 'show_selecting_online'
				this.store.online.user = 'signup_error'
				if (response.error_number === '1062') {
					this.store.online.signup_error='Username already taken'
				} else {
					this.store.online.signup_error='Unknown error'
				}
			} else {
				// todo: general error message
				alert('other error')
			}

		},
		report_token(user, token) {
			var server_request = new XMLHttpRequest()

			let get_url = 'http://godcloud.philosofiles.com/?action=report_token&token='+this.store.token+'&user='+user;
			lo(get_url);

			server_request.open("GET", get_url, false) // false = synchronous
			server_request.send()
		},
		new_online() {
			this.store.online.subscreen = 'select opponent'
		},
		select_opponent() {

			var opp = document.getElementById('newg_opponent').value
			var server_request = new XMLHttpRequest()

			let get_url = 'http://godcloud.philosofiles.com/?action=find_user&user='+opp
			lo(get_url)

			server_request.open("GET", get_url, false)
			server_request.send()

			const response = JSON.parse(server_request.responseText)

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
		load_game(id, pw, side) {
			this.game_type = 'online'
			this.which_screen =  'show_online'
			this.store.online.game_id = id
			this.store.online.game_pass = pw
			this.store.online.side =  side
		},
		new_pass_and_play() {
			this.game_type = 'pnp'
			bus.emit('change_gameworld_data', {'online_game': false})
			this.which_screen =  'show_pnp'
		},
		test_online_game() {
			this.game_type = 'online'
			this.which_screen =  'show_online'
		},
		test_move_msg() {
			bus.emit('test_move_arrow', {})
		}
	},

	data() {
		const store_parent = inject("store")
		
		return {
			store: store_parent.state
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