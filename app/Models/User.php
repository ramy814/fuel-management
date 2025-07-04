<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The connection name for the model.
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     */
    protected $table = 'USERS';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'oid';

    /**
     * The "type" of the auto-incrementing ID.
     */
    protected $keyType = 'int';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = true;

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'USER_NAME_NEW',
        'USER_PASSWORD',
        'USER_SSN',
        'USER_FULL_NAME',
        'USER_ACTIVE',
        'READ_ONLY',
        'REMEMBER_TOKEN'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'OID' => 'integer',
        'USER_SSN' => 'integer',
        'USER_ACTIVE' => 'boolean',
        'READ_ONLY' => 'boolean',
    ];

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'user_name_new';
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->user_password;
    }

    /**
     * Get the gas bills for this user.
     */
    public function gasBills()
    {
        return $this->hasMany(VehGasBill::class, 'ENTERY_USER_OID');
    }

    /**
     * Get the fuel logs for this user.
     */
    public function fuelLogs()
    {
        return $this->hasMany(VehicleFuelLog::class, 'ENTRY_USER');
    }
}
