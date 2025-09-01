import { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { auth } from '../lib/auth';

export function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  async function handleSubmit(e) { 
    e.preventDefault(); 
    setLoading(true); 
    setError(null); 
    
    try { 
      if (mode === 'signup') {
        await auth.signup(email, password, { autoConfirm: true });
        // Show success message for signup
        setError({ type: 'success', message: 'Account created! Please check your email to confirm your registration.' });
      } else {
        await auth.login(email, password, true);
        onAuthed(); 
        onClose();
      } 
    } catch (err) {
      console.error('Auth error:', err);
      setError({ 
        type: 'error', 
        message: err?.json?.error_description || err?.message || 'Authentication failed'
      }); 
    } finally { 
      setLoading(false);
    } 
  }
  
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="auth-modal-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="auth-modal-title" className="text-lg font-semibold text-gray-900">
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </h2>
        <button 
          className="text-sm text-brand-600 hover:underline" 
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
        >
          {mode === 'signup' ? 'Have an account? Sign in' : 'New here? Create one'}
        </button>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            autoComplete="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {error && (
          <p 
            className={`text-sm ${error.type === 'success' ? 'text-green-600' : 'text-red-600'}`} 
            role="alert"
          >
            {error.message}
          </p>
        )}
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full"
        >
          {loading ? 'Please wait…' : (mode === 'signup' ? 'Create account' : 'Sign in')}
        </Button>
      </form>
    </Dialog>
  );
}