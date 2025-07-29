'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import rawCourses from '../../../data/full_data.json';

interface CourseData {
      country_codes: { name: string; code: string}[];
    }

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
    const courses = rawCourses as CourseData;
    const countryCodes = courses.country_codes || [];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validateEmail = (value: string) => {
    return value.trim() !== '' && value.includes('@');
  };

  const validateMobile = (value: string) => {
    return value.length === 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   const newErrors: { [key: string]: string } = {};

if(loginMethod === 'email'){
  if(!validateEmail(email)){
    newErrors.email = 'Valid email is required';
  }
} else{
  if(!validateMobile(mobile)){
         newErrors.mobile = 'Valid 10-digit mobile number required';
  }
}   

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
     
      return;
    }
    const identifier = loginMethod === 'email' ? email : countryCode + mobile;

    try {
      const response = await fetch('http://localhost:5000/login/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      sessionStorage.setItem('userId', data.userId);
      router.push('/application');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };



  {/*styling -----------------*/}

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    
      <div className='w-full md:w-1/2 bg-blue-950 min-h-[300px] md:min-h-screen overflow-hidden flex flex-col items-center justify-start pt-20 md:items-center md:justify-center md:pt-20 px-4 md:px-0 relative md:static'>
    <div className='absolute bottom-0 left-0 w-32 h-16 md:w-74 md:h-44 bg-blue-700 rounded-full blur-3xl opacity-30'></div>

    <div className='text-white w-full px-2 md:px-4'> 
      <p className='text-2xl md:text-5xl font-bold font-serif leading-snug md:leading-loose text-blue-100 text-left'>
        Advance your knowledge, refine your skills, and shape the future
      
      </p>
    </div>
    </div>

{/*rigjt side ---------------------------------*/}

<div className='w-full md:w-1/2 md:ml-auto bg-blue-50 min-h-screen h-full md:h-screen overflow-y-auto flex items-start md:items-center justify-center md:static' style={{marginLeft: '0', minHeight: '100vh' }}>
<div className='w-full max-w-md px-4 md:px-0 py-8 md:py-0 flex-col'>

      <div
        className="max-w-md w-full rounded-lg"
       >
        <h1 className="text-2xl md:text-3xl font-bold font-sans mb-6 text-center text-black">
          Sign In
        </h1>

{/*email or mobile btn */}
        <div className="flex justify-center mb-4 gap-4">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`px-4 py-2 rounded text-black border ${
              loginMethod === 'email' ? 'bg-blue-700 text-white' : 'bg-blue-100'
            }`}
          >
            Email
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMethod('mobile');
              setErrors({});
              setError('');
            }}
            className={`px-4 py-2 rounded text-black border ${
              loginMethod === 'mobile' ? 'bg-blue-700 text-white'  : 'bg-blue-100'
            }`}
          >
            Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === 'email' ? (
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="border border-gray-300 text-black p-2 w-full rounded"
                value={email}
                onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    if (value.trim() !== '' && value.includes('@')) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.email;
                        return copy;
                      });
                    }
                    setError('');
                  }}
                  onBlur={() => {
                    if (!email.trim() || !email.includes('@')) {
                      setErrors((prev) => ({
                        ...prev,
                        email: 'Valid email is required',
                      }));
                    }
                  }}
                  placeholder="xxxx@gmail.com"
                  
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>
          ) : (
            <div>
  <label htmlFor="mobile" className="block mb-1 font-semibold text-black">
    Mobile Number
  </label>
  <div className="flex">
    <select
      value={countryCode}
      onChange={(e) => setCountryCode(e.target.value)}
      className="h-10 w-24 rounded-l border border-r-0 border-gray-300 px-2 py-2 text-black"
      aria-label="Select country code"
    >
      {countryCodes.map(({ name, code }) => (
        <option key={code} value={code}>
          {code} {name}
        </option>
      ))}
    </select>
    <input
      id="mobile"
      type="tel"
      className="flex-1 h-10 rounded-r text-black border border-gray-300 px-3 py-2"
      value={mobile}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobile(val);
        if (validateMobile(val)) {
          setErrors((prev) => {
            const copy = { ...prev };
            delete copy.mobile;
            return copy;
          });
        }
        setError('');
      }}
      onBlur={() => {
        if (!validateMobile(mobile)) {
          setErrors((prev) => ({
            ...prev,
            mobile: 'Valid 10-digit mobile number required',
          }));
        }
      }}
      placeholder="Enter mobile number"
    />
  </div>
  {errors.mobile && (
    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
  )}
</div>

            
          )}

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-black">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full h-10 rounded border border-gray-300 text-black px-3 py-2"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.trim() !== ''){
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.password;
                      return copy;
                    });
                    setError('');
                  }
                }}

                onBlur = {() => {
                  if(password.trim() === ''){
                    setErrors((prev) => ({
                      ...prev,
                      password: 'Password is required'
                    }));
                  }
                }}
                
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
            )}
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            className="transition-all duration-100 ease-in bg-blue-700 mt-2 text-white py-2 w-full rounded border border-blue-800 shadow-sm shadow-blue-700 hover:bg-blue-600 transform hover:scale-105"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-black">
          Don’t have an account?{' '}
          <Link href="/" className="text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
   </div>
   </div>
  );
}
