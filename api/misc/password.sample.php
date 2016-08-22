<?php

function checkPassword() {
    /*
    Remove .sample from the name of this file, set the password below and uncomment it

    e.g. for the password 'password' (not actually used on live site): 
    $passwords = [
        '$2a$11$3G929u6Uqp4sbEV6.uMKVumI7mOxhjL70gUvbADjIVtJ4vLFerKX6'
    ];
    */

    $password = json_decode(file_get_contents('php://input'))->pw;

    foreach ($passwords as $passwordHash) {
        if (password_verify($password, $passwordHash)) {
            return true;
        }
    }

    return false;
}