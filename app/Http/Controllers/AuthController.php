<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    /**
     * معالجة طلب تسجيل الدخول API
     */
    public function login(Request $request)
    {
        // تسجيل البيانات المستلمة للتشخيص
        Log::info('API Login attempt', [
            'data' => $request->all(),
            'headers' => $request->headers->all()
        ]);
        
        $request->validate([
            'username' => 'required|string|min:3',
            'password' => 'required|string|min:3',
        ], [
            'username.required' => 'اسم المستخدم مطلوب',
            'username.min' => 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل',
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون 3 أحرف على الأقل',
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        try {
            // البحث عن المستخدم في قاعدة البيانات Oracle
            $user = User::where('USER_NAME_NEW', $username)
                       ->where('USER_ACTIVE', 1)
                       ->first();
            
            // تسجيل نتيجة البحث
            Log::info('User search result', [
                'username' => $username,
                'user_found' => $user ? 'Yes' : 'No',
                'user_data' => $user ? [
                    'oid' => $user->OID,
                    'user_name_new' => $user->USER_NAME_NEW,
                    'user_active' => $user->USER_ACTIVE,
                    'user_password_exists' => !empty($user->USER_PASSWORD),
                    'user_password_length' => strlen($user->USER_PASSWORD ?? '')
                ] : null
            ]);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'اسم المستخدم غير صحيح أو المستخدم غير مفعل'
                ], 401);
            }

            // تسجيل بيانات التشخيص
            Log::info('Password comparison debug', [
                'input_password' => $password,
                'input_password_length' => strlen($password),
                'db_password' => $user->USER_PASSWORD,
                'db_password_length' => strlen($user->USER_PASSWORD ?? ''),
                'password_match' => $password === $user->USER_PASSWORD,
                'trimmed_match' => trim($password) === trim($user->USER_PASSWORD ?? ''),
                'user_id' => $user->OID
            ]);

            // التحقق من كلمة المرور (بدون تشفير)
            // استخدام trim() للتخلص من المسافات الزائدة
            if (trim($password) !== trim($user->USER_PASSWORD ?? '')) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور غير صحيحة'
                ], 401);
            }

            // إنشاء بيانات المستخدم للجلسة
            $userData = [
                'id' => $user->OID,
                'username' => $user->USER_NAME_NEW,
                'name' => $user->USER_FULL_NAME,
                'ssn' => $user->USER_SSN,
                'active' => $user->USER_ACTIVE,
                'read_only' => $user->READ_ONLY,
                'authenticated' => true
            ];

            // حفظ بيانات المستخدم في الجلسة
            $request->session()->put('user', $userData);

            // إنشاء token
            $token = 'oracle-token-' . base64_encode($user->OID . ':' . time());

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'user' => $userData
                ],
                'message' => 'تم تسجيل الدخول بنجاح'
            ]);

        } catch (\Exception $e) {
            Log::error('Login error', [
                'error' => $e->getMessage(),
                'username' => $username
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تسجيل الدخول: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تسجيل خروج المستخدم
     */
    public function logout(Request $request)
    {
        // حذف بيانات المستخدم من الجلسة
        $request->session()->forget('user');
        
        // إلغاء الجلسة وإعادة توليدها
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    /**
     * التحقق من حالة المصادقة
     */
    public function checkAuth(Request $request)
    {
        $user = $request->session()->get('user');
        
        if (!$user || !isset($user['authenticated']) || !$user['authenticated']) {
            return response()->json(['authenticated' => false], 200);
        }

        return response()->json(['authenticated' => true, 'user' => $user], 200);
    }

    /**
     * الحصول على بيانات المستخدم الحالي
     */
    public function user(Request $request)
    {
        $user = $request->session()->get('user');
        
        if (!$user || !$user['authenticated']) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return response()->json($user);
    }
}