<?php

namespace Tests\Unit;

use App\Models\Transaction;
use PHPUnit\Framework\TestCase;

class TransactionTest extends TestCase
{
    public function test_amount_is_exposed_with_two_decimal_places(): void
    {
        $transaction = new Transaction(['amount' => 42.5]);

        self::assertSame('42.50', $transaction->amount);
    }
}

