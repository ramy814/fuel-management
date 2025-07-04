<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Station;
use App\Helpers\ConstantsHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Vehicle::query();

            // Add filtering
            if ($request->has('status_oid')) {
                $query->where('STATUS_OID', $request->status_oid);
            }

            if ($request->has('fuel_type_oid')) {
                $query->where('FUEL_TYPE_OID', $request->fuel_type_oid);
            }

            if ($request->has('assigned_to')) {
                $query->where('ASSIGNED_TO', $request->assigned_to);
            }

            // Add search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('VEHICLE_NUM', 'LIKE', "%{$search}%")
                      ->orWhere('PLATE_NUM', 'LIKE', "%{$search}%")
                      ->orWhere('MODEL', 'LIKE', "%{$search}%");
                });
            }

            // Add pagination
            $perPage = $request->get('per_page', 15);
            $vehicles = $query->orderBy('OID', 'desc')->paginate($perPage);

            // Transform data with constant names and station names
            $vehicles->getCollection()->transform(function ($vehicle) {
                $vehicle = ConstantsHelper::transformModelData($vehicle);
                
                // Add assigned station name
                if ($vehicle->assigned_to) {
                    $station = Station::find($vehicle->assigned_to);
                    $vehicle->assigned_station_name = $station ? $station->station_name : null;
                }
                
                return $vehicle;
            });

            return response()->json([
                'success' => true,
                'data' => $vehicles,
                'message' => 'Vehicles retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving vehicles: ' . $e->getMessage()
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
                'VEHICLE_NUM' => 'required|string|max:100',
                'MODEL' => 'nullable|string|max:100',
                'MODLE_YEAR' => 'nullable|integer',
                'PLATE_NUM' => 'nullable|string|max:100',
                'FUEL_TYPE_OID' => 'required|integer',
                'TYPE_OID' => 'required|integer',
                'ENGINE_CAPACITY' => 'nullable|numeric',
                'TANK_CAPACITY' => 'nullable|numeric',
                'ASSIGNED_TO' => 'nullable|integer',
                'STATUS_OID' => 'nullable|integer',
            ]);

            $vehicle = Vehicle::create($validated);

            return response()->json([
                'success' => true,
                'data' => $vehicle,
                'message' => 'Vehicle created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $vehicle = Vehicle::with([
                'fuelLogs' => function($query) {
                    $query->orderBy('FILL_UP_DATE', 'desc')->limit(10);
                },
                'maintenanceRecords' => function($query) {
                    $query->orderBy('MNTC_DATE', 'desc')->limit(5);
                },
                'generators'
            ])->findOrFail($id);

            // Transform data with constant names and station name
            $vehicle = ConstantsHelper::transformModelData($vehicle);
            
            // Add assigned station name
            if ($vehicle->assigned_to) {
                $station = Station::find($vehicle->assigned_to);
                $vehicle->assigned_station_name = $station ? $station->station_name : null;
            }

            return response()->json([
                'success' => true,
                'data' => $vehicle,
                'message' => 'Vehicle retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $vehicle = Vehicle::findOrFail($id);

            $validated = $request->validate([
                'VEHICLE_NUM' => 'sometimes|string|max:100',
                'MODEL' => 'nullable|string|max:100',
                'MODLE_YEAR' => 'nullable|integer',
                'PLATE_NUM' => 'nullable|string|max:100',
                'FUEL_TYPE_OID' => 'sometimes|integer',
                'TYPE_OID' => 'sometimes|integer',
                'ENGINE_CAPACITY' => 'nullable|numeric',
                'TANK_CAPACITY' => 'nullable|numeric',
                'ASSIGNED_TO' => 'nullable|integer',
                'STATUS_OID' => 'nullable|integer',
                'ODOMETER' => 'nullable|numeric',
            ]);

            $vehicle->update($validated);

            return response()->json([
                'success' => true,
                'data' => $vehicle->fresh(),
                'message' => 'Vehicle updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $vehicle = Vehicle::findOrFail($id);
            $vehicle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vehicle deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicle fuel statistics.
     */
    public function fuelStats(string $id): JsonResponse
    {
        try {
            $vehicle = Vehicle::with('fuelLogs')->findOrFail($id);
            
            $stats = [
                'total_fuel_logs' => $vehicle->fuelLogs->count(),
                'total_gallons' => $vehicle->fuelLogs->sum('GALLONS'),
                'last_fuel_date' => $vehicle->fuelLogs->max('FILL_UP_DATE'),
                'current_odometer' => $vehicle->ODOMETER,
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Vehicle fuel statistics retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving fuel statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the web interface for vehicles.
     */
    public function webIndex(Request $request)
    {
        return Inertia::render('Vehicles/Index');
    }

    /**
     * Display the create vehicle form.
     */
    public function create()
    {
        return Inertia::render('Vehicles/Create');
    }

    /**
     * Display the edit vehicle form.
     */
    public function edit(string $id)
    {
        return Inertia::render('Vehicles/Edit', ['id' => $id]);
    }

    /**
     * Display the vehicle details.
     */
    public function webShow(string $id)
    {
        return Inertia::render('Vehicles/Show', ['id' => $id]);
    }
}
