<template>
  <div class="horario">
    <ul class="franjas">
      <TimelineItem v-for="franja in franjaHoras" v-bind:key="franja.indice.valueOf()" :franja="franja" :ancho="ancho"/>
    </ul>
  </div>
</template>
<script>
import TimelineItem from './TimelineItem'
export default {
  name: "Timeline",
  props: {
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    ancho: {
        type: Number,
        required: true
    },
    anchoSeguridadFragmento: {
      type: Number,
      default: 75 // en pixeles
    }
  },
  components: {
    TimelineItem
  },
  computed: {
    franjaHoras() {
      if (
        this.fechaFin < this.fechaInicio ||
        this.ancho === 0
        ) return
      // Calcular el intervalo para que visualmente no se solapen, jugamos con un margen de seguridad de 75px
      // y vamos probando en bloques de 15 minutos
      const anchoTimelineMs = this.fechaFin - this.fechaInicio
      let i = 15
      let anchoTest = this.ancho / (anchoTimelineMs / (i * 60 * 1000))
      while (anchoTest <= this.anchoSeguridadFragmento) {
          i = i * 2
          anchoTest = this.ancho / (anchoTimelineMs / (i * 60 * 1000))
      }

      const intervalo = i * 60 * 1000 // 15, 30, 60 minutos
      let fIndice = new Date(this.fechaInicio.getTime())
      if (intervalo <= 0) return
      let franjas = []
      while(fIndice < this.fechaFin) {
          franjas.push({
              inicio: this.fechaInicio,
              indice: fIndice,
              intervalo: intervalo
          })
          fIndice = new Date(fIndice.getTime() + intervalo)
      }
      return franjas
    }
  }

}
</script>
