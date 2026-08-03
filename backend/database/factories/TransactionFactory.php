<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Transaction> */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['income', 'expense']),
            'category' => fake()->randomElement(['Salário', 'Alimentação', 'Moradia', 'Transporte']),
            'description' => fake()->sentence(3),
            'amount' => fake()->randomFloat(2, 10, 5000),
            'occurred_on' => fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
        ];
    }
}

