# إعداد نظام إدارة الوقود مع قاعدة بيانات Oracle

## نظرة عامة

تم إعداد النظام للعمل مع قاعدة بيانات Oracle. النظام يتكون من:
- **الخلفية (Backend)**: Laravel مع حزمة `yajra/laravel-oci8`
- **الواجهة الأمامية (Frontend)**: React + TypeScript + Vite

## متطلبات النظام

### متطلبات PHP
- PHP 8.2 أو أحدث
- PHP OCI8 extension
- Composer

### متطلبات قاعدة البيانات
- Oracle Database 11g أو أحدث
- Oracle Instant Client (للـ PHP OCI8)

### متطلبات الواجهة الأمامية
- Node.js 16 أو أحدث
- npm أو yarn

## إعداد قاعدة البيانات

### 1. تثبيت PHP OCI8 Extension

#### على macOS:
```bash
# تثبيت Oracle Instant Client
brew install oracle-instantclient

# تثبيت PHP OCI8
pecl install oci8

# إضافة extension إلى php.ini
echo "extension=oci8.so" >> /usr/local/etc/php/8.2/php.ini
```

#### على Ubuntu/Debian:
```bash
# تثبيت Oracle Instant Client
sudo apt-get install oracle-instantclient-basic oracle-instantclient-devel

# تثبيت PHP OCI8
sudo pecl install oci8

# إضافة extension إلى php.ini
echo "extension=oci8.so" | sudo tee -a /etc/php/8.2/cli/php.ini
```

### 2. إعداد ملف البيئة (.env)

```env
# Oracle Database Configuration
DB_CONNECTION=oracle
DB_HOST=172.16.3.59
DB_PORT=1521
DB_DATABASE=gisdb
DB_SERVICE_NAME=gisdb
DB_USERNAME=mntc_test
DB_PASSWORD=1234_56789
DB_CHARSET=AL32UTF8
```

### 3. تثبيت حزم Laravel

```bash
composer install
```

### 4. التحقق من الاتصال

```bash
# اختبار الاتصال بقاعدة البيانات
php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection successful!';"

# اختبار جلب البيانات
php artisan tinker --execute="App\Models\Vehicle::count(); echo 'Vehicles count: ' . App\Models\Vehicle::count();"
```

## تشغيل النظام

### 1. تشغيل الخادم الخلفي

```bash
# تشغيل Laravel server
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. تشغيل الواجهة الأمامية

```bash
# الانتقال إلى مجلد الواجهة الأمامية
cd fuel-management-system

# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev
```

### 3. الوصول للنظام

- **الواجهة الأمامية**: http://localhost:5173
- **API الخلفي**: http://localhost:8000/api

## هيكل قاعدة البيانات

### الجداول الرئيسية

1. **USERS** - المستخدمين
2. **VEHICLE** - المركبات
3. **VEHICLE_FUEL_LOG** - سجلات استهلاك الوقود
4. **VEH_GAS_BILL** - فواتير الوقود
5. **VEH_GENERATOR** - المولدات
6. **GAS_STORE** - مخزون الوقود
7. **STATION** - المحطات
8. **CONSTANT** - الثوابت

### العلاقات

- كل مركبة تنتمي إلى محطة
- كل مركبة لها سجلات استهلاك وقود
- كل مركبة لها فواتير وقود
- المستخدمين يمكنهم إدخال سجلات الوقود

## API Endpoints

### المركبات
- `GET /api/vehicles` - قائمة المركبات
- `POST /api/vehicles` - إضافة مركبة جديدة
- `GET /api/vehicles/{id}` - تفاصيل مركبة
- `PUT /api/vehicles/{id}` - تحديث مركبة
- `DELETE /api/vehicles/{id}` - حذف مركبة

### سجلات الوقود
- `GET /api/fuel-logs` - قائمة سجلات الوقود
- `POST /api/fuel-logs` - إضافة سجل وقود جديد
- `GET /api/fuel-logs/{id}` - تفاصيل سجل وقود
- `PUT /api/fuel-logs/{id}` - تحديث سجل وقود
- `DELETE /api/fuel-logs/{id}` - حذف سجل وقود

### الفواتير
- `GET /api/invoices` - قائمة الفواتير
- `POST /api/invoices` - إضافة فاتورة جديدة
- `GET /api/invoices/{id}` - تفاصيل فاتورة
- `PUT /api/invoices/{id}` - تحديث فاتورة
- `DELETE /api/invoices/{id}` - حذف فاتورة

### المخزون
- `GET /api/inventory/current` - المخزون الحالي
- `GET /api/inventory/history` - تاريخ المخزون
- `POST /api/inventory/update` - تحديث المخزون

### التقارير
- `GET /api/reports/vehicles` - تقرير المركبات
- `GET /api/reports/generators` - تقرير المولدات
- `GET /api/reports/inventory` - تقرير المخزون
- `GET /api/reports/financial` - التقرير المالي

## استكشاف الأخطاء

### مشاكل الاتصال بقاعدة البيانات

1. **تأكد من تثبيت PHP OCI8**:
```bash
php -m | grep oci
```

2. **تأكد من إعدادات الاتصال**:
```bash
php artisan tinker --execute="DB::connection()->getPdo();"
```

3. **تأكد من صحة بيانات الاتصال في .env**

### مشاكل الواجهة الأمامية

1. **تأكد من تشغيل الخادم الخلفي**
2. **تأكد من إعداد VITE_API_URL في .env**
3. **تحقق من console المتصفح للأخطاء**

## الميزات المدعومة

- ✅ إدارة المركبات
- ✅ سجلات استهلاك الوقود
- ✅ فواتير الوقود
- ✅ إدارة المخزون
- ✅ المولدات
- ✅ التقارير
- ✅ إدارة المستخدمين
- ✅ نظام المصادقة
- ✅ واجهة مستخدم حديثة
- ✅ دعم اللغة العربية

## الدعم

في حالة وجود أي مشاكل، يرجى التحقق من:
1. سجلات الأخطاء في `storage/logs/laravel.log`
2. console المتصفح للأخطاء
3. إعدادات قاعدة البيانات
4. إعدادات PHP OCI8 