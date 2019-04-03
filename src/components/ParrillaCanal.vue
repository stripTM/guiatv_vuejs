<template>
  <li class="canal">
    <ul class="dia">
      <EventoRejilla
        v-for="eventoRejilla in parrillaCanal"
        :key="eventoRejilla.id"
        :eventoRejilla="eventoRejilla"
        :preventClick="preventClick"/>
    </ul>
  </li>
</template>

<script>
import EventoRejilla from './EventoRejilla'
export default {
    name: 'ParrillaCanal',
    components: {
        EventoRejilla
    },
    props: {
        parrillaCanal: Array,
        preventClick: Boolean
    },
}
</script>
