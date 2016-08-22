<?php
require('misc/get-alevel-files.php');

header("Content-Type: application/json");

$files = new Files();

$name = $_GET['name'];

// Check file exists for security
$found = false;
foreach($files->getFiles() as $file) {
    if ($file['filename'] === $name) {
        $found = true;
    }
}

if (!$found) {
    exit('File not found.');
}

echo json_encode(['file' => file_get_contents(dirname(__FILE__) . '/saves/alevelnotes/' . $name)]);