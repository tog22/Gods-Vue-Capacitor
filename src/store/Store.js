import { reactive, watch } from "vue";

const STATE_NAME = "gods_0.2_datastore";

let store_parent // What'll get exported
let load_saved_state = false

const default_state = {
        logged_in: 	        true,
        user:			    null,
        token:		        'unset',
		online: {
			user: 				null, // Tomek/logging_in/etc
			userpass: 			null, // pass/etc
			// game_id: 			22,
			// game_pass: 			10559,
			// side: 				1,
			game_id: null,
			game_pass: null,
			side: null,
			subscreen: 			'user menu', // default = 'user menu'
			error: 				null,
			login_error: 		null,
			signup_error: 		null,
			has_current_games: 	true, // todo, low: set
			games: 				[] // gets set in continue_online()
		}
}

const getdefault_state = () => {
	if (load_saved_state && localStorage.getItem(STATE_NAME) !== null) {
		let saved_state = JSON.parse(localStorage.getItem(STATE_NAME))
		update_recursively(saved_state, default_state)
		return saved_state
	} else {
		return default_state;
	}
};

const store = reactive(getdefault_state());


watch(
	() => store,
	() => {
	localStorage.setItem(STATE_NAME, JSON.stringify(store));
	},
	{ deep: true }
);

function update_recursively(to_update, to_match) {
	for (var key in to_match) {
		if (!to_match.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
			continue;
		} else if (typeof to_match[key] == "object" && to_match[key] !== null) {
			if (key in to_update) {
				update_recursively(to_update[key], to_match[key])
			} else {
				to_update[key] = to_match[key]
			}
		} else {
			if (!(key in to_update)) {
				to_update[key] = to_match[key]
				let bpt = 1
			}
		}
	}
}

function lo(to_log) {
	console.log(to_log)
}

/*********************
**   THE EXPORT:    */

const methods = {
	// addTask(todo){
	//   store.state.text = ''  // ← This should start store[dot]state[dot]text
	// }

}

const getters = {}

store_parent = {
	state: 		store,
	methods: 	methods,
	getters: 	getters,
}

export default store_parent


/*********************
**  ALTERNATIVELY:  **

// This doesn't work:
export default store

*********************/