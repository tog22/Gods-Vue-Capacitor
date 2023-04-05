<template>
    <div>
        game world
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

// Components

/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default {
    name: 'Game_World',
	props: {
		online_screen: {
			required: true,
			type: Boolean
		},
		online: {
			type: Object
		}
	},
    data() {
        
        const store_parent = inject("store")

        return {
            store: store_parent.state,
        }

    },
}
</script>