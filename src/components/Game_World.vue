<template>
    <div>
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
						<div class="s_item piece" @click="end_turn">
							♟
						</div>
						<div class="s_item inspiration moved" @click="end_turn">
							⚡️
							<div class="s_badge">
								🔓
							</div>
						</div>
						<div class="current_player s_item">
							<span v-html="current_player_image"></span>
						</div>
						<div class="next_turn s_item s_text_only" @click="end_turn">
							<div class="s_text">
								End Turn
							</div>
						</div>
                        <!--
						<div class="s_item" @click="end_turn">
							🇹🇰
						</div>
                        -->
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
import { inject } from 'vue'

// Auxiliaries
import bus from '@/auxiliary/bus'
import starting_sotw from '@/auxiliary/SOTW_start'

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
		online: {
			type: Object
		}
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
            //
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

		which_screen: function() {
			if (this.winner) {
				return 'won'
			} else {
				return 'active'
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
			
        var turn
        var sotw
        var current_player

        if (this.online_screen) {
        } else if (!this.online_screen) {
            turn = 1
            current_player = 1
            sotw = starting_sotw
            
        }

        return {
            store: store_parent.state,
            turn: 					turn,
            current_player: 		current_player,
            piece_has_moved: 		false,
            inspiration_has_moved: 	false,
            selected_row: 			null,
            selected_col: 			null,
            row_delta: 				null,
            col_delta: 				null,
            winner:					null,
            win_type: 				null,
            online_game:			this.online_screen,
            sotw: 					sotw,
        }

    },
}

function lo(to_log) {
	console.log(to_log)
}
</script>