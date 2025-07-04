<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GasStore extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'GAS_STORE';

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
        'ENTRY_DATE',
        'GAS_QUANTITY',
        'SOLAR_QUANTITY',
        'GAS_REC_OID',
        'GAS_BILLS',
        'FILL_UP_DATE',
        'PRV_OID',
        'PRV_QTY',
        'NOTE',
        'EYGPT_SOLAR_QUANTITY',
        'IS_ACTIVE'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'GAS_QUANTITY' => 'decimal:2',
        'SOLAR_QUANTITY' => 'decimal:2',
        'GAS_REC_OID' => 'integer',
        'GAS_BILLS' => 'decimal:2',
        'PRV_OID' => 'integer',
        'PRV_QTY' => 'decimal:2',
        'EYGPT_SOLAR_QUANTITY' => 'decimal:2',
        'IS_ACTIVE' => 'integer',
        'ENTRY_DATE' => 'datetime',
        'FILL_UP_DATE' => 'datetime',
    ];

    /**
     * Get the vehicle fuel logs for this gas store.
     */
    public function fuelLogs()
    {
        return $this->hasMany(VehicleFuelLog::class, 'FUEL_ID');
    }
}
