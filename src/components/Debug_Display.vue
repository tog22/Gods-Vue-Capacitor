<template>
    <div class="debug_display">
        {{text}}
    </div>
</template>

<script>
import bus from '@/auxiliary/bus'
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