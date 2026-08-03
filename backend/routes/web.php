<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', fn () => file_exists(public_path('app/index.html'))
    ? response()->file(public_path('app/index.html'))
    : response()->json(['message' => 'FinTrack API', 'docs' => '/api/health']))
    ->where('path', '^(?!api).*$');

