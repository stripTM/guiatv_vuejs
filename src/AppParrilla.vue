<template>
  <div id="app-parrilla" :class="getStyle">
    <!--
    <h1>Guía programación</h1>
    <section id="desarrollo">
      <label>Nº canales: <input name="total_canales" v-model="conf.limiteCanales" type="number" min="0"/></label>
      <label>Ancho: <input name="ancho" v-model="conf.ancho" type="number" min="0" step="100"/></label>
      <label>Sombras: <input type="checkbox" v-model="mostrarSombras"/></label>
      <div>
        <label>Status: {{ status }}</label>
      </div>
    </section>

    {{ parrilla }}
    -->
    <ParrillaContainer
      :conf="getConfParrilla"
      :parrilla="getParrilla"
      :ancla="conf.fecha"
      :completa="esParrillaCompleta"
      :cargando="cargando"
      v-on:cargarMas="cargarMas"
      v-on:setFecha="setFecha"/>
  </div>
</template>

<script>
//import ParrillaDo from './ws/ParrillaDoFake.js'
//import Canales from './ws/mocks/canales.js'
// Simulando api de guia
import ParrillaContainer from './components/ParrillaContainer.vue'
import Fecha from './lib/Fecha.js'
import axios from 'axios'

export default {
  name: 'appParrilla',
  components: {
    ParrillaContainer
  },
  data() {
    const now = new Date()
    const humanNow = Fecha.humana(now)
    let inicio = new Date(humanNow.getFullYear(), humanNow.getMonth(), humanNow.getDate() - 6, 12, 0, 0)
    let fin
    if(humanNow.getDate() >= 15) {
      fin = new Date(humanNow.getFullYear(), humanNow.getMonth() + 2, 0, 12, 0, 0)
    }
    else {
      fin = new Date(humanNow.getFullYear(), humanNow.getMonth() + 1, 0, 12, 0, 0)
    }
    let inicioBotones = new Date(humanNow.getFullYear(), humanNow.getMonth(), humanNow.getDate() - 6, 12, 0, 0)
    let finBotones = new Date(humanNow.getFullYear(), humanNow.getMonth(), humanNow.getDate() + 6, 12, 0, 0)

    return {
      conf: {
        fecha: now,
        fechaMin: inicio,
        fechaMax: fin,
        fechaMinBotones: inicioBotones,
        fechaMaxBotones: finBotones,
        //fecha: new Date(2019,1,22, 5,58,0),
        ancho: 7200, //7200
        limiteCanales: 10 //163
      },
      parrilla: [],
      ancla: new Date(),
      status: 'init',
      mostrarSombras: true
    }
  },
  created() {
    //console.time('depurar carga')
    this.status = 'created'
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.status = 'loading'
      const fechaH = Fecha.humana(this.conf.fecha)
      const fakeRejilla = fechaH.getDay() % 2
      const endPoint = `rejilla${fakeRejilla}.json?f=${fechaH.toISOString().split('T')[0]}&ps=${this.conf.ancho/24/60}`
      axios.get(endPoint)
        .then((response) => {
          this.parrilla = response.data.data
          this.status = 'loaded'
        })
        .catch(() => {
          this.status = 'error'
        })
      /* Fetch nativo
        fetch(endPoint)
          .then((response) => {
            //console.timeLog('depurar carga')

            const datos = response.json()
            return datos
          })
          .then((myJson) => {
            //console.log("myJson", myJson)
            this.parrilla = myJson.data
            //this.parrilla = Object.entries(myJson.data).slice(0,this.conf.limiteCanales).map(entry => entry[1]);
            //console.timeLog('depurar carga')
            this.status = 'loaded'
          })
      */
    },
    cargarMas() {
      this.conf.limiteCanales += 10
    },
    setFecha(nuevaFecha) {
      this.conf.fecha = nuevaFecha
      this.fetchData()
    }
  },
  computed: {
    getParrilla() {
      return Object.entries(this.parrilla).slice(0,this.conf.limiteCanales).map(entry => entry[1]);
    },
    cargando() {
      return this.status !== 'loaded'
    },
    esParrillaCompleta() {
      return (Object.keys(this.parrilla).length <= this.conf.limiteCanales)
    },
    getConfParrilla() {
      // El día comienza a las 6 de la mañana
      const fechaHumana = Fecha.humana(this.conf.fecha)
      return {
        //fecha: new Date(fechaHumana.getFullYear(), fechaHumana.getMonth(), fechaHumana.getDate()),
        fecha: this.conf.fecha,
        fechaInicio: new Date(fechaHumana.getFullYear(), fechaHumana.getMonth(), fechaHumana.getDate(), 6),
        fechaFin: new Date(fechaHumana.getFullYear(), fechaHumana.getMonth(), fechaHumana.getDate() + 1, 5, 59, 59),
        fechaMin: this.conf.fechaMin, // Límite de calendario de selección
        fechaMax: this.conf.fechaMax,
        fechaMinBotones: this.conf.fechaMinBotones, // Límite de botones de calendario de selección
        fechaMaxBotones: this.conf.fechaMaxBotones,
        ancho: parseInt(this.conf.ancho)
      }
    },
    getStyle() {
      let clases = []
      if (this.mostrarSombras) {
        clases.push('dev-sombras')
      }
      if (this.status !== 'loaded') {
        clases.push('spinner-2')
      }
      return clases
    }
    /*
    getParrilla() {
      const TotalCanalesMock = Canales.length
      let parrilla= []
      for(let dial = 0; dial < this.conf.limiteCanales; dial++) {
        // 1px = 5 minutos, 7200px = 1 día
        // parrilla -> canales -> canal + eventos
        let newCanal = JSON.parse(JSON.stringify(Canales[dial % TotalCanalesMock]));
        newCanal.idFake = newCanal.id + '_' + dial // Evitar ids duplicados
        let parrillaCanal = {
          canal: newCanal,
          eventos: []
        }
        let parrillaDo = new ParrillaDo(
          {
            canal: parrillaCanal.canal.id,
            min: 0,
            max: this.conf.ancho
          }
        )
        for (var evento of parrillaDo) {
          parrillaCanal.eventos.push(evento)
        }

        parrilla.push(parrillaCanal)
      }
      return parrilla
    }
  */
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
#app-parrilla {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #222;
}
#desarrollo {
  color: rgb(241, 173, 70);
}
  #desarrollo label {
    margin: 0 1rem 0 0;
  }
/* Spinner 2 */
.spinner-2:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin-top: -30px;
  margin-left: -30px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: coral;
  border-bottom-color: coral;
  animation: spinner 0.7s ease infinite;
  z-index: 30;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
