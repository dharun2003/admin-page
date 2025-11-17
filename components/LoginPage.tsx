
import React, { useState, useEffect } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedUser && rememberedPassword) {
      setUsername(rememberedUser);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would validate credentials with a backend service.
    // We'll use mock credentials for this demo.
    if (username === 'budstech' && password === '12345') {
      if (rememberMe) {
        localStorage.setItem('rememberedUser', username);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberedPassword');
      }
      onLogin();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl px-8 pt-10 pb-8 mb-4">
          <div className="mb-8 text-center">
             <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Login</h1>
             <p className="text-gray-500 mt-2">Sign in to access the admin panel.</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow-inner appearance-none border border-gray-300 bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow-inner appearance-none border border-gray-300 bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <EyeIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
            </div>
            <div className="flex items-center justify-start mb-6">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 bg-gray-100 border-gray-300 rounded text-indigo-500 focus:ring-offset-white focus:ring-2 focus:ring-indigo-500"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="ml-2">Remember me</span>
                </label>
            </div>
            {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
            <div className="flex items-center justify-between">
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
