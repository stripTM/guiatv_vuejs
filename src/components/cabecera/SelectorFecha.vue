<template>
    <li class="extraFecha">
        <label for="guiaCabeceraFecha"><img src="/css/i/guiaparrilla/ico-calendar.png" alt="Seleccionar fecha"/></label>
        <input id="guiaCabeceraFecha" type="date"
            v-bind:value="value | toInput"
            v-bind:min="min | toInput"
            v-bind:max="max | toInput"
            v-on:change="handleChange"/>
    </li>
</template>

<script>
import Fecha from '../../lib/Fecha.js'
export default {
    name: 'SelectorFecha',
    props: {
        value: {
            type: Date,
            required: false
        },
        min: {
            type: Date,
            required: false
        },
        max: {
            type: Date,
            required: false
        }
    },
    data() {
        return {
            seleccionada: ''
        }
    },
    filters: {
        toInput(fecha) {
            //return fecha.toISOString().split('T')[0]
            return Fecha.humana(fecha).toISOString().split('T')[0]
        }
    },
    methods: {
        handleChange(e) {
            const nuevaFecha = new Date(e.target.value + 'T06:00:00')
            this.$emit('selectFecha', nuevaFecha)
        }
    }
}
</script>

