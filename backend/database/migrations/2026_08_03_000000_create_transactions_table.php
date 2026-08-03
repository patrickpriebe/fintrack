<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 10)->index();
            $table->string('category', 50)->index();
            $table->string('description')->nullable();
            $table->decimal('amount', 12, 2);
            $table->date('occurred_on')->index();
            $table->timestamps();

            $table->index(['occurred_on', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

