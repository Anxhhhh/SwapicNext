'use client';
import { useState } from 'react';
import {
  Repeat, Mail, Lock, Eye, EyeOff, ArrowRight,
  ArrowLeft, Users, Leaf, ShoppingCart, Tag, Home
} from 'lucide-react';

/* ─────────────────── Types ─────────────────── */
type Mode = 'signin' | 'signup';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithGoogle, auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
/* ─────────────────── Google / Apple SVG icons ─────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96l3.007 2.332C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M13.173 9.438c-.013-1.787.977-2.693 1.007-2.72-1.1-1.607-2.808-1.827-3.41-1.847-1.447-.147-2.837.853-3.573.853-.737 0-1.867-.833-3.073-.807-1.573.027-3.027.92-3.833 2.327-1.64 2.84-.42 7.053 1.167 9.36.78 1.12 1.707 2.373 2.92 2.327 1.173-.047 1.62-.753 3.04-.753 1.42 0 1.82.753 3.067.727 1.26-.02 2.06-1.14 2.833-2.267.893-1.3 1.26-2.56 1.28-2.627-.027-.013-2.453-.94-2.473-3.713l.048.14z"/>
    <path d="M11.647 3.8c.647-.787 1.08-1.873.96-2.967-.927.04-2.053.62-2.72 1.407-.593.693-1.113 1.807-.973 2.867 1.04.08 2.08-.527 2.733-1.307z"/>
  </svg>
);

/* ─────────────────── Left Panel ─────────────────── */
const LeftPanel = () => (
  <div
    className="hidden lg:flex flex-col justify-between relative overflow-hidden"
    style={{
      background: '#2C1505',
      minHeight: '100vh',
      width: '48%',
      flexShrink: 0,
    }}
  >
    {/* Background image */}
    <img
      src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&fit=crop&q=80"
      alt="cozy workspace"
      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #35190F 0%, rgba(35,12,3,0.85) 60%, rgba(35,12,3,0.7) 100%)' }} />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full p-10 justify-between">

      {/* Top: Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/15 p-2 rounded-lg">
            <Repeat size={20} className="text-white stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-[1.2rem] text-white tracking-wide">SWAPIC</span>
        </div>

        {/* Handwritten top-right */}
        <div
          className="text-right select-none"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.1rem',
            color: '#F5C088',
            lineHeight: 1.2,
          }}
        >
          <div>Sustainable</div>
          <div>Choices</div>
          <div>Brighter</div>
          <div>Tomorrows</div>
          <svg width="90" height="10" viewBox="0 0 90 10" fill="none" style={{ marginTop: 3 }}>
            <path d="M2 5 C25 1 65 1 88 5" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Middle: Headline */}
      <div className="my-auto py-12">
        <h1 className="text-[2.8rem] font-extrabold text-white leading-[1.15] mb-4">
          Trade what you have,{' '}
          <span className="text-[#E96B16]">get what you need.</span>
        </h1>
        <p className="text-white/70 text-[1rem] mb-10 leading-relaxed">
          Buy, sell, rent or barter — one marketplace,<br />four ways to transact.
        </p>

        {/* Feature icons */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: <ShoppingCart size={20} strokeWidth={2} />, label: 'Buy', sub: 'Find what you need' },
            { icon: <Tag size={20} strokeWidth={2} />, label: 'Sell', sub: 'Give your items a new home' },
            { icon: <Home size={20} strokeWidth={2} />, label: 'Rent', sub: 'Use without buying' },
            { icon: <Users size={20} strokeWidth={2} />, label: 'Barter', sub: 'Exchange with community' },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-center text-center gap-2 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="text-white/80">{f.icon}</div>
              <span className="text-white font-bold text-[13px]">{f.label}</span>
              <span className="text-white/55 text-[11px] leading-tight">{f.sub}</span>
            </div>
          ))}
        </div>

        {/* Sustainability badge */}
        <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm w-fit">
          <Leaf size={18} className="text-[#5FAD74] shrink-0" strokeWidth={2.5} />
          <span className="text-white/80 text-[13.5px] font-medium">A more sustainable tomorrow, together.</span>
        </div>
      </div>

      {/* Bottom: empty space for image breathing room */}
      <div />
    </div>
  </div>
);

/* ─────────────────── Sign In Form ─────────────────── */
const SignInForm = ({ onSwitch, onLogin }: { onSwitch: () => void, onLogin?: () => void }) => {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      const res = await api.post('/auth/firebase', { idToken });
      login(res.data, res.data.token);
      toast.success('Successfully logged in with Google!');
      if (onLogin) onLogin();
    } catch (err: any) {
      toast.error("DEBUG: " + (err.response?.data?.message || err.message || 'Google Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async (demoEmail: string = 'aarav@swapic.app') => {
    setLoading(true);
    try {
      const res = await api.post('/auth/demo-login', { email: demoEmail });
      login(res.data, res.data.token);
      toast.success(`Welcome back, ${res.data.name}!`);
      if (onLogin) onLogin();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setLoading(true);
    try {
      // If it's the demo account, we can go directly to demo-login for instant access
      if (email.includes('demo') || email.includes('swapic.app')) {
        await handleDemoQuickLogin(email);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const res = await api.post('/auth/firebase', { idToken });
      login(res.data, res.data.token);
      toast.success('Successfully logged in!');
      if (onLogin) onLogin();
    } catch (err: any) {
      // Fallback for demo credentials or mock test
      if (email.includes('swapic.app') || email === 'aarav@swapic.app' || email === 'admin@swapic.app') {
        try {
          await handleDemoQuickLogin(email);
          return;
        } catch (e) {
          // ignore fallback error and show original
        }
      }
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[2rem] font-extrabold text-[#35190F] mb-1">Sign in</h2>
      <p className="text-[#8c6e5d] text-[14.5px] mb-7">Welcome back to SWAPIC.</p>

      {/* Email */}
      <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">Email or username</label>
      <div className="flex items-center border border-[#ddd5c8] rounded-xl px-3.5 py-3 mb-4 focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all bg-white">
        <Mail size={16} className="text-gray-400 mr-2.5 shrink-0" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 bg-transparent outline-none text-[14px] text-[#35190F] placeholder:text-gray-400"
        />
      </div>

      {/* Password */}
      <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">Password</label>
      <div className="flex items-center border border-[#ddd5c8] rounded-xl px-3.5 py-3 mb-4 focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all bg-white">
        <Lock size={16} className="text-gray-400 mr-2.5 shrink-0" />
        <input
          type={showPass ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="flex-1 bg-transparent outline-none text-[14px] text-[#35190F] placeholder:text-gray-400"
        />
        <button onClick={() => setShowPass(s => !s)} className="text-gray-400 hover:text-[#35190F] transition-colors ml-2">
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="w-4 h-4 rounded accent-[#E96B16] cursor-pointer"
          />
          <span className="text-[13.5px] text-[#654332]">Remember me</span>
        </label>
        <a href="#" className="text-[13.5px] text-[#E96B16] font-semibold hover:underline">Forgot password?</a>
      </div>

      {/* Sign in button */}
      <button disabled={loading} onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 bg-[#35190F] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#E96B16] hover:shadow-[0_4px_20px_rgba(233,107,22,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mb-5 disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? 'Signing in...' : 'Sign in'}
        {!loading && <ArrowRight size={17} strokeWidth={2.5} />}
      </button>

      {/* OR divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[#ede8e1]" />
        <span className="text-[12px] text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-[#ede8e1]" />
      </div>

      {/* Social buttons */}
      <div className="flex gap-3 mb-6">
        <button onClick={handleGoogleSignIn} disabled={loading} type="button" className="flex-1 flex items-center justify-center gap-2.5 border border-[#ddd5c8] rounded-xl py-3 text-[13.5px] font-semibold text-[#35190F] hover:bg-[#FAF7F2] hover:border-[#c8b8a8] transition-all">
          <GoogleIcon /> Continue with Google
        </button>
        <button className="flex-1 flex items-center justify-center gap-2.5 border border-[#ddd5c8] rounded-xl py-3 text-[13.5px] font-semibold text-[#35190F] hover:bg-[#FAF7F2] hover:border-[#c8b8a8] transition-all">
          <AppleIcon /> Continue with Apple
        </button>
      </div>

      {/* Switch to signup */}
      <p className="text-[13.5px] text-[#654332] mb-6">
        New here?{' '}
        <button onClick={onSwitch} className="text-[#E96B16] font-bold hover:underline">
          Create an account
        </button>
      </p>

      {/* Demo credentials */}
      <div className="bg-[#FAF7F2] border border-[#ede8e1] rounded-xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E96B16]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Users size={14} className="text-[#E96B16]" />
          </div>
          <div className="text-[12px] text-[#654332] leading-relaxed flex-1">
            <span className="font-semibold text-[#35190F]">Demo:</span> aarav@swapic.app / demo123<br />
            <span className="font-semibold text-[#35190F]">Admin:</span> admin@swapic.app / admin123
          </div>
        </div>
        <div className="flex gap-2 pt-1 border-t border-[#ede8e1]">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoQuickLogin('aarav@swapic.app')}
            className="flex-1 bg-white hover:bg-[#E96B16] hover:text-white text-[#35190F] border border-[#ddd5c8] hover:border-[#E96B16] text-[12px] font-bold py-1.5 px-2.5 rounded-lg transition-all text-center"
          >
            ⚡ Quick Demo Login
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoQuickLogin('admin@swapic.app')}
            className="flex-1 bg-white hover:bg-[#35190F] hover:text-white text-[#35190F] border border-[#ddd5c8] hover:border-[#35190F] text-[12px] font-bold py-1.5 px-2.5 rounded-lg transition-all text-center"
          >
            🛡️ Admin Login
          </button>
        </div>
      </div>
    </>
  );
};

/* ─────────────────── Sign Up Form ─────────────────── */
const SignUpForm = ({ onSwitch, onLogin }: { onSwitch: () => void, onLogin?: () => void }) => {
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      const res = await api.post('/auth/firebase', { idToken });
      login(res.data, res.data.token);
      toast.success('Account created with Google!');
      if (onLogin) onLogin();
    } catch (err: any) {
      toast.error("DEBUG: " + (err.response?.data?.message || err.message || 'Google Auth failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const idToken = await userCredential.user.getIdToken();
      const res = await api.post('/auth/firebase', { idToken });
      login(res.data, res.data.token);
      toast.success('Account created successfully!');
      if (onLogin) onLogin();
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[2rem] font-extrabold text-[#35190F] mb-1">Create account</h2>
      <p className="text-[#8c6e5d] text-[14.5px] mb-7">Join the SWAPIC community today.</p>

      {/* Full name */}
      <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">Full name</label>
      <div className="flex items-center border border-[#ddd5c8] rounded-xl px-3.5 py-3 mb-4 focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all bg-white">
        <Users size={16} className="text-gray-400 mr-2.5 shrink-0" />
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="flex-1 bg-transparent outline-none text-[14px] text-[#35190F] placeholder:text-gray-400" />
      </div>

      {/* Email */}
      <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">Email</label>
      <div className="flex items-center border border-[#ddd5c8] rounded-xl px-3.5 py-3 mb-4 focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all bg-white">
        <Mail size={16} className="text-gray-400 mr-2.5 shrink-0" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-transparent outline-none text-[14px] text-[#35190F] placeholder:text-gray-400" />
      </div>

      {/* Password */}
      <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">Password</label>
      <div className="flex items-center border border-[#ddd5c8] rounded-xl px-3.5 py-3 mb-4 focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all bg-white">
        <Lock size={16} className="text-gray-400 mr-2.5 shrink-0" />
        <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="flex-1 bg-transparent outline-none text-[14px] text-[#35190F] placeholder:text-gray-400" />
        <button onClick={() => setShowPass(s => !s)} className="text-gray-400 hover:text-[#35190F] transition-colors ml-2">
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* T&C */}
      <label className="flex items-start gap-2 mb-6 cursor-pointer">
        <input type="checkbox" className="mt-0.5 w-4 h-4 rounded accent-[#E96B16] cursor-pointer" />
        <span className="text-[13px] text-[#654332] leading-snug">
          I agree to the{' '}
          <a href="#" className="text-[#E96B16] font-semibold hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-[#E96B16] font-semibold hover:underline">Privacy Policy</a>
        </span>
      </label>

      {/* Create button */}
      <button disabled={loading} onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 bg-[#35190F] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#E96B16] hover:shadow-[0_4px_20px_rgba(233,107,22,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mb-5 disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? 'Creating...' : 'Create account'}
        {!loading && <ArrowRight size={17} strokeWidth={2.5} />}
      </button>

      {/* OR divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[#ede8e1]" />
        <span className="text-[12px] text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-[#ede8e1]" />
      </div>

      {/* Social */}
      <div className="flex gap-3 mb-6">
        <button onClick={handleGoogleSignIn} disabled={loading} type="button" className="flex-1 flex items-center justify-center gap-2.5 border border-[#ddd5c8] rounded-xl py-3 text-[13.5px] font-semibold text-[#35190F] hover:bg-[#FAF7F2] hover:border-[#c8b8a8] transition-all">
          <GoogleIcon /> Continue with Google
        </button>
        <button className="flex-1 flex items-center justify-center gap-2.5 border border-[#ddd5c8] rounded-xl py-3 text-[13.5px] font-semibold text-[#35190F] hover:bg-[#FAF7F2] hover:border-[#c8b8a8] transition-all">
          <AppleIcon /> Continue with Apple
        </button>
      </div>

      {/* Switch to signin */}
      <p className="text-[13.5px] text-[#654332]">
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-[#E96B16] font-bold hover:underline">Sign in</button>
      </p>
    </>
  );
};

/* ─────────────────── Main Page ─────────────────── */
const LoginPage = ({ onBack }: { onBack?: () => void }) => {
  const [mode, setMode] = useState<Mode>('signin');

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left panel */}
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-white min-h-screen overflow-y-auto">

        {/* Back to home */}
        <div className="flex justify-end p-6 pb-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[13.5px] font-medium text-[#654332] hover:text-[#35190F] transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-10 py-8 max-w-[460px] mx-auto w-full">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="bg-[#35190F] p-1.5 rounded-lg text-white">
              <Repeat size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-[1.1rem] text-[#35190F] tracking-wide">SWAPIC</span>
          </div>

          {mode === 'signin'
            ? <SignInForm onSwitch={() => setMode('signup')} onLogin={onBack} />
            : <SignUpForm onSwitch={() => setMode('signin')} onLogin={onBack} />
          }
        </div>

        {/* Bottom-right handwritten deco */}
        <div
          className="self-end p-6 select-none pointer-events-none hidden lg:block"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.1rem',
            color: '#35190F',
            lineHeight: 1.2,
            transform: 'rotate(4deg)',
          }}
        >
          <div>Swap</div>
          <div>for a</div>
          <div>Brighter</div>
          <div>Tomorrow</div>
          <svg width="80" height="10" viewBox="0 0 80 10" fill="none" style={{ marginTop: 3 }}>
            <path d="M2 5 C22 1 58 1 78 5" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

