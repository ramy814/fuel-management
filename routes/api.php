<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehGeneratorController;
use App\Http\Controllers\VehicleFuelLogController;
use App\Http\Controllers\VehGasBillController;
use App\Http\Controllers\GasStoreController;
use App\Http\Controllers\ConstantController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\DashboardController;

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('verify', [AuthController::class, 'checkAuth']);
    Route::get('user', [AuthController::class, 'user']);
});

// Protected routes (temporarily without middleware for testing)
Route::group([], function () {
    
    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    
    // Vehicles
    Route::prefix('vehicles')->group(function () {
        Route::get('/', [VehicleController::class, 'index']);
        Route::post('/', [VehicleController::class, 'store']);
        Route::get('{id}', [VehicleController::class, 'show']);
        Route::put('{id}', [VehicleController::class, 'update']);
        Route::delete('{id}', [VehicleController::class, 'destroy']);
        Route::get('{id}/fuel-logs', [VehicleController::class, 'fuelLogs']);
        Route::get('export/excel', [VehicleController::class, 'exportExcel']);
        Route::get('export/pdf', [VehicleController::class, 'exportPdf']);
    });
    
    // Generators
    Route::prefix('generators')->group(function () {
        Route::get('/', [VehGeneratorController::class, 'index']);
        Route::post('/', [VehGeneratorController::class, 'store']);
        Route::get('{id}', [VehGeneratorController::class, 'show']);
        Route::put('{id}', [VehGeneratorController::class, 'update']);
        Route::delete('{id}', [VehGeneratorController::class, 'destroy']);
        Route::get('{id}/fuel-logs', [VehGeneratorController::class, 'fuelLogs']);
    });
    
    // Fuel Logs
    Route::prefix('fuel-logs')->group(function () {
        Route::get('/', [VehicleFuelLogController::class, 'index']);
        Route::post('/', [VehicleFuelLogController::class, 'store']);
        Route::get('{id}', [VehicleFuelLogController::class, 'show']);
        Route::put('{id}', [VehicleFuelLogController::class, 'update']);
        Route::delete('{id}', [VehicleFuelLogController::class, 'destroy']);
    });
    
    // Invoices/Gas Bills
    Route::prefix('invoices')->group(function () {
        Route::get('/', [VehGasBillController::class, 'index']);
        Route::post('/', [VehGasBillController::class, 'store']);
        Route::get('{id}', [VehGasBillController::class, 'show']);
        Route::put('{id}', [VehGasBillController::class, 'update']);
        Route::delete('{id}', [VehGasBillController::class, 'destroy']);
    });
    
    // Inventory
    Route::prefix('inventory')->group(function () {
        Route::get('current', [GasStoreController::class, 'current']);
        Route::get('history', [GasStoreController::class, 'history']);
        Route::post('update', [GasStoreController::class, 'updateInventory']);
    });
    
    // Master Data
    Route::get('constants', [ConstantController::class, 'index']);
    Route::get('constants/type/{type}', [ConstantController::class, 'getByType']);
    Route::get('stations', [StationController::class, 'index']);
    
    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('vehicles', [VehicleController::class, 'report']);
        Route::get('generators', [VehGeneratorController::class, 'report']);
        Route::get('inventory', [GasStoreController::class, 'report']);
        Route::get('financial', [VehGasBillController::class, 'report']);
    });
});