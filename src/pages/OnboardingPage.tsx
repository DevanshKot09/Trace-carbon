import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, User, ShieldCheck, ArrowRight, Loader2, Zap, Car, Flame, ShoppingBag } from 'lucide-react';

export default function OnboardingPage() {
  const { submitOnboarding } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Demographic stats
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');

  // Lifestyle metrics
  const [transportationHabits, setTransportationHabits] = useState('Fuel Sedan Car');
  const [foodHabits, setFoodHabits] = useState('Vegetarian options mainly');
  const [electricityUsage, setElectricityUsage] = useState('Moderate (approx. 200 kWh/mo)');
  const [flightFrequency, setFlightFrequency] = useState('Occasional flights (1-2 per year)');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await submitOnboarding({
        name,
        age: parseInt(age) || 25,
        country,
        city,
        occupation,
        transportationHabits,
        foodHabits,
        electricityUsage,
        flightFrequency
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 justify-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        
        {/* Onboarding branding header */}
        <div className="flex items-center justify-between border-b border-gray-500/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                CarbonWise Onboarding
              </h2>
              <p className="text-xs text-gray-400">Step {step} of 2 – Customizing baseline carbon factors</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className={`h-2.5 w-10 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`}></span>
            <span className={`h-2.5 w-10 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`}></span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1 Form: Personal Profile */
          <form onSubmit={handleNext} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/10 flex gap-3.5 items-start">
                <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome to CarbonWise! In order to configure realistic carbon targets, let us know a little bit about who you are.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="onboard_name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Preferred Name
                  </label>
                  <input
                    id="onboard_name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Alex Rivera"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>

                <div>
                  <label htmlFor="onboard_age" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Age
                  </label>
                  <input
                    id="onboard_age"
                    type="number"
                    required
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g., 28"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="onboard_country" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Country
                  </label>
                  <input
                    id="onboard_country"
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g., Canada"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>

                <div>
                  <label htmlFor="onboard_city" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    City Location
                  </label>
                  <input
                    id="onboard_city"
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g., Vancouver"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="onboard_occupation" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Occupation / Role
                </label>
                <input
                  id="onboard_occupation"
                  type="text"
                  required
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  placeholder="e.g., Software Architect"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/10 hover:bg-emerald-500"
              >
                <span>Continue to Lifestyle Factors</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Step 2 Form: Eco Habits selection cards */
          <div className="mt-8 space-y-6">
            <div className="space-y-5">
              {/* Transportation selection cards */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Car className="h-4 w-4 text-emerald-500" /> Commute / Transportation Habits
                </label>
                <div className="mt-2.5 grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {[
                    'Electric Vehicle / EV owner',
                    'Public Transit Line commuter',
                    'Hybrid Car / Carpooling rider',
                    'Traditional Petrol SUV driver'
                  ].map(item => (
                    <button
                      key={item}
                      onClick={() => setTransportationHabits(item)}
                      className={`rounded-xl border p-3.5 text-left text-xs font-semibold tracking-tight transition-all duration-150 ${
                        transportationHabits === item
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                          : 'border-gray-150 bg-gray-50/50 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food selection cards */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Flame className="h-4 w-4 text-emerald-500" /> Diet & Food Preferences
                </label>
                <div className="mt-2.5 grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {[
                    'Strict Vegan diet',
                    'Vegetarian choices only',
                    'Balanced animal meat & veggie',
                    'High-frequency meat diet'
                  ].map(item => (
                    <button
                      key={item}
                      onClick={() => setFoodHabits(item)}
                      className={`rounded-xl border p-3.5 text-left text-xs font-semibold tracking-tight transition-all duration-150 ${
                        foodHabits === item
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                          : 'border-gray-150 bg-gray-50/50 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Electricity usage indicator */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Zap className="h-4 w-4 text-emerald-500" /> Domestic Energy consumption
                </label>
                <div className="mt-2.5 grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {[
                    'Low energy (100% solar or LED)',
                    'Moderate standard bills (~250 kWh)',
                    'Heavy electricity (AC on full-time)'
                  ].map(item => (
                    <button
                      key={item}
                      onClick={() => setElectricityUsage(item)}
                      className={`rounded-xl border p-3.5 text-left text-xs font-semibold tracking-tight transition-all duration-150 ${
                        electricityUsage === item
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                          : 'border-gray-150 bg-gray-50/50 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-500/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-55 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                Previous Profile
              </button>

              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-500/10 hover:bg-emerald-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Analyzing footprint...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span>Complete Calculations & Setup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
