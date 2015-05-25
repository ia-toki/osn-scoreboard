<?php

$cache_path = 'cache.json';

if (isset($_POST['scoreboard']) && isset($_POST['secret']) && $_POST['secret'] == 'xxx') {
    file_put_contents($cache_path, $_POST['scoreboard']);
}
