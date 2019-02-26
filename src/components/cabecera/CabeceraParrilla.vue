<template>
    <ul class="cabecera">
        <BotonFecha v-for="boton in getBotones" v-bind:key="boton.fecha.getTime()"
            :literal="boton.literal"
            :fecha="boton.fecha"
            :selected="boton.selected"
            v-on:selectFecha="selectFecha"/>
    </ul>
</template>
<script>
import BotonFecha from './BotonFecha'
import Fecha from '../../lib/Fecha.js'
export default {
    name: 'CabeceraParrilla',
    props: {
        fechaSeleccionada: {
            type: Date,
            required: true
        },
        totalDias: {
            type: Number,
            default: 9
        }
    },
    components: {
        BotonFecha
    },
    created() {

    },
    computed: {
        getBotones() {
            let f = new Date()
            f.setDate(f.getDate() - 2)
            return Array.from(
                {length: this.totalDias},
                () => {
                    f.setDate(f.getDate() + 1)
                    let fIndice = new Date(f)
                    fIndice.setDate(f.getDate())
                    Fecha.toDiaSemanaHumana(fIndice)
                    return {
                        literal: Fecha.toDiaSemanaHumana(f),
                        fecha: fIndice,
                        selected: Fecha.mismaFecha(this.fechaSeleccionada, fIndice)
                    }
                })
        }
    },
    methods: {
        selectFecha(fecha) {
            this.$emit('setFecha', fecha)
        }
    }
}
</script>
