<?php

namespace App\Http\Controllers;

use App\Models\VehGenerator;
use App\Models\VehicleFuelLog;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class VehGeneratorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = VehGenerator::with(['vehicle', 'user']);

            // Add search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('NAME', 'LIKE', "%{$search}%")
                      ->orWhere('DESCRIPTION', 'LIKE', "%{$search}%");
                });
            }

            // Add filtering by fuel type
            if ($request->has('fuel_type_oid')) {
                $query->where('FUEL_TYPE_OID', $request->fuel_type_oid);
            }

            // Add filtering by vehicle
            if ($request->has('vehicle_oid')) {
                $query->where('VEHICLE_OID', $request->vehicle_oid);
            }

            // Add filtering by assigned user
            if ($request->has('assigned_to')) {
                $query->where('ASSIGNED_TO', $request->assigned_to);
            }

            // Add filtering by location
            if ($request->has('location_oid')) {
                $query->where('LOCATION_OID', $request->location_oid);
            }

            // Add filtering by brand
            if ($request->has('brand_oid')) {
                $query->where('BRAND_OID', $request->brand_oid);
            }

            $perPage = $request->get('per_page', 15);
            $generators = $query->orderBy('OID', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $generators,
                'message' => 'Generators retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving generators: ' . $e->getMessage()
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
                'NAME' => 'required|string|max:255',
                'ASSIGNED_TO' => 'required|integer',
                'FUEL_TYPE_OID' => 'required|integer',
                'VEHICLE_OID' => 'nullable|integer',
                'LOCATION_OID' => 'nullable|integer',
                'BRAND_OID' => 'nullable|integer',
                'MODEL_OID' => 'nullable|integer',
                'POWER_KW' => 'nullable|numeric|min:0',
                'FUEL_CAPACITY_LITERS' => 'nullable|numeric|min:0',
                'OPERATING_HOURS' => 'nullable|numeric|min:0',
                'CONSUMPTION_LITERS_PER_HOUR' => 'nullable|numeric|min:0',
                'DESCRIPTION' => 'nullable|string|max:4000',
                'SERIAL_NUMBER' => 'nullable|string|max:100',
                'MANUFACTURE_DATE' => 'nullable|date',
                'LAST_MAINTENANCE_DATE' => 'nullable|date',
                'NEXT_MAINTENANCE_DATE' => 'nullable|date',
            ]);

            $generator = VehGenerator::create($validated);

            return response()->json([
                'success' => true,
                'data' => $generator->load(['vehicle', 'user']),
                'message' => 'Generator created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating generator: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $generator = VehGenerator::with(['vehicle', 'user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $generator,
                'message' => 'Generator retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Generator not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $generator = VehGenerator::findOrFail($id);

            $validated = $request->validate([
                'NAME' => 'sometimes|string|max:255',
                'ASSIGNED_TO' => 'sometimes|integer',
                'FUEL_TYPE_OID' => 'sometimes|integer',
                'VEHICLE_OID' => 'nullable|integer',
                'LOCATION_OID' => 'nullable|integer',
                'BRAND_OID' => 'nullable|integer',
                'MODEL_OID' => 'nullable|integer',
                'POWER_KW' => 'nullable|numeric|min:0',
                'FUEL_CAPACITY_LITERS' => 'nullable|numeric|min:0',
                'OPERATING_HOURS' => 'nullable|numeric|min:0',
                'CONSUMPTION_LITERS_PER_HOUR' => 'nullable|numeric|min:0',
                'DESCRIPTION' => 'nullable|string|max:4000',
                'SERIAL_NUMBER' => 'nullable|string|max:100',
                'MANUFACTURE_DATE' => 'nullable|date',
                'LAST_MAINTENANCE_DATE' => 'nullable|date',
                'NEXT_MAINTENANCE_DATE' => 'nullable|date',
            ]);

            $generator->update($validated);

            return response()->json([
                'success' => true,
                'data' => $generator->fresh(['vehicle', 'user']),
                'message' => 'Generator updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating generator: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $generator = VehGenerator::findOrFail($id);
            $generator->delete();

            return response()->json([
                'success' => true,
                'message' => 'Generator deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting generator: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get generators by fuel type.
     */
    public function getByFuelType(string $fuelTypeOid): JsonResponse
    {
        try {
            $generators = VehGenerator::with(['vehicle', 'user'])
                ->where('FUEL_TYPE_OID', $fuelTypeOid)
                ->orderBy('NAME')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $generators,
                'message' => 'Generators retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving generators: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get generator statistics.
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total_generators' => VehGenerator::count(),
                'total_power_kw' => VehGenerator::sum('POWER_KW'),
                'total_operating_hours' => VehGenerator::sum('OPERATING_HOURS'),
                'average_consumption' => VehGenerator::avg('CONSUMPTION_LITERS_PER_HOUR'),
                'generators_with_vehicles' => VehGenerator::whereNotNull('VEHICLE_OID')->count(),
                'generators_by_fuel_type' => VehGenerator::selectRaw('FUEL_TYPE_OID, COUNT(*) as count')
                    ->groupBy('FUEL_TYPE_OID')
                    ->pluck('count', 'FUEL_TYPE_OID'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Generator statistics retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving statistics: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Get fuel logs for a specific generator
     */
    public function fuelLogs(string $id): JsonResponse
    {
        try {
            $generator = VehGenerator::findOrFail($id);
            
            $fuelLogs = VehicleFuelLog::where('GENERATOR_OID', $id)
                ->orderBy('FILL_UP_DATE', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'generator' => $generator,
                    'fuel_logs' => $fuelLogs
                ],
                'message' => 'Generator fuel logs retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving fuel logs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate generator reports
     */
    public function report(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Generator reporting functionality not implemented yet'
        ], 501);
    }
}
