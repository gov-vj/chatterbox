import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient.ts";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError('');
    setLoading(true);
    try {
      const {error: signInError} = await supabase.auth.signInWithPassword({email, password});
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      navigate('/chat');
    } catch (error) {
      setError('An unknown error occurred during login.');
      console.error('Login catch block error:', error);
      setLoading(false);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-3 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="h-6 mb-1"> {/* Adjust height (h-5, h-6) as needed */}
            {error && (
              <p className="text-red-500 text-xs italic">
                {error}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              required
              onChange={(ev) => setEmail(ev.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              required
              onChange={(ev) => setPassword(ev.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;