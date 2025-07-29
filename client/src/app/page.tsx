'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import rawCourses from '../../data/full_data.json';
import { Eye, EyeOff } from 'lucide-react';

interface CourseData {
    country_codes: { name: string; code: string }[];
}

export default function SignupPage() {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [college, setCollege] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const courses = rawCourses as CourseData;
    const countryCodes = courses.country_codes || [];
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!email.trim() || !email.includes('@')) {
            newErrors.email = 'Valid email is required';
        }

        if (!passwordRegex.test(password)) {
            newErrors.password =
                'Password must be at least 8 characters and include at least 1 number and 1 special character';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!mobileNumber || mobileNumber.length !== 10) {
            newErrors.mobileNumber = 'Valid 10-digit mobile number required';
        }

        if (!college) {
            newErrors.college = 'Please select college';
        }

        if (!district) {
            newErrors.district = 'Please select district';
        }

        if (!state) {
            newErrors.state = 'Please select state';
        }

        if (!age) {
            newErrors.age = 'Age is required';
        }

        if (!gender) {
            newErrors.gender = 'Please select gender';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {

            return;
        }

        const signupData = {
            firstName,
            surName,
            email,
            mobileNumber: countryCode + mobileNumber,
            password,
            college,
            district,
            state,
            age: Number(age),
            gender,
        };

        try {
            const res = await fetch('http://localhost:5000/signup/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Signup failed');
                return;
            }

            sessionStorage.setItem('userId', data.userId);

            router.push('/application');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };


    {/* Stylimg --------------------*/}
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
       
            <div className="w-full md:w-1/2 bg-blue-950 min-h-[300px] md:min-h-screen overflow-hidden flex flex-col items-center justify-start pt-20 md:pt-50 md:left-0 md:top-0 md:h-screen z-10 px-4 md:px-0 relative md:static">
                <div className="absolute bottom-0 left-0 w-32 h-16 md:w-74 md:h-44 bg-blue-700 rounded-full blur-3xl opacity-30"></div>
        
                <div className="text-white w-full px-2 md:px-4">
                    <p className="text-2xl md:text-5xl font-bold font-serif leading-snug md:leading-loose text-blue-100 text-left ">
                        Advance your knowledge, refine your skills, and shape the future
                    </p>
                </div>
            </div>

            {/* Right Side*/}
            <div className="w-full md:w-1/2 md:ml-auto bg-blue-50 min-h-screen h-full md:h-screen overflow-y-auto flex items-center justify-center md:static" style={{ marginLeft: '0', minHeight: '100vh' }}>
                <div className="w-full max-w-md px-4 md:px-0 py-8 md:py-0">
                    <div className="max-w-md w-full rounded-lg">
                        <h1 className="text-2xl md:text-3xl font-bold mt-10 md:mt-120 font-sans mb-6 text-center text-black">
                            Sign Up
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}

                                    placeholder="Your name here..."
                                    className="w-full h-10 rounded border text-black border-gray-300 px-3 py-2"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="surName"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    Surname
                                </label>
                                <input
                                    id="surName"
                                    type="text"
                                    value={surName}
                                    onChange={(e) => setSurName(e.target.value)}
                                    placeholder="Your surname here..."

                                    className="w-full h-10 rounded border text-black border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
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
                                    className="w-full h-10 rounded border text-black border-gray-300 px-3 py-2"
                                />
                               {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                            </div>

                            <div>
                                <label htmlFor="age" className="block mb-1 font-semibold text-black">
                                    Age
                                </label>
                                <input
                                    id="age"
                                    type="number"
                                    min={1}
                                    max={120}
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Your age here..."
                                    className="w-full h-10 rounded border text-black border-gray-300 px-3 py-2"
                                />
                                {errors.age && (
                                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    defaultValue=""
                                    className="w-full h-10 rounded border border-gray-300 px-3 py-2 text-gray-500"
                                >
                                    <option value="" disabled>
                                        Select your gender
                                    </option>
                                    <option className="text-black" value="male">
                                        Male
                                    </option>
                                    <option className="text-black" value="female">
                                        Female
                                    </option>
                                    <option className="text-black" value="other">
                                        Other
                                    </option>
                                    <option className="text-black" value="prefer_not_to_say">
                                        Prefer not to say
                                    </option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="mobileNumber"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    Mobile Number
                                </label>
                                <div className="flex">
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="h-10 w-24 rounded-l border border-r-0 border-gray-300 px-2 py-2 text-gray-500"
                                        aria-label="Select country code"
                                    >
                                        {countryCodes.map(({ name, code }) => (
                                            <option className="text-black" key={code} value={code}>
                                                {code} {name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setMobileNumber(val);
                                        }}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        placeholder="Enter mobile number"
                                        className="flex-1 h-10 rounded-r text-black border border-gray-300 px-3 py-2"
                                    />
                                </div>
                                {errors.mobileNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setPassword(val);

                                            if (val.length > 0 && !passwordRegex.test(val)) {
                                                setPasswordError(
                                                    'Password must be at least 8 characters and include at least 1 number and 1 special character'
                                                );
                                            } else {
                                                setPasswordError('');
                                            }

                                            if (passwordRegex.test(val)) {
                                                setErrors((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy.password;
                                                    return copy;
                                                });
                                            }
                                        }}
                                        placeholder="xxx@123"
                                        className="w-full h-10 rounded text-black border border-gray-300 px-3 py-2"
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
                                {(passwordError || errors.password) && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordError || errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-1 font-semibold text-black"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setConfirmPassword(value);

                                            if (value !== password) {
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    confirmPassword: 'Passwords do not match',
                                                }));
                                            } else {
                                                setErrors((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy.confirmPassword;
                                                    return copy;
                                                });
                                            }
                                        }}
                                        placeholder="xxx@123"
                                        className="w-full h-10 rounded text-black border border-gray-300 px-3 py-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700"
                                        tabIndex={-1}
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Hide confirm password'
                                                : ' Show confirm password'
                                        }
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {error && <p className="text-red-500 mt-2 font-extralight">{error}</p>}

                            <div>
                                <label
                                    htmlFor="college"
                                    className="block mb-1 text-black font-semibold"
                                >
                                    College
                                </label>
                                <select
                                    id="college"
                                    name="college"
                                    value={college}
                                    onChange={(e) => {
                                        setCollege(e.target.value);
                                        if (e.target.value) {
                                            setErrors((prev) => {
                                                const copy = { ...prev };
                                                delete copy.college;
                                                return copy;
                                            });
                                        }
                                    }}
                                    className="border p-2 border-gray-300 w-full rounded text-gray-500"
                                >
                                    <option value="" className="text-slate-500">
                                        Select your college
                                    </option>
                                    <option value="college_h">
                                        Kalaignar Karunanidhi Institute of Technology
                                    </option>
                                    <option value="college_g">Karpagam Institute of Technology</option>
                                    <option value="college_a">KGiSL Institute Of Technology</option>
                                    <option value="college_i">PPG Insitute of Technology</option>
                                    <option value="college_b">SNS College of Engineering</option>
                                    <option value="college_c">
                                        Sri Krishna College of Engineering & Technology
                                    </option>
                                    <option value="college_d">Sri Ramakrisha Engineering College</option>
                                    <option value="college_e">Sri Ramakrishna Institute of Technology</option>
                                    <option value="college_f">
                                        Sri Shakthi Institute of Engineering and Technology
                                    </option>
                                </select>
                                {errors.college && (
                                    <p className="text-red-500 text-sm mt-1">{errors.college}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="district"
                                    className="block mb-1 text-black font-semibold"
                                >
                                    District
                                </label>
                                <select
                                    id="district"
                                    name="district"
                                    value={district}
                                    onChange={(e) => {
                                        setDistrict(e.target.value);
                                        if (e.target.value) {
                                            setErrors((prev) => {
                                                const copy = { ...prev };
                                                delete copy.district;
                                                return copy;
                                            });
                                        }
                                    }}
                                    className="border p-2 border-gray-300 w-full rounded text-gray-500"
                                >
                                    <option value="">Select your district</option>
                                    <option value="district_1">Ariyalur</option>
                                    <option value="district_2">Chengalpattu</option>
                                    <option value="district_3">Chennai</option>
                                    <option value="district_4">Coimbatore</option>
                                    <option value="district_5">Dindigul</option>
                                    <option value="district_6">Erode</option>
                                    <option value="district_7">Kanchipuram</option>
                                    <option value="district_8">Madurai</option>
                                    <option value="district_9">Namakkal</option>
                                    <option value="district_10">Nilgiris</option>
                                    <option value="district_11">Pudukkottai</option>
                                </select>
                                {errors.district && (
                                    <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="state"
                                    className="block mb-1 text-black font-semibold"
                                >
                                    State
                                </label>
                                <select
                                    id="state"
                                    name="state"
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        if (e.target.value) {
                                            setErrors((prev) => {
                                                const copy = { ...prev };
                                                delete copy.state;
                                                return copy;
                                            });
                                        }
                                    }}
                                    className="border p-2 border-gray-300 w-full rounded text-gray-500 mb-4 md:mb-30"
                                >
                                    <option value="">Select your State</option>
                                    <option value="state_1">Andhra Pradesh</option>
                                    <option value="state_2">Assam</option>
                                    <option value="state_3">Bihar</option>
                                    <option value="state_4">Chhattisgarh</option>
                                    <option value="state_5">Gujarat</option>
                                    <option value="state_6">Maharashtra</option>
                                    <option value="state_7">Punjab</option>
                                    <option value="state_8">Rajasthan</option>
                                    <option value="state_9">Sikkim</option>
                                    <option value="state_10">Tamil Nadu</option>
                                    <option value="state_11">Telangana</option>
                                </select>
                                {errors.state && (
                                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                )}
                            </div>
                       
                  
                        <div className="w-full bg-blue-50 px-4 py-4 z-20 border-t border-gray-200 mt-8 md:mt-0 md:fixed md:bottom-0 md:right-0 md:w-[750px] md:mr-3" style={{ marginLeft: '0' }}>
                            <button
                                type="submit"
                            
                                className="transition-all duration-100 ease-in bg-blue-700 text-white py-2 w-full rounded border border-blue-800 shadow-sm shadow-blue-700 hover:bg-blue-600 transform hover:scale-105 mb-2"
                            >
                                Sign Up
                            </button>
                            <p className="text-center text-black">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-700 hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                         </form>
                    </div>
                </div>
            </div>
        </div>
    );
}