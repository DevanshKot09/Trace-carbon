import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { 
  Calculator, 
  Car, 
  Zap, 
  Flame, 
  Plane, 
  ShoppingBag, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function CalculatorPage() {
  const { addActivity, addToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);

  // Transportation Inputs
  const [vehicleType, setVehicleType] = useState('sedan');
  const [fuelType, setFuelType] = useState('petrol');
  const [distance, setDistance] = useState('120');

  // Energy Inputs
  const [electricity, setElectricity] = useState('250');
  const [acUsage, setAcUsage] = useState('40');
  const [lpgUsage, setLPGUsage] = useState('1');

  // Food Inputs
  const [diet, setDiet] = useState<'vegetarian' | 'non-vegetarian' | 'vegan'>('vegetarian');

  // Travel Inputs
  const [domesticFlights, setDomesticFlights] = useState('2');
  const [intlFlights, setIntlFlights] = useState('0');

  // Shopping Inputs
  const [clothingCount, setClothingCount] = useState('3');
  const [electronicsCount, setElectronicsCount] = useState('1');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await apiService.calculator.calculate({
        vehicleType,
        fuelType,
        distance: parseFloat(distance) || 0,
        electricity: parseFloat(electricity) || 0,
        acUsage: parseFloat(acUsage) || 0,
        lpgUsage: parseFloat(lpgUsage) || 0,
        diet,
        domesticFlights: parseInt(domesticFlights) || 0,
        intlFlights: parseInt(intlFlights) || 0,
        clothingCount: parseInt(clothingCount) || 0,
        electronicsCount: parseInt(electronicsCount) || 0
      });
      setResult(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!result) return;
    try {
      setLoading(true);
      // Log as direct collective activity
      await addActivity({
        name: 'Bulk Calculated Carbon Assessment',
        category: 'Electricity',
        emissionValue: result.total,
        date: new Date().toISOString(),
        notes: `Transportation: ${distance}km (${fuelType}), Electricity: ${electricity}kWh, Diet: ${diet}, Flights: ${domesticFlights} domestic.`
      });
      addToast('Calculated footprint successfully pinned into your Activity tracker logs!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDistance('0');
    setElectricity('0');
    setAcUsage('0');
    setLPGUsage('0');
    setDiet('vegetarian');
    setDomesticFlights('0');
    setIntlFlights('0');
    setClothingCount('0');
    setElectronicsCount('0');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Carbon Footprint Calculator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
          Estimate your monthly greenhouse output with high-precision coefficient queries.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column: Form inputs (Span 3) */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleCalculate} className="space-y-6">
            
            {/* Sec A: Transportation */}
            <div className="space-y-4">
              <h3 className="border-b border-gray-500/10 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Car className="h-4.5 w-4.5 text-sky-500" />
                <span>1. Transportation habits (Per Month)</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400">Vehicle Class</label>
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-800 dark:bg-gray-950 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="sedan">Sedan / Hatchback</option>
                    <option value="suv">SUV / Pick-Up</option>
                    <option value="bus">Motorcycle / Scooter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400">Fuel Class Type</label>
                  <select
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-800 dark:bg-gray-950 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="petrol">Standard Petrol / Gas</option>
                    <option value="diesel">Diesel fuel</option>
                    <option value="electricity">Electric battery (EV)</option>
                    <option value="hybrid">Plug-in Hybrid (PHEV)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400">Distance Travelled (km)</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={e => setDistance(e.target.value)}
                    placeholder="120"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Sec B: Household energy */}
            <div className="space-y-4">
              <h3 className="border-b border-gray-500/10 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Zap className="h-4.5 w-4.5 text-yellow-500" />
                <span>2. Residential Energy grid usage</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400">Electricity (kWh)</label>
                  <input
                    type="number"
                    value={electricity}
                    onChange={e => setElectricity(e.target.value)}
                    placeholder="250"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400">AC Cooling (Hours/mo)</label>
                  <input
                    type="number"
                    value={acUsage}
                    onChange={e => setAcUsage(e.target.value)}
                    placeholder="40"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400">LPG gas (Cylinders)</label>
                  <input
                    type="number"
                    value={lpgUsage}
                    onChange={e => setLPGUsage(e.target.value)}
                    placeholder="1"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Sec C: Diet profile */}
            <div className="space-y-4">
              <h3 className="border-b border-gray-500/10 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Flame className="h-4.5 w-4.5 text-orange-500" />
                <span>3. Dietary profile</span>
              </h3>
              <div className="grid gap-4 grid-cols-3 text-center">
                {[
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'non-vegetarian', label: 'Omnivore / Meat' },
                  { id: 'vegan', label: 'Strict Vegan' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDiet(item.id as any)}
                    className={`rounded-xl border p-3 text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer ${
                      diet === item.id 
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' 
                        : 'border-gray-150 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sec D: Travel and Shopping */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="border-b border-gray-500/10 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Plane className="h-4.5 w-4.5 text-purple-500" />
                  <span>4. Flight frequency</span>
                </h3>
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400">Domestic flights</label>
                    <input
                      type="number"
                      value={domesticFlights}
                      onChange={e => setDomesticFlights(e.target.value)}
                      placeholder="2"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400">International flights</label>
                    <input
                      type="number"
                      value={intlFlights}
                      onChange={e => setIntlFlights(e.target.value)}
                      placeholder="0"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-gray-500/10 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <ShoppingBag className="h-4.5 w-4.5 text-emerald-500" />
                  <span>5. Shopping purchases</span>
                </h3>
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400">Clothing articles</label>
                    <input
                      type="number"
                      value={clothingCount}
                      onChange={e => setClothingCount(e.target.value)}
                      placeholder="3"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400">Electronics devices</label>
                    <input
                      type="number"
                      value={electronicsCount}
                      onChange={e => setElectronicsCount(e.target.value)}
                      placeholder="1"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-500/10">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900 flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" /> Reset Fields
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-500/10 hover:bg-emerald-500 focus:outline-hidden"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Calculating coefficients...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-4.5 w-4.5" />
                    <span>Run Footprint Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Results display (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between min-h-[350px]">
            {result ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Sparkles className="h-5.5 w-5.5 animate-pulse" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-extrabold text-gray-900 dark:text-white">
                    Emission Assessment Complete!
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Calculated carbon index output</p>
                </div>

                <div className="rounded-2xl bg-emerald-500/5 p-5 text-center border border-emerald-500/10 shadow-inner">
                  <p className="font-display text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {result.total} <span className="text-xs font-normal">kg CO₂e</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-semibold uppercase tracking-wider">Estimated Monthly Burden</p>
                </div>

                {/* Breakdown index display */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Category Proportions:</h4>
                  <div className="divide-y divide-gray-500/10 text-xs">
                    {Object.keys(result.breakdown).map(cat => (
                      <div key={cat} className="flex items-center justify-between py-2">
                        <span className="text-gray-500">{cat} Portion</span>
                        <strong className="text-gray-900 dark:text-white">{result.breakdown[cat]} kg CO₂e</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveResult}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    <ShieldCheck className="h-4.5 w-4.5" /> Save to Monthly Ledger
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center my-auto space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-gray-950 dark:text-gray-600">
                  <Calculator className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-gray-900 dark:text-white">
                    Calculation Engine Idle
                  </h3>
                  <p className="max-w-xs mx-auto text-xs text-secondary text-gray-500 mt-1">
                    Fill out the environmental parameter blocks and hit run to extract your localized carbon emission ratio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
