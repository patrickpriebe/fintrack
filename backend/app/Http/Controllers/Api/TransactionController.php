<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
        ]);

        $transactions = Transaction::query()
            ->when($validated['month'] ?? null, function ($query, string $month): void {
                $query->whereYear('occurred_on', substr($month, 0, 4))
                    ->whereMonth('occurred_on', substr($month, 5, 2));
            })
            ->orderByDesc('occurred_on')
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $transactions]);
    }

    public function store(TransactionRequest $request): JsonResponse
    {
        $transaction = Transaction::create($request->validated());

        return response()->json(['data' => $transaction], 201);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json(['data' => $transaction]);
    }

    public function update(TransactionRequest $request, Transaction $transaction): JsonResponse
    {
        $transaction->update($request->validated());

        return response()->json(['data' => $transaction->fresh()]);
    }

    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();

        return response()->json(status: 204);
    }
}

