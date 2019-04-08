<template>
    <div class="outCabecera" ref="lienzoParrilla" v-on:scroll="handleScroll">
        <ul class="cabecera" ref="track">
            <BotonFecha v-for="boton in getBotones" v-bind:key="boton.fecha.getTime()"
                :literal="boton.literal"
                :fecha="boton.fecha"
                :selected="boton.selected"
                v-on:offSetLeft="scrollToSelected"
                v-on:selectFecha="selectFecha"/>
            <SelectorFecha
                v-if="extraSelectorFecha"
                v-bind:value="fechaSeleccionada"
                v-bind:min="fechaMin"
                v-bind:max="fechaMax"
                v-on:selectFecha="selectFecha"/>
        </ul>
    </div>
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
    data() {
        return {
            fechaScrollX: 0,
            fechaScrollY: 0,
            mouseDown: false,
            mouseMove: false,
            dragStartX: 0,
            dragStaryY: 0
        }
    },
    mountedzz() {
        // Mover horizontalmente con ratón
        if ('ontouchstart' in window) {
            this.$refs.track.addEventListener('touchstart', this.handleMouseDown)
            this.$refs.track.addEventListener('touchend', this.handleMouseUp)
            this.$refs.track.addEventListener('touchmove', this.handleMouseMove)
        } else {
            this.$refs.track.addEventListener('mousedown', this.handleMouseDown)
            this.$refs.track.addEventListener('mouseup', this.handleMouseUp)
            this.$refs.track.addEventListener('mousemove', this.handleMouseMove)
        }
    },
    destroyedzz() {
        // Mover horizontalmente con ratón
        if (this.$refs.track) {
            if ('ontouchstart' in window) {
                this.$refs.track.removeEventListener('touchstart', this.handleMouseDown)
                this.$refs.track.removeEventListener('touchend', this.handleMouseUp)
                this.$refs.track.removeEventListener('touchmove', this.handleMouseMove)
            } else {
                this.$refs.track.removeEventListener('mousedown', this.handleMouseDown)
                this.$refs.track.removeEventListener('mouseup', this.handleMouseUp)
                this.$refs.track.removeEventListener('mousemove', this.handleMouseMove)
            }
        }
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
    watch: {
        // El scroll de la parrilla no es algo que está presente en el dom, con lo que hay que mantener manualmente el binding
        fechaScrollX(newFechaScroll) {
            this.$refs.lienzoParrilla.scrollLeft = newFechaScroll
        },
        fechaScrollY(newFechaScroll) {
            this.$refs.lienzoParrilla.scrollTop = newFechaScroll
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
        },
                handleMouseDown (e) {
            if (!e.touches) {
                e.preventDefault()
            }
            this.mouseDown = true
            this.mouseMove = false
            this.dragStartX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
            this.dragStartY = ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
        },
        handleScroll(e) {
            this.fechaScrollX = e.target.scrollLeft
            this.fechaScrollY = e.target.scrollTop
        },
        handleMouseMove (e) {
            if (this.mouseDown) {
                this.mouseMove = true
                let positionX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
                let positionY = ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
                let dragDistanceX = positionX - this.dragStartX
                let dragDistanceY = positionY - this.dragStartY

                /*
                https://github.com/lukaszflorczak/vue-agile/blob/master/src/Agile.vue
                if (dragDistanceX > 3 * dragDistanceY) {
                    this.dragDistance = positionX - this.dragStartX
                    this.disableScroll()
                }
                */
                this.fechaScrollX -= dragDistanceX
                this.fechaScrollY -= dragDistanceY
                this.dragStartX += dragDistanceX
                this.dragStartY += dragDistanceY
             }
        },
        handleMouseUp () {
            this.mouseDown = false
            this.enableScroll()
        },
        disableScroll () {
            document.ontouchmove = function (e) {
                e.preventDefault()
            }
        },
        enableScroll () {
            document.ontouchmove = function () {
                return true
            }
        }
    }
}
</script>
