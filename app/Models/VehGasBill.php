<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehGasBill extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'VEH_GAS_BILL';

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
        'DONOR_NAME_OID',
        'GAS_STATION_OID',
        'PRICE',
        'QUANTITY',
        'BILL_TYPE_OID',
        'EN_DATE',
        'STATUS_OID',
        'ENTERY_USER_OID',
        'BILL_NUM',
        'FUEL_TYPE_OID',
        'NOTES',
        'BILL_DATE'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'DONOR_NAME_OID' => 'integer',
        'GAS_STATION_OID' => 'integer',
        'PRICE' => 'decimal:2',
        'QUANTITY' => 'decimal:2',
        'BILL_TYPE_OID' => 'integer',
        'EN_DATE' => 'datetime',
        'STATUS_OID' => 'integer',
        'ENTERY_USER_OID' => 'integer',
        'BILL_NUM' => 'integer',
        'FUEL_TYPE_OID' => 'integer',
        'BILL_DATE' => 'datetime',
    ];

    /**
     * Get the station that owns this gas bill.
     */
    public function station()
    {
        return $this->belongsTo(Station::class, 'GAS_STATION_OID');
    }

    /**
     * Get the user who created this gas bill.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'ENTERY_USER_OID');
    }
}
