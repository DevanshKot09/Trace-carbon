import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  ArrowRight, 
  Leaf, 
  Flame, 
  Globe, 
  Cpu, 
  LineChart, 
  Trophy, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  Plus,
  Minus,
  Mail,
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const stats = [
    { value: '14,200+', label: 'Active Climate Trackers' },
    { value: '254,000 kg', label: 'CO₂ Emissions Prevented' },
    { value: '18.5%', label: 'Average Footprint Drop' },
    { value: '4.9★', label: 'User Rating Average' }
  ];

  const features = [
    { 
      icon: LineChart, 
      title: 'Real-time Analytics', 
      desc: 'Interactive Recharts layout broken down across Transportation, Food, Grid energy use, Travel and Shopping.' 
    },
    { 
      icon: Cpu, 
      title: 'Eco Calculator', 
      desc: 'Slick customizable factors where you can input trip parameters, local fuel models, and AC habits.' 
    },
    { 
      icon: Trophy, 
      title: 'Gamified Progress', 
      desc: 'Climb sustainability levels, expand tracker streaks, and register official Green badges.' 
    },
    { 
      icon: ShieldCheck, 
      title: 'Smart Goals', 
      desc: 'Set localized caps, watch progress bars dynamically synchronize with your logged ledger activities.' 
    }
  ];

  const faqs = [
    { 
      q: 'How does CarbonWise estimate my carbon footprint?', 
      a: 'We utilize standard EPA coefficients and real-world carbon emission parameters based on your transportation engine types, utility bills (electricity kWh factors), dietary profiles, and shopping weights.' 
    },
    { 
      q: 'Is my tracked data stored securely?', 
      a: 'Yes, absolutely! Authentication details are saved safely inside browser cookies and storage protocols with full support for immediate secure access.' 
    },
    { 
      q: 'Can I export my reports for environmental audits?', 
      a: 'Yes. CarbonWise features fully-functioning CSV and PDF export simulations directly within the Reports block, rendering downloadable tabular audits.' 
    },
    { 
      q: 'What are carbon levels and tracking badges?', 
      a: 'To make climate tracking fun, you earn environmental XP for logging activities and keeping streaks! Badges have designated milestones you unlock over time.' 
    }
  ];

  const testimonials = [
    { 
      quote: "CarbonWise transformed how our household views energy bills. Shaving 20% off our emissions felt like an exciting game!", 
      author: "Marcus Vance", 
      role: "Environmental Science Major", 
      avatarColor: "bg-emerald-500" 
    },
    { 
      quote: "The interface is incredible. Being able to quickly estimate vehicle carbon metrics and log them takes less than three minutes.", 
      author: "Elanor Vance", 
      role: "Tech Lead at GreenCore", 
      avatarColor: "bg-sky-500" 
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Landing page top header bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md dark:border-emerald-950/20 dark:bg-[#07130D]/85">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-display font-bold text-white shadow-md shadow-emerald-500/20 dark:bg-emerald-500">
              <Compass className="h-5 w-5 text-white animate-spin-slow" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-[#0F291E] dark:text-white">
              Carbon<span className="text-emerald-600 dark:text-emerald-450">Wise</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Theme toggler */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-emerald-500 dark:text-gray-400 dark:hover:bg-emerald-950/40 cursor-pointer"
              title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-emerald-800" />}
            </button>

            <Link 
              to="/login" 
              className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-emerald-605 dark:text-gray-300 dark:hover:text-emerald-400"
            >
              Sign In
            </Link>
            
            <Link 
              to="/login?mode=signup" 
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-650 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-linear-to-b from-emerald-50/30 via-white to-transparent dark:from-emerald-950/20 dark:via-[#07130D] dark:to-transparent">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/5"></div>
        <div className="absolute top-1/3 right-10 -z-10 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/5"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join the Climate Solutions Movement</span>
          </div>
          
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Monitor, Analyze, and Shave Your <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">Carbon Footprint</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            CarbonWise is a modern carbon-accounting SaaS for individuals who want to track transit, utility bills, food consumption, and shopped items. Visualize metrics and earn real badges!
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link 
              to="/login?mode=signup" 
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-102 transition-transform dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link 
              to="/login" 
              className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-700 hover:bg-gray-100 shadow-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span>Explore Demo Profile</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. What is Carbon Footprint */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <Flame className="h-5.5 w-5.5" />
              </div>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                What is a Carbon Footprint?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                A carbon footprint represents the total volume of greenhouse gases—mainly carbon dioxide (CO₂) and methane—emitted directly or indirectly by our daily human actions. Everything we consume, from vehicle mileage and flight frequencies to domestic lights and grocery items, contributes to global warming offsets.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                <span>Find out how easy standard steps reduce variables</span>
              </div>
            </div>
            <div className="rounded-3xl bg-linear-to-tr from-emerald-500/10 to-sky-500/10 p-8 border border-emerald-500/10">
              <div className="grid gap-4 grid-cols-2">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xs">
                  <p className="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400">28%</p>
                  <p className="text-xs font-semibold mt-1 uppercase text-gray-400">Transportation share</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xs">
                  <p className="text-3xl font-bold font-display text-teal-600 dark:text-teal-400">22%</p>
                  <p className="text-xs font-semibold mt-1 uppercase text-gray-400">Energy & Power grid</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xs">
                  <p className="text-3xl font-bold font-display text-amber-600 dark:text-amber-400">17%</p>
                  <p className="text-xs font-semibold mt-1 uppercase text-gray-400">Food Manufacturing</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xs">
                  <p className="text-3xl font-bold font-display text-sky-600 dark:text-sky-400">33%</p>
                  <p className="text-xs font-semibold mt-1 uppercase text-gray-400">Travel & Electronics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why It Matters */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
            <Globe className="h-5.5 w-5.5" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Why Shaving Carbon Matters
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Climate instability drives global heat indices, reduces ocean oxygen content, and disrupts agriculture. By tracking emissions daily, you join thousands of global citizens committing to keeping climate indices below a 1.5°C threshold.
          </p>
        </div>
      </section>

      {/* 4. How CarbonWise Works */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Simplified 3-Step Management
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Input Onboarding', desc: 'Detail your standard demographic and domestic energy frameworks to produce a realistic baseline constraint.' },
              { step: '2', title: 'Log Daily Activities', desc: 'Use our calculators to quickly record grocery bills, long flights, smart purchases, or office commute fuel.' },
              { step: '3', title: 'Action & Badges', desc: 'Follow recommended steps, hit monthly caps, track statistics through graphs, and unlock badges.' }
            ].map(item => (
              <div key={item.step} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs relative">
                <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-bold text-white text-sm shadow-md">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/40 border-y border-gray-200 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              A Complete SaaS Carbon Dashboard
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item, id) => {
              const Icon = item.icon;
              return (
                <div key={id} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Statistics Counter Summary */}
      <section className="py-16 bg-emerald-600 dark:bg-emerald-900 text-white rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 shadow-xl shadow-emerald-500/10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {stats.map((item, id) => (
            <div key={id}>
              <p className="font-display text-4xl sm:text-5xl font-extrabold">{item.value}</p>
              <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-emerald-100">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Empowering Climate Champions
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((item, id) => (
              <div key={id} className="bg-gray-50/50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="italic text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  "{item.quote}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full ${item.avatarColor} flex items-center justify-center font-bold text-white text-xs`}>
                    {item.author[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-950 dark:text-white">{item.author}</h4>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Interactive FAQs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3.5">
            {faqs.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4.5 text-left font-display font-bold text-sm text-gray-900 dark:text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  {activeFaq === index ? <Minus className="h-4 w-4 text-emerald-500" /> : <Plus className="h-4 w-4 text-emerald-500" />}
                </button>
                {activeFaq === index && (
                  <div className="p-4.5 pt-0 border-t border-gray-500/10 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-950/20">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact Section */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-md px-4 sm:px-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Mail className="h-5.5 w-5.5" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Ask Our Climate Planners
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">Have queries about coefficients or partnership logs? Emit a request!</p>

          <form onSubmit={handleContactSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Marcus Vance"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="marcus@example.com"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Your Message</label>
              <textarea
                required
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="Type question detail..."
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800"
              />
            </div>

            {contactSubmitted && (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-500/15 flex items-center justify-center gap-1.5 font-semibold">
                <UserCheck className="h-4 w-4" /> Message delivered successfully! We'll reach out shortly.
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              Emit Message
            </button>
          </form>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-900 bg-gray-50 dark:bg-gray-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
              <Compass className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
              Carbon<span className="text-emerald-500">Wise</span>
            </span>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} CarbonWise LLC. All rights reserved. Empowering climate offsets.
          </p>

          <div className="flex gap-4">
            <Link to="/login" className="text-xs font-semibold text-gray-500 hover:text-emerald-500 dark:text-gray-400">Login Platform</Link>
            <Link to="/login?mode=signup" className="text-xs font-semibold text-gray-500 hover:text-emerald-500 dark:text-gray-400">Join Climate List</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
