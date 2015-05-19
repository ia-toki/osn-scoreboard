<?php

$cache_path = '../data/cache.json';

if (isset($_POST['scoreboard'])) {
    file_put_contents($cache_path, $_POST['scoreboard']);
}
