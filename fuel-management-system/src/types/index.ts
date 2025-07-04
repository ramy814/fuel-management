export interface Vehicle {
  oid: number;
  vehicleNum: string;
  model: string;
  modelYear?: number;
  plateNum?: string;
  vinNum?: string;
  fuelTypeOid?: number;
  engineCapacity?: number;
  tankCapacity?: number;
  odometer?: number;
  statusOid?: number;
  assignedTo?: number;
  entryDate?: Date;
  updateDate?: Date;
  fuelTypeName?: string;
  statusName?: string;
  assignedToName?: string;
}

export interface Generator {
  oid: number;
  name: string;
  assignedTo?: number;
  fuelTypeOid?: number;
  engineCapacity?: number;
  vehicleNum?: string;
  assignedToName?: string;
  fuelTypeName?: string;
}

export interface FuelLog {
  oid: number;
  vehOid?: number;
  fillUpDate?: Date;
  gallons?: number;
  odometer?: number;
  stationOid?: number;
  entryUser?: number;
  fuelId?: number;
  statusOid?: number;
  note?: string;
  entryDate?: Date;
  updateDate?: Date;
  generatorOid?: number;
  vehicleNum?: string;
  generatorName?: string;
  stationName?: string;
  userName?: string;
  fuelTypeName?: string;
  statusName?: string;
}

export interface GasBill {
  oid: number;
  gasStationOid?: number;
  price?: number;
  quantity?: number;
  billDate?: Date;
  billNum?: number;
  fuelTypeOid?: number;
  enteryUserOid?: number;
  updateUser?: string;
  updateDate?: Date;
  note?: string;
  stationName?: string;
  fuelTypeName?: string;
  userName?: string;
  totalAmount?: number;
}

export interface GasStore {
  oid: number;
  entryDate?: Date;
  gasQuantity?: number;
  solarQuantity?: number;
  eygptSolarQuantity?: number;
  gasBills?: number;
  fillUpDate?: Date;
  note?: string;
  isActive?: number;
}

export interface Station {
  oid: number;
  stationName?: string;
  stationEname?: string;
  stationWeight?: number;
  parentOid?: number;
  parentStationName?: string;
}

export interface Constant {
  oid: number;
  cnstName?: string;
  cnstType?: string;
  cnstEng?: string;
}

export enum ConstantType {
  FUEL_TYPE = 'FUEL_TYPE',
  VEHICLE_STATUS = 'VEHICLE_STATUS',
  ASSIGNED_TO = 'ASSIGNED_TO',
  LOG_STATUS = 'LOG_STATUS',
  MAINTENANCE_TYPE = 'MAINTENANCE_TYPE'
}

export interface User {
  oid: number;
  username: string;
  fullName?: string;
  email?: string;
  isActive?: boolean;
  readOnly?: boolean;
  permissions?: string[];
  roles?: string[];
}

export interface VehicleMaintenance {
  oid: number;
  vehicleOid?: number;
  maintenanceDate?: Date;
  maintenanceType?: string;
  description?: string;
  cost?: number;
  nextMaintenanceDate?: Date;
  entryUser?: number;
  vehicleNum?: string;
  userName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VehicleFilters {
  vehicleNum?: string;
  model?: string;
  fuelTypeOid?: number;
  statusOid?: number;
  assignedTo?: number;
  page?: number;
  pageSize?: number;
}

export interface FuelLogFilters {
  vehOid?: number;
  generatorOid?: number;
  dateFrom?: Date;
  dateTo?: Date;
  stationOid?: number;
  fuelId?: number;
  page?: number;
  pageSize?: number;
}

export interface GasBillFilters {
  gasStationOid?: number;
  fuelTypeOid?: number;
  dateFrom?: Date;
  dateTo?: Date;
  billNum?: number;
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalGenerators: number;
  todayMovements: number;
  currentInventory: {
    gasQuantity: number;
    solarQuantity: number;
    eygptSolarQuantity: number;
  };
  monthlyConsumption: {
    month: string;
    gas: number;
    solar: number;
    eygptSolar: number;
  }[];
  recentMovements: FuelLog[];
}

export interface CreateVehicleDTO {
  vehicleNum: string;
  model: string;
  modelYear?: number;
  plateNum?: string;
  vinNum?: string;
  fuelTypeOid?: number;
  engineCapacity?: number;
  tankCapacity?: number;
  odometer?: number;
  statusOid?: number;
  assignedTo?: number;
}

export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {
  oid: number;
}

export interface CreateGeneratorDTO {
  name: string;
  assignedTo?: number;
  fuelTypeOid?: number;
  engineCapacity?: number;
  vehicleNum?: string;
}

export interface UpdateGeneratorDTO extends Partial<CreateGeneratorDTO> {
  oid: number;
}

export interface CreateFuelLogDTO {
  vehOid?: number;
  generatorOid?: number;
  fillUpDate?: Date;
  gallons?: number;
  odometer?: number;
  stationOid?: number;
  fuelId?: number;
  statusOid?: number;
  note?: string;
}

export interface UpdateFuelLogDTO extends Partial<CreateFuelLogDTO> {
  oid: number;
}

export interface CreateGasBillDTO {
  gasStationOid?: number;
  price?: number;
  quantity?: number;
  billDate?: Date;
  billNum?: number;
  fuelTypeOid?: number;
  note?: string;
}

export interface UpdateGasBillDTO extends Partial<CreateGasBillDTO> {
  oid: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ReportParams {
  type: 'vehicles' | 'generators' | 'inventory' | 'invoices' | 'maintenance';
  dateFrom?: Date;
  dateTo?: Date;
  vehicleOid?: number;
  generatorOid?: number;
  fuelTypeOid?: number;
  stationOid?: number;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}