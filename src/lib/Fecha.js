export default {
    humana(f) {
        // Convención de que el día comienza a las 6 de la mañana, le restamos 6 horas a la fecha que nos viene
        return new Date(f - 6 * 60 * 60 * 1000)
    },
    intervaloPx(inicio, fin, ancho, punto) {
        const finNormalizado = fin.getTime() - inicio.getTime()
        const puntoNormalizado = punto.getTime() - inicio.getTime()
        return Math.round (puntoNormalizado * ancho / finNormalizado)
    },
    mismaFecha(f1, f2) {
        return f1.getFullYear() === f2.getFullYear() &&
            f1.getMonth() === f2.getMonth() &&
            f1.getDate() === f2.getDate()
    },
    toDiaSemanaHumana(f) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const hoy = new Date()
        if (this.mismaFecha(hoy, f)) {
            return 'Hoy'
        }
        if (this.mismaFecha(new Date(hoy - 24 * 60 * 60 * 1000), f)) {
            return 'Ayer'
        }
        return dias[f.getDay()]
    }
}