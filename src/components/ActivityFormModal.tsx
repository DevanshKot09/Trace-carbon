import React, { useState } from 'react';
import { ActivityCategory } from '../types';
import { X, HelpCircle, Flame } from 'lucide-react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: {
    name: string;
    category: ActivityCategory;
    emissionValue: number;
    date: string;
    notes?: string;
  }) => Promise<void>;
}

export default function ActivityFormModal({ isOpen, onClose, onSubmit }: ActivityFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Transportation');
  const [emissionValue, setEmissionValue] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimationMode, setEstimationMode] = useState(false);

  // Quick helper calculator coefficients
  const [distance, setDistance] = useState('');
  const [transportType, setTransportType] = useState('petrol'); // petrol, diesel, EV, bus

  if (!isOpen) return null;

  const handleEstimate = () => {
    let computed = 0;
    const distNum = parseFloat(distance) || 0;
    if (category === 'Transportation') {
      if (transportType === 'petrol') computed = distNum * 0.25;
      if (transportType === 'diesel') computed = distNum * 0.28;
      if (transportType === 'EV') computed = distNum * 0.04;
      if (transportType === 'bus') computed = distNum * 0.08;
    } else if (category === 'Electricity') {
      computed = distNum * 0.45; // dist acts as kWh here
    } else if (category === 'Food') {
      // dist acts as meals count
      computed = distNum * 2.5; // average meal footprint
    } else if (category === 'Travel') {
      // dist acts as flights count
      computed = distNum * 250;
    } else {
      computed = distNum * 5.0; // purchases count
    }
    setEmissionValue((Math.round(computed * 10) / 10).toString());
    setEstimationMode(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emissionValue) return;

    const valueNum = parseFloat(emissionValue);
    if (isNaN(valueNum) || valueNum <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        category,
        emissionValue: valueNum,
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined
      });
      // clear inputs
      setName('');
      setCategory('Transportation');
      setEmissionValue('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="activity_modal_content"
        className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
      >
        <div className="flex items-center justify-between border-b border-gray-500/10 pb-4">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>Record Footprint Activity</span>
          </h3>
          <button 
            id="btn_close_activity_modal"
            onClick={onClose} 
            aria-label="Close activity tracker modal"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="activity_name_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Activity Name
            </label>
            <input
              id="activity_name_input"
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Weekly grocery shop, Commute to office"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label htmlFor="activity_category_select" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Category
              </label>
              <select
                id="activity_category_select"
                value={category}
                onChange={e => setCategory(e.target.value as ActivityCategory)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-800 dark:bg-gray-950 focus:border-emerald-500 outline-hidden"
              >
                <option value="Transportation">Transportation</option>
                <option value="Food">Food & Diet</option>
                <option value="Electricity">Electricity & Utility</option>
                <option value="Travel">Long Travel (Flights)</option>
                <option value="Shopping">Shopping & Tech</option>
              </select>
            </div>

            <div>
              <label htmlFor="activity_date_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Date
              </label>
              <input
                id="activity_date_input"
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="activity_emission_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Emissions (kg CO₂e)
              </label>
              <button
                type="button"
                onClick={() => setEstimationMode(!estimationMode)}
                className="text-xs text-emerald-500 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-3 w-3" /> Quick Estimator Assistant
              </button>
            </div>

            {estimationMode ? (
              <div className="mt-2 rounded-xl bg-emerald-500/5 p-3.5 border border-emerald-500/10 space-y-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {category === 'Transportation' && "Estimate based on trip distance:"}
                  {category === 'Electricity' && "Estimate based on electricity consumption:"}
                  {category === 'Food' && "Estimate based on meal count:"}
                  {category === 'Travel' && "Estimate based on flights taken:"}
                  {category === 'Shopping' && "Estimate based on total purchases count:"}
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={distance}
                    onChange={e => setDistance(e.target.value)}
                    placeholder={
                      category === 'Transportation' ? 'Distance (miles/km)' :
                      category === 'Electricity' ? 'Usage (kWh)' :
                      category === 'Food' ? 'Meals Count' :
                      category === 'Travel' ? 'Flights Count' : 'Purchases Count'
                    }
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                  {category === 'Transportation' && (
                    <select
                      value={transportType}
                      onChange={e => setTransportType(e.target.value)}
                      className="rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950"
                    >
                      <option value="petrol">Petrol SUV</option>
                      <option value="diesel">Diesel Car</option>
                      <option value="EV">Electric Car</option>
                      <option value="bus">Public Transit</option>
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={handleEstimate}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shrink-0"
                  >
                    Apply Estimate
                  </button>
                </div>
              </div>
            ) : null}

            <input
              id="activity_emission_input"
              type="number"
              step="any"
              required
              value={emissionValue}
              onChange={e => setEmissionValue(e.target.value)}
              placeholder="e.g., 14.5"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
            />
          </div>

          <div>
            <label htmlFor="activity_notes_textarea" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Personal Notes
            </label>
            <textarea
              id="activity_notes_textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record any details, e.g., carpooled, reduced temperature, etc."
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 flex items-center justify-center gap-1"
            >
              {isSubmitting ? 'Logging...' : 'Log Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
