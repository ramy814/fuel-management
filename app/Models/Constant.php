<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Constant extends Model
{
    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'CONSTANTS';

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
        'CNST_NAME',
        'CNST_TYPE', 
        'CNST_ENG'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'OID' => 'integer',
    ];
}
