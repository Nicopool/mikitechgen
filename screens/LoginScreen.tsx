import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { UserRole } from '../types';
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { demoLogin } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const m = params.get('mode');
        if (m === 'register' || m === 'forgot' || m === 'login') {
            setMode(m as any);
        }
    }, [location]);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<UserRole>('USER');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    // Password strength validation
    const getPasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const passedChecks = Object.values(checks).filter(Boolean).length;

        return {
            checks,
            score: passedChecks,
            strength: passedChecks <= 2 ? 'weak' : passedChecks <= 3 ? 'medium' : passedChecks <= 4 ? 'good' : 'strong'
        };
    };

    const passwordStrength = mode === 'register' ? getPasswordStrength(pass) : null;

    const notify = (text: string, type: 'success' | 'error' | 'info') => {
        setMsg({ text, type });
        setTimeout(() => setMsg(null), 4000);
    };

    const handleLogin = async () => {
        setLoading(true);

        // Try demo login first
        const demoSuccess = await demoLogin(email, pass);

        if (demoSuccess) {
            notify('¡Bienvenido de nuevo!', 'success');

            // Navigate based on email/role
            setTimeout(() => {
                if (email === 'admin@mikitech.com') {
                    navigate('/admin');
                } else if (email === 'proveedor@mikitech.com') {
                    navigate('/supplier');
                } else {
                    navigate('/dashboard');
                }
            }, 500);

            setLoading(false);
            return;
        }

        // Try Supabase login
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
            notify(error.message === 'Invalid login credentials' ? 'Credenciales inválidas' : error.message, 'error');
            setLoading(false);
        } else {
            notify('¡Bienvenido de nuevo!', 'success');
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !pass) {
            notify('Por favor completa todos los campos', 'error');
            return;
        }

        // Validate password strength
        if (passwordStrength && passwordStrength.score < 3) {
            notify('La contraseña debe cumplir al menos 3 requisitos de seguridad', 'error');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: { name, role }
            }
        });

        if (error) {
            notify(error.message, 'error');
            setLoading(false);
            return;
        }

        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').upsert([
                { id: data.user.id, email, name, role, status: 'ACTIVE' }
            ]);

            if (profileError) {
                notify('Cuenta creada, pero error de perfil: ' + profileError.message, 'error');
            } else {
                notify('Email de verificación enviado. Revisa tu bandeja de entrada.', 'success');
                setMode('login');
            }
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) notify(error.message, 'error');
        else notify('Enlace de recuperación enviado.', 'success');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Toast Notification */}
            {msg && (
                <div className={`fixed top-8 right-8 z-[200] px-6 py-4 shadow-2xl border-2 flex items-center gap-3 animate-in slide-in-from-right-4 duration-300 ${msg.type === 'success' ? 'bg-black text-white border-black' :
                    msg.type === 'error' ? 'bg-white text-red-600 border-red-200' :
                        'bg-white text-gray-900 border-gray-200'
                    }`}>
                    {msg.type === 'success' && <Check size={18} />}
                    {msg.type === 'error' && <AlertCircle size={18} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{msg.text}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Left Side - Form */}
                <div className="flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-baseline mb-12 group">
                            <span className="text-2xl font-black tracking-tighter font-display">MIKI</span>
                            <span className="text-2xl font-light tracking-tighter font-display ml-px">tech.</span>
                        </Link>

                        {/* Title */}
                        <div className="mb-12">
                            <h1 className="text-4xl lg:text-5xl font-display font-black uppercase tracking-tight mb-4">
                                {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar Acceso'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {mode === 'login' ? 'Accede a tu cuenta de Mikitech' :
                                    mode === 'register' ? 'Únete a la comunidad de profesionales' :
                                        'Te enviaremos un enlace de recuperación'}
                            </p>
                        </div>

                        {/* Demo Credentials Panel */}
                        {mode === 'login' && (
                            <div className="mb-8 p-6 bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-[#ff3b30] rounded-full animate-pulse"></div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Modo Demo - Credenciales de Prueba</p>
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center justify-between p-3 bg-white border border-gray-100">
                                        <div>
                                            <p className="font-bold text-black">Admin</p>
                                            <p className="text-gray-500">admin@mikitech.com</p>
                                        </div>
                                        <code className="px-2 py-1 bg-gray-100 font-mono text-[10px]">admin123</code>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white border border-gray-100">
                                        <div>
                                            <p className="font-bold text-black">Proveedor</p>
                                            <p className="text-gray-500">proveedor@mikitech.com</p>
                                        </div>
                                        <code className="px-2 py-1 bg-gray-100 font-mono text-[10px]">proveedor123</code>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white border border-gray-100">
                                        <div>
                                            <p className="font-bold text-black">Cliente</p>
                                            <p className="text-gray-500">cliente@mikitech.com</p>
                                        </div>
                                        <code className="px-2 py-1 bg-gray-100 font-mono text-[10px]">cliente123</code>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-6">
                            {mode === 'register' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        className="w-full px-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full px-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            {mode !== 'forgot' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 pr-12 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium"
                                            value={pass}
                                            onChange={e => setPass(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator (only in register mode) */}
                                    {mode === 'register' && pass && passwordStrength && (
                                        <div className="mt-4 space-y-3">
                                            {/* Strength Bar */}
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 flex-1 transition-all ${level <= passwordStrength.score
                                                            ? passwordStrength.strength === 'weak' ? 'bg-red-500'
                                                                : passwordStrength.strength === 'medium' ? 'bg-yellow-500'
                                                                    : passwordStrength.strength === 'good' ? 'bg-blue-500'
                                                                        : 'bg-green-500'
                                                            : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Strength Label */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                                    Seguridad:
                                                </span>
                                                <span className={`text-xs font-bold uppercase tracking-wider ${passwordStrength.strength === 'weak' ? 'text-red-600'
                                                    : passwordStrength.strength === 'medium' ? 'text-yellow-600'
                                                        : passwordStrength.strength === 'good' ? 'text-blue-600'
                                                            : 'text-green-600'
                                                    }`}>
                                                    {passwordStrength.strength === 'weak' ? 'Débil'
                                                        : passwordStrength.strength === 'medium' ? 'Media'
                                                            : passwordStrength.strength === 'good' ? 'Buena'
                                                                : 'Fuerte'}
                                                </span>
                                            </div>

                                            {/* Requirements Checklist */}
                                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                                                    Requisitos:
                                                </p>
                                                {[
                                                    { key: 'length', label: 'Mínimo 8 caracteres' },
                                                    { key: 'uppercase', label: 'Una mayúscula (A-Z)' },
                                                    { key: 'lowercase', label: 'Una minúscula (a-z)' },
                                                    { key: 'number', label: 'Un número (0-9)' },
                                                    { key: 'special', label: 'Un carácter especial (!@#$...)' }
                                                ].map((req) => (
                                                    <div key={req.key} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 flex items-center justify-center border transition-all ${passwordStrength.checks[req.key as keyof typeof passwordStrength.checks]
                                                            ? 'bg-black border-black'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {passwordStrength.checks[req.key as keyof typeof passwordStrength.checks] && (
                                                                <Check size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                        <span className={`text-xs ${passwordStrength.checks[req.key as keyof typeof passwordStrength.checks]
                                                            ? 'text-black font-medium'
                                                            : 'text-gray-400'
                                                            }`}>
                                                            {req.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode === 'register' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                        Tipo de Cuenta
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setRole('USER')}
                                            className={`py-4 text-xs font-bold uppercase tracking-widest border-2 transition-all ${role === 'USER'
                                                ? 'bg-black border-black text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                }`}
                                        >
                                            Cliente
                                        </button>
                                        <button
                                            onClick={() => setRole('VENDOR')}
                                            className={`py-4 text-xs font-bold uppercase tracking-widest border-2 transition-all ${role === 'VENDOR'
                                                ? 'bg-black border-black text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                }`}
                                        >
                                            Proveedor
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                disabled={loading}
                                onClick={() => mode === 'login' ? handleLogin() : mode === 'register' ? handleRegister() : handleResetPassword()}
                                className="w-full py-5 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Procesando...' :
                                    mode === 'login' ? 'Iniciar Sesión' :
                                        mode === 'register' ? 'Crear Cuenta' :
                                            'Enviar Enlace'}
                            </button>

                            {/* Links */}
                            <div className="pt-6 space-y-4 border-t border-gray-100">
                                {mode === 'login' ? (
                                    <>
                                        <button
                                            onClick={() => setMode('forgot')}
                                            className="block w-full text-center text-xs font-bold uppercase text-gray-500 hover:text-black transition-all tracking-widest"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                        <div className="text-center text-xs font-bold uppercase text-gray-500 tracking-widest">
                                            ¿No tienes cuenta?{' '}
                                            <button onClick={() => setMode('register')} className="text-black hover:underline underline-offset-4">
                                                Regístrate
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setMode('login')}
                                        className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 hover:text-black transition-all tracking-widest mx-auto"
                                    >
                                        <ArrowLeft size={14} /> Volver al inicio de sesión
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image/Branding */}
                <div className="hidden lg:flex items-center justify-center bg-gray-50 p-12 relative overflow-hidden">
                    <div className="relative z-10 max-w-lg">
                        <div className="mb-12">
                            <div className="inline-block px-4 py-2 bg-white border border-gray-200 mb-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                    Plataforma Profesional
                                </span>
                            </div>
                            <h2 className="text-5xl font-display font-black uppercase tracking-tight mb-6 leading-tight">
                                Kits de Hardware <br />
                                <span className="text-gray-400">Para Profesionales</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-12">
                                Únete a más de 500 creadores, gamers y profesionales que confían en Mikitech para su infraestructura digital.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-6">
                            {[
                                'Kits optimizados y probados',
                                'Garantía extendida 12 meses',
                                'Soporte técnico especializado',
                                'Envío asegurado nacional'
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-black flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-wider">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-30"></div>
                </div>
            </div>
        </div>
    );
};
