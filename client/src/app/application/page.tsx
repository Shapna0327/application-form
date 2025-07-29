'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import rawCourses from '../../../data/full_data.json';

 interface CourseData {
      pgCourses: string[];
      phdCourses: string[];
      country_codes: { name: string; code: string}[];
    }

   const educationLevels = ['10th', 'Diploma', '11th', '12th', 'UG'];

export default function ApplicationForm() {
 const [showModal, setShowModal] = useState(false);
const [applicationId, setApplicationId] = useState('');
const [submitted, setSubmitted] = useState('')
 
useEffect(() => {
  if(applicationId){
    const timer = setTimeout(() =>{
      setApplicationId('');
    }, 10000);
    return () => clearTimeout(timer);
  }
}, [applicationId]);


  const [firstName, setFirstName] = useState('');
  const [surName, setSurName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [college, setCollege] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
const [pinCode, setPinCode] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [degree, setDegree] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const router = useRouter();
  const courses = rawCourses as CourseData;
const pgCourses: string[] = courses.pgCourses || [];
const phdCourses: string[] = courses.phdCourses || [];
const countryCodes = courses.country_codes || [];
const [errors, setErrors] = useState<{ [key: string]: string }>({});


const [marksData, setMarksData] = useState(()=>{
  const initialData: Record<string, { total: string; obtained: string }> = {};
  educationLevels.forEach((level)=>{
    initialData[level] = { total: '', obtained: '' };
  });
  return initialData; 
});

  const handleMarksChange = (
    level: string,
    field: 'total' | 'obtained',
    value: string
  ) => {
    if (/^\d*$/.test(value)){
      setMarksData((prev)=>({
        ...prev,
        [level]: {
          ...prev[level],
          [field]: value,
        },
      }));
    }
  };

const calculatePercentage = (totalStr: string, obtainedStr: string) => {
  const total = Number(totalStr);
  const obtained = Number(obtainedStr);
  if (total > 0 && obtained >= 0 && obtained <= total) {
    return ((obtained / total) * 100).toFixed(2) + '%';
  }
  return '';
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!degree) {
      setError('Please select your degree');
      return;
    }

     if (!selectedCourse) {
      setError(`Please select a ${degree} course`);
      return;
    }
 const formData = {
    firstName,
    surName,
    age,
    gender,
    mobileNumber,
    countryCode,
    college,
    address,
    pinCode,
    district,
    state,
    fatherName,
    motherName,
    degree,
    selectedCourse,
    marks: marksData,
 
  };

   try {
    const res = await fetch('http://localhost:5000/application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
     setApplicationId(data.applicationId);
    
    } else {
      setError(data.message || 'Submission failed');
    }
  } catch (err) {
    setError('Something went wrong. Try again.');
  }

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-950 px-6 py-12 relative overflow-visible">
      <div
        className="relative w-full max-w-4xl"
      
      >
        <h1 className="text-4xl font-extrabold 6 text-center text-white">
          Application Form
        </h1>
           </div>

<div className='relative mt-6 w-full max-w-4xl bg-gradient-to-br from-blue-50 to-blue-100 bg-opacity-95 rounded-4xl border border-gray-400 shadlow-lg p-8 md:p-12 backdrop-blue-sm overflow-visible'
>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/*firstname */}
         <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='flex-1'>
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
              onChange={e => setFirstName(e.target.value)}
              placeholder="Your name here..."
              required
              className="w-full h-10 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>

          <div className='flex-1 mt-4 md:mt-0'>
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
              onChange={e => setSurName(e.target.value)}
              placeholder="Your surname here..."
              required
              className="w-full h-10 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>
</div>

<div className='flex flex-col md:flex-row md:space-x-4'>          
          <div className='flex-1'>
            <label htmlFor="age" className="block mb-1 font-semibold text-black">
              Age
            </label>
            <input
              id="age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Your age here..."
              required
              className="w-full h-10 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>

          
           <div className='flex-1 mt-4 md:mt-0'>
            <label htmlFor="gender" className="block mb-1 font-semibold text-black">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={e => setGender(e.target.value)}
              required
              defaultValue=""
              className="w-full h-10 rounded-4xl border border-gray-400 px-3 py-2 text-gray-500"
            >
              <option value="" disabled>
                Select your gender
              </option>
              <div className='text-black'>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
              </div>
            </select>
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
                className="h-10 w-25 rounded-l-4xl border border-r-0 border-gray-400 px-3 py-2 text-gray-500"
                aria-label="Select country code"
              >
                <div className='text-black'>
               {countryCodes.map(({ name, code }) => (
                
                <option key={code} value={code}>
                  {code} {name}
                </option>
               ))}
               </div>
               
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
                placeholder="Enter 10-digit mobile number"
                required
                className="flex-1 h-10 w-60 rounded-r-4xl border border-gray-400 px-3 py-2 text-black"
              />
            </div>
          </div>
</div>

          
        
           <div>
          <label htmlFor='college' className='block mb-1 font-semibold text-black'>College</label>
          <select id='college' name="college" className='border p-2 border-gray-400 w-full rounded-4xl text-gray-500'
          value={college}
          onChange={e => setCollege(e.target.value)}
          required>
           <div className='text-black'>
            <option value="" className='text-slate-500'>Select your college</option>
            <option value="college_h">Kalaignar Karunanidhi Institute of Technology</option>
            <option value="college_g">Karpagam Institute of Technology</option>
            <option value="college_a">KGiSL Institute Of Technology</option>
            <option value="college_i">PPG Insitute of Technology</option>
            <option value="college_b">SNS College of Engineering</option>
            <option value="college_c">Sri Krishna College of Engineering & Technology</option>
            <option value="college_d">Sri Ramakrisha Engineering College</option>
            <option value="college_e">Sri Ramakrishna Institute of Technology</option>
            <option value="college_f">Sri Shakthi Institute of Engineering and Technology</option>
       
            </div>
          </select>
        </div>

        {/*Address --------------------*/}
         <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='flex-1'>
            <label
              htmlFor="address"
              className="block mb-1 font-semibold text-black"
            >
             Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Type Your address here..."
              required
              className="w-full h-25 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>
</div>

{}
 <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='flex-1'>
            <label
              htmlFor="pincode"
              className="block mb-1 font-semibold text-black"
            >
             Pin code
            </label>
            <input
              id="pinCode"
              type="text"
              value={pinCode}
              onChange={e => setPinCode(e.target.value)}
              placeholder="Your pinCode here..."
              required
              className="h-10 w-50 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>

          <div className='flex-1 mt-4 md:mt-0'>
          <label htmlFor='district' className='block mb-1 font-semibold text-black'>District</label>
          <select id='district' name="district" 
          className='border p-2 border-gray-400 w-70 h-10 rounded-4xl text-gray-500' 
          value={district}
          onChange={e => setDistrict(e.target.value)}
          required>
             <div className='text-black'>
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
            </div>
          </select>
        </div>


         <div className='flex-1 mt-4 md:mt-0'>
          <label htmlFor='state' className='block mb-1 font-semibold text-black'>State</label>
          <select id='state' name="state" 
          className='border p-2 border-gray-400 w-70 h-10 rounded-4xl text-gray-500' 
          value={state}
          onChange={e => setState(e.target.value)}
          required>
             <div className='text-black'>
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
            </div>
          </select>
        </div>
         
</div>

        

        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='flex-1'>
            <label
              htmlFor="fatherName"
              className="block mb-1 font-semibold text-black"
            >
              Father name
            </label>
            <input
              id="fatherName"
              type="text"
               value={fatherName}
          onChange={e => setFatherName(e.target.value)}
              placeholder="Type here..."
              required
              className="w-full h-10 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>

          <div className='flex-1 mt-4 md:mt-0'>
            <label
              htmlFor="motherName"
              className="block mb-1 font-semibold text-black"
            >
              Mother name
            </label>
            <input
              id="motherName"
              type="text"
               value={motherName}
          onChange={e => setMotherName(e.target.value)}
              placeholder="Type here..."
              required
              className="w-full h-10 rounded-4xl border border-gray-400 px-3 py-2 text-black"
            />
          </div>
</div>
        
       <div>
  <label htmlFor='degree' className='block mb-1 font-semibold text-black'>Degree</label>
  <select
    id="degree"
    name="degree"
    required
    value={degree}
    onChange={(e) => {
      setDegree(e.target.value);
      setSelectedCourse('');
    }}
    className="border p-2 border-gray-400 w-full rounded-4xl text-gray-500"
  >
    <option value="">Choose the degree</option>
    <div className='text-black'>
    <option value="PG">PG</option>
    <option value="PhD">PhD</option>
    </div>
  </select>
</div>

{degree && (
  <div className="mt-2">
    <label htmlFor="course" className="block mb-1 font-semibold text-black">
      {degree} Courses
    </label>
    <select
    
     id="course"
    name="course"
    value={selectedCourse}

    onChange={(e) => setSelectedCourse(e.target.value)}
    required
     className="w-full p-2 rounded-4xl border border-gray-400 text-gray-500"
    >

<div className='text-black'>
      <option value="">Select a {degree} course</option>
      {(degree === "PG" ? pgCourses : phdCourses).map((course) => (
        <option key={course} value={course}>
          {course}
        </option>
      ))}
      </div>
    </select>
  </div>
)}


{/*marks*/}
<div>
  <label className="block mb-2 font-semibold text-black text-lg">Marks</label>
  <div className='bg-blue-50 rounded-3xl border border-gray-200 p-4 '>
  <div className="space-y-6">
    {educationLevels.map(level => (
      <div key={level} className="flex flex-col sm:flex-row sm:items-center sm:space-x-6  gap-4">
        <div className="w-full sm:w-28 font-semibold text-black mb-2 sm:mb-0">{level}</div>

        {/* Total Marks */}
        <div className="flex-1 flex flex-col w-full sm:w-32 mb-4 sm:mb-0">
          <label htmlFor={`${level}-total`} className="text-sm text-black mb-1">
            Total Marks
          </label>
          <input
            type="text"
            id={`${level}-total`}
            name={`${level}-total`}
            value={marksData[level].total}
            onChange={e => handleMarksChange(level, 'total', e.target.value)}
            placeholder="100"
            className="p-2 rounded-l border border-gray-400 text-black"
            inputMode="numeric"
            required
          />
        </div>

        {/* Marks Obtained */}
        <div className="flex-1 flex flex-col w-full sm:w-32 mb-4 sm:mb-0">
          <label htmlFor={`${level}-obtained`} className="text-sm text-black mb-1">
            Marks Obtained
          </label>
          <input
            type="text"
            id={`${level}-obtained`}
            name={`${level}-obtained`}
            value={marksData[level].obtained}
            onChange={e => handleMarksChange(level, 'obtained', e.target.value)}
            placeholder="Obtained"
            className="p-2 rounded-l border border-gray-400 text-black"
            inputMode="numeric"
            required
          />
        </div>

        {/* Percentage */}
        <div className="flex flex-col w-full sm:w-28">
          <label className="text-sm text-black mb-1" aria-label={`${level} Percentage`}>
            Percentage
          </label>
          <input
            type="text"
            readOnly
            value={calculatePercentage(marksData[level].total, marksData[level].obtained)}
            className="p-2 rounded-xl border border-gray-400 text-black cursor-not-allowed"
            aria-readonly="true"
            tabIndex={-1}
          />
        </div>
      </div>
      
    ))}
    </div>
  </div>
</div>
          <button
            type="submit"
            className="transition-all duration-100 ease-in bg-blue-700 mt-2 text-white py-2 w-full rounded border border-blue-800 shadow-sm shadow-blue-700 hover:bg-blue-600 transform hover:scale-105"
          >
            Submit
          </button>
        </form>

{/* Success Alert */}
{applicationId && (
  <div className="fixed top-0 left-0 right-0 z-50 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-b shadow-md flex items-center justify-between max-w-4xl mx-auto mt-2">
    <div>
      ✅ Application submitted! Your Id is: <span className="font-bold">{applicationId}</span>
         <br />Thank You!!
    </div>

    <button
      onClick={() => {setApplicationId('');
         router.push('/login');
      }}
      className="ml-4 text-green-700 font-bold hover:text-green-900"
      aria-label="Close success alert"
    >
      OK
    </button>
  </div>
)}


{error && (
  <div className="fixed top-0 left-0 right-0 z-50 bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-b shadow-md flex items-center justify-between max-w-4xl mx-auto mt-2">
    <div>⚠️ {error}</div>
    <button
      onClick={() => setError('')}
      className="ml-4 text-red-700 font-bold hover:text-red-900"
      aria-label="Close error alert"
    >
      X
    </button>
  </div>
)}

        
   </div>
    </div>
  );
}
