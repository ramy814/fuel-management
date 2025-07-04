<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * عرض صفحة تسجيل الدخول
     */
    public function showLoginForm(Request $request)
    {
        // إذا كان المستخدم مسجل دخول، توجيهه للداش بورد
        $user = $request->session()->get('user');
        if ($user && isset($user['authenticated']) && $user['authenticated']) {
            return redirect('/dashboard');
        }

        return Inertia::render('Auth/Login', [
            'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    /**
     * معالجة طلب تسجيل الدخول
     */
    public function login(Request $request)
    {
        // تسجيل البيانات المستلمة للتشخيص
        Log::info('Login attempt', [
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

        // قبول أي يوزر وكلمة مرور (للعرض التوضيحي)
        // حفظ بيانات المستخدم في الجلسة
        $request->session()->put('user', [
            'id' => rand(1, 1000), // معرف عشوائي
            'username' => $username,
            'name' => $username, // استخدام اسم المستخدم كاسم العرض
            'authenticated' => true,
            'login_time' => now(),
        ]);

        // إعادة توليد الجلسة لضمان الأمان
        $request->session()->regenerate();
        
        return redirect('/dashboard');
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