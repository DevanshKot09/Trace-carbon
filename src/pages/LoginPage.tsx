import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, Mail, Lock, Phone, ArrowLeft, Loader2, Sparkles, LogIn, ChevronRight } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'phone_otp' | 'forgot' | 'reset';

export default function LoginPage() {
  const { login, register, loginWithGoogle, verifyOTP, addToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resetToken, setResetToken] = useState('rst_temp');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Read URL query params e.g. /login?mode=signup
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') setMode('signup');
    else if (modeParam === 'reset') setMode('reset');
  }, [searchParams]);

  // Handle Resend OTP count timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await register(name, email, password);
        navigate('/onboarding');
      } else if (mode === 'forgot') {
        // Mock forgot trigger
        await new Promise(resolve => setTimeout(resolve, 1000));
        addToast(`Reset link simulated and emitted to ${email}! Check inbox.`, 'info');
        setMode('login');
      } else if (mode === 'reset') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        addToast('Password has been reset beautifully. Proceeding to login.', 'success');
        setMode('login');
      }
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || "Authentication request failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSocial = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || "Google Social Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      // Simulate endpoint hit
      await new Promise(resolve => setTimeout(resolve, 800));
      setOtpSent(true);
      setTimer(59);
      addToast("OTP code sent successfully (simulated)", "success");
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || "Failed to transmit OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      await verifyOTP(phone, otp);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || "Invalid OTP code entered.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-900 dark:bg-gray-900 overflow-hidden relative">
        
        {/* Absolute decoration details */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl"></div>

        {/* Back navigation */}
        {mode !== 'login' && (
          <button
            onClick={() => {
              if (otpSent && mode === 'phone_otp') {
                setOtpSent(false);
              } else {
                setMode('login');
              }
            }}
            className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </button>
        )}

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Leaf className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {mode === 'login' && 'Welcome to CarbonWise'}
            {mode === 'signup' && 'Begin your climate journey'}
            {mode === 'phone_otp' && (otpSent ? 'Confirm OTP access' : 'Phone Sign In')}
            {mode === 'forgot' && 'Reset Secure Access'}
            {mode === 'reset' && 'Choose New Password'}
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {mode === 'login' && 'Track, reduce, and balance your daily emissions.'}
            {mode === 'signup' && 'Gain access to modern trackers & gamification.'}
            {mode === 'phone_otp' && (otpSent ? `Enter the 6-digit digits sent to ${phone}` : 'Get started with instant SMS callbacks.')}
            {mode === 'forgot' && 'Provide your certified email to revive your profile settings.'}
            {mode === 'reset' && 'Please create a robust unique password combination.'}
          </p>
        </div>

        {/* Core Auth modes conditional states */}
        {mode === 'phone_otp' ? (
          /* Phone OTP Module Form */
          !otpSent ? (
            <form onSubmit={handlePhoneSendOTP} className="mt-6 space-y-4">
              <div>
                <label htmlFor="login_phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Mobile Phone Number
                </label>
                <div className="relative mt-2">
                  <Phone className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" />
                  <input
                    id="login_phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-hidden focus:border-emerald-500 focus:bg-transparent dark:border-gray-800 dark:bg-gray-950 dark:focus:bg-transparent focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-500/10 hover:bg-emerald-500 hover:shadow-emerald-500/20 flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Verification Token'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneVerifyOTP} className="mt-6 space-y-4">
              <div>
                <label htmlFor="login_otp" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Enter One-Time PIN (OTP)
                </label>
                <input
                  id="login_otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="123456"
                  className="mt-2 w-full text-center tracking-widest text-lg font-bold rounded-xl border border-gray-150 bg-gray-50/50 py-3 block text-sm outline-hidden focus:border-emerald-500 focus:bg-transparent dark:border-gray-800 dark:bg-gray-950"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-500 flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify and Access App'}
              </button>

              <div className="text-center text-xs text-gray-400">
                {timer > 0 ? (
                  <span>Resend code in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTimer(59);
                      addToast('Simulating another OTP emissions credentials code delivery.', 'info');
                    }}
                    className="text-emerald-500 hover:underline font-semibold"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )
        ) : (
          /* Email Auth login / signup / forgot forms */
          <form onSubmit={handleEmailAction} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="login_fullname" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Full Name
                </label>
                <input
                  id="login_fullname"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm outline-hidden focus:border-emerald-500 focus:bg-transparent dark:border-gray-800 dark:bg-gray-950"
                />
              </div>
            )}

            <div>
              <label htmlFor="login_email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="login_email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-hidden focus:border-emerald-500 focus:bg-transparent dark:border-gray-800 dark:bg-gray-950"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login_password" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-emerald-500 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    id="login_password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-hidden focus:border-emerald-500 focus:bg-transparent dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-500/10 hover:bg-emerald-500 hover:shadow-emerald-500/15 flex items-center justify-center gap-1 active:scale-98"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="h-4.5 w-4.5" />
                  <span>Sign In</span>
                </>
              ) : mode === 'signup' ? (
                'Create Carbon Tracker Profile'
              ) : (
                'Send Recovery Link'
              )}
            </button>
          </form>
        )}

        {/* Global Social Login Separator */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-500/10"></div>
              <span className="flex-shrink mx-4 text-xs font-medium uppercase tracking-wider text-gray-400">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-gray-500/10"></div>
            </div>

            <div className="mt-4 grid gap-3 grid-cols-2">
              {/* Simulated Elegant Google Authentication */}
              <button
                id="btn_google_login"
                onClick={handleGoogleSocial}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                {/* SVG Google Minimal Icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.411 0-6.177-2.766-6.177-6.177s2.766-6.177 6.177-6.177c1.554 0 2.964.577 4.05 1.524l3.1-3.1C18.91 1.91 15.75 1 12.24 1 6.14 1 1.24 5.9 1.24 12s4.9 11 11 11c6.35 0 10.56-4.47 10.56-10.74 0-1.03-.09-1.57-.22-1.975H12.24z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Toggle to phone OTP signup */}
              <button
                onClick={() => setMode('phone_otp')}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                <Phone className="h-4 w-4" />
                <span>Phone OTP</span>
              </button>
            </div>
          </div>
        )}

        {/* Auth Sub-mode Switch Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <p>
              New to CarbonWise?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-emerald-500 hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p>
              Already tracking emissions?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-emerald-500 hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-emerald-500 hover:underline font-semibold"
            >
              Back to general email sign-in
            </button>
          )}
        </div>

        {/* Quick Demo Assist Banner */}
        <div className="mt-6 rounded-2xl bg-amber-500/5 p-3 text-center border border-amber-500/10 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            <strong>Testing Tip:</strong> Enter any credentials. The mockup server auto-creates your sandbox!
          </span>
        </div>
      </div>
    </main>
  );
}
