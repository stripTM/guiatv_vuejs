<template>
    <li class="er" :style="getStyle">
        <a v-if="!esCorto" :href="urlFicha" v-on:click="cancelClick">
            <div>
                <img v-if="esEstreno" src="css/i/guiaparrilla/estreno.png" class="e" alt="Estreno"/>
                <span class="h">{{ eventoRejilla.HORA_INICIO }}</span>&nbsp;<span class="g">{{ eventoRejilla.GENERO }}</span>
            </div>
            <div class="t">{{ eventoRejilla.TITULO }}<img v-if="esDirecto" src="css/i/guiaparrilla/directo.png" class="d" alt="Directo"/></div>
        </a>
        <a v-else :href="urlFicha" class="corto">*</a>
    </li>
</template>

<script>
export default {
    name: 'EventoRejilla',
    props: {
        eventoRejilla: Object,
        preventClick: Boolean
    },
    computed: {
        getStyle() {
            return {
                left: this.eventoRejilla.x1 + 'px',
                width: (this.eventoRejilla.x2 - this.eventoRejilla.x1) + 'px'
            }
        },
        urlFicha() {
            return this.eventoRejilla.URL
        },
        esCorto() {
            return this.eventoRejilla.x2 - this.eventoRejilla.x1 < 100
        },
        esEstreno() {
            return this.eventoRejilla.ESTRENO
        },
        esDirecto() {
            return this.eventoRejilla.DIRECTO
        }
    },
    methods: {
        cancelClick(e) {
            if(this.preventClick) {
                e.preventDefault()
            }
        }
    }
}
</script>

