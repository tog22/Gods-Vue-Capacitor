<template>
    <div class="debug_display">
        <div v-for="(message, index) in messages" :key="'i'+index">
            {{ message }}
        </div>
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
        bus.on('debug display', (message) => {
            this.messages.push(message)
        })
    },
    data() {
        return {
            messages: [
                'Debug Display'
            ]
        }
    },
}
</script>

<style scoped>

.debug_display {
    overflow-y: scroll;
    height: 2.8em;
    font-size: 0.8em;
    background: #7c98b3;
}

</style>