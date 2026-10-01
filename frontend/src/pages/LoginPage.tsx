import React from 'react';
import { m } from 'framer-motion';
import { Phone, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const addToast = useUIStore(state => state.addToast);
  const setToken = useAuthStore(state => state.setToken);

  const handleGuestLogin = async () => {
    try {
      // Mock device ID for testing
      const deviceId = localStorage.getItem('device_id') || `device_${Date.now()}`;
      localStorage.setItem('device_id', deviceId);
      
      const response = await api.loginGuest(deviceId);
      setToken(response.access_token);
      if (response.user) {
        useAuthStore.getState().setUser(response.user);
      } else {
        try {
          const userData = await api.getMe();
          useAuthStore.getState().setUser(userData);
        } catch (e) {
          console.error("Failed to fetch user data for guest", e);
        }
      }
      setCurrentPage('dashboard');
    } catch (error: any) {
      console.error("Guest login failed", error);
      addToast('error', error?.response?.data?.detail || 'Guest login failed. Please try again.');
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-heading">Welcome Back</h2>
          <p className="text-body mt-2">Build Your Next Startup With AI</p>
        </div>

        <div className="space-y-4">
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentPage('login/phone')}
            className="w-full flex items-center justify-between p-4 bg-primary text-white rounded-2xl shadow-soft-hover transition-all"
          >
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Continue with Phone Number</span>
            </div>
          </m.button>

          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentPage('login/email')}
            className="w-full flex items-center justify-between p-4 bg-secondary text-white rounded-2xl shadow-soft-hover transition-all"
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Continue with Email</span>
            </div>
          </m.button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-muted">Or</span>
            </div>
          </div>

          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center p-4 bg-white text-heading border border-border rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-muted" />
              <span className="font-medium">Continue as Guest</span>
            </div>
          </m.button>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted flex flex-col space-y-2">
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <span>Version 1.0.0</span>
        </div>
      </m.div>
    </div>
  );
};
