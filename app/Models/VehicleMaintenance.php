<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleMaintenance extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'VEHICLE_MAINTENANCE';

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
        'VEHICLE_OID',
        'MNTC_TYPE_OID',
        'IS_ACCIDENTAL',
        'CURRENT_MILEAGE',
        'MNTC_DATE',
        'STATUS_OID',
        'FINISH_DATE',
        'NOTE',
        'ENTRY_USER',
        'MNTC_ID',
        'MNTC_YEAR',
        'RESPONSIBLE',
        'REPAIR_TIME',
        'DRIVER_OWNER'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'VEHICLE_OID' => 'integer',
        'MNTC_TYPE_OID' => 'integer',
        'IS_ACCIDENTAL' => 'integer',
        'CURRENT_MILEAGE' => 'decimal:2',
        'MNTC_DATE' => 'datetime',
        'STATUS_OID' => 'integer',
        'FINISH_DATE' => 'datetime',
        'MNTC_ID' => 'integer',
        'MNTC_YEAR' => 'integer',
        'REPAIR_TIME' => 'integer',
        'DRIVER_OWNER' => 'integer',
    ];

    /**
     * Get the vehicle that owns this maintenance record.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'VEHICLE_OID');
    }
}
