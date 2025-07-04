<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleFuelLog extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'VEHICLE_FUEL_LOG';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'oid';

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'ENTRY_USER',
        'ENTRY_DATE',
        'VEH_OID',
        'FILL_UP_DATE',
        'GALLONS',
        'ODOMETER',
        'NOTE',
        'STATUS_OID',
        'FUEL_ID',
        'FUEL_YEAR',
        'GAS_TYPE',
        'GENERATOR_OID',
        'DIVERS',
        'CANCEL_DATE',
        'ODOMETER_LOWER',
        'ODOMETER3_UPPER',
        'ODOMETER_BIG',
        'ODOMETER_SMALL',
        'ODOMETER_SMALL2',
        'USER_CANCEL_OID',
        'APPROVAL_DATE',
        'STATION_OID'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'ENTRY_USER' => 'integer',
        'ENTRY_DATE' => 'datetime',
        'VEH_OID' => 'integer',
        'FILL_UP_DATE' => 'datetime',
        'GALLONS' => 'decimal:2',
        'ODOMETER' => 'decimal:2',
        'STATUS_OID' => 'integer',
        'FUEL_ID' => 'integer',
        'FUEL_YEAR' => 'integer',
        'GAS_TYPE' => 'integer',
        'GENERATOR_OID' => 'integer',
        'DIVERS' => 'integer',
        'CANCEL_DATE' => 'datetime',
        'ODOMETER_LOWER' => 'decimal:2',
        'ODOMETER3_UPPER' => 'decimal:2',
        'ODOMETER_BIG' => 'decimal:2',
        'ODOMETER_SMALL' => 'decimal:2',
        'ODOMETER_SMALL2' => 'decimal:2',
        'USER_CANCEL_OID' => 'integer',
        'APPROVAL_DATE' => 'datetime',
        'STATION_OID' => 'integer'
    ];

    /**
     * Get the vehicle that owns this fuel log.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'VEH_OID');
    }

    /**
     * Get the station where the fueling occurred.
     */
    public function station()
    {
        return $this->belongsTo(Station::class, 'STATION_OID');
    }

    /**
     * Get the user who entered this fuel log.
     */
    public function entryUser()
    {
        return $this->belongsTo(User::class, 'ENTRY_USER');
    }

    /**
     * Get the generator associated with this fuel log.
     */
    public function generator()
    {
        return $this->belongsTo(VehGenerator::class, 'GENERATOR_OID');
    }
}
