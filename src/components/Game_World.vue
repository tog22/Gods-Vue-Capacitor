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