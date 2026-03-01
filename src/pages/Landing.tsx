import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  DollarSign,
  Leaf,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
  Zap
} from 'lucide-react';

const trustMetrics = [
  {
    label: 'Average savings each quarter',
    value: '$400+',
    icon: DollarSign,
    iconStyle: 'from-emerald-500 to-green-500'
  },
  {
    label: 'UCI verified trust badges',
    value: '100%',
    icon: UserCheck,
    iconStyle: 'from-uci-blue to-blue-500'
  },
  {
    label: 'Setup time for new users',
    value: '< 2 min',
    icon: Clock3,
    iconStyle: 'from-indigo-500 to-violet-500'
  },
  {
    label: 'Campus sustainability impact',
    value: 'Lower CO2',
    icon: Leaf,
    iconStyle: 'from-teal-500 to-cyan-500'
  }
] as const;

const rideFlow = [
  {
    step: '01',
    title: 'Set your route in seconds',
    body: 'Choose commute days, pickup windows, and seat preferences once. ZotPool remembers your schedule.',
    icon: Route
  },
  {
    step: '02',
    title: 'Match with verified riders',
    body: 'Browse offers from verified UCI students and community members, compare departure details, and confirm with confidence.',
    icon: Users
  },
  {
    step: '03',
    title: 'Ride and split smarter',
    body: 'Know your cost up front and keep a reliable weekly commute without driving every day.',
    icon: CalendarCheck2
  }
] as const;

const featureHighlights = [
  {
    title: 'Cost clarity before you commit',
    description:
      'See expected gas and parking split details before requesting a seat so there are no last-minute surprises.',
    icon: DollarSign,
    accent: 'from-emerald-500 to-lime-500',
    bullets: ['Transparent per-seat pricing', 'Clear pickup windows']
  },
  {
    title: 'Safety built into every ride',
    description:
      'UCI verification and community standards keep your carpool network trusted. General users are welcome with full transparency.',
    icon: ShieldCheck,
    accent: 'from-uci-blue to-blue-500',
    bullets: ['Verified @uci.edu accounts get a trust badge', 'Community standards for all users']
  },
  {
    title: 'Community-powered commuting',
    description:
      'Build familiar weekly ride circles with classmates from your area and cut wasted solo trips.',
    icon: Users,
    accent: 'from-amber-500 to-orange-500',
    bullets: ['Recurring ride coordination', 'Better rider-driver consistency']
  },
  {
    title: 'Sustainability that scales',
    description:
      'Fewer single-occupancy vehicles means less congestion around campus and a cleaner daily commute.',
    icon: Leaf,
    accent: 'from-teal-500 to-cyan-500',
    bullets: ['Lower per-person emissions', 'Reduced campus traffic']
  }
] as const;

const testimonials = [
  {
    name: 'Maya C.',
    role: 'Computer Science, Class of 2027',
    quote:
      'I stopped buying daily parking and now ride with the same two classmates each week. It feels way more organized.'
  },
  {
    name: 'Daniel R.',
    role: 'Business Admin, Class of 2026',
    quote:
      'The verified student network is the main reason I trust it. I found a consistent route during week one.'
  },
  {
    name: 'Avery P.',
    role: 'Public Health, Class of 2028',
    quote:
      'Commuting used to be stressful. Now I know exactly when I leave and what I pay before every ride.'
  }
] as const;

const faqs = [
  {
    question: 'Who can use ZotPool?',
    answer:
      'ZotPool is open to everyone. UCI students get a verified badge and full access via @uci.edu sign-in. General users can sign up with any email to browse, post, and match with rides in the Irvine area.'
  },
  {
    question: 'What is the difference between UCI and general accounts?',
    answer:
      'UCI verified accounts can see all rides and restrict their posts to fellow UCI members. General accounts have full access to community rides but cannot view UCI-only listings.'
  },
  {
    question: 'How quickly can I find a ride?',
    answer:
      'Most users can set up a profile and request a seat in under two minutes. Matching speed depends on your route and time window.'
  },
  {
    question: 'What does it cost?',
    answer:
      'Drivers and riders agree on split costs before the trip. Pricing is visible up front to avoid uncertainty.'
  },
  {
    question: 'Can I post recurring rides?',
    answer:
      'Yes. You can publish regular commute schedules so you do not need to recreate the same ride each day.'
  }
] as const;

export const Landing: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 pb-32 md:pb-40">
        <div className="absolute inset-0 mesh-bg opacity-100"></div>
        <div className="absolute inset-0 hero-grain opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 inline-flex rounded-full bg-uci-gold/40"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-uci-gold"></span>
              </span>
              For Anteaters, by Anteaters
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.9] text-balance drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              The smart way <br/> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-uci-gold to-yellow-300">commute</span>.
            </h1>

            <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Save cash, reduce emissions, and vibe with fellow students on your way to campus.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <Link to="/signup?tier=uci" className="group relative bg-white text-uci-blue px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)] transition-all overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">UCI Student? Start Here <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></span>
              </Link>
              <Link to="/signup?tier=general" className="px-8 py-4 rounded-full font-semibold text-lg text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
                Not UCI? Join Too
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Curve */}
        <div className="absolute bottom-0 w-full">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-slate-50 w-full h-auto block translate-y-1" style={{ overflow: 'visible' }}>
              <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>

              {/* Anteater Car driving along the curve */}
              <g style={{ pointerEvents: 'none' }}>
                <animateMotion
                  dur="14s"
                  repeatCount="indefinite"
                  rotate="auto"
                  path="M-150,224L0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1590,192"
                />
                <image href="/anteater-car.png" width="120" height="76" x="-60" y="-72" />
              </g>
           </svg>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="bg-white border-y border-slate-200 deferred-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${metric.iconStyle} rounded-xl flex items-center justify-center text-white shadow-md`}>
                      <Icon size={19} />
                    </div>
                    <p className="font-display text-2xl font-bold text-slate-900">{metric.value}</p>
                  </div>
                  <p className="text-sm text-slate-600">{metric.label}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commute Flow */}
      <section className="py-24 bg-slate-50 deferred-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-uci-blue/10 text-uci-blue rounded-full font-semibold text-sm mb-5">
              <Sparkles size={16} /> How ZotPool Works
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 text-balance">
              A cleaner flow for daily campus commuting
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto">
              From signup to seat confirmation, the product is designed to reduce friction at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="space-y-4">
              {rideFlow.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex gap-5 items-start">
                      <div className="shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-uci-blue/10 text-uci-blue flex items-center justify-center mb-3">
                          <Icon size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 tracking-[0.22em]">STEP {item.step}</p>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600 text-lg leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white p-8 md:p-10 shadow-2xl shadow-slate-900/25">
              <div className="absolute -top-24 -left-24 w-56 h-56 bg-uci-blue/40 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-uci-gold/25 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h3 className="font-display text-3xl font-bold mb-4">Built for students with real schedules</h3>
                <p className="text-slate-200 text-lg leading-relaxed mb-7">
                  Instead of one-off rides, ZotPool helps you lock in repeatable commute routines around classes and labs.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-uci-gold shrink-0 mt-1" />
                    <p className="text-slate-200">Match with students commuting from your area</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-uci-gold shrink-0 mt-1" />
                    <p className="text-slate-200">Keep your weekly departure times consistent</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-uci-gold shrink-0 mt-1" />
                    <p className="text-slate-200">Reduce solo driving without sacrificing reliability</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                    <p className="font-display text-3xl font-bold text-white">3x</p>
                    <p className="text-sm text-slate-300 mt-1">More predictable commute planning</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                    <p className="font-display text-3xl font-bold text-white">1 app</p>
                    <p className="text-sm text-slate-300 mt-1">For rides, trust, and coordination</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-24 bg-white deferred-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-slate-900 text-white text-sm font-bold rounded-full mb-4">
              Why Students Keep Using It
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5">
              Enterprise-grade clarity, <span className="text-uci-blue">student-first experience</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Every screen focuses on fewer taps, stronger trust signals, and faster decisions during busy class days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featureHighlights.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.accent} rounded-2xl flex items-center justify-center text-white mb-6 shadow-md`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-5">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 size={16} className="text-uci-blue shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-slate-50 deferred-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full font-semibold text-sm mb-4">
              <Star size={14} className="fill-current" /> Social Proof
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Students trust ZotPool for their weekly commute
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              Real riders, real routes, and consistent outcomes during high-pressure academic schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${testimonial.name}-${index}`} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white deferred-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-uci-blue/10 text-uci-blue rounded-full font-semibold text-sm mb-4">
              <ShieldCheck size={14} /> FAQ
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">Questions students usually ask first</h2>
            <p className="text-slate-600 text-lg">
              Clear answers to help you get started quickly and ride with confidence.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900 text-lg">{faq.question}</h3>
                  <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-slate-600 leading-relaxed mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50 deferred-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-uci-blue to-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="absolute inset-0 dot-grid-overlay opacity-25"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-uci-gold/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-black mb-6">Ready to lock in your weekly commute?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join ZotPool to save money, reduce parking stress, and travel with verified commuters in the Irvine area.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="inline-flex items-center justify-center gap-3 bg-white text-uci-blue px-10 py-5 rounded-full font-bold text-xl hover:bg-uci-gold hover:text-uci-dark transition-colors shadow-xl">
                  <Zap size={24} fill="currentColor" /> Create Free Account
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors font-semibold">
                  Browse Rides <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
