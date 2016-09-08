# JamesWalker.net version 3
Using Angular.js 1, Webpack and a small PHP API (I'm trying to keep loading times low)  
I also use MathJax, Firebase Storage and Ace Editor, these are loaded from their CDNs

## Building and deploying
Install Node.js, PHP and a webserver and then run ```sudo npm install -g webpack```.  
Clone this repo into a directory served by the webserver and run ```npm install```.  
Build with ```webpack``` and build for production (minification etc) with ```webpack -p```.  
Add a BCrypt password hash to api/misc/password.sample.php and rename it to password.php.   
PHP will need write permissions for api/saves/.

## Note markup syntax
See note-syntax.jwmkp

## A-level resources syntax
See resource-syntax.jwrsc