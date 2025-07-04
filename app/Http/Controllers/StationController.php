<?php

namespace App\Http\Controllers;

use App\Models\Station;
use App\Helpers\ConstantsHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class StationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Station::query();

            // Add search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('STATION_NAME', 'LIKE', "%{$search}%")
                      ->orWhere('STATION_ENAME', 'LIKE', "%{$search}%");
                });
            }

            // Add filtering by parent
            if ($request->has('parent_oid')) {
                $query->where('PARENT_OID', $request->parent_oid);
            }

            $perPage = $request->get('per_page', 15);
            $stations = $query->orderBy('STATION_WEIGHT', 'asc')->paginate($perPage);

            // Transform data with constant names
            $stations->getCollection()->transform(function ($station) {
                return ConstantsHelper::transformModelData($station);
            });

            return response()->json([
                'success' => true,
                'data' => $stations,
                'message' => 'Stations retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving stations: ' . $e->getMessage()
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
                'STATION_NAME' => 'required|string|max:4000',
                'STATION_ENAME' => 'nullable|string|max:4000',
                'STATION_WEIGHT' => 'nullable|integer',
                'PARENT_OID' => 'nullable|integer',
            ]);

            $station = Station::create($validated);

            return response()->json([
                'success' => true,
                'data' => $station,
                'message' => 'Station created successfully'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating station: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $station = Station::with(['fuelLogs', 'gasBills'])->findOrFail($id);

            // Transform data with constants
            $stationData = ConstantsHelper::transformModelData($station);

            return response()->json([
                'success' => true,
                'data' => $stationData,
                'message' => 'Station retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Station not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $station = Station::findOrFail($id);

            $validated = $request->validate([
                'STATION_NAME' => 'sometimes|string|max:4000',
                'STATION_ENAME' => 'nullable|string|max:4000',
                'STATION_WEIGHT' => 'nullable|integer',
                'PARENT_OID' => 'nullable|integer',
            ]);

            $station->update($validated);

            return response()->json([
                'success' => true,
                'data' => $station->fresh(),
                'message' => 'Station updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating station: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get station options for select dropdowns
     */
    public function getStationOptions(): JsonResponse
    {
        try {
            $stations = Station::select('OID', 'STATION_NAME')
                ->orderBy('STATION_NAME', 'asc')
                ->get()
                ->map(function ($station) {
                    return [
                        'value' => $station->OID,
                        'label' => $station->STATION_NAME
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $stations,
                'message' => 'Station options retrieved successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving station options: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $station = Station::findOrFail($id);
            $station->delete();

            return response()->json([
                'success' => true,
                'message' => 'Station deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting station: ' . $e->getMessage()
            ], 500);
        }
    }

}
