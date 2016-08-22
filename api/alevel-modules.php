<?php
require('misc/get-alevel-files.php');

header('Content-Type: application/json');

$files = new Files();

echo json_encode([
    'modules' => $files->getFiles()
]);