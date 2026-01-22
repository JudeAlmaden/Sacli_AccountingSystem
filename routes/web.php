<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

//Developer note!
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        return Inertia::render('dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->toArray(), 
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ]
        ]);
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
