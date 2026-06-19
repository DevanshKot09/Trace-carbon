import React, { useState } from 'react';
import { ActivityCategory } from '../types';
import { X, Target } from 'lucide-react';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: {
    title: string;
    category: ActivityCategory | 'Overall';
    targetValue: number;
    deadline: string;
    unit: string;
  }) => Promise<void>;
}

export default function GoalFormModal({ isOpen, onClose, onSubmit }: GoalFormModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory | 'Overall'>('Overall');
  const [targetValue, setTargetValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetValue || !deadline) return;

    const valNum = parseFloat(targetValue);
    if (isNaN(valNum) || valNum <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        category,
        targetValue: valNum,
        deadline,
        unit: category === 'Overall' ? 'kg CO2' : 'kg CO2'
      });
      // clear
      setTitle('');
      setCategory('Overall');
      setTargetValue('');
      setDeadline('');
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
        id="goal_modal_content"
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
      >
        <div className="flex items-center justify-between border-b border-gray-500/10 pb-4">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>Establish Carbon Target</span>
          </h3>
          <button 
            id="btn_close_goal_modal"
            onClick={onClose} 
            aria-label="Close goals modal"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="goal_title_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Goal Title
            </label>
            <input
              id="goal_title_input"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Cut electricity emissions below 150kg"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label htmlFor="goal_category_select" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Scope / Category
              </label>
              <select
                id="goal_category_select"
                value={category}
                onChange={e => setCategory(e.target.value as ActivityCategory | 'Overall')}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-800 dark:bg-gray-950 focus:border-emerald-500 outline-hidden"
              >
                <option value="Overall">Overall Carbon Index</option>
                <option value="Transportation">Transportation</option>
                <option value="Food">Food</option>
                <option value="Electricity">Electricity</option>
                <option value="Travel">Flights Travel</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <div>
              <label htmlFor="goal_deadline_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Deadline
              </label>
              <input
                id="goal_deadline_input"
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950"
              />
            </div>
          </div>

          <div>
            <label htmlFor="goal_target_value_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Target Value (Limit, kg CO₂e)
            </label>
            <input
              id="goal_target_value_input"
              type="number"
              required
              value={targetValue}
              onChange={e => setTargetValue(e.target.value)}
              placeholder="e.g., 100"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Set the monthly maximum footprint limit you wish to stay under.
            </p>
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
              {isSubmitting ? 'Saving...' : 'Set Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
