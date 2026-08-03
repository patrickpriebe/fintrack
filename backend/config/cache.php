<?php

return [
    'default' => env('CACHE_STORE', 'file'),
    'stores' => [
        'array' => ['driver' => 'array', 'serialize' => false],
        'file' => ['driver' => 'file', 'path' => storage_path('framework/cache/data')],
        'database' => ['driver' => 'database', 'connection' => null, 'table' => 'cache'],
    ],
    'prefix' => env('CACHE_PREFIX', 'fintrack_cache_'),
];

