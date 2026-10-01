import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, ArrowLeft, RefreshCw, Phone } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

export const PhoneLogin: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setToken = useAuthStore(state => state.setToken);
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.requestPhoneOTP(phoneNumber);
      setStep('otp');
      setCountdown(30);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await api.verifyPhoneOTP(phoneNumber, code);
      setToken(response.access_token);
      if (response.user) {
        useAuthStore.getState().setUser(response.user);
      } else {
        try {
          const userData = await api.getMe();
          useAuthStore.getState().setUser(userData);
        } catch (e) {
          console.error("Failed to fetch user data", e);
        }
      }
      setCurrentPage('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-8 max-w-md w-full shadow-soft"
      >
        <button 
          onClick={() => step === 'phone' ? setCurrentPage('login') : setStep('phone')}
          className="text-muted hover:text-heading flex items-center space-x-2 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-3xl font-display font-bold text-heading mb-2">
          {step === 'phone' ? 'Phone Login' : 'Verify Code'}
        </h2>
        <p className="text-body mb-8">
          {step === 'phone' 
            ? 'Enter your phone number to receive a secure login code.' 
            : `We sent a 6-digit code to ${phoneNumber}`}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">Phone Number</label>
              <div className="flex space-x-3">
                <div className="w-24 px-4 py-3 bg-white border border-border rounded-2xl flex items-center justify-center text-heading font-medium">
                  +1
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length < 10}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium shadow-soft-hover disabled:opacity-50"
            >
              <span>{loading ? 'Sending...' : 'Continue'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-between space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium shadow-soft-hover disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
            </button>

            <div className="text-center mt-6">
              {countdown > 0 ? (
                <p className="text-sm text-muted">
                  Resend code in <span className="font-medium text-heading">00:{countdown.toString().padStart(2, '0')}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestOTP}
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center justify-center space-x-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Resend Code</span>
                </button>
              )}
            </div>
          </form>
        )}
      </m.div>
    </div>
  );
};
