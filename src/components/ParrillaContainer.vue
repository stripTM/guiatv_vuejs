<template>
    <section :class="getClass">
        <input type="range" min="0" :max="conf.ancho" name="scrollX" v-model="scrollX"/>
        <CabeceraParrilla
            :fechaSeleccionada="conf.fecha"
            :fechaMin="conf.fechaMin"
            :fechaMax="conf.fechaMax"
            :fechaMinBotones="conf.fechaMinBotones"
            :fechaMaxBotones="conf.fechaMaxBotones"
            :fechaScroll="getDateScroll"
            v-on:setFecha="setFecha"/>

        <div class="out" ref="drag" v-on:scroll="handleScroll">
            <div class="in" :style="getStyleWidth">
                <Timeline :fechaInicio="this.conf.fechaInicio" :fechaFin="this.conf.fechaFin" :ancho="this.conf.ancho"/>
                <MarcadorParrilla :conf="conf" />
                <ul class="logos">
                    <li v-for="parrillaCanal in parrilla" :key="parrillaCanal.DATOS_CADENA.CODIGO" class="logo">
                        <CanalMicro :canal="parrillaCanal.DATOS_CADENA"/>
                    </li>
                    <li ref="ultimo"><button v-if="!completa" :disabled="cargando" v-on:click="cargarMas">{{ getLabelLoadMore }}</button></li>
                </ul>
                <ul class="canales" :style="getStyleWidth">
                    <ParrillaCanal v-for="parrillaCanal in parrilla" :key="parrillaCanal.DATOS_CADENA.CODIGO" :parrillaCanal="parrillaCanal.PROGRAMAS"
                    :preventClick="mouseMove"/>
                </ul>
                <!--<ul class="canales"><ParrillaCanal v-for="parrillaCanal in parrilla" :key="parrillaCanal.canal.idFake" :parrillaCanal="parrillaCanal"/></ul>-->
            </div>
        </div>
    </section>
</template>
<script>
//import FranjaHorario from '../ws/FranjaHorarioDo.js'
//import FranjaHorario from '../ws/ParrillaDoFake.js'
// Safari de iPad no implementa el intersection-observer
require('intersection-observer')
import CabeceraParrilla from './cabecera/CabeceraParrilla'
import Timeline from './timeline/Timeline'
import MarcadorParrilla from './MarcadorParrilla'
import CanalMicro from './CanalMicro'
import ParrillaCanal from './ParrillaCanal'
import Fecha from '../lib/Fecha'
import {draggable} from '../mixins/draggable'
export default {
    name: 'ParrillaContainer',
    mixins: [draggable],
    components: {
        CabeceraParrilla,
        Timeline,
        MarcadorParrilla,
        CanalMicro,
        ParrillaCanal
    },
    props: {
        conf: Object,
        parrilla: Array,
        ancla: Date,
        completa: Boolean,
        cargando: Boolean
    },
    data() {
        return {
            observer: null
        }
    },
    mounted() {
        // Carga de canales al llegar al final del scroll
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(entries => {
                const oCargarMas = entries[0];
                if (oCargarMas.isIntersecting) {
                    this.cargarMas()
                }
                // Si llegamos al límite desconectar
                //this.observer.disconnect();
            })
            this.observer.observe(this.$refs.ultimo)
        }

        this.moverAAnchor()
    },
    destroyed() {
        if(this.observer) {
            this.observer.disconnect()
        }
    },
    computed: {
        getClass() {
            return this.cargando ? ['parrilla', 'loading'] : 'parrilla'
        },
        getStyleWidth() {
            return {
                width: this.conf.ancho + 'px'
            }
        },
        getLabelLoadMore() {
            return this.cargando ? 'Cargando…' : 'Cargar más'
        },
        getDateScroll() {
            // = posición marcador / ancho parrilla * (timestamp fin - timestamp inicio ) + timestamp inicio
            return new Date(this.scrollX / this.conf.ancho * (this.conf.fechaFin.getTime() - this.conf.fechaInicio.getTime()) + this.conf.fechaInicio.getTime())
        }
    },
    methods: {
        moverAAnchor() {
            // Pasar de fecha-ancla de tipo Date a pixeles
            // fecha-ancla-normalizada * anchura / fecha-fin-normalizada
            let anclaPx = Fecha.intervaloPx(this.conf.fechaInicio, this.conf.fechaFin, this.conf.ancho, this.ancla)
            // Desplazamos 30 minutos (1/48) para que se vea un poco de contexto
            anclaPx = anclaPx - Math.round (this.conf.ancho / 48)
            if (anclaPx >= 0) {
                this.scrollX = anclaPx
            }
            if (anclaPx >= this.conf.ancho) {
                this.scrollX = this.conf.ancho
            }
        },
        cargarMas() {
            this.$emit('cargarMas')
        },
        setFecha(nuevaFecha) {
            this.$emit('setFecha', nuevaFecha)
        }
    }
}
</script>
<style>
    .parrilla {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    .parrilla .out{
        flex: 1;
    }
    .parrilla.loading .canales {
        opacity: 0.2;
    }
    .dev-sombras .cabecera:before {
        display: block;
        box-shadow: 1em 0 1em -0.5em rgb(34, 34, 34);
    }
    .outCabecera {
        width: 100%;
        overflow: auto;
        /* overflow-x: hidden; */
    }
    .cabecera {
        padding: 0;
        margin: 0 0 0.7rem 164px;
        list-style-type: none;
        display: flex;
        justify-content: left;
        flex-flow: row nowrap;
        align-items: stretch;
    }
    .cabecera .opcion {
        background-color: #1b1b1b;
        color: #fff;
        padding: 0.5rem;
        margin: 0 0.2rem;
        border-radius: 0.2rem;
        text-transform: capitalize;
        white-space: nowrap;
    }
    .cabecera .opcion a:link,
    .cabecera .opcion a:visited,
    .cabecera .opcion a:hover,
    .cabecera .opcion a:active {
        text-decoration: none;
        color: #fff;
    }
    .cabecera .selected {
        background-color: #79b800;
    }
    .cabecera .extraFecha {
        margin-right: 1em;
        position: relative;
    }
    .cabecera .extraFecha #guiaCabeceraFecha {
        right: 0;
        position: absolute;
        z-index: 10;
        opacity: 0;
        pointer-events: none;
    }
    .cabecera .extraFecha #guiaCabeceraFecha:focus {
        opacity: 1;
        pointer-events: auto;
    }
    .fecha {
        position: absolute;
        z-index: 11;
        background-color: #1e1e1e;
        color: #fff;
        width: 164px;
        height: 40px;
        text-align: center;
        font-size: 1rem;
        line-height: 40px;
    }
    .dev-sombras .fecha {
        box-shadow: 0 1em 1em -0.5em rgb(27, 27, 27), 1em 0 1em -0.5em rgb(27, 27, 27);
    }
    .out {
        font-family: Arial, sans-serif;
        font-size: 0.8125em;
        /* width: 100vw;
        height: 100vh; */
        overflow: auto;
        /*scroll-behavior: smooth;*/
        position: relative;
        transform: translate(0, 0);
    }
    .in {
        position: relative;
        width: 7200px;
    }
    /* Franja de horas */
    .horario {
        position: sticky;
        z-index: 10;
        top: 0;
        left: 0;
        padding: 0 0 0 164px;
    }
    .dev-sombras .horario {
        box-shadow: 0 1em 1em -0.5em rgb(34, 34, 34);
    }
        .franjas {
            list-style: none;
            position: relative;
            background-color: #1b1b1b;
            height: 40px;
            margin: 0;
            padding: 0;
        }
            .franja {
                position: absolute;
                color: #999;
                font-size: 1rem;
                line-height: 40px;
                text-align: center;
            }
            .franja:nth-child(odd) {
                color: #fff;
                font-size: 1.5rem;
            }
    /* Marcador */
    .marcador {
        position: absolute;
        top: 40px;
        left: -1px;
        margin-left: 164px;
        transition-property: left;
        transition-duration: 0.5s;
        height: 100%;
        border-left: 1px solid #fdb613;
        z-index: 9;
    }
        .marcador span {
            position: absolute;
            z-index: 9;
            width: 0;
            height: 0;
            left: -6px;
            border-left: 6px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #fdb613;
        }
    /* Logos */
    .logos {
        list-style: none;
        position: sticky;
        top: 45px;
        left: 0;
        padding: 0;
        border-top: 5px solid #222;
        margin: 0;
        width: 164px;
        z-index: 20;
    }
    .dev-sombras .logos {
        box-shadow: 1em 0 1em -0.5em rgb(34, 34, 34);
    }
        .logo {
            height: 7rem;
            box-sizing: border-box;
            background-color: #222;
            border: 1px solid #222;
            position: relative;
        }
        .logo a,
        .logo a:link,
        .logo a:hover {
            display: block;
            color: #fff;
            text-decoration: none;
        }
        .logo .dial {
            display: block;
            padding: 0 5px;
            min-width: 2.5rem;
            float: left;
            font-size: 1.5rem;
            line-height: 7rem;
            background-color: #1b1b1b;
            text-align: center;
        }
        .logo img {
            position: absolute;

            top: 50%;
            margin-top: -37px;
        }
    /* Programas */
    .canales {
        position: absolute;
        top: 0;
        left: 164px;
        width: 7200px;
        overflow: hidden;
        list-style: none;
        padding: 40px 0 0 0;
        margin: 5px 0 0 0;
        background-color: #222;
    }
    .canal {
        position: relative;
        margin: 0;
        padding: 0;
        height: 7rem;
        box-sizing: border-box;
    }
    .dia {
        list-style: none;
    }
    .er {
        margin: 0;
        padding: 0;
        border: 1px solid #222;
        position: absolute;
        top: 0;
        background-color: #262626;
        color: #aaa;
        box-sizing: border-box;
        height: 7rem;
        padding: 1em 0.5em;
    }
    .er a,
    .er a:link,
    .er a:hover {
        color: #aaa;
        text-decoration: none;
    }
    .er .h {
        color: #fff;
    }
    .er .g {
        color: #999;
    }
    .er .t {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #fff;
        height: 2rem;
    }
    .er a.corto,
    .er a.corto:link,
    .er a.corto:hover {
        color: #fff;
        font-family: "Canalplus", Futura, sans-serif;
        font-size: 1.125rem;
        font-weight: 700;
        line-height: 4.444em;
        display: block;
        text-align: center;
    }
    .er .e {
        position: absolute;
        /* z-index: 15; */
        margin: -1.5em 0;
    }
    .er .d {
        margin: 0 0 0 0.5rem;
        vertical-align: middle;
    }
    /*
    .er:nth-child(odd) {
        background-color: #333;
    }
    .er:nth-child(even) {
        background-color: #f0efec;
    }
    */
input[type=range] {
    box-sizing: content-box;
    margin: 0 5vw;
    width: 90vw;
}
</style>