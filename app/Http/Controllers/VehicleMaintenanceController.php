<?php

namespace App\Http\Controllers;

use App\Models\VehicleMaintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use Inertia\Inertia;

class VehicleMaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = VehicleMaintenance::with(['vehicle']);

            // Add filtering
            if ($request->has('vehicle_oid')) {
                $query->where('VEHICLE_OID', $request->vehicle_oid);
            }

            if ($request->has('mntc_type_oid')) {
                $query->where('MNTC_TYPE_OID', $request->mntc_type_oid);
            }

            if ($request->has('status_oid')) {
                $query->where('STATUS_OID', $request->status_oid);
            }

            if ($request->has('is_accidental')) {
                $query->where('IS_ACCIDENTAL', $request->is_accidental);
            }

            // Date range filtering
            if ($request->has('date_from')) {
                $query->where('MNTC_DATE', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('MNTC_DATE', '<=', $request->date_to);
            }

            $perPage = $request->get('per_page', 15);
            $maintenance = $query->orderBy('MNTC_DATE', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $maintenance,
                'message' => 'Maintenance records retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving maintenance records: ' . $e->getMessage()
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
                'VEHICLE_OID' => 'required|integer',
                'MNTC_TYPE_OID' => 'required|integer',
                'CURRENT_MILEAGE' => 'required|numeric',
                'MNTC_ID' => 'required|integer',
                'MNTC_YEAR' => 'required|integer',
                'IS_ACCIDENTAL' => 'nullable|integer',
                'MNTC_DATE' => 'nullable|date',
                'STATUS_OID' => 'nullable|integer',
                'FINISH_DATE' => 'nullable|date',
                'NOTE' => 'nullable|string',
                'ENTRY_USER' => 'nullable|string',
                'RESPONSIBLE' => 'nullable|string',
                'REPAIR_TIME' => 'nullable|integer',
                'DRIVER_OWNER' => 'nullable|integer',
            ]);

            $maintenance = VehicleMaintenance::create($validated);

            return response()->json([
                'success' => true,
                'data' => $maintenance->load('vehicle'),
                'message' => 'Maintenance record created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating maintenance record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $maintenance = VehicleMaintenance::with('vehicle')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $maintenance,
                'message' => 'Maintenance record retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance record not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $maintenance = VehicleMaintenance::findOrFail($id);

            $validated = $request->validate([
                'VEHICLE_OID' => 'sometimes|integer',
                'MNTC_TYPE_OID' => 'sometimes|integer',
                'CURRENT_MILEAGE' => 'sometimes|numeric',
                'IS_ACCIDENTAL' => 'nullable|integer',
                'MNTC_DATE' => 'nullable|date',
                'STATUS_OID' => 'nullable|integer',
                'FINISH_DATE' => 'nullable|date',
                'NOTE' => 'nullable|string',
                'RESPONSIBLE' => 'nullable|string',
                'REPAIR_TIME' => 'nullable|integer',
            ]);

            $maintenance->update($validated);

            return response()->json([
                'success' => true,
                'data' => $maintenance->fresh('vehicle'),
                'message' => 'Maintenance record updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating maintenance record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $maintenance = VehicleMaintenance::findOrFail($id);
            $maintenance->delete();

            return response()->json([
                'success' => true,
                'message' => 'Maintenance record deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting maintenance record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the web interface for maintenance.
     */
    public function webIndex(Request $request)
    {
        return Inertia::render('Maintenance/Index');
    }

    /**
     * Display the create maintenance form.
     */
    public function create()
    {
        return Inertia::render('Maintenance/Create');
    }

    /**
     * Display the edit maintenance form.
     */
    public function edit(string $id)
    {
        return Inertia::render('Maintenance/Edit', ['id' => $id]);
    }

    /**
     * Display the maintenance details.
     */
    public function webShow(string $id)
    {
        return Inertia::render('Maintenance/Show', ['id' => $id]);
    }
}
