<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{

    /**
     * Get dashboard statistics for API
     */
    public function stats(Request $request)
    {
        try {
            // اختبار الاتصال بقاعدة البيانات
            $connectionTest = DB::connection('oracle')->getPdo();
            
            if ($connectionTest) {
                // إحصائيات من Oracle
                $stats = [
                    'totalVehicles' => (int) DB::connection('oracle')->table('VEHICLE')->count(),
                    'totalGenerators' => (int) DB::connection('oracle')->table('VEH_GENERATOR')->count(),
                    'todayFuelLogs' => (int) DB::connection('oracle')->table('VEHICLE_FUEL_LOG')
                        ->whereDate('ENTRY_DATE', today())->count(),
                    'thisMonthFuelLogs' => (int) DB::connection('oracle')->table('VEHICLE_FUEL_LOG')
                        ->whereMonth('ENTRY_DATE', date('m'))
                        ->whereYear('ENTRY_DATE', date('Y'))
                        ->count(),
                    'activeStations' => (int) DB::connection('oracle')->table('STATIONS')->count(),
                    'totalGasBills' => (int) DB::connection('oracle')->table('VEH_GAS_BILL')->count(),
                    'gasInventory' => (float) (DB::connection('oracle')->table('GAS_STORE')
                        ->sum('GAS_QUANTITY') ?? 0),
                    'solarInventory' => (float) (DB::connection('oracle')->table('GAS_STORE')
                        ->sum('SOLAR_QUANTITY') ?? 0),
                ];

                // آخر عمليات التزويد - تبسيط الاستعلام
                $recentFuelLogs = DB::connection('oracle')->table('VEHICLE_FUEL_LOG')
                    ->orderBy('ENTRY_DATE', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($log) {
                        return [
                            'id' => (int) $log->OID,
                            'vehicle_oid' => $log->VEH_OID ?? null,
                            'quantity' => ($log->GALLONS ?? 0),
                            'station_oid' => $log->STATION_OID ?? null,
                            'entry_date' => $log->ENTRY_DATE,
                        ];
                    });

                return response()->json([
                    'success' => true,
                    'data' => [
                        'stats' => $stats,
                        'recentFuelLogs' => $recentFuelLogs
                    ],
                    'message' => 'Dashboard statistics retrieved successfully'
                ]);
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard statistics: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }

        return response()->json([
            'success' => false,
            'message' => 'Database connection failed',
            'data' => null
        ], 500);
    }
}