<?php
$url = 'http://www.movistarplus.es/programacion-tv/2019-02-01/?v=json';

$programacion = file_get_contents($url);

echo $programacion;
