<template>
    <div class="debug_display">
        <div id="copy_to_clipboard" @click="copyToClipboard">
            📋
        </div>
        <div v-for="(message, index) in messages" :key="'i'+index">
            {{ message }}
        </div>
    </div>
</template>

<script>

/*******************
**   ⤵️ IMPORTS   **
*******************/

// External libraries
import { Clipboard } from '@capacitor/clipboard';

// Auxiliaries
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
    methods: {
        copyToClipboard() {
            Clipboard.write({
                string: this.messages.join('\n')
            })
        }
    },
    data() {
        return {
            messages: []
        }
    },
}
</script>

<style scoped>

.debug_display {
    overflow-y: scroll;
    overflow-x: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    hyphens: auto;
    width: 100%;
    height: 2.8em;
    font-size: 0.8em;
    background: #7c98b3;
    position: relative;
}

#copy_to_clipboard {
    position: absolute;
    top: 2px;
    right: 4px;
}

</style>