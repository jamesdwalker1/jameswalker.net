<?php
require('misc/password.php');

header("Content-Type: text/plain");

if (!checkPassword()) {
    exit('Incorrect password');
}

$filename = $_GET['filename'];
$file = json_decode(file_get_contents('php://input'))->text;


// Dissallow \ and / to prevent overwriting html, css and js files
if (!preg_match('/^[-a-zA-Z0-9 .;\(\)]+$/', $filename)) {
    exit('Invalid filename');
}

$status = file_put_contents(dirname(__FILE__) . '/saves/alevelnotes/' . $filename, $file);

if ($status === false) {
    echo 'Fail';
} else {
    echo 'Success';
}