<?php

namespace App\Http\Controllers;

use App\Models\VehicleFuelLog;
use App\Models\Vehicle;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use Inertia\Inertia;

class VehicleFuelLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = VehicleFuelLog::with(['vehicle', 'station', 'entryUser']);

            // Add filtering
            if ($request->has('veh_oid')) {
                $query->where('VEH_OID', $request->veh_oid);
            }

            if ($request->has('station_oid')) {
                $query->where('STATION_OID', $request->station_oid);
            }

            if ($request->has('fuel_year')) {
                $query->where('FUEL_YEAR', $request->fuel_year);
            }

            if ($request->has('gas_type')) {
                $query->where('GAS_TYPE', $request->gas_type);
            }

            // Date range filtering
            if ($request->has('date_from')) {
                $query->where('FILL_UP_DATE', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('FILL_UP_DATE', '<=', $request->date_to);
            }

            $perPage = $request->get('per_page', 15);
            $fuelLogs = $query->orderBy('FILL_UP_DATE', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $fuelLogs,
                'message' => 'Fuel logs retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving fuel logs: ' . $e->getMessage()
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
                'VEH_OID' => 'nullable|integer',
                'ENTRY_USER' => 'required|integer',
                'FILL_UP_DATE' => 'required|date',
                'GALLONS' => 'required|numeric|min:0',
                'FUEL_ID' => 'required|integer',
                'FUEL_YEAR' => 'required|integer',
                'GAS_TYPE' => 'required|integer',
                'ODOMETER' => 'nullable|numeric',
                'STATION_OID' => 'nullable|integer',
                'GENERATOR_OID' => 'nullable|integer',
                'NOTE' => 'nullable|string'
            ]);

            $validated['ENTRY_DATE'] = now();
            $fuelLog = VehicleFuelLog::create($validated);

            return response()->json([
                'success' => true,
                'data' => $fuelLog->load(['vehicle', 'station', 'entryUser']),
                'message' => 'Fuel log created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating fuel log: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $fuelLog = VehicleFuelLog::with([
                'vehicle', 
                'station', 
                'entryUser',
                'generator'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $fuelLog,
                'message' => 'Fuel log retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Fuel log not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $fuelLog = VehicleFuelLog::findOrFail($id);

            $validated = $request->validate([
                'VEH_OID' => 'sometimes|integer',
                'FILL_UP_DATE' => 'sometimes|date',
                'GALLONS' => 'sometimes|numeric|min:0',
                'ODOMETER' => 'nullable|numeric',
                'STATION_OID' => 'nullable|integer',
                'GENERATOR_OID' => 'nullable|integer',
                'NOTE' => 'nullable|string'
            ]);

            $fuelLog->update($validated);

            return response()->json([
                'success' => true,
                'data' => $fuelLog->fresh(['vehicle', 'station', 'entryUser']),
                'message' => 'Fuel log updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating fuel log: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $fuelLog = VehicleFuelLog::findOrFail($id);
            $fuelLog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Fuel log deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting fuel log: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the web interface for fuel logs.
     */
    public function webIndex(Request $request)
    {
        return Inertia::render('FuelLogs/Index');
    }

    /**
     * Display the create fuel log form.
     */
    public function create()
    {
        return Inertia::render('FuelLogs/Create');
    }

    /**
     * Display the edit fuel log form.
     */
    public function edit(string $id)
    {
        return Inertia::render('FuelLogs/Edit', ['id' => $id]);
    }

    /**
     * Display the fuel log details.
     */
    public function webShow(string $id)
    {
        return Inertia::render('FuelLogs/Show', ['id' => $id]);
    }
}
