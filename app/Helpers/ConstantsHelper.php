<?php

namespace App\Helpers;

use App\Models\Constant;

class ConstantsHelper
{
    /**
     * Get constant name by ID and type
     */
    public static function getConstantName($id, $type)
    {
        if (!$id) return null;
        
        $constant = Constant::where('CNST_TYPE', $type)
                          ->where('OID', $id)
                          ->first();
        
        return $constant ? $constant->CNST_NAME : null;
    }

    /**
     * Transform model data to include constant names
     */
    public static function transformModelData($data)
    {
        $transformed = $data;
        
        // Add constant names for common fields
        if (isset($data['FUEL_TYPE_OID'])) {
            $transformed['fuel_type_name'] = self::getConstantName($data['FUEL_TYPE_OID'], 'gas_type');
        }
        
        if (isset($data['STATUS_OID'])) {
            $transformed['status_name'] = self::getConstantName($data['STATUS_OID'], 'vehcile_status');
        }
        
        if (isset($data['TYPE_OID'])) {
            $transformed['type_name'] = self::getConstantName($data['TYPE_OID'], 'Vehcile_type');
        }
        
        if (isset($data['USAGE_TYPE_OID'])) {
            $transformed['usage_type_name'] = self::getConstantName($data['USAGE_TYPE_OID'], 'veh_type');
        }
        
        if (isset($data['VENDOR_OID'])) {
            $transformed['vendor_name'] = self::getConstantName($data['VENDOR_OID'], 'Vendor');
        }
        
        return $transformed;
    }

    /**
     * Get all constants by type
     */
    public static function getConstantsByType($type)
    {
        return Constant::where('CONSTANT_TYPE', $type)
                      ->orderBy('CONSTANT_NAME')
                      ->get();
    }

    /**
     * Get constants as options for select dropdowns
     */
    public static function getConstantsAsOptions($type)
    {
        return Constant::where('CONSTANT_TYPE', $type)
                      ->orderBy('CONSTANT_NAME')
                      ->pluck('CONSTANT_NAME', 'OID')
                      ->toArray();
    }
} 