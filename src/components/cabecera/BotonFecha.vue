<template>
    <li :class="getClass" v-bind:title="toYYYYMMDD">
        <span v-if="selected">{{ literal }}</span>
        <a v-else :href="getUrl" v-on:click="selectFecha">{{ literal }}</a>
    </li>
</template>
<script>
export default {
    name: 'BotonFecha',
    props: {
        literal: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            required: true
        },
        selected: Boolean,
        preventClick: Boolean
    },
    mounted() {
        this.$emit('offSetLeft', this.$el.offsetLeft, this.fecha, this.selected)
    },
    methods: {
        selectFecha(e) {
            if(!this.preventClick) {
                this.$emit('selectFecha', this.fecha)
            }
            e.preventDefault()
        }
    },
    computed: {
        getClass() {
            return this.selected ? ['opcion', 'selected'] : 'opcion'
        },
        getUrl() {
            return `?f=${this.fecha.toISOString().split('T')[0]}`
        },
        toYYYYMMDD() {
            return this.fecha.toISOString().split('T')[0]
        }

    }
}
</script>
