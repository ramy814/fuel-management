<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\ConstantsHelper;

class Vehicle extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'VEHICLE';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'OID';

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'VENDOR_OID',
        'MODEL',
        'MODLE_YEAR',
        'INITIAL_PRICE',
        'VIN_NUM',
        'PLATE_NUM',
        'OLD_PLATE_NUM',
        'TOO_OLD_PLATE_NUM',
        'USAGE_TYPE_OID',
        'FUEL_TYPE_OID',
        'ENGINE_CAPACITY',
        'VEHICLE_WEIGHT',
        'PASSENGER_NUM',
        'LIC_END_DATE',
        'INS_END_DATE',
        'ASSIGNED_TO',
        'SERVICE_YEAR',
        'STATUS_OID',
        'DEPRECIATE_DATE',
        'NTOE',
        'ENTRY_DATE',
        'ENTRY_USER',
        'TANK_CAPACITY',
        'VEHICLE_NUM',
        'GPS_NUM',
        'LIC_START_DATE',
        'INS_START_DATE',
        'KELOMETER_PER_LITER',
        'ODOMETER',
        'USER_MODIFIED',
        'DATE_MODIFIED',
        'TYPE_OID'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'VENDOR_OID' => 'integer',
        'MODLE_YEAR' => 'integer',
        'INITIAL_PRICE' => 'decimal:2',
        'USAGE_TYPE_OID' => 'integer',
        'FUEL_TYPE_OID' => 'integer',
        'ENGINE_CAPACITY' => 'decimal:2',
        'VEHICLE_WEIGHT' => 'decimal:2',
        'LIC_END_DATE' => 'datetime',
        'INS_END_DATE' => 'datetime',
        'ASSIGNED_TO' => 'integer',
        'SERVICE_YEAR' => 'integer',
        'STATUS_OID' => 'integer',
        'DEPRECIATE_DATE' => 'datetime',
        'ENTRY_DATE' => 'datetime',
        'TANK_CAPACITY' => 'decimal:2',
        'GPS_NUM' => 'integer',
        'LIC_START_DATE' => 'datetime',
        'INS_START_DATE' => 'datetime',
        'KELOMETER_PER_LITER' => 'decimal:2',
        'ODOMETER' => 'decimal:2',
        'USER_MODIFIED' => 'integer',
        'DATE_MODIFIED' => 'datetime',
        'TYPE_OID' => 'integer'
    ];

    /**
     * Get the fuel logs for this vehicle.
     */
    public function fuelLogs()
    {
        return $this->hasMany(VehicleFuelLog::class, 'VEH_OID');
    }

    /**
     * Get the maintenance records for this vehicle.
     */
    public function maintenanceRecords()
    {
        return $this->hasMany(VehicleMaintenance::class, 'VEHICLE_OID');
    }

    /**
     * Get the gas bills for this vehicle.
     */
    public function gasBills()
    {
        return $this->hasMany(VehGasBill::class, 'vehicle_id');
    }

    /**
     * Get the generators for this vehicle.
     */
    public function generators()
    {
        return $this->hasMany(VehGenerator::class, 'ASSIGNED_TO');
    }

    /**
     * Get constant names for this vehicle
     */
    public function getConstantNames()
    {
        $data = $this->toArray();
        return ConstantsHelper::transformModelData($data);
    }

    /**
     * Get fuel type name
     */
    public function getFuelTypeNameAttribute()
    {
        return ConstantsHelper::getConstantName($this->FUEL_TYPE_OID, 'gas_type');
    }

    /**
     * Get status name
     */
    public function getStatusNameAttribute()
    {
        return ConstantsHelper::getConstantName($this->STATUS_OID, 'vehcile_status');
    }

    /**
     * Get vehicle type name
     */
    public function getTypeNameAttribute()
    {
        return ConstantsHelper::getConstantName($this->TYPE_OID, 'Vehcile_type');
    }

    /**
     * Get usage type name
     */
    public function getUsageTypeNameAttribute()
    {
        return ConstantsHelper::getConstantName($this->USAGE_TYPE_OID, 'veh_type');
    }

    /**
     * Get vendor name
     */
    public function getVendorNameAttribute()
    {
        return ConstantsHelper::getConstantName($this->VENDOR_OID, 'Vendor');
    }
}
