import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, PlusCircle, Search, Home, Menu, X, FlaskConical, Handshake, Bell } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, loginForTesting } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const userInitial = user?.name?.charAt(0) || 'U';
  const userFirstName = user?.name?.split(' ')[0] || 'Profile';

  const handleTestOnboarding = () => {
    loginForTesting();
    navigate('/onboarding');
  };

  const handleSkipToDashboard = () => {
    loginForTesting(true);
    navigate('/dashboard');
  };

  type NavLinkProps = {
    to: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    primary?: boolean;
  };

  const NavLink = ({ to, icon: Icon, label, primary = false }: NavLinkProps) => {
    const isActive = location.pathname === to;
    return (
        <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 group ${
            isActive
            ? 'bg-uci-blue text-white shadow-lg shadow-uci-blue/25'
            : primary
            ? 'bg-uci-gold text-uci-dark font-bold hover:shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-0.5'
            : 'text-slate-600 hover:bg-slate-100 hover:text-uci-blue'
        }`}
        >
        <Icon size={18} />
        <span className="font-medium">{label}</span>
        </Link>
    );
  };

  const isLandingPage = location.pathname === '/';
  const isFullScreenPage = ['/onboarding', '/waiver'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50/50">
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <nav className={`${isLandingPage ? 'glass-solid' : 'glass'} rounded-full shadow-xl shadow-slate-200/50 pointer-events-auto w-full max-w-5xl mx-auto transition-all duration-300`}>
            <div className="px-6">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/assets/icon.png" alt="ZotPool" className="h-[60px] w-[60px] group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-display font-bold text-2xl tracking-tight text-uci-dark">Zot<span className="text-uci-blue">Pool</span></span>
                </Link>
                </div>

                {/* Desktop Navigation */}
                {user && (
                <div className="hidden md:flex items-center gap-1">
                    <NavLink to="/dashboard" icon={Home} label="Home" />
                    <NavLink to="/browse" icon={Search} label="Browse" />
                    <NavLink to="/matches" icon={Handshake} label="Matches" />
                    <NavLink to="/create" icon={PlusCircle} label="Post Ride" primary />
                    <div className="h-6 w-px bg-slate-200 mx-3"></div>
                    <Link
                        to="/profile"
                        className={`flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full transition-all border ${
                            location.pathname === '/profile'
                            ? 'border-uci-blue bg-blue-50'
                            : 'border-transparent hover:bg-slate-100'
                        }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-uci-blue to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {userInitial}
                        </div>
                        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{userFirstName}</span>
                    </Link>
                    <NotificationBell
                        notifications={notifications}
                        unreadCount={unreadCount}
                        onMarkRead={markAsRead}
                        onMarkAllRead={markAllRead}
                    />
                    <button
                        onClick={logout}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
                )}

                {/* Public Navigation */}
                {!user && (
                <div className="hidden md:flex items-center space-x-2">
                    {import.meta.env.DEV && (<>
                    <button
                      onClick={handleTestOnboarding}
                      className="flex items-center gap-1.5 px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-full transition-colors text-sm border border-orange-200 border-dashed"
                    >
                      <FlaskConical size={16} /> Test Onboard
                    </button>
                    <button
                      onClick={handleSkipToDashboard}
                      className="flex items-center gap-1.5 px-4 py-2 text-green-600 font-medium hover:bg-green-50 rounded-full transition-colors text-sm border border-green-200 border-dashed"
                    >
                      <FlaskConical size={16} /> Skip to Dash
                    </button>
                    </>)}
                    <Link to="/login" className="px-5 py-2.5 text-uci-blue font-semibold hover:bg-blue-50 rounded-full transition-colors">Log In</Link>
                    <Link to="/signup" className="bg-uci-blue text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-900/20 transform hover:-translate-y-0.5">
                    Sign Up
                    </Link>
                </div>
                )}

                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label="Toggle navigation menu"
                    className="text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                </div>
            </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
            <div
              id="mobile-menu"
              aria-hidden={!isMobileMenuOpen}
              className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-4 space-y-2 animate-in slide-in-from-top-4 fade-in duration-200"
            >
                {user ? (
                <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium">
                        <Home size={20} className="text-uci-blue" /> Home
                    </Link>
                    <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium">
                        <Search size={20} className="text-uci-blue" /> Browse
                    </Link>
                    <Link to="/matches" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium">
                        <Handshake size={20} className="text-uci-blue" /> Matches
                    </Link>
                    <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-uci-gold/20 text-uci-dark font-bold">
                        <PlusCircle size={20} /> Post Ride
                    </Link>
                    <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium">
                        <Bell size={20} className="text-uci-blue" />
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                    </Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium">
                        <User size={20} className="text-uci-blue" /> Profile
                    </Link>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <button
                        onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </>
                ) : (
                    <div className="flex flex-col gap-3 p-2">
                        {import.meta.env.DEV && (<>
                        <button
                          onClick={() => {
                            handleTestOnboarding();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 text-orange-600 font-medium hover:bg-orange-50 rounded-xl transition-colors border border-orange-200 border-dashed"
                        >
                          <FlaskConical size={18} /> Test Onboard
                        </button>
                        <button
                          onClick={() => {
                            handleSkipToDashboard();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 text-green-600 font-medium hover:bg-green-50 rounded-xl transition-colors border border-green-200 border-dashed"
                        >
                          <FlaskConical size={18} /> Skip to Dash
                        </button>
                        </>)}
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 text-uci-blue font-bold hover:bg-blue-50 rounded-xl transition-colors">Log In</Link>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 bg-uci-blue text-white font-bold rounded-xl shadow-lg shadow-blue-500/25">Sign Up</Link>
                    </div>
                )}
            </div>
            )}
        </nav>
      </div>

      <main className={`flex-grow relative z-0 ${isLandingPage || isFullScreenPage ? '' : 'pt-28 pb-12'}`}>
        {children}
      </main>

      <footer className="bg-slate-900 text-white pt-16 pb-12 mt-auto relative overflow-hidden">
        {/* Abstract background shape in footer */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-uci-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/assets/icon.png" alt="ZotPool" className="h-9 w-9" />
                <span className="font-display font-bold text-2xl tracking-tight">Zot<span className="text-uci-gold">Pool</span></span>
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                Reimagining the UCI commute. Join thousands of Anteaters saving money and the planet, one ride at a time.
              </p>
            </div>
            <div>
              <h3 className="font-display font-bold mb-6 text-white tracking-wide text-sm uppercase">Platform</h3>
              <ul className="space-y-4 text-slate-400">
                <li><span className="text-slate-300">How it Works</span></li>
                <li><span className="text-slate-300">Safety</span></li>
                <li><span className="text-slate-300">Community Guidelines</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold mb-6 text-white tracking-wide text-sm uppercase">Legal</h3>
              <ul className="space-y-4 text-slate-400">
                <li><span className="text-slate-300">Privacy Policy</span></li>
                <li><span className="text-slate-300">Terms of Service</span></li>
                <li><span className="text-slate-300">Contact Support</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
             <p>© {new Date().getFullYear()} ZotPool. Not officially affiliated with UC Irvine.</p>
             <div className="flex gap-6">
                 <span className="text-slate-400">Twitter</span>
                 <span className="text-slate-400">Instagram</span>
                 <span className="text-slate-400">Discord</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
