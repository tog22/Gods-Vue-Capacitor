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
import godcloud from '@/auxiliary/api'

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
		
		to_login() {
			this.subscreen = 'Login'
		},

		to_signup() {
			this.subscreen = 'Signup'
		},

		log_in_button() {
			
			this.error = false // reset
			
			let user = document.getElementById('login_user').value
			let pw = document.getElementById('login_pass').value
			
			let get_url = 'http://godcloud.philosofiles.com/?action=login&username='+user+'&pw='+pw

			godcloud.get(get_url).then((response) => {
				if (response.hasOwnProperty('result')) { 
					switch (response.result) {
						case 'success':
							this.store.online.user = user
							this.store.online.userpass = pw
							this.report_token(user, this.store.token)
							this.subscreen = 'Initial menu'
							break
						case 'un or pw wrong':
							this.error = 'Incorrect login details'
							break
						default:
							this.error = 'Error logging in'
							break
					}
				}
			})
			
		},
		sign_up_button() {
			
			this.error = false // reset
			
			let user = document.getElementById('signup_user').value
			let pw = document.getElementById('signup_pass').value
			
			var server_request = new XMLHttpRequest()
			
			let get_url = 'http://godcloud.philosofiles.com/?action=signup&username='+user+'&pw='+pw
			//lo(get_url)
			
			server_request.open("GET", get_url, false)
			server_request.send()
			
			const response = JSON.parse(server_request.responseText)
			lo(response)
			
			if (response.result === 'success') {
				
				this.store.online.user = user
				this.report_token(user, this.store.token)
				
				this.subscreen = 'Initial menu'
				
			} else if (response.result === "sql error") {
				if (response.error_number === '1062') {
					this.error='Username already taken'
				} else {
					this.error='Unknown SQL error'
				}
			} else {
				// todo: general error message
				this.error='Unknown non-SQL error'
			}
			
		},
		report_token(user, token) {
			
			let get_url = 'http://godcloud.philosofiles.com/?action=report_token&token='+this.store.token+'&user='+user;
			lo(get_url);

			godcloud.get(get_url).then((api_response) => {
				alert('token reported')
			})

			// Old synchronous code:
			// var server_request = new XMLHttpRequest()
			// server_request.open("GET", get_url, false) // false = synchronous
			// server_request.send()

		},
		online_games() {
			this.which_screen =  'show_selecting_online'
			this.store.online.subscreen = 'user menu' // is this right? was 'login or signup'
		},
		logout() {
			this.store.online.user = null
			// todo - remove token from db
		}
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