<?php
// Midtrans Configuration Template
// Copy file ini menjadi config.php dan isi dengan key yang sebenarnya

return [
    'midtrans' => [
        'server_key' => 'YOUR_MIDTRANS_SERVER_KEY_HERE', // Sandbox: SB-Mid-server-xxx, Production: Mid-server-xxx
        'client_key' => 'YOUR_MIDTRANS_CLIENT_KEY_HERE', // Sandbox: SB-Mid-client-xxx, Production: Mid-client-xxx
        'is_production' => false, // Set true untuk production
        'is_sanitized' => true,
        'is_3ds' => true,
    ]
];
?>
