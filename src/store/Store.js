import { reactive, watch } from "vue";

const STATE_NAME = "gods_alpha_datastore";

let store_parent // What'll get exported
let load_saved_state = false

const default_state = {
        logged_in: 	        true,
        user:			    "Tomek",
        token:		        'unset'
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