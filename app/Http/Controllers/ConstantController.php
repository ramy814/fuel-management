<?php

namespace App\Http\Controllers;

use App\Models\Constant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class ConstantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Constant::query();

            // Add search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('CNST_NAME', 'LIKE', "%{$search}%")
                      ->orWhere('CNST_ENG', 'LIKE', "%{$search}%");
                });
            }

            // Add filtering by type
            if ($request->has('cnst_type')) {
                $query->where('CNST_TYPE', $request->cnst_type);
            }

            $perPage = $request->get('per_page', 15);
            $constants = $query->orderBy('OID', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $constants,
                'message' => 'Constants retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving constants: ' . $e->getMessage()
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
                'CNST_NAME' => 'required|string|max:80',
                'CNST_TYPE' => 'nullable|string|max:40',
                'CNST_ENG' => 'nullable|string|max:80',
            ]);

            $constant = Constant::create($validated);

            return response()->json([
                'success' => true,
                'data' => $constant,
                'message' => 'Constant created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating constant: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $constant = Constant::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $constant,
                'message' => 'Constant retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Constant not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $constant = Constant::findOrFail($id);

            $validated = $request->validate([
                'CNST_NAME' => 'sometimes|string|max:80',
                'CNST_TYPE' => 'nullable|string|max:40',
                'CNST_ENG' => 'nullable|string|max:80',
            ]);

            $constant->update($validated);

            return response()->json([
                'success' => true,
                'data' => $constant->fresh(),
                'message' => 'Constant updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating constant: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $constant = Constant::findOrFail($id);
            $constant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Constant deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting constant: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get constants by type.
     */
    public function getByType(string $type): JsonResponse
    {
        try {
            $constants = Constant::where('CNST_TYPE', $type)->get();

            return response()->json([
                'success' => true,
                'data' => $constants,
                'message' => 'Constants retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving constants: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get constant options for select dropdowns.
     */
    public function getOptions(string $type): JsonResponse
    {
        try {
            $constants = Constant::where('CNST_TYPE', $type)
                ->select('OID as value', 'CNST_NAME as label')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $constants,
                'message' => 'Constant options retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving constant options: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all constant types.
     */
    public function getTypes(): JsonResponse
    {
        try {
            $types = Constant::select('CNST_TYPE')
                ->distinct()
                ->pluck('CNST_TYPE');

            return response()->json([
                'success' => true,
                'data' => $types,
                'message' => 'Constant types retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving constant types: ' . $e->getMessage()
            ], 500);
        }
    }
}
