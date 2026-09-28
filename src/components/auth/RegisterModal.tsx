import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Gender, InterestedIn, RelationshipGoal } from '../../types';
import { WEST_BENGAL_DISTRICTS, POPULAR_INTERESTS, RELATIONSHIP_GOAL_LABELS } from '../../data/districts';
import { X, ShieldCheck, AlertCircle, Camera, Check, Phone, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGender?: Gender;
  onSuccessOpenVerification: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  initialGender = 'female',
  onSuccessOpenVerification
}) => {
  const { registerUser } = useApp();

  // Multi-step form: 1: Basic Info & Age, 2: Bengal Location & Professional, 3: Photos & Bio, 4: OTP Verification
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('2000-06-15');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [interestedIn, setInterestedIn] = useState<InterestedIn>(initialGender === 'male' ? 'female' : 'male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // District & Location
  const [district, setDistrict] = useState(WEST_BENGAL_DISTRICTS[0].district);
  const [city, setCity] = useState(WEST_BENGAL_DISTRICTS[0].popularCities[0]);
  
  // Profile Info
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [height, setHeight] = useState("5' 6\" (168 cm)");
  const [relationshipStatus, setRelationshipStatus] = useState('Single');
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>('long_term');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([POPULAR_INTERESTS[0], POPULAR_INTERESTS[1]]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Bengali', 'English']);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // OTP Simulation State
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('8921');
  const [otpTimer, setOtpTimer] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  // Update gender when initialGender changes
  useEffect(() => {
    if (initialGender) {
      setGender(initialGender);
      setInterestedIn(initialGender === 'female' ? 'male' : 'female');
    }
  }, [initialGender]);

  // Dynamic Age Calculation
  useEffect(() => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  }, [dob]);

  // Update cities when district changes
  useEffect(() => {
    const d = WEST_BENGAL_DISTRICTS.find(item => item.district === district);
    if (d && d.popularCities.length > 0) {
      setCity(d.popularCities[0]);
    }
  }, [district]);

  // Countdown timer for OTP
  useEffect(() => {
    if (step === 4 && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, otpTimer]);

  if (!isOpen) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (age < 18) {
      setErrorMsg('Under 18 Notice: Only individuals aged 18 years or above can register on PremKotha.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!profession.trim()) {
      setErrorMsg('Please mention your profession.');
      return;
    }
    if (!education.trim()) {
      setErrorMsg('Please mention your education / college.');
      return;
    }

    setStep(3);
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!bio.trim() || bio.length < 15) {
      setErrorMsg('Please write a short bio (at least 15 characters) so matches get to know you.');
      return;
    }
    if (!termsAgreed) {
      setErrorMsg('You must agree to the Terms, Privacy Policy and confirm you are 18+.');
      return;
    }

    // Generate random 4-digit OTP and proceed to step 4
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);
    setOtpTimer(45);
    setStep(4);
  };

  const handleVerifyOtpAndComplete = () => {
    setErrorMsg('');
    if (otpCode !== generatedOtp && otpCode !== '1234') {
      setErrorMsg(`Invalid verification code. For this preview, use: ${generatedOtp}`);
      return;
    }

    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      fullName,
      dob,
      age,
      gender,
      interestedIn,
      mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
      email,
      district,
      city,
      profilePhoto,
      additionalPhotos: [profilePhoto],
      bio,
      profession,
      education,
      height,
      relationshipStatus,
      relationshipGoal,
      interests: selectedInterests,
      languages: selectedLanguages,
      verificationStatus: 'required', // will prompt real-time video verification
      isOnline: true,
      lastActive: 'Just now'
    };

    try {
      registerUser(newProfile);
      onClose();
      // Prompt user to immediately proceed to real-time liveness verification
      onSuccessOpenVerification();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  const samplePhotos = gender === 'female' ? [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  ] : [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                {gender === 'female' ? '👩 Female Registration' : '👨 Male Registration'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                18+ Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {step} of 4: {step === 1 ? 'Personal & Age Verification' : step === 2 ? 'Bengal Location & Career' : step === 3 ? 'Photos & Lifestyle' : 'Mobile OTP Verification'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="m-5 mb-0 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Basic Info & Age Calculation */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              
              {/* Gender selector switch */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setGender('female'); setInterestedIn('male'); }}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                    gender === 'female'
                      ? 'bg-pink-500/20 border-pink-500 text-pink-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">👩</span>
                  <div>
                    <p className="text-xs font-semibold text-white">Female Profile</p>
                    <p className="text-[10px] text-pink-300/80">Looking for Men / All</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setGender('male'); setInterestedIn('female'); }}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                    gender === 'male'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">👨</span>
                  <div>
                    <p className="text-xs font-semibold text-white">Male Profile</p>
                    <p className="text-[10px] text-purple-300/80">Looking for Women / All</p>
                  </div>
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joyita Sen or Subhasis Roy"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* DOB & Auto-Calculated Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Calculated Age (18+ Mandatory)
                  </label>
                  <div className={`px-3.5 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-between ${
                    age >= 18
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  }`}>
                    <span>{age >= 0 ? `${age} years old` : 'Select DOB'}</span>
                    {age >= 18 ? (
                      <span className="text-[11px] text-emerald-400 font-medium">✓ Eligible</span>
                    ) : (
                      <span className="text-[11px] text-rose-400 font-medium">✕ Under 18 Not Allowed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Interested In */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Interested In</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'female', label: 'Women' },
                    { id: 'male', label: 'Men' },
                    { id: 'all', label: 'Everyone' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInterestedIn(item.id as InterestedIn)}
                      className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        interestedIn === item.id
                          ? 'bg-rose-500/20 border-rose-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobile Number (For OTP Verification)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98300 12345"
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={10}
                      className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={age < 18}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Continue to Bengal Location & Career</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: Bengal Location & Profession */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              
              {/* West Bengal District & City Selector */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-3">
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
                  West Bengal Location
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">District</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    >
                      {WEST_BENGAL_DISTRICTS.map(d => (
                        <option key={d.district} value={d.district}>{d.district}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">City / Region</label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    >
                      {WEST_BENGAL_DISTRICTS.find(d => d.district === district)?.popularCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  🔒 Privacy Guarantee: Your exact house/apartment address is never stored or displayed. Only city/district is shown to matches.
                </p>
              </div>

              {/* Profession & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Profession / Work</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT Engineer (Sector V), Doctor, Teacher"
                    value={profession}
                    onChange={e => setProfession(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Education / College</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech Jadavpur, Calcutta Univ"
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Height & Relationship Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Height</label>
                  <select
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="5' 0&quot; (152 cm)">5' 0" (152 cm)</option>
                    <option value="5' 2&quot; (157 cm)">5' 2" (157 cm)</option>
                    <option value="5' 4&quot; (162 cm)">5' 4" (162 cm)</option>
                    <option value="5' 6&quot; (168 cm)">5' 6" (168 cm)</option>
                    <option value="5' 8&quot; (173 cm)">5' 8" (173 cm)</option>
                    <option value="5' 10&quot; (178 cm)">5' 10" (178 cm)</option>
                    <option value="6' 0&quot; (183 cm)">6' 0" (183 cm)</option>
                    <option value="6' 2&quot; (188 cm)">6' 2" (188 cm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Relationship Status</label>
                  <select
                    value={relationshipStatus}
                    onChange={e => setRelationshipStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                  </select>
                </div>
              </div>

              {/* Relationship Goal */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">What are you looking for?</label>
                <select
                  value={relationshipGoal}
                  onChange={e => setRelationshipGoal(e.target.value as RelationshipGoal)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {Object.entries(RELATIONSHIP_GOAL_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <span>Continue to Photos & Bio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: Photos, Bio & Interests */}
          {step === 3 && (
            <form onSubmit={handleNextStep3} className="space-y-4">
              
              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Profile Photo</label>
                <p className="text-[11px] text-slate-400 mb-2">Choose an authentic, clear portrait. You can also paste an image URL.</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {samplePhotos.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setProfilePhoto(url)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        profilePhoto === url ? 'border-rose-500 ring-2 ring-rose-500/50 scale-95' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {profilePhoto === url && (
                        <div className="absolute top-1 right-1 bg-rose-600 rounded-full p-0.5 text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or paste direct image URL (https://...)"
                  value={profilePhoto}
                  onChange={e => setProfilePhoto(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  About You / Short Bio (Min 15 chars)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a bit about your passions, weekend adda spots, favorite Bengali dishes or films..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Interests & Hobbies */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Interests & Adda Topics (Select at least 2)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_INTERESTS.slice(0, 10).map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedInterests(prev => prev.filter(i => i !== interest));
                          } else {
                            setSelectedInterests(prev => [...prev, interest]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms and 18+ Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={e => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-rose-600 focus:ring-rose-500 w-4 h-4 bg-slate-950"
                  />
                  <span>
                    I confirm that I am <strong className="text-white">18 years of age or older</strong>, living in or connected to West Bengal. I agree to the{' '}
                    <span className="text-rose-400 underline">Terms of Service</span>,{' '}
                    <span className="text-rose-400 underline">Privacy Policy</span>, and consent to real-time video verification.
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={!termsAgreed}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Proceed to Mobile OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 4: Mobile OTP Verification */}
          {step === 4 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
                <Phone className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Verify Your Mobile Number</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  We sent a 4-digit verification code to <span className="text-white font-medium">+91 {mobile}</span> to prevent fake bots and duplicate accounts.
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  Demo SMS OTP Code: {generatedOtp}
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <label className="block text-xs font-medium text-slate-400 mb-2">Enter 4-Digit Code</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full text-center tracking-[1em] text-2xl font-bold py-3 rounded-2xl bg-slate-950 border border-slate-700 text-rose-400 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="text-xs text-slate-500">
                {otpTimer > 0 ? (
                  <span>Resend OTP in {otpTimer}s</span>
                ) : (
                  <button
                    onClick={() => {
                      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(newCode);
                      setOtpTimer(45);
                    }}
                    className="text-rose-400 hover:underline font-medium"
                  >
                    Resend Code Now
                  </button>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleVerifyOtpAndComplete}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verify OTP & Create Account</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Next: You will complete a quick 15-second real-time camera liveness check to get your Verified Profile badge!
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
