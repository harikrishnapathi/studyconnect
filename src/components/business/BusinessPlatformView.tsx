import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Crown,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  Award,
  FileText,
  Briefcase,
  Search,
  Filter,
  Download,
  QrCode,
  Share2,
  TrendingUp,
  Zap,
  Tag,
  Gift,
  Check,
  Star,
  Building,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Globe,
  Lock,
  ArrowRight,
  Percent,
  Sparkles,
  PieChart
} from 'lucide-react';
import {
  PaymentGatewayProvider,
  UserSubscription,
  MentorProfile,
  MentorBooking,
  Invoice,
  Wallet,
  LearningPassport,
  VerifiedCertificate,
  CareerServiceOffer,
  JobListing,
  BusinessAnalytics
} from '../../types';
import { PaymentGatewayService } from '../../services/paymentGateway';

export const BusinessPlatformView: React.FC = () => {
  const { user, showToast } = useApp();

  // Sub-Navigation Tabs inside Business Platform
  const [activeSubTab, setActiveSubTab] = useState<
    | 'plans'
    | 'mentors'
    | 'wallet'
    | 'passport'
    | 'careers'
    | 'recruiter'
    | 'invoices'
    | 'analytics'
  >('plans');

  // Subscriptions State
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayProvider>('Stripe');

  // Mentors & Booking State
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [mentorSearch, setMentorSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-08-05');
  const [bookingTime, setBookingTime] = useState('02:00 PM');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Wallet & Transactions State
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Passport & Certificates State
  const [passport, setPassport] = useState<LearningPassport | null>(null);
  const [certificates, setCertificates] = useState<VerifiedCertificate[]>([]);

  // Career Services & Jobs State
  const [careerServices, setCareerServices] = useState<CareerServiceOffer[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);

  // Recruiter Search State
  const [candidateSearchSkill, setCandidateSearchSkill] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);

  // Invoices & Business Analytics State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchMentors();
    fetchWallet();
    fetchPassport();
    fetchCareers();
    fetchInvoices();
    fetchAnalytics();
    fetchCandidates();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/business/plans');
      const data = await res.json();
      if (data.success) setSubscription(data.currentSubscription);
    } catch (e) {}
  };

  const fetchMentors = async () => {
    try {
      const res = await fetch(`/api/business/mentors?search=${mentorSearch}`);
      const data = await res.json();
      if (data.success) setMentors(data.mentors || []);
    } catch (e) {}
  };

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/business/wallet');
      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
        setTransactions(data.transactions || []);
      }
    } catch (e) {}
  };

  const fetchPassport = async () => {
    try {
      const res = await fetch('/api/business/passport');
      const data = await res.json();
      if (data.success) {
        setPassport(data.passport);
        setCertificates(data.certificates || []);
      }
    } catch (e) {}
  };

  const fetchCareers = async () => {
    try {
      const res = await fetch('/api/business/careers');
      const data = await res.json();
      if (data.success) {
        setCareerServices(data.careerServices || []);
        setJobs(data.jobs || []);
      }
    } catch (e) {}
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/business/invoices');
      const data = await res.json();
      if (data.success) setInvoices(data.invoices || []);
    } catch (e) {}
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/business/analytics');
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (e) {}
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`/api/business/recruiter/candidates?skill=${candidateSearchSkill}`);
      const data = await res.json();
      if (data.success) setCandidates(data.candidates || []);
    } catch (e) {}
  };

  // Handlers
  const handleApplyPromo = async () => {
    try {
      const res = await fetch('/api/business/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCodeInput })
      });
      const data = await res.json();
      if (data.success && data.valid) {
        setAppliedPromo(data.coupon.code);
        showToast(data.coupon.message, 'success');
      } else {
        showToast(data.error || 'Invalid Promo Code', 'warning');
      }
    } catch (e) {
      showToast('Error validating promo code', 'warning');
    }
  };

  const handleManageSubscription = async (action: 'Upgrade' | 'Pause' | 'Cancel', tier?: 'PLUS' | 'PRO') => {
    try {
      const res = await fetch('/api/business/subscriptions/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, planTier: tier, billingCycle, provider: selectedGateway })
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        showToast(data.message, 'success');
      }
    } catch (e) {
      showToast('Failed to update subscription', 'warning');
    }
  };

  const handleBookMentorSession = async () => {
    if (!selectedMentor) return;

    try {
      const res = await fetch('/api/business/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          date: bookingDate,
          timeSlot: bookingTime,
          provider: selectedGateway,
          promoCode: appliedPromo
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setIsBookingModalOpen(false);
        setSelectedMentor(null);
        fetchInvoices();
      }
    } catch (e) {
      showToast('Booking transaction failed', 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Banner & Platform Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/50 border-b border-amber-500/20 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Prompt 10 Module Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Core Features 100% FREE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Business & Monetization Platform
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Empowering millions of learners globally. Support for multi-gateway checkout (Stripe, Razorpay, Cashfree, PayPal), verified mentor booking in escrow, wallet credits, learning passports, and career services.
            </p>
          </div>

          {/* Active Plan & Wallet Widget */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-lg">
            <div className="px-3 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Your Plan</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {subscription?.planTier || 'PLUS'} Membership
              </span>
            </div>
            <div className="px-3 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-xs font-bold text-emerald-400">
                ${wallet?.totalBalance || 170} Credits
              </span>
            </div>
            <div className="px-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">GST Invoice</span>
              <span className="text-xs font-bold text-sky-300">18% Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 sticky top-14 z-20 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          {[
            { id: 'plans', label: 'Plans & Pricing', icon: Crown },
            { id: 'mentors', label: 'Mentor Marketplace', icon: UserCheck },
            { id: 'wallet', label: 'Wallet & Credits', icon: DollarSign },
            { id: 'passport', label: 'Passport & Certs', icon: Award },
            { id: 'careers', label: 'Career & Jobs', icon: Briefcase },
            { id: 'recruiter', label: 'Recruiter Portal', icon: Building },
            { id: 'invoices', label: 'Invoices & GST', icon: FileText },
            { id: 'analytics', label: 'Business Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">

        {/* 1. PLANS & PRICING */}
        {activeSubTab === 'plans' && (
          <div className="space-y-8">
            {/* Billing Cycle Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Choose the Right Plan for Your Learning Journey</h3>
                <p className="text-xs text-slate-400">Core study matching & video rooms remain FREE for everyone forever.</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setBillingCycle('Monthly')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === 'Monthly' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('Yearly')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    billingCycle === 'Yearly' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Yearly <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">Save 25%</span>
                </button>
              </div>
            </div>

            {/* Promo Code Input Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Have a Promo Code or Coupon?</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Enter code (e.g. STUDY50)"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none uppercase font-mono"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Apply Code
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* FREE TIER */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">FREE</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">Forever Free</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <p className="text-xs text-slate-400">Core learning features, unlimited study matching, basic chat, voice, video, and whiteboards.</p>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {['Unlimited study matching', 'Basic chat & video calls', 'Interactive Whiteboard', 'Public Study Pods', 'Basic Analytics'].map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <button disabled className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold cursor-default">
                  Included by Default
                </button>
              </div>

              {/* PLUS TIER */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 border-2 border-amber-500 space-y-6 flex flex-col justify-between shadow-xl relative">
                <span className="absolute -top-3 right-6 bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase">Most Popular</span>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">PLUS</span>
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {billingCycle === 'Monthly' ? '$9.99' : '$89.99'} <span className="text-xs text-slate-400 font-normal">/ {billingCycle === 'Monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className="text-xs text-slate-400">Enhanced productivity with AI Study Coach, unlimited cloud storage, custom themes, and priority matching.</p>
                  <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
                    {['Everything in FREE', 'AI Study Coach & AI Flashcards', 'Unlimited Cloud Storage', 'Custom Themes & Profile Ring', 'Priority Study Pod Matching', 'Verified Learning Passport'].map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleManageSubscription('Upgrade', 'PLUS')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  {subscription?.planTier === 'PLUS' ? 'Current Active Plan ✓' : 'Upgrade to PLUS'}
                </button>
              </div>

              {/* PRO TIER */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-400 uppercase tracking-wider">PRO</span>
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {billingCycle === 'Monthly' ? '$19.99' : '$179.99'} <span className="text-xs text-slate-400 font-normal">/ {billingCycle === 'Monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className="text-xs text-slate-400">Complete mentor toolkit, unlimited pods, calendar sync, candidate recruiter indexing, & priority support.</p>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {['Everything in PLUS', 'Mentor Publishing Marketplace', 'Unlimited Pods & Communities', 'Calendar Sync (Google/Outlook)', 'Recruiter Profile Indexing', '24/7 Priority Support'].map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleManageSubscription('Upgrade', 'PRO')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  {subscription?.planTier === 'PRO' ? 'Current Active Plan ✓' : 'Upgrade to PRO'}
                </button>
              </div>
            </div>

            {/* Provider-Independent Payment Gateway Badges */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Supported Payment Gateways & Global Currencies</span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: 'Stripe', region: 'Global' },
                  { name: 'Razorpay', region: 'India (UPI / Cards)' },
                  { name: 'Cashfree', region: 'India' },
                  { name: 'PayPal', region: 'Global' },
                  { name: 'GooglePay', region: 'Mobile' },
                  { name: 'ApplePay', region: 'Mobile' }
                ].map((gw) => (
                  <button
                    key={gw.name}
                    onClick={() => {
                      setSelectedGateway(gw.name as any);
                      showToast(`Selected Payment Provider: ${gw.name}`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      selectedGateway === gw.name
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{gw.name}</span>
                    <span className="text-[10px] opacity-75">({gw.region})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. MENTOR MARKETPLACE */}
        {activeSubTab === 'mentors' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-indigo-400" />
                  Verified Mentor Marketplace
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Book 1-on-1 sessions with verified experts. Payments held securely in Escrow until session completion. Platform fee: 15%.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  placeholder="Search by name, expertise..."
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
                <button onClick={fetchMentors} className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                  Search
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentors.map((mnt) => (
                <div key={mnt.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={mnt.avatar} alt={mnt.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/40" />
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          {mnt.name}
                          {mnt.verifiedBadge && <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />}
                        </h3>
                        <p className="text-xs text-slate-400">{mnt.companyOrInstitution} • {mnt.country}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{mnt.bio}</p>

                    <div className="flex flex-wrap gap-1">
                      {mnt.expertise.map((exp, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> {mnt.rating} ({mnt.reviewCount})
                      </span>
                      <span className="text-white font-extrabold text-sm">${mnt.hourlyPrice} / hr</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMentor(mnt);
                        setIsBookingModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                    >
                      Book Session (Escrow Secured)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && selectedMentor && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Book Session with {selectedMentor.name}</h3>
                  <p className="text-xs text-slate-400">Rate: ${selectedMentor.hourlyPrice} / hour • 15% Escrow Commission</p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Select Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Select Time Slot</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      >
                        {selectedMentor.timeSlots.map((ts) => (
                          <option key={ts} value={ts}>{ts}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Payment Provider</label>
                      <select
                        value={selectedGateway}
                        onChange={(e) => setSelectedGateway(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      >
                        <option value="Stripe">Stripe Credit/Debit Card</option>
                        <option value="Razorpay">Razorpay (India UPI / Cards)</option>
                        <option value="Cashfree">Cashfree (Net Banking)</option>
                        <option value="PayPal">PayPal Global</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span>${selectedMentor.hourlyPrice}.00</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>18% GST Tax:</span>
                      <span>${(selectedMentor.hourlyPrice * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                      <span>Total Payable (Escrow):</span>
                      <span>${(selectedMentor.hourlyPrice * 1.18).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsBookingModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBookMentorSession}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      Pay & Lock Booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. WALLET & REWARD CREDITS */}
        {activeSubTab === 'wallet' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                    StudyConnect Wallet & Credits
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Accumulate referral credits, challenge rewards, and session refunds.</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Balance</span>
                  <span className="text-2xl font-extrabold text-emerald-400">${wallet?.totalBalance || 170} Credits</span>
                </div>
              </div>

              {/* Wallet Credits Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Reward Credits</span>
                  <span className="text-lg font-bold text-amber-400">${wallet?.rewardCredits || 120}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Referral Credits</span>
                  <span className="text-lg font-bold text-sky-400">${wallet?.referralCredits || 50}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Refund Credits</span>
                  <span className="text-lg font-bold text-slate-400">${wallet?.refundCredits || 0}</span>
                </div>
              </div>

              {/* Transaction History Table */}
              <h3 className="text-sm font-bold text-white">Recent Credit Transactions</h3>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{tx.description}</p>
                      <p className="text-[11px] text-slate-400">{tx.timestamp} • Type: {tx.type}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">+{tx.amount} Credits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. LEARNING PASSPORT & CERTIFICATES */}
        {activeSubTab === 'passport' && passport && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-indigo-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={passport.avatar} alt={passport.userName} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {passport.userName}
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    </h2>
                    <p className="text-xs text-slate-300">{passport.headline}</p>
                    <p className="text-[11px] text-indigo-400 mt-1 font-mono">{passport.publicPassportUrl}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(passport.publicPassportUrl);
                    showToast('Public Passport URL copied!', 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share Verified Passport
                </button>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Study Hours</span>
                  <span className="text-lg font-extrabold text-amber-400">{passport.studyHoursTotal} hrs</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reputation Score</span>
                  <span className="text-lg font-extrabold text-emerald-400">{passport.reputationScore} / 100</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Projects Done</span>
                  <span className="text-lg font-extrabold text-sky-400">{passport.projectsCompleted}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Certificates</span>
                  <span className="text-lg font-extrabold text-purple-400">{passport.certificatesEarnedCount}</span>
                </div>
              </div>

              {/* Verified Certificates List */}
              <h3 className="text-sm font-bold text-white pt-2 border-t border-slate-800">Verified StudyConnect Digital Certificates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cert.badgeIcon}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{cert.title}</p>
                        <p className="text-[11px] text-slate-400">Issued: {cert.issueDate}</p>
                        <p className="text-[10px] font-mono text-emerald-400 mt-0.5">Hash: {cert.verificationHash}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`Downloading ${cert.title} PDF Certificate...`, 'info')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CAREERS & JOB BOARD */}
        {activeSubTab === 'careers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-sky-400" />
                Career Services & Verified Job Board
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Resume reviews, mock interviews, and high-impact software/AI opportunities.
              </p>
            </div>

            {/* Career Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careerServices.map((cs) => (
                <div key={cs.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">{cs.title}</h3>
                    <p className="text-xs text-slate-400">{cs.description}</p>
                    <p className="text-[11px] text-sky-300">Turnaround: {cs.deliveryTimeDays} Days</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-base font-extrabold text-white">${cs.price} USD</span>
                    <button onClick={() => showToast(`Booked ${cs.title}`, 'success')} className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold">
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Job Listings Grid */}
            <h3 className="text-sm font-bold text-white mt-8 mb-3">Featured Jobs, Internships & Hackathons</h3>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={job.companyLogo} alt={job.companyName} className="w-12 h-12 rounded-xl object-cover bg-white p-1" />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {job.title}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {job.type}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">{job.companyName} • {job.location} • {job.salaryOrStipend}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Applied for ${job.title}! Passport submitted.`, 'success')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap"
                  >
                    Quick Apply with Passport
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. RECRUITER PORTAL */}
        {activeSubTab === 'recruiter' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building className="w-6 h-6 text-purple-400" />
                  Company & Recruiter Learner Indexing
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Search top 1% verified learners by study hours, reputation score, and verified skill achievements.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={candidateSearchSkill}
                  onChange={(e) => setCandidateSearchSkill(e.target.value)}
                  placeholder="Filter candidates by skill (e.g. PyTorch, React)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
                <button onClick={fetchCandidates} className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">
                  Filter Candidates
                </button>
              </div>

              <div className="space-y-4">
                {candidates.map((cand) => (
                  <div key={cand.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{cand.name} <span className="text-xs text-slate-400">({cand.title})</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">Verified Hours: {cand.studyHours} hrs • Reputation: {cand.reputation}/100</p>
                    </div>

                    <button
                      onClick={() => showToast(`Sent direct job invitation to ${cand.name}!`, 'success')}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold"
                    >
                      Invite to Interview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. INVOICES & GST TAX */}
        {activeSubTab === 'invoices' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-sky-400" />
                GST Tax Invoices & Download History
              </h2>
              <p className="text-xs text-slate-400">
                Official 18% GST tax invoices generated automatically for all purchases, subscription renewals, and mentor bookings.
              </p>

              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{inv.invoiceNumber} • {inv.description}</p>
                      <p className="text-[11px] text-slate-400">Date: {inv.issuedAt} • Provider: {inv.paymentProvider}</p>
                      <p className="text-[10px] text-sky-400">Subtotal: ${inv.subtotal} + 18% GST: ${inv.gstAmount}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-white">${inv.totalAmount}</span>
                      <a
                        href={inv.pdfDownloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. BUSINESS ANALYTICS */}
        {activeSubTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                Financial & Business Analytics Dashboard
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase block">MRR</span>
                  <span className="text-xl font-bold text-emerald-400">${analytics.mrr.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase block">ARR</span>
                  <span className="text-xl font-bold text-amber-400">${analytics.arr.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase block">LTV</span>
                  <span className="text-xl font-bold text-indigo-400">${analytics.ltv}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase block">Churn Rate</span>
                  <span className="text-xl font-bold text-sky-400">{analytics.churnRatePercent}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
