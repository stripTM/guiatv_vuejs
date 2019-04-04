<template>
    <ul class="cabecera">
        <BotonFecha v-for="boton in getBotones" v-bind:key="boton.fecha.getTime()"
            :literal="boton.literal"
            :fecha="boton.fecha"
            :selected="boton.selected"
            v-on:selectFecha="selectFecha"/>
        <SelectorFecha
            v-if="extraSelectorFecha"
            v-bind:value="fechaSeleccionada"
            v-bind:min="fechaMin"
            v-bind:max="fechaMax"
            v-on:selectFecha="selectFecha"/>
    </ul>
</template>
<script>
import BotonFecha from './BotonFecha'
import SelectorFecha from './SelectorFecha'
import Fecha from '../../lib/Fecha.js'
export default {
    name: 'CabeceraParrilla',
    props: {
        fechaSeleccionada: {
            type: Date,
            required: true
        },
        fechaMin: {
            type: Date,
            required: true
        },
        fechaMax: {
            type: Date,
            required: true
        },
        fechaMinBotones: {
            type: Date,
            required: true
        },
        fechaMaxBotones: {
            type: Date,
            required: true
        }
    },
    components: {
        BotonFecha,
        SelectorFecha
    },
    created() {

    },
    computed: {
        getBotones() {
            //const totalLiterales = Math.min(this.diffFechaMinMax() + 1, 9)
            const totalLiterales = this.diffFechaMinMax() + 1
            return Array.from(
                {length: totalLiterales},
                (v, i) => {
                    let fIndice = new Date(this.fechaMinBotones.getTime() + i*24*60*60*1000)
                    return {
                        literal: Fecha.toDiaSemanaHumana(fIndice),
                        fecha: fIndice,
                        selected: Fecha.mismaFecha(Fecha.humana(this.fechaSeleccionada), fIndice)
                    }
                })
        },
        extraSelectorFecha() {
            return this.fechaMax.getTime() > this.fechaMaxBotones.getTime()
        }
    },
    methods: {
        diffFechaMinMax() {
            return Math.round(Math.abs((this.fechaMinBotones.getTime() - this.fechaMaxBotones.getTime())/(24*60*60*1000)))
        },
        selectFecha(fecha) {
            this.$emit('setFecha', fecha)
        }
    }
}
</script>
