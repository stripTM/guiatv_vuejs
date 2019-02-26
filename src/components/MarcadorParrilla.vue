<template>
  <div v-if="visible" :style="getMarcadorStyle" class="marcador"><span></span></div>
</template>
<script>
import Fecha from '../lib/Fecha';
export default {
  name: 'MarcadorParrilla',
  props: {
    conf: Object // {fecha, fechaInicio, fechaFin, ancho}
  },
  data() {
    return {
      now: this.conf.fecha,
      timerObj: null
    }
  },
  mounted() {
    this.startTimer()
  },
  destroyed() {
    this.stopTimer()
  },
  methods: {
    startTimer(){
      this.timerObj = window.setInterval(this.timerTick, 60000)
    },
    stopTimer(){
        window.clearInterval(this.timerObj)
        this.timerObj = null
    },
    timerTick() {
      this.now = new Date()
    }
  },
  computed: {
    getMarcadorStyle() {
      return {
          left: Fecha.intervaloPx(this.conf.fechaInicio, this.conf.fechaFin, this.conf.ancho, this.now) + 'px'
      }
    },
    visible() {
      return !(this.now < this.conf.fechaInicio || this.now > this.conf.fechaFin)
    }
  }
}
/*

        startTimer(){
                timerObj = window.setInterval(this.timerTick(), 1000);
                this.timerFormat();
            },

            stopTimer(){
                window.clearInterval(timerObj);
                timerObj = null;
            },
*/
</script>
