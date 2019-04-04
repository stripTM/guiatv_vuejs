<template>
    <li class="franja" :style="getStyle">{{ timeInString }}</li>
</template>

<script>
export default {
    name: 'TimelineItem',
    props: {
        franja: Object, // inicio (Date) indice (Date) intervalo (int segundos)
        ancho: Number // Ancho en pixeles
    },
    methods: {
        pad(n) {
            return n <= 9 ? '0' + n : n;
        }
    },
    computed: {
        getStyle() {
            const intervaloPx = this.ancho / 24 / 4
            let x1 = (this.franja.indice.valueOf() - this.franja.inicio.valueOf()) * this.ancho / (24 * 60 * 60 * 1000) - 35
            let x2 = x1 + intervaloPx

            return {
                top: 0,
                left: x1 + 'px',
                width: (x2 - x1) + 'px'
            }
        },
        timeInString() {
            // Desde diseño comentan que las horas mejor sin pad
            return this.franja.indice.getHours() + ':' + this.pad(this.franja.indice.getMinutes())
        }
    }
}
</script>
