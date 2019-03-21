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
            let f = new Date()
            const totalLiterales = Math.min(this.diffFechaMinMax() + 1, 9)
            f.setDate(this.fechaMinBotones.getDate() - 1)
            return Array.from(
                {length: totalLiterales},
                () => {
                    f.setDate(f.getDate() + 1)
                    let fIndice = new Date(f)
                    fIndice.setDate(f.getDate())
                    return {
                        literal: Fecha.toDiaSemanaHumana(f),
                        fecha: fIndice,
                        selected: Fecha.mismaFecha(this.fechaSeleccionada, fIndice)
                    }
                })
        },
        extraSelectorFecha() {
            return this.diffFechaMinMax() >= 9
        }
    },
    methods: {
        diffFechaMinMax() {
            return Math.round(Math.abs((this.fechaMin.getTime() - this.fechaMax.getTime())/(24*60*60*1000)))
        },
        selectFecha(fecha) {
            this.$emit('setFecha', fecha)
        }
    }
}
</script>
