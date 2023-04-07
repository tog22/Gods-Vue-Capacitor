<template>
	<div class="game_world_root mob_style dev">
		<div id="selecting_online" class="screen">
			<Menu_Bar />
			<div id="inner_selecting_online">
				
				<div v-if="subscreen === 'Initial menu'">
					
					<h1 class="page_title">
						Play Online
					</h1>

					<div id="menu_buttons">
						
						<div v-if="store.online.user">
			
							<router-link 
								class="button" 
								to="/online/new"
							>
								New Game
							</router-link>

							<router-link 
								class="button" 
								to="/online/load"
							>
								Continue Game
							</router-link>

							<div 
								@click="logout"
								class="button" 
							>
								Log out
							</div>

						</div>

						<div v-else>

							<div class="button" @click="to_login">
								Log In
							</div>
							<div class="button" @click="to_signup">
								Sign Up
							</div>

						</div>

					</div><!-- /end #menu_buttons-->

				</div>

				<div v-else-if="subscreen === 'Login'">
					
					<h1 class="page_title">
						Log In
					</h1>
					
					<div id="content">
						
						<!-- todo: convert this and signup to forms -->
						<div class="login form">
							<div class="input_with_label">
								<div class="s_label">
									Username
								</div>
								<div class="s_input">
									<input name="user" id="login_user" class="user" type="text" required />
								</div>
							</div>
							<div class="input_with_label">
								<div class="s_label">
									Password
								</div>
								<div class="s_input">
									<input name="pass" id="login_pass" class="pass" type="password" required />
								</div>
							</div>
							<div class="s_input">
								<button type="button" @click="log_in_button()">
									Log in
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

				<div v-else-if="subscreen === 'Signup'">

					<h1 class="page_title">
						Sign Up
					</h1>

					<div id="content">
						<div class="signup form">
							<div class="input_with_label">
								<div class="s_label">
									Username (no spaces)
								</div>
								<div class="s_input">
									<input name="user" class="user" id="signup_user" type="text" required />
								</div>
							</div>
							<div class="input_with_label">
								<div class="s_label">
									Password
								</div>
								<div class="s_input">
									<input name="pass" class="pass" id="signup_pass" type="password" required />
								</div>
							</div>
							<div class="s_input">
								<button type="button" @click="sign_up_button()">
									Sign up
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

				<div v-else>

					<p>
						Error - unknown subscreen
					</p>

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
	},

	data() {
		const store_parent = inject("store")
		
		return {
			store: 		store_parent.state,
			subscreen:	'Initial menu',
			error:		false
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