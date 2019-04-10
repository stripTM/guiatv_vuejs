<template>
    <div class="outCabecera" ref="drag" v-on:scroll="handleScroll">
        <ul class="cabecera">
            <BotonFecha v-for="boton in getBotones" v-bind:key="boton.fecha.getTime()"
                :literal="boton.literal"
                :fecha="boton.fecha"
                :selected="boton.selected"
                :preventClick="mouseMove"
                v-on:offSetLeft="scrollToSelected"
                v-on:selectFecha="selectFecha"/>
            <SelectorFecha
                v-if="extraSelectorFecha"
                :value="fechaSeleccionada"
                :min="fechaMin"
                :max="fechaMax"
                :preventClick="mouseMove"
                v-on:selectFecha="selectFecha"/>
        </ul>
    </div>
</template>
<script>
import BotonFecha from './BotonFecha'
import SelectorFecha from './SelectorFecha'
import Fecha from '../../lib/Fecha.js'
import {draggable} from '../../mixins/draggable'

export default {
    name: 'CabeceraParrilla',
    mixins: [draggable],
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
        scrollToSelected(left, fecha, selected) {
            if (selected) {
                this.$el.scrollLeft = (left - 30)
            }
        },
        selectFecha(fecha) {
            this.$emit('setFecha', fecha)
        }
    }
}
</script>
