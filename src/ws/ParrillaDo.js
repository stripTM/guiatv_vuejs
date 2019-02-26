export default function*(conf) {
    /*
    conf = {
        canal: 'MV',
        min: 0,
        max: 7200
    }
    */
    let i = conf.min
    let duracionEvento, inicio, fin
    while (i < conf.max) {
        duracionEvento = (Math.floor(Math.random()*50)) * 10 + 50
        inicio = i
        fin = i + duracionEvento
        // Si el evento se pasa del límite lo acotamos
        fin = fin > conf.max ? conf.max : fin
        i = fin + 1
        yield {
            id: `${conf.canal}_${i}`,
            horaInicio: '15:45', // Como string ya procesado
            titulo: `Lorem ipsum ${i} Las noticias de la mañana`,
            subtitulo: 'Ep.2 No dos veces por lo mismo',
            genero: 'Humor',
            x1: inicio,
            x2: fin
        }
    }
}