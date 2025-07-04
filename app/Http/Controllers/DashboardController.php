<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // التأكد من أن المستخدم مسجل دخول
        $user = $request->session()->get('user');
        if (!$user || !isset($user['authenticated']) || !$user['authenticated']) {
            return redirect('/login');
        }

        try {
            // محاولة الاتصال بقاعدة البيانات Oracle مع timeout قصير
            $stats = [];
            $recentFuelLogs = [];
            $error = null;
            
            // اختبار الاتصال بقاعدة البيانات
            $connectionTest = DB::connection('oracle')->getPdo();
            
            if ($connectionTest) {
                // إحصائيات من Oracle
                $stats = [
                    'totalVehicles' => (int) DB::connection('oracle')->table('VEHICLE')->count(),
                    'todayFuelLogs' => (int) DB::connection('oracle')->table('VEHICLE_FUEL_LOG')
                        ->whereDate('ENTRY_DATE', today())->count(),
                    'activeStations' => (int) DB::connection('oracle')->table('STATIONS')->count(),
                    'gasInventory' => (float) (DB::connection('oracle')->table('GAS_STORE')
                        ->sum('GAS_QUANTITY') ?? 0),
                ];

                // آخر عمليات التزويد من Oracle
                $recentFuelLogs = DB::connection('oracle')->table('VEHICLE_FUEL_LOG')
                    ->join('VEHICLE', 'VEHICLE_FUEL_LOG.VEH_OID', '=', 'VEHICLE.OID')
                    ->select([
                        'VEHICLE_FUEL_LOG.OID as id',
                        'VEHICLE.PLATE_NUM as vehicle_number',
                        'VEHICLE_FUEL_LOG.GALLONS as quantity',
                        'VEHICLE_FUEL_LOG.ENTRY_DATE as created_at'
                    ])
                    ->orderBy('VEHICLE_FUEL_LOG.ENTRY_DATE', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($log) {
                        return [
                            'id' => (int) $log->id,
                            'vehicle_number' => 'مركبة #' . ($log->vehicle_number ?? 'غير محدد'),
                            'quantity' => ($log->quantity ?? 0) . ' لتر',
                            'station_name' => 'محطة الوقود',
                            'created_at' => $log->created_at ? date('Y-m-d H:i:s', strtotime($log->created_at)) : null,
                        ];
                    });
            }
            
        } catch (\Exception $e) {
            // في حالة فشل الاتصال، استخدم بيانات وهمية
            $stats = [
                'totalVehicles' => 25,
                'todayFuelLogs' => 8,
                'activeStations' => 5,
                'gasInventory' => 1250.5,
            ];
            
            $recentFuelLogs = [
                [
                    'id' => 1,
                    'vehicle_number' => 'مركبة #101',
                    'quantity' => '45 لتر',
                    'station_name' => 'محطة الوقود الرئيسية',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-2 hours')),
                ],
                [
                    'id' => 2,
                    'vehicle_number' => 'مركبة #205',
                    'quantity' => '60 لتر',
                    'station_name' => 'محطة الوقود الفرعية',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-4 hours')),
                ],
                [
                    'id' => 3,
                    'vehicle_number' => 'مركبة #312',
                    'quantity' => '35 لتر',
                    'station_name' => 'محطة الوقود الشمالية',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-6 hours')),
                ],
            ];
            
            $error = 'تعذر الاتصال بقاعدة البيانات Oracle. يتم عرض بيانات تجريبية. الخطأ: ' . $e->getMessage();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentFuelLogs' => $recentFuelLogs,
            'error' => $error,
            'auth' => [
                'user' => $user
            ]
        ]);
    }
}