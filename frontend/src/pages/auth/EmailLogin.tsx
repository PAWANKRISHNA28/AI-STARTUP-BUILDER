import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const EmailLogin: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setToken = useAuthStore(state => state.setToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.loginEmail(data.email, data.password);
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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
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
          onClick={() => setCurrentPage('login')}
          className="text-muted hover:text-heading flex items-center space-x-2 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-3xl font-display font-bold text-heading mb-2">Welcome Back</h2>
        <p className="text-body mb-8">Sign in with your email to continue</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-heading mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input 
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-heading">Password</label>
              <button type="button" className="text-sm text-primary hover:text-primary-hover font-medium">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input 
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="rounded text-primary focus:ring-primary h-4 w-4 border-border" />
            <label htmlFor="remember" className="ml-2 text-sm text-body">Remember me</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium shadow-soft-hover"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-center text-body text-sm">
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentPage('register')}
            className="text-primary hover:text-primary-hover font-medium">
            Create account
          </button>
        </p>
      </m.div>
    </div>
  );
};
