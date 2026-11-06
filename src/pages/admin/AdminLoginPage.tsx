import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, brand } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@abayaattire.com');
  const [password, setPassword] = useState('luxury2026');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. You can click "Fill Demo Credentials" below.');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@abayaattire.com');
    setPassword('luxury2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#171614] text-[#F8F6F1] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Silhouette */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/images/collections/atelier-hero.png"
          alt="Atelier background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#171614]/80" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto my-auto space-y-8">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#B69A70] font-semibold block mb-1">
              Atelier Management Portal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl tracking-widest text-[#F8F6F1] uppercase">
              {brand.brandName}
            </h1>
          </Link>
          <p className="text-xs text-[#E8DFD2]/60 font-light">
            Restricted Haute Couture Administration & Inventory Ledger
          </p>
        </div>

        {/* Demo Authentication Banner */}
        <div className="bg-[#B69A70]/15 border border-[#B69A70]/40 p-3.5 text-xs text-[#E8DFD2] space-y-1">
          <div className="flex items-center space-x-1.5 font-medium text-[#B69A70]">
            <AlertCircle className="w-4 h-4" />
            <span>Frontend Prototype Auth</span>
          </div>
          <p className="text-[11px] text-[#E8DFD2]/70 font-light leading-relaxed">
            Authentication is simulated locally via LocalStorage. It will be wired to Node.js/PostgreSQL sessions upon deployment.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-[#1D1C1A] border border-[#B69A70]/20 p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#E8DFD2]/80 uppercase tracking-wider text-[10px] mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abayaattire.com"
                  className="w-full bg-[#171614] border border-[#F8F6F1]/20 p-3 pl-9 text-xs text-white focus:outline-hidden focus:border-[#B69A70]"
                />
                <Mail className="w-4 h-4 text-[#B69A70] absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[#E8DFD2]/80 uppercase tracking-wider text-[10px] mb-1">
                Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#171614] border border-[#F8F6F1]/20 p-3 pl-9 text-xs text-white focus:outline-hidden focus:border-[#B69A70]"
                />
                <Lock className="w-4 h-4 text-[#B69A70] absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B69A70] hover:bg-[#A0835B] text-[#171614] py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>Authenticate Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Fill Demo button */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] text-[#B69A70] hover:text-white underline underline-offset-2 transition-colors"
            >
              Autofill Demo Credentials (admin@abayaattire.com / luxury2026)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-white/40">
          <Link to="/" className="hover:text-[#B69A70] transition-colors">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>

      <div className="relative z-10 text-center text-[11px] text-white/40">
        AlisTech Modular Commerce Architecture • Staff Access Only
      </div>
    </div>
  );
};
