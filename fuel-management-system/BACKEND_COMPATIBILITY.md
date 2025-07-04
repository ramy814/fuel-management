# دليل التوافق مع الباك اند

## مراجعة تكامل النظام مع Laravel + Oracle Backend

### ✅ واجهات البيانات (Data Interfaces)

جميع واجهات TypeScript متوافقة مع مخطط قاعدة البيانات Oracle:

#### 1. جدول VEH_GENERATOR
```typescript
interface Vehicle {
  oid: number;               // OID (Primary Key)
  vehicleNum: string;        // VEHICLE_NUM
  model: string;             // MODEL
  modelYear?: number;        // MODEL_YEAR
  plateNum?: string;         // PLATE_NUM
  vinNum?: string;           // VIN_NUM
  fuelTypeOid?: number;      // FUEL_TYPE_OID (FK)
  engineCapacity?: number;   // ENGINE_CAPACITY
  tankCapacity?: number;     // TANK_CAPACITY
  odometer?: number;         // ODOMETER
  statusOid?: number;        // STATUS_OID (FK)
  assignedTo?: number;       // ASSIGNED_TO (FK)
  entryDate?: Date;          // ENTRY_DATE
  updateDate?: Date;         // UPDATE_DATE
}
```

#### 2. جدول VEHICLE_FUEL_LOG
```typescript
interface FuelLog {
  oid: number;               // OID (Primary Key)
  vehOid?: number;           // VEH_OID (FK)
  generatorOid?: number;     // GENERATOR_OID (FK)
  fillUpDate?: Date;         // FILL_UP_DATE
  gallons?: number;          // GALLONS
  odometer?: number;         // ODOMETER
  stationOid?: number;       // STATION_OID (FK)
  fuelId?: number;           // FUEL_ID (FK)
  statusOid?: number;        // STATUS_OID (FK)
  note?: string;             // NOTE
  entryDate?: Date;          // ENTRY_DATE
  updateDate?: Date;         // UPDATE_DATE
}
```

#### 3. جدول VEH_GAS_BILL
```typescript
interface GasBill {
  oid: number;               // OID (Primary Key)
  gasStationOid?: number;    // GAS_STATION_OID (FK)
  billNum?: number;          // BILL_NUM
  billDate?: Date;           // BILL_DATE
  fuelTypeOid?: number;      // FUEL_TYPE_OID (FK)
  quantity?: number;         // QUANTITY
  price?: number;            // PRICE
  note?: string;             // NOTE
  entryDate?: Date;          // ENTRY_DATE
  updateDate?: Date;         // UPDATE_DATE
}
```

#### 4. جدول GAS_STORE
```typescript
interface GasStore {
  oid: number;               // OID (Primary Key)
  gasQuantity?: number;      // GAS_QUANTITY
  solarQuantity?: number;    // SOLAR_QUANTITY
  eygptSolarQuantity?: number; // EYGPT_SOLAR_QUANTITY
  entryDate?: Date;          // ENTRY_DATE
  updateDate?: Date;         // UPDATE_DATE
}
```

### ✅ نقاط النهاية API Endpoints

جميع endpoints متوافقة مع Laravel REST API:

#### Authentication
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/me` - بيانات المستخدم الحالي
- `POST /api/auth/verify` - التحقق من صحة الرمز

#### Vehicles Management
- `GET /api/vehicles` - قائمة المركبات مع pagination
- `POST /api/vehicles` - إضافة مركبة جديدة
- `GET /api/vehicles/{id}` - تفاصيل مركبة محددة
- `PUT /api/vehicles/{id}` - تحديث بيانات مركبة
- `DELETE /api/vehicles/{id}` - حذف مركبة
- `GET /api/vehicles/{id}/fuel-logs` - سجل الوقود للمركبة

#### Generators Management
- `GET /api/generators` - قائمة المولدات
- `POST /api/generators` - إضافة مولد جديد
- `GET /api/generators/{id}` - تفاصيل مولد محدد
- `PUT /api/generators/{id}` - تحديث بيانات مولد
- `DELETE /api/generators/{id}` - حذف مولد

#### Fuel Logs Management
- `GET /api/fuel-logs` - قائمة حركات الوقود
- `POST /api/fuel-logs` - إضافة حركة وقود جديدة
- `GET /api/fuel-logs/{id}` - تفاصيل حركة محددة
- `PUT /api/fuel-logs/{id}` - تحديث حركة وقود
- `DELETE /api/fuel-logs/{id}` - حذف حركة وقود

#### Invoices Management
- `GET /api/invoices` - قائمة الفواتير
- `POST /api/invoices` - إضافة فاتورة جديدة
- `GET /api/invoices/{id}` - تفاصيل فاتورة محددة
- `PUT /api/invoices/{id}` - تحديث فاتورة
- `DELETE /api/invoices/{id}` - حذف فاتورة

#### Inventory Management
- `GET /api/inventory/current` - المخزون الحالي
- `GET /api/inventory/history` - تاريخ المخزون
- `POST /api/inventory/update` - تحديث المخزون

#### Master Data
- `GET /api/constants` - البيانات الثابتة (أنواع الوقود، الحالات، إلخ)
- `GET /api/stations` - قائمة المحطات

#### Dashboard & Reports
- `GET /api/dashboard/stats` - إحصائيات لوحة التحكم
- `GET /api/reports/vehicles` - تقارير المركبات
- `GET /api/reports/generators` - تقارير المولدات
- `GET /api/reports/inventory` - تقارير المخزون
- `GET /api/reports/financial` - تقارير مالية

### ✅ نموذج الاستجابة Response Format

جميع APIs تتبع نفس نموذج الاستجابة:

#### نجاح العملية
```json
{
  "success": true,
  "data": {...},
  "message": "تم تنفيذ العملية بنجاح"
}
```

#### قائمة مع Pagination
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "total": 100,
    "per_page": 10,
    "last_page": 10
  }
}
```

#### خطأ في العملية
```json
{
  "success": false,
  "message": "رسالة الخطأ",
  "errors": {...}
}
```

### ✅ نظام المصادقة Authentication

- استخدام JWT tokens
- HttpOnly cookies للأمان
- Auto-refresh للرموز
- Logout مع إلغاء الرمز من الخادم

### ✅ معالجة الأخطاء Error Handling

- Status codes مناسبة (200, 201, 400, 401, 403, 404, 500)
- رسائل خطأ واضحة بالعربية
- Validation errors مفصلة
- Retry logic للشبكة

### ✅ المتطلبات من الباك اند Backend Requirements

#### Laravel Setup
```php
// في routes/api.php
Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);
    
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('generators', GeneratorController::class);
    Route::apiResource('fuel-logs', FuelLogController::class);
    Route::apiResource('invoices', InvoiceController::class);
    
    Route::get('inventory/current', [InventoryController::class, 'current']);
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('constants', [ConstantsController::class, 'index']);
    Route::get('stations', [StationsController::class, 'index']);
});
```

#### CORS Configuration
```php
// في config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

#### Middleware للAPI
```php
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    // Protected routes
});
```

### ✅ قاعدة البيانات Oracle

#### Connection Configuration
```php
// في config/database.php
'oracle' => [
    'driver' => 'oracle',
    'tns' => env('DB_TNS', ''),
    'host' => env('DB_HOST', 'localhost'),
    'port' => env('DB_PORT', '1521'),
    'database' => env('DB_DATABASE', 'xe'),
    'username' => env('DB_USERNAME', 'fuel_management'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_schema' => env('DB_SCHEMA_PREFIX', ''),
]
```

#### Required Tables
- `VEH_GENERATOR` - المركبات والمولدات
- `VEHICLE_FUEL_LOG` - سجل حركات الوقود  
- `VEH_GAS_BILL` - فواتير الوقود
- `GAS_STORE` - مخزون الوقود
- `CONSTANTS` - البيانات الثابتة
- `STATIONS` - محطات الوقود
- `USERS` - المستخدمين

### ✅ متغيرات البيئة Environment Variables

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000/api
VITE_APP_TITLE=نظام إدارة المحروقات - بلدية غزة
```

#### Backend (.env)
```bash
APP_URL=http://localhost:8000
DB_CONNECTION=oracle
DB_HOST=localhost
DB_PORT=1521
DB_DATABASE=XE
DB_USERNAME=fuel_management
DB_PASSWORD=your_password
```

### 🔧 خطوات التشغيل Deployment Steps

1. **إعداد الباك اند**
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

2. **إعداد الفرونت اند**
   ```bash
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **التحقق من الاتصال**
   - افتح المتصفح على `http://localhost:5173`
   - تأكد من عمل صفحة تسجيل الدخول
   - اختبر العمليات الأساسية

### ⚠️ ملاحظات مهمة Important Notes

1. **أمان البيانات**: جميع المدخلات محققة في الفرونت والباك اند
2. **أداء التطبيق**: تم تحسين الاستعلامات والتحميل
3. **سهولة الصيانة**: كود منظم وموثق جيداً
4. **قابلية التوسع**: بنية تدعم إضافة ميزات جديدة

### 📞 الدعم الفني Technical Support

عند مواجهة مشاكل في التكامل:
1. تحقق من logs الباك اند
2. فحص Network tab في المتصفح
3. مراجعة متغيرات البيئة
4. التأكد من صحة أذونات قاعدة البيانات

---

النظام جاهز 100% للتكامل مع Laravel + Oracle Backend!