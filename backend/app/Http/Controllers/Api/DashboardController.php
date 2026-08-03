<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
        ]);

        $month = $validated['month'];
        $baseQuery = fn (): Builder => Transaction::query()
            ->whereYear('occurred_on', substr($month, 0, 4))
            ->whereMonth('occurred_on', substr($month, 5, 2));

        $income = (float) $baseQuery()->where('type', 'income')->sum('amount');
        $expense = (float) $baseQuery()->where('type', 'expense')->sum('amount');
        $byCategory = $baseQuery()
            ->where('type', 'expense')
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn (Transaction $row): array => [
                'category' => $row->category,
                'total' => (float) $row->getRawOriginal('total'),
            ]);

        return response()->json([
            'data' => [
                'period' => $month,
                'income' => $income,
                'expense' => $expense,
                'balance' => $income - $expense,
                'expenses_by_category' => $byCategory,
            ],
        ]);
    }
}

