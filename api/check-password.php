<?php
require('misc/password.php');

header('Content-Type: application/json');

exit(json_encode([
    'correct' => checkPassword()
]));