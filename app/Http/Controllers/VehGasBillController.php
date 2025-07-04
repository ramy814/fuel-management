<?php

namespace App\Http\Controllers;

use App\Models\VehGasBill;
use App\Models\Station;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class VehGasBillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = VehGasBill::with(['station', 'user']);

            // Add filtering by station
            if ($request->has('gas_station_oid')) {
                $query->where('GAS_STATION_OID', $request->gas_station_oid);
            }

            // Add filtering by user
            if ($request->has('entery_user_oid')) {
                $query->where('ENTERY_USER_OID', $request->entery_user_oid);
            }

            // Add filtering by fuel type
            if ($request->has('fuel_type_oid')) {
                $query->where('FUEL_TYPE_OID', $request->fuel_type_oid);
            }

            // Add filtering by bill type
            if ($request->has('bill_type_oid')) {
                $query->where('BILL_TYPE_OID', $request->bill_type_oid);
            }

            // Add filtering by status
            if ($request->has('status_oid')) {
                $query->where('STATUS_OID', $request->status_oid);
            }

            // Date range filtering
            if ($request->has('date_from')) {
                $query->where('BILL_DATE', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('BILL_DATE', '<=', $request->date_to);
            }

            // Filter by bill number
            if ($request->has('bill_num')) {
                $query->where('BILL_NUM', $request->bill_num);
            }

            $perPage = $request->get('per_page', 15);
            $gasBills = $query->orderBy('BILL_DATE', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $gasBills,
                'message' => 'Gas bills retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving gas bills: ' . $e->getMessage()
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
                'DONOR_NAME_OID' => 'nullable|integer',
                'GAS_STATION_OID' => 'required|integer',
                'PRICE' => 'nullable|numeric|min:0',
                'QUANTITY' => 'required|numeric|min:0',
                'BILL_TYPE_OID' => 'required|integer',
                'EN_DATE' => 'nullable|date',
                'STATUS_OID' => 'nullable|integer',
                'ENTERY_USER_OID' => 'required|integer',
                'BILL_NUM' => 'nullable|integer',
                'FUEL_TYPE_OID' => 'required|integer',
                'NOTES' => 'nullable|string|max:4000',
                'BILL_DATE' => 'nullable|date',
            ]);

            $gasBill = VehGasBill::create($validated);

            return response()->json([
                'success' => true,
                'data' => $gasBill->load(['station', 'user']),
                'message' => 'Gas bill created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating gas bill: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $gasBill = VehGasBill::with(['station', 'user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $gasBill,
                'message' => 'Gas bill retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gas bill not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $gasBill = VehGasBill::findOrFail($id);

            $validated = $request->validate([
                'DONOR_NAME_OID' => 'nullable|integer',
                'GAS_STATION_OID' => 'sometimes|integer',
                'PRICE' => 'nullable|numeric|min:0',
                'QUANTITY' => 'sometimes|numeric|min:0',
                'BILL_TYPE_OID' => 'sometimes|integer',
                'EN_DATE' => 'nullable|date',
                'STATUS_OID' => 'nullable|integer',
                'BILL_NUM' => 'nullable|integer',
                'FUEL_TYPE_OID' => 'sometimes|integer',
                'NOTES' => 'nullable|string|max:4000',
                'BILL_DATE' => 'nullable|date',
            ]);

            $gasBill->update($validated);

            return response()->json([
                'success' => true,
                'data' => $gasBill->fresh(['station', 'user']),
                'message' => 'Gas bill updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating gas bill: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $gasBill = VehGasBill::findOrFail($id);
            $gasBill->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gas bill deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting gas bill: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get bills summary by date range.
     */
    public function summary(Request $request): JsonResponse
    {
        try {
            $query = VehGasBill::query();

            if ($request->has('date_from')) {
                $query->where('BILL_DATE', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('BILL_DATE', '<=', $request->date_to);
            }

            $summary = [
                'total_bills' => $query->count(),
                'total_quantity' => $query->sum('QUANTITY'),
                'total_amount' => $query->sum('PRICE'),
                'average_price' => $query->avg('PRICE'),
                'date_range' => [
                    'from' => $request->date_from,
                    'to' => $request->date_to
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $summary,
                'message' => 'Bills summary retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving summary: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate financial reports
     */
    public function report(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Financial reporting functionality not implemented yet'
        ], 501);
    }
}
