import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Patron Registration | TITANOVA Haute Horlogerie';
    window.scrollTo(0, 0);

    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name.trim(), email.trim(), password);
      if (res.success) {
        setSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/login?registered=true', { replace: true });
        }, 800);
      } else {
        setError(res.error || 'Failed to create your patron account.');
      }
    } catch {
      setError('Could not reach the registration server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-gold-500 selection:text-white">
      <div className="w-full max-w-4xl bg-[#14151a] border border-[#2e281b] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
        
        {/* Left Side: Brand Visual & Horological Heritage */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#181920] to-[#0c0d10] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#2a2416]">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gold-400 tracking-[0.3em] uppercase block">
              MAISON D'HORLOGERIE
            </span>
            <Link
              to="/"
              className="inline-block font-serif text-3xl sm:text-4xl text-white font-bold tracking-[0.2em] hover:text-gold-400 transition-colors"
            >
              TITANOVA
            </Link>
            <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">
              Register your patronage to access bespoke timepieces, digital certificates of authenticity, and private atelier showcases.
            </p>
          </div>

          <div className="my-8 flex justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/20 to-gold-400/5 rounded-2xl blur-lg transition duration-700" />
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#0c0d10] border border-[#382f1b] p-3 flex items-center justify-center overflow-hidden shadow-2xl">
                <img
                  src="/images/watches/men-1.jpg"
                  alt="TITANOVA Timepiece"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#262015]">
            <div className="flex items-center gap-2 text-[11px] text-gold-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Complimentary Insured Shipping Across India</span>
            </div>
            <p className="text-[10px] text-[#737373]">
              Private concierge assistance available for all registered clients.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gold-600 uppercase tracking-[0.25em] block">
                NEW PATRON REGISTRATION
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
                Create Your Account
              </h1>
              <p className="text-xs text-charcoal-500 font-light">
                Please enter your information to register with the TITANOVA Maison.
              </p>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2 animate-fade-in" role="alert">
                <span className="font-semibold">Notice:</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Notice */}
            {success && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in" role="status">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Maya Deshmukh"
                    className="w-full pl-10 pr-4 py-2.5 border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-charcoal-950 focus:ring-1 focus:ring-charcoal-950 transition-colors rounded-md bg-white text-charcoal-900"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-charcoal-950 focus:ring-1 focus:ring-charcoal-950 transition-colors rounded-md bg-white text-charcoal-900"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Password (Minimum 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-charcoal-950 focus:ring-1 focus:ring-charcoal-950 transition-colors rounded-md bg-white text-charcoal-900"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 transition-colors cursor-pointer p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 border border-charcoal-300 text-xs sm:text-sm focus:outline-none focus:border-charcoal-950 focus:ring-1 focus:ring-charcoal-950 transition-colors rounded-md bg-white text-charcoal-900"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 transition-colors cursor-pointer p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer rounded-md shadow-md mt-2"
              >
                <span>{loading ? 'Registering Patron...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-charcoal-500 border-t border-charcoal-100 pt-5">
              <span>Already registered? </span>
              <Link
                to="/login"
                className="font-semibold text-charcoal-950 hover:text-gold-600 transition-colors underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
