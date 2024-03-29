<template>
    <div v-if="online_is_loading" id="loading">
		<div class="s_text">
			Loading...
		</div>
	</div>
	<div v-else-if="!winner" class="game_world">
		<div v-if="show_restart_dialog" id="dialog">
			<p>
				Are you sure you want to restart the game?
			</p>
			<p class="dialog_buttons">
				<a @click="restart_game">Yes</a>
				<a @click="show_restart_dialog = false">No</a>
			</p>
		</div>
		<table class="board">
			<tr v-for="(row, row_index) in sotw" :key="'r'+row_index">
				<Square
					v-for="(square, col_index) in row"
						:key="'c'+col_index"
						:square="square"
						:row="row_index"
						:col="col_index"
						:is_selected="sotw[row_index][col_index].is_selected"
						@square_click_emission="square_click"
				/>
			</tr>
		</table>
		<div id="bottom_zone">
			<div id="bz_content">
				<div id="info_bar">
					<div id="item_flex_container">
						<!-- <div 
                            class="s_item piece" 
                            :class="has_piece_moved"
                            @click="end_turn"
                        >
							♟
						</div>
						<div 
                            class="s_item inspiration" 
                            :class="has_inspiration_moved"
                            @click="toggle_inspiration_lock"
                        >
							⚡️
							<div class="s_badge" v-if="inspiration_locked">
								🔒
							</div>
							<div class="s_badge" v-else>
								🔑
							</div>
						</div> -->
						<div class="back_arrow s_item" @click="reset_turn">
							<img src="/images/back_arrow.png" alt="←" />
						</div>
						<div class="next_turn s_item" @click="end_turn"><!-- was s_text_only -->
							<img alt="End turn" src="/images/tick_green_desat.png" />
							<!-- <div class="s_text">
								End Turn
							</div> -->
						</div>
						<div class="current_player s_item">
							<span v-html="current_player_image"></span>
						</div>
						<!-- <div class="s_item" style="max-width: 80px; font-size: 0.7em; overflow: hidden;">
							🇹{{  store.token }}
						</div> -->
					</div>
				</div>
			</div>
		</div>
    </div>
	<div v-else-if="winner" id="end_game">
		<div class="s_container">
			<div v-if="game_type === 'online' && winner !== store.online.side">
				<div id="victory">
					Defeat!
				</div>
				<div id="type_of_victory">
					You have lost
				</div>
			</div>
			<div v-else>
				<div id="victory">
					Victory!
				</div>
				<div id="type_of_victory">
					You have won
				</div>
			</div>
			<router-link 
				class="button" 
				to="/"
			>
				Back to menu
			</router-link>
		</div>
	</div>
</template>
<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { inject } from 'vue'
import axios from 'axios'; // for temp test
import $ from 'jquery'

// Auxiliaries
import api from '@/auxiliary/api'
import bus from '@/auxiliary/bus'
import godcloud from '@/auxiliary/api'
import starting_sotw from '@/auxiliary/SOTW_start'
import tog from '@/libraries/tog'
import togvue from '@/libraries/togVue'

// Components
import Square from '@/components/Square.vue'

/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default {
    name: 'Game_World',
    components: {
        Square
    },
	props: {
		online_screen: {
			required: true,
			type: Boolean
		},
		debug_player: {
			type: Boolean
		},
		online: {
			type: Object
		}
	},

    created() {

		/***********************
		**  GET DATA FROM API **
		***********************/

		if (this.online_screen) {
			
			let debug_mode = false

			if (debug_mode) {
				this.turn = 1
				this.current_player = 1
				this.sotw = clone(starting_sotw)
			}
 			
			let get_url = 'https://godcloud.philosofiles.com/?action=get&game='+this.store.online.game_id+'&pw='+this.store.online.game_pass
			lo(get_url)

			// New asynchronous code

			bus.emit('debug display', '?action=get&game='+this.store.online.game_id+'&pw='+this.store.online.game_pass)

			godcloud.get(get_url).then((response) => {
				
				// console.log('gc resp = ',response)
				// togvue.log(tog.debugging.dump(response.data))
				
				this.turn = response.turn
				this.current_player = response.current_player
				this.sotw = response.sotw
				this.online_is_loading = false
				
			})
			/**/
		}

        /*******************
        **  BUS HANDLERS  **
        *******************/

        bus.on('move', (move) => {

            this.on_fcm_update_received(move)

        });

        bus.on('log_sotw', () => {

            this.on_log_sotw()

        });

		bus.on('toggle restart dialog', (data) => {
			this.show_restart_dialog = !this.show_restart_dialog
		})

    },
    
	methods: {
		/***************************
		****************************
		**						  **
		**	 BASE CLICK HANDLER   **
		**						  **
		****************************
		***************************/
		square_click(row, col) {

			if (this.waiting_online()) {
				// alert('Waiting for other player');
				return;
			}

			let clicked = this.sotw[row][col];

			let is_something_selected;
			if (this.selected_row !== null && this.selected_col !== null) {
				is_something_selected = true;
			} else {
				is_something_selected = false;
			}

			// 1) SELECTING PIECES
			if (!is_something_selected) {

				// Check if the active side has a piece to select

				if (clicked.occupant === null) {
					return;
				}

				if (clicked.side !== this.current_player) {
					
					$("#info_bar .current_player").addClass("pulse")

					$("#info_bar .current_player").on(
						"transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd",
						function() {
							$(this).removeClass("pulse");
						}
					);

					// alert ("It's not this player's turn");
					// ↑ todo: Ideally make the turn indicator flash red instead
					return;
				}

				// Check if the relevant thing (a mortal/angel, or divine inspiration) hasn't moved yet

				if (clicked.divinely_inspired && this.inspiration_has_moved) {
					return;
				}

				if (!clicked.divinely_inspired && this.piece_has_moved) {
					return;
				}

				// If conditions above are met, make the selection

				this.selected_row = row;
				this.selected_col = col;

				this.sotw[row][col].is_selected = 'selected ';

			// 2) MOVING SELECTED PIECES
			} else if (is_something_selected) {

				let to_row = row;
				let to_col = col;
				let from_row = this.selected_row;
				let from_col = this.selected_col;

				// Re-clicking the selected piece, to unselect it

				if (to_row === from_row && to_col === from_col) {
					this.unselect_piece()
					return
				}


				// Check if it's a valid move
				// ...starting by calculating the deltas for later use
				if (to_row > from_row) {
					this.row_delta = to_row - from_row;
				} else {
					this.row_delta = from_row - to_row;
				}
				if (to_col > from_col) {
					this.col_delta = to_col - from_col;
				} else {
					this.col_delta = from_col - to_col;
				}

				let selected = this.sotw[from_row][from_col];

				if (this.is_valid_move(this.selected_row, this.selected_col, to_row, to_col)) {

					// Make the move

					if (selected.divinely_inspired) {

						this.inspiration_has_moved = true
						selected.divinely_inspired = false
						clicked.divinely_inspired = true
						// this.check_for_trap(this.selected_row, this.selected_col)
						this.check_for_reaching_heartland(clicked)

					} else if (selected.occupant === 'mortal') {

						this.piece_has_moved = true
						selected.occupant = null
						selected.side = null
						clicked.occupant = 'mortal'
						clicked.side = this.current_player
						this.check_for_trap(to_row, to_col)

					} else if (selected.occupant === 'angel'){
						this.piece_has_moved = true
						selected.occupant = null
						selected.side = null
						clicked.occupant = 'angel'
						clicked.side = this.current_player
						this.check_for_trap(to_row, to_col)

					}
					this.unselect_piece()

					// End turn/switch to the other player if appropriate
					/* 
					Disabled (making the tick compulsory)
					if (this.piece_has_moved) {
						if (!this.inspiration_locked) {
                            this.end_turn();
                        } else if (this.inspiration_has_moved) {
                            this.end_turn();
                        }
					}
					*/

				} else {
					// alert("Not a valid move");
				}

			}
		},
		/***************************
		****************************
		**						  **
		**	 IS THE MOVE VALID?   **
		**						  **
		****************************
		***************************/
		is_valid_move(from_row, from_col, to_row, to_col) {

			let selected = this.sotw[from_row][from_col];
			let dest = this.sotw[to_row][to_col];

			// Don't count clicks on the same square, to make logic simpler

			if ((from_row === to_row) && (from_col === to_col)) {
				return false;
			}

			//  1) MOVING MORTALS & ANGELS

			if (!selected.divinely_inspired && !this.piece_has_moved) {
				if (dest.occupant !== null) {
					return false;
				}
				if (selected.occupant === 'mortal') {
					if (this.is_adjacent()) {
						return true;
					}
					if (this.is_adjacent_diagonally()) {
						return true;
					}
					if (this.is_straight_hop(from_row, from_col, to_row, to_col)) {
						return true;
					}
					if (this.is_diagonal_hop(from_row, from_col, to_row, to_col)) {
						return true;
					}
				} else if (selected.occupant === 'angel') {
					if (this.is_along_clear_straight_line(from_row, from_col, to_row, to_col)) {
						return true;
					}
					if (this.is_angel_hop(from_row, from_col, to_row, to_col)) {
						return true;
					}
				}
			}

			//  2) MOVING DIVINE INSPIRATION

			if (selected.divinely_inspired && !this.inspiration_has_moved) {
				if (!dest.side === this.current_player) {
					return false;
				}
				if (this.is_along_an_inspiration_path(from_row, from_col, to_row, to_col)) {
					return true;
				}
			}
		},
		is_adjacent_diagonally() {
			if (this.row_delta === 1 && this.col_delta === 1) {
				return true;
			} else {
				return false;
			}
		},
		is_adjacent() {
			if (this.row_delta === 1 && this.col_delta === 0) {
				return true;
			} else if (this.row_delta === 0 && this.col_delta === 1) {
				return true;
			} else {
				return false;
			}
		},
		is_along_clear_straight_line(from_row, from_col, to_row, to_col) {
			// Check if it's not a straight line
			if (this.row_delta !== 0 && this.col_delta !== 0) {
				return false;
			}
			// Check for pieces in between
			if (this.row_delta > 0) {
				let lowest_intermediate;
				let highest_intermediate;
				if (to_row > (from_row+1)) {
					highest_intermediate = to_row - 1;
					lowest_intermediate = from_row + 1;
				} else if (from_row > (to_row+1)) {
					highest_intermediate = from_row - 1;
					lowest_intermediate = to_row + 1;
				} else { // It's just moving 1 square
					return true;
				}
				for (
					let intermediate = lowest_intermediate;
					intermediate <= highest_intermediate;
					intermediate++
				) {
					let intermediate_square = this.sotw[intermediate][from_col];
					if (intermediate_square.occupant) {
						return false;
					}
				}
				return true;
			} else if (this.col_delta > 0) {
				let lowest_intermediate;
				let highest_intermediate;
				if (to_col > (from_col+1)) {
					highest_intermediate = to_col - 1;
					lowest_intermediate = from_col + 1;
				} else if (from_col > (to_col+1)) {
					highest_intermediate = from_col - 1;
					lowest_intermediate = to_col + 1;
				} else { // It's just moving 1 square
					return true;
				}
				for (
					let intermediate = lowest_intermediate;
					intermediate <= highest_intermediate;
					intermediate++
				) {
					let intermediate_square = this.sotw[from_row][intermediate];
					if (intermediate_square.occupant) {
						return false;
					}
				}
				return true;
			}
		},
		is_along_solid_straight_line(from_row, from_col, to_row, to_col) {
			// Check if it's not a straight line
			if (this.row_delta !== 0 && this.col_delta !== 0) {
				return false;
			}
			// Check for pieces in between
			if (this.row_delta > 0) {
				let lowest_intermediate;
				let highest_intermediate;
				if (to_row > (from_row+1)) {
					highest_intermediate = to_row - 1;
					lowest_intermediate = from_row + 1;
				} else if (from_row > (to_row+1)) {
					highest_intermediate = from_row - 1;
					lowest_intermediate = to_row + 1;
				} else { // It's just moving 1 square
					return true;
				}
				for (
					let intermediate = lowest_intermediate;
					intermediate <= highest_intermediate;
					intermediate++
				) {
					let intermediate_square = this.sotw[intermediate][from_col];
					if (!intermediate_square.occupant) {
						return false;
					}
				}
				return true;
			} else if (this.col_delta > 0) {
				let lowest_intermediate;
				let highest_intermediate;
				if (to_col > (from_col+1)) {
					highest_intermediate = to_col - 1;
					lowest_intermediate = from_col + 1;
				} else if (from_col > (to_col+1)) {
					highest_intermediate = from_col - 1;
					lowest_intermediate = to_col + 1;
				} else { // It's just moving 1 square
					return true;
				}
				for (
					let intermediate = lowest_intermediate;
					intermediate <= highest_intermediate;
					intermediate++
				) {
					let intermediate_square = this.sotw[from_row][intermediate];
					if (!intermediate_square.occupant) {
						return false;
					}
				}
				return true;
			}
		},

		is_along_an_inspiration_path(from_row, from_col, to_row, to_col) {

			let path_trace_tracker = {}

			// First just check there's a piece on the destination

			if (!this.sotw[to_row][to_col].occupant || this.sotw[to_row][to_col].occupant.player !== this.player ) {
				return false
			}

			// Create tracker for visited places

			let visited = []
			for (var row = 0; row <= 8; row++) {
				visited[row] = []
				for (var col = 0; col <= 5; col++) {
					visited[row][col] = false
				}
			}
			path_trace_tracker.visited = visited

			// Start from to row and trace all possible courses, until we're either done or have reached divine inspiration

			path_trace_tracker.reached_inspiration = false
			this.trace_adjacent_cells(to_row, to_col, path_trace_tracker)

			if (path_trace_tracker.reached_inspiration) {
				return true
			} else {
				return false
			}

		},

		trace_adjacent_cells(row, col, path_trace_tracker) {

			let adjacent_cells = this.get_adjacent_cells(row, col)

			// lo('____ TRACE ADJACENT TO '+row+'-'+col)

			for (var adj of adjacent_cells) {

				// lo('__IN LOOP FOR '+row+'-'+col)
				// lo('checking '+adj.row+'-'+adj.col)
				if (path_trace_tracker.visited[adj.row][adj.col]) { // f1
					// lo('…visited')
					continue
				}
				path_trace_tracker.visited[adj.row][adj.col] = true

				if (this.sotw[adj.row][adj.col].side !== this.current_player) { // f2
					// lo('…empty')
					continue
				}

				if (this.sotw[adj.row][adj.col].divinely_inspired) {
					path_trace_tracker.reached_inspiration = true
					// lo('••• DIVINE INSPIRATION FOUND •••')
				}

				// Otherwise…
				// lo('…neither visited nor empty, so starting subtrace')
				this.trace_adjacent_cells(adj.row, adj.col, path_trace_tracker)

			}
		},

		get_adjacent_cells(row, col) {
			let adjacent_cells = []

			if (row !== 0) {
				adjacent_cells.push(
					{
						row: row - 1,
						col: col
					}
				)
			}

			if (row !== 8) {
				adjacent_cells.push(
					{
						row: row + 1,
						col: col
					}
				)
			}

			if (col !== 0) {
				adjacent_cells.push(
					{
						row: row,
						col: col - 1
					}
				)
			}

			if (col !== 5) {
				adjacent_cells.push(
					{
						row: row,
						col: col + 1
					}
				)
			}

			return adjacent_cells

		},

		is_hop(from_row, from_col, to_row, to_col) {

			if (this.is_straight_hop(from_row, from_col, to_row, to_col)) {
				return true
			} else if (this.is_diagonal_hop(from_row, from_col, to_row, to_col)) {
				return true
			} else {
				return false
			}

		},

		is_straight_hop(from_row, from_col, to_row, to_col) {

			if (this.row_delta > 0 && this.col_delta > 0) {
				return false
			}

			var intermediate_piece
			var is_along_column
			var col_direction

			if (this.row_delta === 2) {
				var intermediate_row
				if (to_row > from_row) {
					intermediate_row = to_row - 1;
				} else {
					intermediate_row = from_row - 1;
				}
				intermediate_piece = this.sotw[intermediate_row][from_col]
			} else if (this.col_delta === 2) {
				is_along_column = true
				var intermediate_col
				if (to_col > from_col) {
					intermediate_col = to_col - 1;
					col_direction = 'down'
				} else {
					intermediate_col = from_col - 1;
					col_direction = 'up'
				}
				intermediate_piece = this.sotw[from_row][intermediate_col]
			} else {
				return false
			}

			/* Old rule:
			if (intermediate_piece.divinely_inspired) {
				return false;
			}
			*/

			switch (this.current_player) {

				case 1:
					// if (is_along_column && col_direction === 'up') {
					// 	return false
					// }
					if (intermediate_piece.side === 2) {
						return true
					} else {
						return false
					}
				case 2:
				default:
					// if (is_along_column && col_direction === 'down') {
					// 	return false
					// }
					if (intermediate_piece.side === 1) {
						return true
					} else {
						return false
					}
			}

		},

		is_diagonal_hop(from_row, from_col, to_row, to_col) {

			if (this.row_delta !== 2 || this.col_delta !== 2) {
				return false
			}

			var intermediate_piece
			var col_direction

			
			var intermediate_row
			if (to_row > from_row) {
				intermediate_row = to_row - 1;
			} else {
				intermediate_row = from_row - 1;
			}

			var intermediate_col
			if (to_col > from_col) {
				intermediate_col = to_col - 1;
				col_direction = 'down'
			} else {
				intermediate_col = from_col - 1;
				col_direction = 'up'
			}

			intermediate_piece = this.sotw[intermediate_row][intermediate_col]
			
			/* Old rule:
			if (intermediate_piece.divinely_inspired) {
				return false;
			}
			*/

			switch (this.current_player) {

				case 1:
					// if (is_along_column && col_direction === 'up') {
					// 	return false
					// }
					if (intermediate_piece.side === 2) {
						return true
					} else {
						return false
					}
				case 2:
				default:
					// if (is_along_column && col_direction === 'down') {
					// 	return false
					// }
					if (intermediate_piece.side === 1) {
						return true
					} else {
						return false
					}
			}

		},

		is_angel_hop(from_row, from_col, to_row, to_col) {

			// Check it's a straight line
			if (this.row_delta > 0 && this.col_delta > 0) {
				return false
			}

			var intermediate_piece
			var is_along_column
			var col_direction

			if (this.row_delta > 0) {
				
				// Find the second-last ('intermediate') square, to check if it's occupied

				let intermediate_row
				if (to_row > from_row) {
					intermediate_row = to_row - 1;
				} else {
					intermediate_row = to_row + 1;
				}
				intermediate_piece = this.sotw[intermediate_row][from_col]

				// Check the path is clear up to that second-last ('intermediate') square

				if (!this.is_along_clear_straight_line(from_row, from_col, intermediate_row, to_col)) {
					return false
				}

			} else if (this.col_delta > 0) {
				
				// Find the second-last ('intermediate') square, to check if it's occupied
				
				let intermediate_col
				if (to_col > from_col) {
					intermediate_col = to_col - 1;
					col_direction = 'down'
				} else {
					intermediate_col = from_col - 1;
					col_direction = 'up'
				}
				intermediate_piece = this.sotw[from_row][intermediate_col]

				// Check the path is clear up to that second-last ('intermediate') square

				if (!this.is_along_clear_straight_line(from_row, from_col, to_row, intermediate_col)) {
					return false
				}

			} else {
				return false
			}

			/* Old rule:
			if (intermediate_piece.divinely_inspired) {
				return false;
			}
			*/

			switch (this.current_player) {

				case 1:
					if (intermediate_piece.side === 2) {
						return true
					} else {
						return false
					}
				case 2:
				default:
					if (intermediate_piece.side === 1) {
						return true
					} else {
						return false
					}
			}

		},

		/***************************
		****************************
		**						  **
		**	   POST-TURN STUFF    **
		**						  **
		****************************
		***************************/

		unselect_piece() {

			// Deselect the square moved from
			this.sotw[this.selected_row][this.selected_col].is_selected = '';

			// AFTER all other deselection steps, unset the world's selected_row/col state

			this.selected_row = null;
			this.selected_col = null;

			// Reset the deltas for neatness
			this.row_delta = null;
			this.col_delta = null;

		},

		check_for_reaching_heartland(moved_to) {

			if (moved_to.heartland === undefined) {
				return
			}

			switch (moved_to.heartland) {
				case 1:
					if (this.current_player === 2) {
						this.winner = 2
						this.win_type = 'Heartland reached'
						if (this.online_game) {
							this.send_turn();
						}
					}
					break;
				case 2:
					if (this.current_player === 1) {
						this.winner = 1
						this.win_type = 'Heartland reached'
						if (this.online_game) {
							this.send_turn();
						}
					}
					break;
			}

		},

		check_for_trap(to_row, to_col) {

			let squares_to_check_for_trap = this.squares_to_check_for_trap(to_row, to_col)

			let self = this.current_player
			var opponent
			if (self === 1) {
				opponent = 2
			} else {
				opponent = 1
			}

			for (var square of squares_to_check_for_trap) {
				if (this.sotw[square.adj_row][square.adj_col].side === opponent) {

					if (this.sotw[square.next_row][square.next_col].side === self /* Old rule: && !this.sotw[square.next_row][square.next_col].divinely_inspired*/) {

						this.sotw[square.adj_row][square.adj_col].occupant = null
						this.sotw[square.adj_row][square.adj_col].side = null

						if (this.sotw[square.adj_row][square.adj_col].divinely_inspired) {
							this.winner = this.current_player
							this.win_type = 'Faith extinguished'
							this.sotw[square.adj_row][square.adj_col].divinely_inspired = false
							if (this.online_game) {
								this.send_turn();
							}
						}

					}

				}
			}

		},

		squares_to_check_for_trap(row, col) {

			var at_top = false
			var at_bottom = false
			var at_left = false
			var at_right = false

			if (row === 0 || row === 1) {
				at_top = true
			}
			if (row === 8 || row === 7) {
				at_bottom = true
			}
			if (col === 5 || col === 4) {
				at_right = true
			}
			if (col === 0 || col  === 1) {
				at_left = true
			}

			let squares_to_check_for_trap = []
			// TODO - match new rules
			if (!at_top) {
				squares_to_check_for_trap.push({
					direction: 'row',
					adj_row: row - 1,
					adj_col: col,
					next_row: row - 2,
					next_col: col
				})
			}
			if (!at_bottom) {
				squares_to_check_for_trap.push({
					direction: 'row',
					adj_row: row + 1,
					adj_col: col,
					next_row: row +2,
					next_col: col
				})
			}
			if (!at_left) {
				squares_to_check_for_trap.push({
					direction: 'col',
					adj_row: row,
					adj_col: col - 1,
					next_row: row,
					next_col: col - 2
				})
			}
			if (!at_right) {
				squares_to_check_for_trap.push({
					direction: 'col',
					adj_row: row,
					adj_col: col + 1,
					next_row: row,
					next_col: col + 2
				})
			}

			return squares_to_check_for_trap

		},

        toggle_inspiration_lock() {
            this.inspiration_locked = !this.inspiration_locked

        },

		show_end_game() {
			
		},

		end_turn(atclick_var = null, by_opponent = false) {

			switch (this.current_player) {
				case 1:
					this.current_player = 2;
					break;
				case 2:
					this.current_player = 1;
					break;
			}
			lo('Turn = '+this.turn)
			this.turn++;
			this.piece_has_moved = false;
			this.inspiration_has_moved = false;
			if (this.selected_row && this.selected_col) {
				this.sotw[this.selected_row][this.selected_col].is_selected = '';
			}
			this.selected_row = null;
			this.selected_col = null;
			this.row_delta = null;
			this.col_delta = null;
			// Pulse animation is added in computed property current_player_image
			/// (Adding it with jQuery here doesn't work as it then gets overridden there)

			this.reset_turn_sotw = clone(this.sotw)

			if (this.online_game && !by_opponent) {
				this.send_turn();
			}
		},

		send_turn() {

			let get_url = 'https://godcloud.philosofiles.com/?action=update&game='+this.store.online.game_id+'&pw='+this.store.online.game_pass+'&turn='+this.turn+'&current_player='+this.current_player+'&sending_player_name='+this.store.online.user+'&winner='+this.winner+'&win_type='+this.win_type+'&sotw='+JSON.stringify(this.sotw);
			
			godcloud.get(get_url).then((response) => {
				lo('🔄 Sending update. Response ='+response)
			})

			/* Old synchronous code
			var server_request = new XMLHttpRequest()
			server_request.open("GET", get_url, false) // false = synchronous
			server_request.send()
			lo('🔄 Sending update. Response =')
			lo(server_request.responseText)
			*/

		},

		waiting_online() {

			if (!this.online_game) {
				return false
			}
			
			if (
				(this.current_player === 1 && this.store.online.side === 2)
				||
				(this.current_player === 2 && this.store.online.side === 1)
			) {
				return true
			} else {
				return false
			}

		},

		get_game_state(game_id, game_pass) {

			let get_url = 'https://godcloud.philosofiles.com/?action=get&game='+game_id+'&pw='+game_pass

			godcloud.get(get_url).then((response) => {
				console.log('🔄 got sotw. Response ='+response)

				this.turn = response.turn
				this.current_player = response.current_player
				this.sotw = response.sotw
			})

			// Old synchronous code

			// var server_request = new XMLHttpRequest()

			// server_request.open("GET", get_url, false) // false = synchronous
			// server_request.send()

			// const response = JSON.parse(server_request.responseText)

			// this.turn = response.turn
			// this.current_player = response.current_player
			// this.sotw = response.sotw
		},

		dummy_game_state(game_id = null, game_pass = null) {
			this.turn = 1
			this.current_player = 1
			this.sotw = clone(starting_sotw)
		},

		on_fcm_update_received(update) {
			
			let game_id = update.game_id
			let game_pass = update.game_pass

			if (game_id == this.store.online.game_id && game_pass == this.store.online.game_pass) {
				this.get_game_state(game_id, game_pass)
			} else {
				lo('🚫 FCM received, but not this game')
			}

		},

		on_update_received(update) {

			lo('u=')
			lo(update)
			this.sotw = update.sotw
			this.turn = update.turn
			this.current_player = update.current_player
			this.winner = update.winner
			this.win_type = update.win_type

			// Not needed, defeat screen will show: if (this.winner) {}

		},

		// ↓ Not used
		on_move_received(move) {

			
			// Make the move

			if (move.inspiration) {

				/* ↓  NB: Don't use same let name
							in these 2 if blocks, because in Vue specifically the let name persists, and then becomes undefined in the 2nd if statement
				*/
				let from_for_inspiration = this.sotw[move.inspiration.from_row][move.inspiration.from_col]
				let to_for_inspiration = this.sotw[move.inspiration.to_row][move.inspiration.to_col]
				from_for_inspiration.divinely_inspired = false
				to_for_inspiration.divinely_inspired = true

				// Maybe have move sender send the results:

				this.check_for_trap(move.inspiration.from_row, move.inspiration.from_col)
				this.check_for_reaching_heartland(to_for_inspiration)

				}

				if (move.piece) {

				/* ↓  NB: Don't use same let name
							in these 2 if blocks, because in Vue specifically the let name persists, and then becomes undefined in the 2nd if statement
				*/
				let from_for_move = this.sotw[move.piece.from_row][move.piece.from_col]
				let to_for_move = this.sotw[move.piece.to_row][move.piece.to_col]
				from_for_move.occupant = null
				from_for_move.side = null
				to_for_move.occupant = move.piece.type
				to_for_move.side = move.piece.side
				this.check_for_trap(move.piece.from_row, move.piece.from_col)

				}
				this.end_turn(null, 'by_opponent')

		},

		on_log_sotw() {

			lo(this.sotw)

		},

		reset_turn() {
			this.sotw = clone(this.reset_turn_sotw)
		},

		restart_game() {
			this.turn = 					1
			this.current_player = 			2
			this.sotw = 					clone(starting_sotw)
			this.piece_has_moved = 			false
			this.inspiration_has_moved = 	false
			this.inspiration_locked = 		true
			this.selected_row = 			null
			this.selected_col = 			null
			this.row_delta = 				null
			this.col_delta = 				null
			this.winner =					null
			this.win_type = 				null
			this.show_restart_dialog =		false
			lo(this.sotw)
		}

	},

	computed: {

		current_player_image: function() {
			switch (this.current_player) {
				case 1:
					return '<span class="cpi blue"></span>';
				case 2:
					return '<span class="cpi red"></span>';
				default:
					return 'Unset: this.current_player'
			}
		},

        has_piece_moved: function() {
            if (this.piece_has_moved) {
                return 'piece_has_moved'
            } else {
                return 'piece_has_not_moved'
            }
        },

        has_inspiration_moved: function() {
            if (this.inspiration_has_moved) {
                return 'inspiration_has_moved'
            } else {
                return 'inspiration_has_not_moved'
            }
        },

		which_screen: function() {
			if (this.winner) {
				return 'won'
			} else {
				return 'active'
			}
		},

		show_game_world: function() {
			if (!this.winner) {
				return 'shown'
			} else {
				return 'hidden'
			}
		},

		type_of_victory: function() {
			if (this.win_type === 'Faith extinguished') {
				return 'The opposing faith was extinguished, leaving the path clear for the conversion of its former believers'
			} else if (this.win_type === 'Heartland reached') {
				return "A divinely inspired monk or abbot reaches the other side's heartland, and begins to convert its populace to the one true faith"
			} else {
				return 'The one true faith prevails'
				// ↑ A fallback, not actually used
			}
		},

		is_in_dev: function() {
			return 'dev' // 'dev'
		}

	},

    data() {
        
        const store_parent = inject("store")
		// let store_pre_setup = store_parent.state
		
		// ↓ Initial values - for online games these get updated in created(). They can't be set here because GodCloud is asyncronous.
        let turn = 1
        let current_player = 2
        let sotw = clone(starting_sotw)
		let online_is_loading = false

		if (this.online_screen) {
			online_is_loading = true
		}

        return {
            store: 					store_parent.state,
            turn: 					turn,
            current_player: 		current_player,
            piece_has_moved: 		false,
            inspiration_has_moved: 	false,
            inspiration_locked: 	true,
            selected_row: 			null,
            selected_col: 			null,
            row_delta: 				null,
            col_delta: 				null,
            winner:					null,
            win_type: 				null,
            online_game:			this.online_screen,
			online_is_loading:		online_is_loading,
			show_restart_dialog:	false,
			reset_turn_sotw:		clone(sotw),
            sotw: 					sotw,
        }

    },
}


/*******************
**	🛠 FUNCTIONS  **
*******************/


function lo(to_log) { 
	console.log(to_log) 
}

function alo(to_log) {
	bus.emit('debug display', to_log)
}

function clone(obj) {
	return JSON.parse(JSON.stringify(obj))
}

</script>