<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Exception;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::with(['gasBills', 'fuelLogs']);

            // Add search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('USER_NAME_NEW', 'LIKE', "%{$search}%")
                      ->orWhere('USER_FULL_NAME', 'LIKE', "%{$search}%");
                });
            }

            // Add filtering by active status
            if ($request->has('user_active')) {
                $query->where('USER_ACTIVE', $request->user_active);
            }

            // Add filtering by read only status
            if ($request->has('read_only')) {
                $query->where('READ_ONLY', $request->read_only);
            }

            $perPage = $request->get('per_page', 15);
            $users = $query->orderBy('OID', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'USER_NAME_NEW' => 'required|string|max:30|unique:USERS,USER_NAME_NEW',
                'USER_PASSWORD' => 'required|string|max:30',
                'USER_SSN' => 'nullable|integer|unique:USERS,USER_SSN',
                'USER_FULL_NAME' => 'required|string|max:100',
                'USER_ACTIVE' => 'nullable|boolean',
                'READ_ONLY' => 'nullable|boolean',
            ]);

            // Hash the password
            $validated['USER_PASSWORD'] = Hash::make($validated['USER_PASSWORD']);
            
            // Convert boolean to integer for Oracle
            $validated['USER_ACTIVE'] = $validated['USER_ACTIVE'] ?? false ? 1 : 0;
            $validated['READ_ONLY'] = $validated['READ_ONLY'] ?? false ? 1 : 0;

            $user = User::create($validated);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::with(['gasBills', 'fuelLogs'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'USER_NAME_NEW' => 'sometimes|string|max:30|unique:USERS,USER_NAME_NEW,' . $id . ',OID',
                'USER_PASSWORD' => 'sometimes|string|max:30',
                'USER_SSN' => 'nullable|integer|unique:USERS,USER_SSN,' . $id . ',OID',
                'USER_FULL_NAME' => 'sometimes|string|max:100',
                'USER_ACTIVE' => 'nullable|boolean',
                'READ_ONLY' => 'nullable|boolean',
            ]);

            // Hash password if provided
            if (isset($validated['USER_PASSWORD'])) {
                $validated['USER_PASSWORD'] = Hash::make($validated['USER_PASSWORD']);
            }

            // Convert boolean to integer for Oracle
            if (isset($validated['USER_ACTIVE'])) {
                $validated['USER_ACTIVE'] = $validated['USER_ACTIVE'] ? 1 : 0;
            }
            if (isset($validated['READ_ONLY'])) {
                $validated['READ_ONLY'] = $validated['READ_ONLY'] ? 1 : 0;
            }

            $user->update($validated);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'User updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate or deactivate user.
     */
    public function toggleStatus(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['USER_ACTIVE' => $user->USER_ACTIVE ? 0 : 1]);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'User status updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user activity statistics.
     */
    public function userStats(string $id): JsonResponse
    {
        try {
            $user = User::with(['gasBills', 'fuelLogs'])->findOrFail($id);
            
            $stats = [
                'total_gas_bills' => $user->gasBills->count(),
                'total_fuel_logs' => $user->fuelLogs->count(),
                'last_activity' => $user->fuelLogs->max('ENTRY_DATE'),
                'is_active' => (bool) $user->USER_ACTIVE,
                'is_read_only' => (bool) $user->READ_ONLY,
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'User statistics retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving user statistics: ' . $e->getMessage()
            ], 500);
        }
    }

}
