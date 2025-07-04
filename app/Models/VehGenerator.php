<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehGenerator extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'VEH_GENERATOR';

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
        'NAME',
        'ASSIGNED_TO',
        'FUEL_TYPE_OID',
        'ENTRY_DATE',
        'ENTRY_USER',
        'VEHICLE_NUM',
        'NOTE',
        'ENGINE_CAPACITY',
        'TYPE_OID',
        'ESSENCE_OID'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'ASSIGNED_TO' => 'integer',
        'FUEL_TYPE_OID' => 'integer',
        'ENTRY_DATE' => 'datetime',
        'ENTRY_USER' => 'integer',
        'TYPE_OID' => 'integer',
        'ESSENCE_OID' => 'integer',
    ];

    /**
     * Get the vehicle that owns this generator.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'ASSIGNED_TO');
    }

    /**
     * Get the user who entered this generator.
     */
    public function entryUser()
    {
        return $this->belongsTo(User::class, 'ENTRY_USER');
    }
}
