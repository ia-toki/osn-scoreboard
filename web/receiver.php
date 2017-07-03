<?php

$receiver_secret = 'insert-receiver-secret-here';
$cache_path = 'cache.json';

if (isset($_POST['scoreboard']) && isset($_POST['secret']) && $_POST['secret'] == $receiver_secret) {
    file_put_contents($cache_path, (string) $_POST['scoreboard']);
}

?>
