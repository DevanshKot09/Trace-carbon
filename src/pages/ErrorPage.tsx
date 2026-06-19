import { Link } from 'react-router-dom';
import { Compass, FileX2, ArrowRight } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
        <FileX2 className="h-7 w-7" />
      </div>
      
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Page Not Located
      </h1>
      <p className="mt-2.5 max-w-sm text-sm text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
        The climate link or dashboard report context you requested doesn't exist, or has been relocated to another sector.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          to="/"
          className="rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Back to Welcome Block
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
        >
          <span>Eco Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-2 opacity-50">
        <Compass className="h-5 w-5 text-emerald-500" />
        <span className="font-display font-medium text-xs text-gray-400">CarbonWise Diagnostics</span>
      </div>
    </div>
  );
}
