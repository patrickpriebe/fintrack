<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('fintrack:about', function (): void {
    $this->info('FinTrack - demonstração de CI/CD com Laravel e React.');
})->purpose('Exibe informações do projeto');

