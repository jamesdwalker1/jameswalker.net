<?php
require('misc/get-alevel-resources.php');

header('Content-Type: application/json');

$files = new Files();

echo json_encode([
    'worksheets' => $files->getFiles()
]);