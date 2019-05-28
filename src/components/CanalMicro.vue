<template>
    <a href="playercanal" :title="nombre"><span v-if="dial" class="dial">{{ dial }}</span><img :src="urlLogo" :alt="altLogo"/></a>
</template>
<script>
export default {
    name: 'CanalMicro',
    props: {
        canal: Object
    },
    computed: {
        nombre() {
            return this.canal.NOMBRE
        },
        urlLogo() {
            return 'http://www.movistarplus.es/recorte/m-DP/samepg/' + this.canal.CODIGO
        },
        altLogo() {
            return 'Logotipo de ' + this.canal.NOMBRE
        },
        dial() {
            return this.canal.DIAL_PRINCIPAL[0]
        }
    }
}
</script>
