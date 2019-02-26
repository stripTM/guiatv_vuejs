export default function*(fInicio, fFin, intervalo) {
    // Genera el rango de elementos que hay entre dos fechas con el intervalo (en milisegundos) indicado
    let indice = new Date(fInicio.getTime())
    if (fFin < fInicio) return
    if (intervalo <= 0) return
    let i = 0
    let f = 4
    while(i <= f) {
        console.log("xxxx",i)
        yield i
        i++
    }
    /*
    while(indice <= fFin) {
        indice = new Date(indice.getTime() + intervalo)
    }
    */
    return
}