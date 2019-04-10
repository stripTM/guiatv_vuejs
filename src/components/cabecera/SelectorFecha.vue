<template>
    <li class="extraFecha">
        <label for="guiaCabeceraFecha" v-on:click="cancelClick"><img src="/css/i/guiaparrilla/ico-calendar.png" alt="Seleccionar fecha"/></label>
        <input id="guiaCabeceraFecha" type="date"
            v-bind:value="value | toInput"
            v-bind:min="min | toInput"
            v-bind:max="max | toInput"
            v-on:change="handleChange"
            v-on:click="cancelClick"/>
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
        },
        preventClick: {
            type: Boolean,
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
            const nuevaFecha = new Date(e.target.value + 'T12:00:00')
            // Verificar que la nueva fecha cae entre los límites y no es una fecha inválida
            if (!(nuevaFecha instanceof Date) || isNaN(nuevaFecha) || nuevaFecha < this.min || nuevaFecha > this.max) {
                e.preventDefault()
                return
            }
            e.target.blur()
            this.$emit('selectFecha', nuevaFecha)
        },
        cancelClick(e) {
            if(this.preventClick) {
                e.preventDefault()
            }
        }
    }
}
</script>

