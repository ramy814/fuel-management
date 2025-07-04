<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\ConstantsHelper;

class Station extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'STATIONS';

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
        'STATION_NAME',
        'STATION_ENAME',
        'STATION_WEIGHT',
        'PARENT_OID'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
        'STATION_WEIGHT' => 'integer',
        'PARENT_OID' => 'integer',
    ];

    /**
     * Get the gas stores for this station.
     */
    public function gasStores()
    {
        return $this->hasMany(GasStore::class, 'station_id');
    }

    /**
     * Get the vehicle fuel logs for this station.
     */
    public function fuelLogs()
    {
        return $this->hasMany(VehicleFuelLog::class, 'STATION_OID');
    }

    /**
     * Get the gas bills for this station.
     */
    public function gasBills()
    {
        return $this->hasMany(VehGasBill::class, 'GAS_STATION_OID');
    }

    /**
     * Get constant names for this station
     */
    public function getConstantNames()
    {
        $data = $this->toArray();
        return ConstantsHelper::transformModelData($data);
    }


}
