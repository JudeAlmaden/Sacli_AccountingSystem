<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('auth/login');
})->name('home');

//Main Login View
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

//Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Accounts Management
    Route::get('/accounts', [AccountController::class, 'index']);       // List all accounts
    Route::get('/accounts/create', [AccountController::class, 'create']); // Show create form
    Route::post('/accounts', [AccountController::class, 'store']);      // Save new account
    Route::get('/accounts/{account}/edit', [AccountController::class, 'edit']); // Show edit form
    Route::put('/accounts/{account}', [AccountController::class, 'update']);   // Update account
    Route::delete('/accounts/{account}', [AccountController::class, 'destroy']); // Delete account
});

require __DIR__.'/settings.php';
