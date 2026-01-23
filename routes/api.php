<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*==================
  Admin API Routes
===================*/
//For account management
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Accounts Management
    Route::get('/accounts', [UserController::class, 'index'])->name('accounts.index'); // List all accounts
    Route::post('/accounts/store', [UserController::class, 'store'])->name('accounts.store');      // Save new account
    Route::get('/accounts/{account}', [UserController::class, 'show'])->name('accounts.show'); // Show specific account
    Route::put('/accounts/{account}', [UserController::class, 'update'])->name('accounts.update');   // Update account
});
