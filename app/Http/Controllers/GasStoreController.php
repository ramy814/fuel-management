<?php

namespace App\Http\Controllers;

use App\Models\GasStore;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class GasStoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = GasStore::with('fuelLogs');

            // Add filtering by active status
            if ($request->has('is_active')) {
                $query->where('IS_ACTIVE', $request->is_active);
            }

            // Date range filtering
            if ($request->has('date_from')) {
                $query->where('ENTRY_DATE', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('ENTRY_DATE', '<=', $request->date_to);
            }

            // Filter by minimum quantity
            if ($request->has('min_quantity')) {
                $query->where('GAS_QUANTITY', '>=', $request->min_quantity);
            }

            $perPage = $request->get('per_page', 15);
            $gasStores = $query->orderBy('ENTRY_DATE', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $gasStores,
                'message' => 'Gas stores retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving gas stores: ' . $e->getMessage()
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
                'ENTRY_DATE' => 'nullable|date',
                'GAS_QUANTITY' => 'nullable|numeric|min:0',
                'SOLAR_QUANTITY' => 'nullable|numeric|min:0',
                'GAS_REC_OID' => 'nullable|integer',
                'GAS_BILLS' => 'nullable|numeric|min:0',
                'FILL_UP_DATE' => 'nullable|date',
                'PRV_OID' => 'nullable|integer',
                'PRV_QTY' => 'nullable|numeric|min:0',
                'NOTE' => 'nullable|string|max:1000',
                'EYGPT_SOLAR_QUANTITY' => 'nullable|numeric|min:0',
                'IS_ACTIVE' => 'nullable|integer',
            ]);

            $gasStore = GasStore::create($validated);

            return response()->json([
                'success' => true,
                'data' => $gasStore,
                'message' => 'Gas store created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating gas store: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $gasStore = GasStore::with('fuelLogs')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $gasStore,
                'message' => 'Gas store retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gas store not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $gasStore = GasStore::findOrFail($id);

            $validated = $request->validate([
                'ENTRY_DATE' => 'nullable|date',
                'GAS_QUANTITY' => 'nullable|numeric|min:0',
                'SOLAR_QUANTITY' => 'nullable|numeric|min:0',
                'GAS_REC_OID' => 'nullable|integer',
                'GAS_BILLS' => 'nullable|numeric|min:0',
                'FILL_UP_DATE' => 'nullable|date',
                'PRV_OID' => 'nullable|integer',
                'PRV_QTY' => 'nullable|numeric|min:0',
                'NOTE' => 'nullable|string|max:1000',
                'EYGPT_SOLAR_QUANTITY' => 'nullable|numeric|min:0',
                'IS_ACTIVE' => 'nullable|integer',
            ]);

            $gasStore->update($validated);

            return response()->json([
                'success' => true,
                'data' => $gasStore->fresh(),
                'message' => 'Gas store updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating gas store: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $gasStore = GasStore::findOrFail($id);
            $gasStore->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gas store deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting gas store: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get gas store statistics.
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total_stores' => GasStore::count(),
                'active_stores' => GasStore::where('IS_ACTIVE', 1)->count(),
                'total_gas_quantity' => GasStore::sum('GAS_QUANTITY'),
                'total_solar_quantity' => GasStore::sum('SOLAR_QUANTITY'),
                'total_bills_value' => GasStore::sum('GAS_BILLS'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Gas store statistics retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving statistics: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Get current inventory status
     */
    public function current(Request $request): JsonResponse
    {
        try {
            $currentInventory = GasStore::where('IS_ACTIVE', 1)
                ->orderBy('ENTRY_DATE', 'desc')
                ->first();

            return response()->json([
                'success' => true,
                'data' => $currentInventory,
                'message' => 'Current inventory retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving current inventory: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory history
     */
    public function history(Request $request): JsonResponse
    {
        try {
            $query = GasStore::query();
            
            if ($request->has('date_from')) {
                $query->where('ENTRY_DATE', '>=', $request->date_from);
            }
            
            if ($request->has('date_to')) {
                $query->where('ENTRY_DATE', '<=', $request->date_to);
            }
            
            $history = $query->orderBy('ENTRY_DATE', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $history,
                'message' => 'Inventory history retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving inventory history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update inventory (create new entry)
     */
    public function updateInventory(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'GAS_QUANTITY' => 'required|numeric|min:0',
                'SOLAR_QUANTITY' => 'nullable|numeric|min:0',
                'NOTE' => 'nullable|string|max:1000',
            ]);

            $validated['ENTRY_DATE'] = now();
            $validated['IS_ACTIVE'] = 1;

            $gasStore = GasStore::create($validated);

            return response()->json([
                'success' => true,
                'data' => $gasStore,
                'message' => 'Inventory updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating inventory: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate inventory reports
     */
    public function report(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Inventory reporting functionality not implemented yet'
        ], 501);
    }
}
