<template>
    <div class="debug_display">
        Debug: {{text}}
    </div>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

import bus from '@/auxiliary/bus'


/*********************
**   *️⃣ MAIN CODE   **
*********************/

export default {
    name: 'Debug_Display',
    created() {
        bus.on('debug display', (msg) => {
            this.text = msg
        })
    },
    data() {
        return {
            text: 'Debug Display'
        }
    },
}
</script>