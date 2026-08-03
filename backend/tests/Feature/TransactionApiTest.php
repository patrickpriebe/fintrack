<?php

namespace Tests\Feature;

use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_is_available(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJsonPath('status', 'ok');
    }

    public function test_it_creates_and_lists_a_transaction(): void
    {
        $payload = [
            'type' => 'expense',
            'category' => 'Alimentação',
            'description' => 'Mercado da semana',
            'amount' => 189.90,
            'occurred_on' => '2026-08-03',
        ];

        $this->postJson('/api/transactions', $payload)
            ->assertCreated()
            ->assertJsonPath('data.category', 'Alimentação')
            ->assertJsonPath('data.amount', '189.90');

        $this->getJson('/api/transactions?month=2026-08')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->assertDatabaseHas('transactions', [
            'description' => 'Mercado da semana',
            'amount' => 189.90,
        ]);
    }

    public function test_dashboard_calculates_monthly_totals_and_categories(): void
    {
        Transaction::factory()->create([
            'type' => 'income',
            'amount' => 5000,
            'occurred_on' => '2026-08-01',
        ]);
        Transaction::factory()->create([
            'type' => 'expense',
            'category' => 'Moradia',
            'amount' => 1800,
            'occurred_on' => '2026-08-02',
        ]);
        Transaction::factory()->create([
            'type' => 'expense',
            'category' => 'Alimentação',
            'amount' => 450.50,
            'occurred_on' => '2026-08-03',
        ]);
        Transaction::factory()->create([
            'type' => 'expense',
            'amount' => 999,
            'occurred_on' => '2026-07-31',
        ]);

        $this->getJson('/api/dashboard?month=2026-08')
            ->assertOk()
            ->assertJsonPath('data.income', 5000)
            ->assertJsonPath('data.expense', 2250.5)
            ->assertJsonPath('data.balance', 2749.5)
            ->assertJsonCount(2, 'data.expenses_by_category');
    }

    public function test_it_rejects_an_invalid_transaction(): void
    {
        $this->postJson('/api/transactions', [
            'type' => 'invalid',
            'amount' => -10,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['type', 'category', 'amount', 'occurred_on']);
    }
}

