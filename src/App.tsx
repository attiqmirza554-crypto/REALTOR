import { useState, useEffect } from 'react';
import { Property, Testimonial, SiteSettings, User, Lead } from './types';
import { INITIAL_PROPERTIES, INITIAL_TESTIMONIALS, INITIAL_SETTINGS, INITIAL_LEADS } from './data/initialData';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WhyChooseUs from './components/WhyChooseUs';
import PropertySection from './components/PropertySection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// Views & Modals
import AllPropertiesView from './components/AllPropertiesView';
import PropertyDetailsView from './components/PropertyDetailsView';
import WishlistDrawer from './components/WishlistDrawer';
import CompareModal from './components/CompareModal';
import ScheduleVisitModal from './components/ScheduleVisitModal';
import ShareModal from './components/ShareModal';
import QuickSearchModal from './components/QuickSearchModal';
import AiAssistantModal from './components/AiAssistantModal';
import { Sparkles } from 'lucide-react';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import AdminProperties from './components/admin/AdminProperties';
import AdminLeads from './components/admin/AdminLeads';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminSettings from './components/admin/AdminSettings';
import ClientSiteGeneratorDashboard from './components/admin/ClientSiteGeneratorDashboard';
import AgencyQuickBar from './components/AgencyQuickBar';

export default function App() {
  const [loading, setLoading] = useState(true);

  // App Navigation View Mode
  const [currentView, setCurrentView] = useState<
    'home' | 'all-properties' | 'details' | 'admin-login' | 'admin-dashboard'
  >('home');

  // Agency Master Access Mode (Default false; enabled via secret URL param ?agency=true / ?master=true or master login)
  const [isAgencyMaster, setIsAgencyMaster] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (
        urlParams.get('agency') === 'true' ||
        urlParams.get('master') === 'true' ||
        urlParams.get('generator') === 'true' ||
        hash === '#agency' ||
        hash === '#generator'
      ) {
        return true;
      }
      return localStorage.getItem('aurahaven_agency_master') === 'true';
    } catch {
      return false;
    }
  });

  // Admin Active Tab (Default 'overview' for clients, 'generator' for agency master)
  const [adminSection, setAdminSection] = useState(() => (isAgencyMaster ? 'generator' : 'overview'));

  // Data States
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'Aura Haven',
    siteTagline: 'Luxury Real Estate',
    contactPhone: '+1 (800) 888-AURA',
    contactEmail: 'concierge@aurahaven.com',
    officeAddress: '9500 Wilshire Blvd, Beverly Hills, CA 90212',
    currencySymbol: '$',
    googleMapsApiKey: ''
  });

  // Selected Property for Details Page
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Wishlist & Compare States
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aurahaven_wishlist');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Modals Open States
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [scheduleVisitOpen, setScheduleVisitOpen] = useState(false);
  const [shareProperty, setShareProperty] = useState<Property | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Fetch Data on Load & Parse Client Demo URL Parameters
  const fetchAllData = async () => {
    try {
      let pData = INITIAL_PROPERTIES;
      let tData = INITIAL_TESTIMONIALS;
      let sData = INITIAL_SETTINGS;
      let lData = INITIAL_LEADS;

      // 1. Try LocalStorage first as primary/cache store (crucial for GitHub Pages / static deployment)
      try {
        const savedProps = localStorage.getItem('aurahaven_properties');
        if (savedProps) {
          pData = JSON.parse(savedProps);
        } else {
          localStorage.setItem('aurahaven_properties', JSON.stringify(pData));
        }

        const savedTestimonials = localStorage.getItem('aurahaven_testimonials');
        if (savedTestimonials) {
          tData = JSON.parse(savedTestimonials);
        } else {
          localStorage.setItem('aurahaven_testimonials', JSON.stringify(tData));
        }

        const savedLeads = localStorage.getItem('aurahaven_leads');
        if (savedLeads) {
          lData = JSON.parse(savedLeads);
        } else {
          localStorage.setItem('aurahaven_leads', JSON.stringify(lData));
        }

        const savedSettings = localStorage.getItem('aurahaven_settings');
        if (savedSettings) {
          sData = JSON.parse(savedSettings);
        } else {
          localStorage.setItem('aurahaven_settings', JSON.stringify(sData));
        }
      } catch (lsErr) {
        console.warn('LocalStorage read/write warning:', lsErr);
      }

      // 2. Try fetching from server API endpoints if running on live backend
      try {
        const fetchJsonOrNull = async (url: string) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return await res.json();
            }
            return null;
          } catch {
            return null;
          }
        };

        const [pRes, tRes, sRes, lRes] = await Promise.all([
          fetchJsonOrNull('/api/properties'),
          fetchJsonOrNull('/api/testimonials'),
          fetchJsonOrNull('/api/settings'),
          fetchJsonOrNull('/api/leads')
        ]);

        if (pRes && pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
          pData = pRes.data;
          localStorage.setItem('aurahaven_properties', JSON.stringify(pData));
        }
        if (tRes && tRes.data && Array.isArray(tRes.data) && tRes.data.length > 0) {
          tData = tRes.data;
          localStorage.setItem('aurahaven_testimonials', JSON.stringify(tData));
        }
        if (sRes && sRes.data && typeof sRes.data === 'object') {
          sData = { ...sData, ...sRes.data };
          localStorage.setItem('aurahaven_settings', JSON.stringify(sData));
        }
        if (lRes && lRes.data && Array.isArray(lRes.data)) {
          lData = lRes.data;
          localStorage.setItem('aurahaven_leads', JSON.stringify(lData));
        }
      } catch (apiErr) {
        console.warn('API fetch warning (running in static / client mode):', apiErr);
      }

      setProperties(pData);
      setTestimonials(tData);
      setLeads(lData);

      let fetchedSettings = sData;

      // Check URL parameters & path for dynamic client demo site customization
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash ? window.location.hash.substring(1) : '';
      const encodedData = urlParams.get('d') || (hash.startsWith('d=') ? hash.substring(2) : '');

      // Clean Pathname Reader (e.g. realtordemos.site/farooqmarketing or /client-1 or /paso-robles)
      let rawPath = (urlParams.get('path') || sessionStorage.getItem('spa_redirect_path') || window.location.pathname).replace(/^\/|\/$/g, '');
      try {
        sessionStorage.removeItem('spa_redirect_path');
      } catch (e) {
        // ignore
      }
      // Ignore repository name if hosted under subpath like REALTOR
      if (rawPath.toLowerCase().startsWith('realtor')) {
        rawPath = rawPath.substring(7).replace(/^\/|\/$/g, '');
      }
      const pathSlug = rawPath && !rawPath.includes('.') && rawPath !== 'index.html' ? rawPath : '';

      let urlCity = urlParams.get('clientCity') || urlParams.get('city');
      let urlState = urlParams.get('state');
      let urlH1 = urlParams.get('h1');
      let urlAreas = urlParams.get('areas');
      let urlPhone = urlParams.get('phone');
      let urlClientName = urlParams.get('clientName') || urlParams.get('r') || urlParams.get('c') || urlParams.get('agency') || urlParams.get('client');
      let urlAddress = urlParams.get('address');
      let urlEmail = urlParams.get('email');

      // 1. Decode Encoded Short Data parameter (?d= or #d=)
      if (encodedData) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(encodedData)));
          const parsed = JSON.parse(jsonStr);
          if (parsed.n) urlClientName = parsed.n;
          if (parsed.c) urlCity = parsed.c;
          if (parsed.s) urlState = parsed.s;
          if (parsed.p) urlPhone = parsed.p;
          if (parsed.a) urlAddress = parsed.a;
          if (parsed.e) urlEmail = parsed.e;
          if (parsed.h) urlH1 = parsed.h;
          if (parsed.ar) urlAreas = Array.isArray(parsed.ar) ? parsed.ar.join(',') : parsed.ar;
        } catch (e) {
          console.warn('Could not parse short encoded data from URL:', e);
        }
      }

      // 2. Check LocalStorage Registry for short slug / path / hash match if present
      const shortSlug = pathSlug || urlParams.get('r') || urlParams.get('c') || urlParams.get('agency') || (hash && !hash.startsWith('d=') ? hash : '');
      if (shortSlug && shortSlug !== 'true') {
        try {
          const savedStr = localStorage.getItem('aurahaven_client_prospects') || localStorage.getItem('generated_client_sites');
          if (savedStr) {
            const savedRecords = JSON.parse(savedStr);
            const found = savedRecords.find((rec: any) => 
              rec.clientName.toLowerCase().replace(/[^a-z0-9]/g, '-') === shortSlug.toLowerCase() ||
              rec.clientName.toLowerCase().replace(/[^a-z0-9]/g, '') === shortSlug.toLowerCase() ||
              rec.id.toLowerCase() === shortSlug.toLowerCase()
            );
            if (found) {
              urlClientName = found.clientName;
              urlCity = found.city;
              urlState = found.state;
              urlPhone = found.phone;
              urlAddress = found.address;
              urlH1 = found.seoCustomH1;
              urlAreas = Array.isArray(found.serviceAreas) ? found.serviceAreas.join(',') : found.serviceAreas;
            }
          }
        } catch (e) {
          console.warn('LocalStorage lookup error:', e);
        }

        // If not found in records, auto-format slug into title if no client name specified
        if (!urlClientName && shortSlug) {
          const formatted = shortSlug
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase());
          if (formatted.length > 2 && formatted.toLowerCase() !== 'true') {
            urlClientName = formatted.includes('Real') || formatted.includes('Realty') || formatted.includes('Marketing') || formatted.includes('Group')
              ? formatted
              : `${formatted} Real Estate`;
          }
        }
      }

      if (urlCity || urlH1 || urlClientName || urlPhone || urlAddress) {
        const activeCity = urlCity || fetchedSettings.targetCity || 'Waterloo';
        const activeState = urlState || fetchedSettings.targetState || 'ON';
        const calculatedH1 = urlH1 || `Luxury Real Estate & Homes for Sale in ${activeCity}, ${activeState}`;

        fetchedSettings = {
          ...fetchedSettings,
          targetCity: activeCity,
          targetState: activeState,
          seoCustomH1: calculatedH1,
          companyName: urlClientName || fetchedSettings.companyName,
          siteTitle: urlClientName || fetchedSettings.siteTitle,
          contactPhone: urlPhone || fetchedSettings.contactPhone,
          officeAddress: urlAddress || fetchedSettings.officeAddress,
          contactEmail: urlEmail || fetchedSettings.contactEmail,
          serviceAreas: urlAreas ? urlAreas.split(',') : fetchedSettings.serviceAreas
        };
      }

      setSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to load initial API data:', err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurahaven_wishlist', JSON.stringify(wishlistIds));
    } catch (err) {
      console.error(err);
    }
  }, [wishlistIds]);

  // Wishlist Handlers
  const handleToggleWishlist = (property: Property) => {
    if (wishlistIds.includes(property.id)) {
      setWishlistIds(wishlistIds.filter((id) => id !== property.id));
    } else {
      setWishlistIds([...wishlistIds, property.id]);
    }
  };

  // Compare Handlers
  const handleToggleCompare = (property: Property) => {
    if (compareIds.includes(property.id)) {
      setCompareIds(compareIds.filter((id) => id !== property.id));
    } else {
      if (compareIds.length >= 4) {
        alert('You can compare up to 4 properties simultaneously.');
        return;
      }
      setCompareIds([...compareIds, property.id]);
      setCompareOpen(true);
    }
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSiteSettings = (newSet: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSet }));
  };

  const wishlistProperties = properties.filter((p) => wishlistIds.includes(p.id));
  const compareProperties = properties.filter((p) => compareIds.includes(p.id));

  if (loading) {
    return <PageLoader />;
  }

  // Admin View Rendering
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(user, isMasterLogin) => {
          setCurrentUser(user);
          if (isMasterLogin) {
            setIsAgencyMaster(true);
            localStorage.setItem('aurahaven_agency_master', 'true');
            setAdminSection('generator');
          } else {
            setIsAgencyMaster(false);
            localStorage.removeItem('aurahaven_agency_master');
            setAdminSection('overview');
          }
          setCurrentView('admin-dashboard');
        }}
        onCancel={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'admin-dashboard' && currentUser) {
    return (
      <AdminLayout
        user={currentUser}
        activeSection={adminSection}
        setActiveSection={setAdminSection}
        onLogout={() => {
          setCurrentUser(null);
          setCurrentView('home');
        }}
        onViewPublicSite={() => setCurrentView('home')}
        isAgencyMaster={isAgencyMaster}
        onToggleAgencyMaster={() => {
          const next = !isAgencyMaster;
          setIsAgencyMaster(next);
          if (next) {
            localStorage.setItem('aurahaven_agency_master', 'true');
            setAdminSection('generator');
          } else {
            localStorage.removeItem('aurahaven_agency_master');
            setAdminSection('overview');
          }
        }}
        companyName={settings.companyName || settings.siteTitle}
      >
        {adminSection === 'generator' && (
          <ClientSiteGeneratorDashboard
            currentSettings={settings}
            onUpdateSiteSettings={(newSet) => setSettings({ ...settings, ...newSet })}
            onViewLiveSite={() => setCurrentView('home')}
          />
        )}
        {adminSection === 'overview' && (
          <AdminOverview
            properties={properties}
            leads={leads}
            onNavigate={(sec) => setAdminSection(sec)}
            onOpenAddProperty={() => setAdminSection('properties')}
          />
        )}
        {adminSection === 'properties' && (
          <AdminProperties
            properties={properties}
            onRefresh={fetchAllData}
            onOpenAddModal={() => {}}
          />
        )}
        {adminSection === 'leads' && (
          <AdminLeads leads={leads} onRefresh={fetchAllData} />
        )}
        {adminSection === 'testimonials' && (
          <AdminTestimonials testimonials={testimonials} onRefresh={fetchAllData} />
        )}
        {adminSection === 'settings' && (
          <AdminSettings settings={settings} onRefresh={fetchAllData} />
        )}
      </AdminLayout>
    );
  }

  // Check if current URL parameters indicate a dynamic client site preview
  const currentUrlParams = new URLSearchParams(window.location.search);
  const isClientPreviewUrl = Boolean(
    currentUrlParams.get('clientCity') ||
    currentUrlParams.get('clientName') ||
    currentUrlParams.get('h1') ||
    currentUrlParams.get('phone') ||
    currentUrlParams.get('address')
  );
  const forceAgencyMode = currentUrlParams.get('agency') === 'true';

  // Agency tools (QuickBar & Navbar Generator Button) ONLY show when Agency Master Mode is active
  const showAgencyTools = isAgencyMaster;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-slate-950">
      {/* Global Navbar */}
      <Navbar
        settings={settings}
        onNavigateHome={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateAllProperties={() => {
          setCurrentView('all-properties');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          if (currentUser) {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('admin-login');
          }
        }}
        onOpenAgencyGenerator={
          showAgencyTools
            ? () => {
                setIsAgencyMaster(true);
                if (!currentUser) {
                  setCurrentUser({
                    id: 'agency-owner-1',
                    name: 'Agency Owner',
                    email: 'agency@master.com',
                    role: 'admin'
                  });
                }
                setCurrentView('admin-dashboard');
                setAdminSection('generator');
              }
            : undefined
        }
        wishlistCount={wishlistIds.length}
        compareCount={compareIds.length}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenScheduleVisit={() => setScheduleVisitOpen(true)}
        onOpenSearch={() => setQuickSearchOpen(true)}
      />

      {/* Floating Agency Live Customizer Bar (Only visible in Agency Mode, hidden on Client Previews) */}
      {showAgencyTools && (
        <AgencyQuickBar
          settings={settings}
          onUpdateSettings={handleUpdateSiteSettings}
          onOpenBulkGenerator={() => {
            setIsAgencyMaster(true);
            if (!currentUser) {
              setCurrentUser({
                id: 'agency-owner-1',
                name: 'Agency Owner',
                email: 'agency@master.com',
                role: 'admin'
              });
            }
            setCurrentView('admin-dashboard');
            setAdminSection('generator');
          }}
        />
      )}

      {/* Main Public Body Views */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <HeroSection
              properties={properties}
              settings={settings}
              onSelectProperty={handleSelectProperty}
              onExploreAll={() => setCurrentView('all-properties')}
            />
            <PropertySection
              properties={properties}
              onSelectProperty={handleSelectProperty}
              onViewAll={() => setCurrentView('all-properties')}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              compareIds={compareIds}
              onToggleCompare={handleToggleCompare}
              onShare={(p) => setShareProperty(p)}
            />
            <AboutSection settings={settings} />
            <WhyChooseUs settings={settings} />
            <TestimonialsSection testimonials={testimonials} />
            <ContactSection settings={settings} />
          </>
        )}

        {currentView === 'all-properties' && (
          <AllPropertiesView
            properties={properties}
            onSelectProperty={handleSelectProperty}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            compareIds={compareIds}
            onToggleCompare={handleToggleCompare}
            onShare={(p) => setShareProperty(p)}
          />
        )}

        {currentView === 'details' && selectedProperty && (
          <PropertyDetailsView
            property={selectedProperty}
            allProperties={properties}
            onBack={() => setCurrentView('all-properties')}
            onSelectProperty={handleSelectProperty}
            isWishlisted={wishlistIds.includes(selectedProperty.id)}
            onToggleWishlist={handleToggleWishlist}
            isCompared={compareIds.includes(selectedProperty.id)}
            onToggleCompare={handleToggleCompare}
            onShare={(p) => setShareProperty(p)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        settings={settings}
        onNavigateHome={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateAllProperties={() => {
          setCurrentView('all-properties');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          if (currentUser) {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('admin-login');
          }
        }}
      />

      {/* Drawers and Modals */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProperties={wishlistProperties}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProperty={handleSelectProperty}
      />

      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        compareProperties={compareProperties}
        onRemoveFromCompare={handleToggleCompare}
        onSelectProperty={handleSelectProperty}
      />

      <ScheduleVisitModal
        isOpen={scheduleVisitOpen}
        onClose={() => setScheduleVisitOpen(false)}
      />

      <ShareModal
        property={shareProperty}
        onClose={() => setShareProperty(null)}
      />

      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        properties={properties}
        onSelectProperty={handleSelectProperty}
      />

      {/* Floating AI Assistant Concierge Button */}
      {!aiAssistantOpen && (
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group border border-amber-300/40"
          title="Open Aura AI Concierge"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-wide leading-none">Aura AI</div>
            <div className="text-[10px] text-slate-900/80 font-medium leading-tight">24/7 Concierge</div>
          </div>
        </button>
      )}

      <AiAssistantModal
        settings={settings}
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onOpenBookVisit={() => setScheduleVisitOpen(true)}
      />
    </div>
  );
}
