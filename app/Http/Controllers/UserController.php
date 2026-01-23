<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a paginated list of accounts.
     * Supports filtering by search, role, email.
     * Used for listing / table views.
     */
    function index(Request $request){
        $validated = $request->validate([
            'search' => 'nullable|string',
            'role'   => 'nullable|string',
            'email'  => 'nullable|string',
            'page'   => 'nullable|integer|min:1',
            'limit'  => 'nullable|integer|min:1|max:15',
            'status'=>  'nullable|string|in:active,inactive',
        ]);

        $limit = $validated['limit'] ?? 10;

        $accounts = User::with('roles')
            ->when($validated['search'] ?? null, fn ($q, $search) =>
                $q->where('name', 'like', "%{$search}%")
            )
            ->when($validated['role'] ?? null, fn ($q, $role) =>
                $q->where('role', 'like', "%{$role}%")
            )
            ->when($validated['email'] ?? null, fn ($q, $email) =>
                $q->where('email', 'like', "%{$email}%")
            )
            ->paginate($limit);

        return response()->json($accounts);
    }


    /**
     * Store a newly created account in the database.
     * Handles validation and persistence.
     */
    function store(Request $request){
        $validated = $request->validate(
            [
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'role'     => 'required|string|in:admin,user',
                'status'   => 'nullable|string|in:active,inactive',
            ],
            [
                'email.unique'       => 'This email is already registered.',
                'password.confirmed' => 'Password confirmation does not match.',
                'role.in'            => 'Role must be either admin or user.',
            ]
        );

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'status'   => $validated['status'] ?? 'active',
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'data'    => $user,
        ], 201);
    }

    /**
     * Display the specified account.
     */
    function show(Request $request, User $user){
        $validated = $request->validate([
            'id' => 'required|exists:users,id',
        ]);
        $user = User::find($validated['id']);
        return response()->json($user);
    }
    /**
     * Update an existing account in the database.
     */
    function update(Request $request, User $user){
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'status'   => 'nullable|string|in:active,inactive',
            'role'     => 'required|string|in:admin,user',
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'role'  => $validated['role'],
            'status'=>$validated['status'] ?? 'active',
        ]);

        // Only update password if provided
        if (!empty($validated['password'])) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        return response()->json([
            'message' => 'User updated successfully.',
            'data'    => $user,
        ]);
    }
}
