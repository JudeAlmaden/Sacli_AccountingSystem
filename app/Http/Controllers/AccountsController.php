<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;

class AccountsController extends Controller
{
    /**
    * List all chart of accounts
    **/
    function index(Request $request){
        $validated = $request->validate([
            'search' => 'nullable|string',
            'page'   => 'nullable|integer|min:1',
            'limit'  => 'nullable|integer|min:1|max:1000',
            'all'    => 'nullable',
        ]);
        $query = Account::query()->withCount('disbursementItems');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('account_name', 'like', "%{$search}%")
                  ->orWhere('account_code', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('all')) {
            // For optimized dropdowns, we usually only want active accounts
            $accounts = $query->where('status', 'active')->get();
            return response()->json(['data' => $accounts]);
        }

        $accounts = $query->paginate($validated['limit'] ?? 15);
        
        return response()->json($accounts);
    }

    /**
    * Create a new chart of account
    **/
    function store(Request $request){
        $validated = $request->validate([
            'account_name' => 'required|string|max:255|unique:accounts,account_name',
            'account_description' => 'nullable|string',
            'account_code' => 'required|string|max:255|unique:accounts,account_code',
            'account_type' => 'required|string|max:255',
            'account_normal_side' => 'required|string|max:255',
        ]);

        $account = Account::create($validated);
        return response()->json($account);
    }

    /** 
    * Delete a chart an account from the chart, 
    * WE WILL ONLY DO THIS IF THE ACCOUNT IS NOT ASSIGNED TO ANY TRANSACTION
    **/
    function destroy($id){
        $account = Account::withCount('disbursementItems')->find($id);

        if (!$account) {
            return response()->json([
                'message' => 'Account not found',
            ], 404);
        }

        if ($account->disbursement_items_count > 0) {
            return response()->json([
                'message' => 'Cannot delete account as it has associated disbursement items.',
            ], 422);
        }

        $account->delete();
        return response()->json([
            'message' => 'Account deleted successfully',
        ], 200);
    }

    /**
     * Toggle the status of an account
     */
    function toggleStatus($id)
    {
        $account = Account::find($id);
        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $account->status = $account->status === 'active' ? 'inactive' : 'active';
        $account->save();

        return response()->json($account);
    }
}
