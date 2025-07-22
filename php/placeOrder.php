<?php
/*Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php

Alternatively, if you are not using **Composer**, you can download midtrans-php library
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require
the file manually.

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */

require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

// Load configuration
$config = require_once dirname(__FILE__) . '/config.php';

//SAMPLE REQUEST START HERE

// Set your Merchant Server Key from config
\Midtrans\Config::$serverKey = $config['midtrans']['server_key'];
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = $config['midtrans']['is_production'];
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = $config['midtrans']['is_sanitized'];
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = $config['midtrans']['is_3ds'];

$params = array(
    'transaction_details' => array(
        'order_id' => rand(),
        'gross_amount' => $_POST['total'],
    ),
    'item_details' => json_decode($_POST['items'], true),

    'customer_details' => array(
        'first_name' => $_POST['name'],
        'email' => $_POST['email'],
        'phone' => $_POST['phone'],
    ),
);

$snapToken = \Midtrans\Snap::getSnapToken($params);
echo $snapToken;

?>
