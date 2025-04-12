import React from 'react';

const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
  ev.preventDefault();
  console.log('submit');
}

const LoginPage = () => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" placeholder="Enter your email" required />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" placeholder="Enter your password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
