import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Globe,
  Copy,
  Check,
  MapPin,
  Smartphone,
  Mail,
  Zap,
  Building,
  Plus,
  Trash2,
  ExternalLink,
  MessageCircle,
  Search,
  CheckCircle2,
  Upload,
  FileText,
  Download
} from 'lucide-react';
import { ClientSiteRecord, SiteSettings } from '../../types';

interface ClientSiteGeneratorDashboardProps {
  currentSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: Partial<SiteSettings>) => void;
  onViewLiveSite?: () => void;
}

// Preset Nearby Neighborhood Engine for USA & Canada Cities
const NEARBY_CITIES_DATABASE: Record<string, string[]> = {
  // Canada Cities & Regions
  'waterloo': ['Kitchener', 'Cambridge', 'Guelph', 'Woolwich', 'Wilmot', 'Wellesley', 'Stratford', 'Ayr', 'Baden'],
  'kitchener': ['Waterloo', 'Cambridge', 'Guelph', 'Baden', 'New Hamburg', 'Woolwich', 'Elmira'],
  'cambridge': ['Kitchener', 'Waterloo', 'Guelph', 'Brantford', 'Paris', 'Puslinch'],
  'toronto': ['Mississauga', 'Brampton', 'Markham', 'Vaughan', 'Oakville', 'Richmond Hill', 'Burlington', 'Pickering'],
  'vancouver': ['Burnaby', 'Richmond', 'Surrey', 'Coquitlam', 'North Vancouver', 'West Vancouver', 'New Westminster', 'Delta', 'Langley'],
  'calgary': ['Airdrie', 'Cochrane', 'Okotoks', 'Chestermere', 'Bearspaw', 'Springbank', 'High River'],
  'edmonton': ['Sherwood Park', 'St. Albert', 'Leduc', 'Spruce Grove', 'Stony Plain', 'Beaumont'],
  'ottawa': ['Gatineau', 'Nepean', 'Kanata', 'Orleans', 'Barrhaven', 'Stittsville', 'Rockland'],
  'montreal': ['Laval', 'Longueuil', 'Westmount', 'Outremont', 'Brossard', 'Dollard-des-Ormeaux', 'Dorval'],
  'winnipeg': ['Steinbach', 'Selkirk', 'Headingley', 'Oakbank', 'Niverville', 'St. Adolphe'],
  'hamilton': ['Ancaster', 'Dundas', 'Stoney Creek', 'Waterdown', 'Burlington', 'Grimsby'],
  'london': ['St. Thomas', 'Strathroy', 'Komoka', 'Thamesford', 'Ingersoll', 'Woodstock'],
  
  // USA Cities & Regions
  'paso robles': ['Templeton', 'Atascadero', 'San Luis Obispo', 'Cambria', 'Morro Bay', 'Santa Margarita', 'Heritage Ranch', 'Cayucos'],
  'los angeles': ['Beverly Hills', 'Santa Monica', 'Pasadena', 'Glendale', 'Long Beach', 'Malibu', 'Burbank', 'Torrance'],
  'beverly hills': ['Bel Air', 'Holmby Hills', 'West Hollywood', 'Century City', 'Santa Monica', 'Brentwood'],
  'miami': ['Miami Beach', 'Coral Gables', 'Fort Lauderdale', 'Boca Raton', 'Key Biscayne', 'Aventura', 'Doral', 'Pinecrest'],
  'new york': ['Manhattan', 'Brooklyn', 'Queens', 'Long Island', 'Hoboken', 'Jersey City', 'Greenwich', 'Scarsdale'],
  'dallas': ['Fort Worth', 'Plano', 'Frisco', 'Arlington', 'Irving', 'McKinney', 'Garland', 'Richardson'],
  'austin': ['Round Rock', 'Cedar Park', 'Georgetown', 'Bee Cave', 'Lakeway', 'San Marcos', 'Pflugerville'],
  'houston': ['The Woodlands', 'Katy', 'Sugar Land', 'Pearland', 'Spring', 'Cypress', 'Bellaire', 'Pasadena'],
  'chicago': ['Evanston', 'Naperville', 'Oak Park', 'Schaumburg', 'Highland Park', 'Arlington Heights', 'Skokie'],
  'phoenix': ['Scottsdale', 'Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Glendale', 'Paradise Valley'],
  'seattle': ['Bellevue', 'Redmond', 'Kirkland', 'Renton', 'Tacoma', 'Bainbridge Island', 'Edmonds'],
  'san francisco': ['Oakland', 'Berkeley', 'Palo Alto', 'San Jose', 'Sausalito', 'San Mateo', 'Walnut Creek'],
  'san diego': ['La Jolla', 'Coronado', 'Del Mar', 'Carlsbad', 'Encinitas', 'Chula Vista', 'Poway'],
  'las vegas': ['Henderson', 'Summerlin', 'North Las Vegas', 'Spring Valley', 'Green Valley', 'Boulder City'],
  'denver': ['Boulder', 'Aurora', 'Highlands Ranch', 'Lakewood', 'Littleton', 'Centennial', 'Castlerock'],
  'orlando': ['Winter Park', 'Windermere', 'Lake Nona', 'Kissimmee', 'Sanford', 'Altamonte Springs']
};

export default function ClientSiteGeneratorDashboard({
  currentSettings,
  onUpdateSiteSettings,
  onViewLiveSite
}: ClientSiteGeneratorDashboardProps) {
  // Load & Edit Live helper function
  const handleLoadAndEditLive = (record: ClientSiteRecord) => {
    onUpdateSiteSettings({
      targetCity: record.city,
      targetState: record.state,
      companyName: record.clientName,
      siteTitle: record.clientName,
      contactPhone: record.phone || currentSettings.contactPhone,
      contactEmail: record.email || currentSettings.contactEmail,
      seoCustomH1: record.seoCustomH1,
      serviceAreas: record.serviceAreas
    });

    if (onViewLiveSite) {
      onViewLiveSite();
    }
  };
  // List of generated client sites (saved in state & localStorage)
  const [clientRecords, setClientRecords] = useState<ClientSiteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aurahaven_client_prospects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial prospect demo
    return [
      {
        id: 'client-demo-1',
        clientName: 'Paso Robles Luxury Real Estate',
        email: 'contact@pasoroblesrealty.com',
        phone: '+18055550199',
        city: 'Paso Robles',
        state: 'CA',
        country: 'USA',
        primaryService: 'Luxury Real Estate & Homes for Sale',
        serviceAreas: ['Paso Robles', 'Templeton', 'Atascadero', 'San Luis Obispo', 'Cambria', 'Morro Bay'],
        seoCustomH1: 'Luxury Real Estate & Homes for Sale in Paso Robles, CA',
        generatedUrl: window.location.origin + '?clientCity=Paso+Robles&state=CA',
        createdAt: new Date().toLocaleDateString(),
        whatsappMessage: `Salam! Men ne ap k business (Paso Robles Luxury Real Estate) k liye 100% Local SEO optimized live demo website ready ki hay. Ap is link par apny area (Paso Robles, Templeton, Atascadero) k targeted keywords aur layout check kr sakty hen: ${window.location.origin}?clientCity=Paso+Robles&state=CA`
      }
    ];
  });

  // Custom Domain Configuration (e.g. realtordemos.site or farooqmarketing.com)
  const [customDomain, setCustomDomain] = useState<string>(() => {
    try {
      return localStorage.getItem('aurahaven_custom_domain') || '';
    } catch {
      return '';
    }
  });

  const handleCustomDomainChange = (domainVal: string) => {
    const cleaned = domainVal.trim().replace(/^https?:\/\//i, '').replace(/\/+$/g, '');
    setCustomDomain(cleaned);
    try {
      localStorage.setItem('aurahaven_custom_domain', cleaned);
    } catch (e) {
      console.error(e);
    }
  };

  // URL Link Style Selector ('ultra-short' | 'compact' | 'slug' | 'full')
  const [linkStyle, setLinkStyle] = useState<'ultra-short' | 'compact' | 'slug' | 'full'>('ultra-short');

  // Helper to generate clean, short, trustworthy URLs (ideal for GitHub Pages & Custom Domain Outreach)
  const createCleanShortUrl = (name: string, cityVal: string, stateVal: string, phoneVal: string, addressVal: string, h1Val: string, areas: string[], mode: 'ultra-short' | 'compact' | 'slug' | 'full' = linkStyle) => {
    const baseOrigin = customDomain
      ? `https://${customDomain.replace(/^https?:\/\//i, '').replace(/\/+$/g, '')}`
      : (window.location.origin + window.location.pathname).replace(/\/+$/, '');

    const cleanName = name.trim() || 'Realtor';
    const slugName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // 1. Ultra-Short Mode (e.g. realtordemos.site/farooqmarketing or realtordemos.site/?agency=farooqmarketing)
    if (mode === 'ultra-short') {
      if (customDomain) {
        return `${baseOrigin}/${slugName}`;
      }
      return `${baseOrigin}/?agency=${slugName}`;
    }

    if (mode === 'slug') {
      return `${baseOrigin}/#${slugName}`;
    }

    if (mode === 'compact') {
      const compactObj = {
        n: cleanName,
        c: cityVal,
        s: stateVal,
        p: phoneVal,
        a: addressVal || '',
        h: h1Val,
        ar: areas.slice(0, 5)
      };
      try {
        const jsonStr = JSON.stringify(compactObj);
        const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
        return `${baseOrigin}/?d=${b64}`;
      } catch (e) {
        console.warn('Base64 encoding error, fallback:', e);
      }
    }

    // Full Mode
    const params = new URLSearchParams();
    params.set('clientCity', cityVal);
    params.set('state', stateVal);
    params.set('clientName', cleanName);
    params.set('phone', phoneVal);
    if (addressVal) params.set('address', addressVal);
    params.set('h1', h1Val);
    params.set('areas', areas.join(','));
    return `${baseOrigin}/?${params.toString()}`;
  };

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('CA');
  const [country, setCountry] = useState<'USA' | 'Canada'>('USA');
  const [primaryService, setPrimaryService] = useState('Luxury Real Estate & Homes for Sale');
  const [customH1, setCustomH1] = useState('');
  const [detectedAreas, setDetectedAreas] = useState<string[]>([]);
  const [newAreaInput, setNewAreaInput] = useState('');

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'bulk' | 'history'>('bulk');

  // Bulk Input State
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkStatusMessage, setBulkStatusMessage] = useState('');

  // File Upload Handler for .csv / .txt files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBulkInputText(content);
        setBulkStatusMessage(`File "${file.name}" uploaded successfully! Click "Generate 500+ Dynamic Site Links" below.`);
      }
    };
    reader.readAsText(file);
  };

  // Sample 50 High-Ticket Leads Generator
  const handleLoadSampleLeads = () => {
    const sampleLeads = [
      'Waterloo Luxury Realty, 100 King St N, Waterloo, ON, +15195550199, Luxury Real Estate & Homes for Sale',
      'Kitchener Premier Estates, 45 Queen St S, Kitchener, ON, +15195550288, Luxury Real Estate & Homes for Sale',
      'Cambridge Advisory Group, 12 Hespeler Rd, Cambridge, ON, +15195550377, Luxury Real Estate & Homes for Sale',
      'Guelph Fine Living, 88 Wyndham St, Guelph, ON, +15195550466, Luxury Real Estate & Homes for Sale',
      'Toronto Penthouse Group, 100 Bay St, Toronto, ON, +14165550999, Luxury Penthouse & Real Estate',
      'Vancouver Waterfront Realty, 1055 W Georgia St, Vancouver, BC, +16045550111, Luxury Real Estate & Homes for Sale',
      'Calgary High-Rise Advisory, 8th Ave SW, Calgary, AB, +14035550222, Luxury Real Estate & Homes for Sale',
      'Montreal Heritage Estates, Rue Sherbrooke, Montreal, QC, +15145550333, Luxury Real Estate & Homes for Sale',
      'Edmonton Luxury Properties, Jasper Ave, Edmonton, AB, +17805550444, Luxury Real Estate & Homes for Sale',
      'Ottawa Executive Homes, Wellington St, Ottawa, ON, +16135550555, Luxury Real Estate & Homes for Sale',
      'Paso Robles Vineyard Estates, Spring St, Paso Robles, CA, +18055550666, Luxury Real Estate & Homes for Sale',
      'Los Angeles Mansions, Wilshire Blvd, Beverly Hills, CA, +13105550777, Luxury Real Estate & Homes for Sale',
      'Miami Beach Front Estates, Ocean Dr, Miami, FL, +13055550888, Luxury Real Estate & Homes for Sale',
      'New York Penthouse Collection, 5th Ave, New York, NY, +12125550999, Luxury Real Estate & Homes for Sale',
      'Dallas Platinum Properties, Main St, Dallas, TX, +12145550123, Luxury Real Estate & Homes for Sale',
      'Austin Lakefront Realty, Congress Ave, Austin, TX, +15125550234, Luxury Real Estate & Homes for Sale',
      'Chicago Gold Coast Realty, Michigan Ave, Chicago, IL, +13125550345, Luxury Real Estate & Homes for Sale',
      'Seattle Bay Estates, Pike St, Seattle, WA, +12065550456, Luxury Real Estate & Homes for Sale',
      'San Francisco Ridge Realty, Market St, San Francisco, CA, +14155550567, Luxury Real Estate & Homes for Sale',
      'Scottsdale Desert Mansions, Camelback Rd, Phoenix, AZ, +16025550678, Luxury Real Estate & Homes for Sale'
    ];
    setBulkInputText(sampleLeads.join('\n'));
    setBulkStatusMessage('Loaded 20 high-ticket agency prospects with full address & phone details!');
  };

  // Process Bulk CSV Data
  const handleProcessBulkCsv = () => {
    if (!bulkInputText.trim()) {
      alert('Please paste or enter CSV client list first.');
      return;
    }

    const lines = bulkInputText.trim().split('\n');
    const newRecords: ClientSiteRecord[] = [];

    lines.forEach((line, index) => {
      // Ignore header line if user included it
      const lowerLine = line.toLowerCase();
      if (index === 0 && (lowerLine.includes('client name') || lowerLine.includes('company') || lowerLine.includes('realtor') || lowerLine.includes('name,'))) return;
      if (!line.trim()) return;

      const parts = line.split(',').map(p => p.trim());
      
      let clientNameVal = `Realtor #${index + 1}`;
      let addressVal = '';
      let cityVal = 'Houston';
      let stateVal = 'TX';
      let phoneVal = '+1 (713) 555-0199';
      let serviceVal = 'Luxury Real Estate & Homes for Sale';

      if (parts.length >= 6) {
        // Name, Address, City, State, Phone, Service
        clientNameVal = parts[0] || clientNameVal;
        addressVal = parts[1] || '';
        cityVal = parts[2] || 'Houston';
        stateVal = parts[3] || 'TX';
        phoneVal = parts[4] || '+1 (713) 555-0199';
        serviceVal = parts[5] || serviceVal;
      } else if (parts.length === 5) {
        // Name, Address, City, State, Phone
        clientNameVal = parts[0] || clientNameVal;
        addressVal = parts[1] || '';
        cityVal = parts[2] || 'Houston';
        stateVal = parts[3] || 'TX';
        phoneVal = parts[4] || '+1 (713) 555-0199';
      } else if (parts.length === 4) {
        // Name, Address, City, Phone OR Name, City, State, Phone
        clientNameVal = parts[0] || clientNameVal;
        addressVal = parts[1] || '';
        cityVal = parts[2] || 'Houston';
        phoneVal = parts[3] || '+1 (713) 555-0199';
      } else if (parts.length === 3) {
        // Standard 3-Column format: Name, Address, Phone
        clientNameVal = parts[0] || clientNameVal;
        const rawAddr = parts[1] || '';
        phoneVal = parts[2] || '+1 (713) 555-0199';

        if (rawAddr) {
          addressVal = rawAddr;
          // Try to extract city and state from rawAddr (e.g., "100 King St, Houston, TX 77002" or "Houston, TX")
          const addrParts = rawAddr.split(' ').map(s => s.replace(',', '').trim());
          // Look for 2-letter state code like TX, CA, ON, FL, NY
          const stateMatch = rawAddr.match(/\b([A-Z]{2})\b/);
          if (stateMatch) {
            stateVal = stateMatch[1];
          }

          // Look for city segment before state code or comma
          if (rawAddr.includes(',')) {
            const subSegments = rawAddr.split(',').map(s => s.trim());
            if (subSegments.length >= 2) {
              cityVal = subSegments[subSegments.length - 2] || subSegments[0];
            } else {
              cityVal = subSegments[0];
            }
          } else if (addrParts.length >= 2) {
            cityVal = addrParts[addrParts.length - 2] || addrParts[0];
          } else {
            cityVal = rawAddr;
          }
        }
      } else {
        clientNameVal = parts[0] || clientNameVal;
        if (parts[1]) cityVal = parts[1];
      }

      // Format city name nicely
      const formattedCity = cityVal
        .replace(/[^a-zA-Z\s]/g, '')
        .trim()
        .split(' ')
        .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
        .join(' ') || 'Houston';

      const normalizedCity = formattedCity.toLowerCase();
      const detectedNearby = NEARBY_CITIES_DATABASE[normalizedCity] || [
        formattedCity,
        `Downtown ${formattedCity}`,
        `Greater ${formattedCity} Region`,
        `${formattedCity} Central`,
        `${formattedCity} Estates`
      ];

      // Auto Generate High-Converting Realtor H1 Title
      const customH1Val = `Top Rated Luxury Realtors & Homes for Sale in ${formattedCity}, ${stateVal}`;

      const generatedUrl = createCleanShortUrl(clientNameVal, formattedCity, stateVal, phoneVal, addressVal, customH1Val, detectedNearby, linkStyle);

      const whatsappMessage = `Salam ${clientNameVal}! Men ne ap k business k liye 100% Local SEO Optimized live website ready ki hay. Is me ap k city (${formattedCity}) aur surrounding areas (${detectedNearby.slice(0, 3).join(', ')}) ka complete H1, Schema.org aur Geo-Tagging set hay. Apni live website yahan check krein: ${generatedUrl}`;

      newRecords.push({
        id: `bulk-${Date.now()}-${index}`,
        clientName: clientNameVal,
        email: `${clientNameVal.toLowerCase().replace(/[^a-z0-9]/g, '')}@domain.com`,
        phone: phoneVal,
        city: formattedCity,
        state: stateVal,
        country: 'USA',
        primaryService: serviceVal,
        serviceAreas: detectedNearby,
        seoCustomH1: customH1Val,
        generatedUrl,
        createdAt: new Date().toLocaleDateString(),
        whatsappMessage
      });
    });

    if (newRecords.length > 0) {
      const merged = [...newRecords, ...clientRecords];
      saveRecordsToStorage(merged);
      setBulkStatusMessage(`🚀 Successfully generated ${newRecords.length} dynamic client site links!`);
      setActiveTab('history');
    }
  };

  // Export All Client Records to CSV/Excel Download File
  const handleExportCsv = () => {
    if (clientRecords.length === 0) {
      alert('No client records to export.');
      return;
    }

    const headers = ['Client Name', 'City', 'State', 'Phone', 'Service', 'Custom H1 Headline', 'Dynamic Demo URL', 'WhatsApp Message'];
    const rows = clientRecords.map(r => [
      `"${r.clientName.replace(/"/g, '""')}"`,
      `"${r.city}"`,
      `"${r.state}"`,
      `"${r.phone}"`,
      `"${r.primaryService}"`,
      `"${r.seoCustomH1.replace(/"/g, '""')}"`,
      `"${r.generatedUrl}"`,
      `"${r.whatsappMessage.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agency_client_site_links_${clientRecords.length}_prospects.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy All URLs to Clipboard
  const handleCopyAllUrls = () => {
    const allUrls = clientRecords.map(r => `${r.clientName} | ${r.city}: ${r.generatedUrl}`).join('\n');
    navigator.clipboard.writeText(allUrls);
    alert(`Copied ${clientRecords.length} URLs to clipboard!`);
  };

  // Auto-Detect Nearby Neighborhoods when City changes
  const handleCityChange = (val: string) => {
    setCity(val);
    const normalized = val.trim().toLowerCase();

    // Properly title-case the city string (e.g. "waterloo" -> "Waterloo")
    const formattedCity = val
      .trim()
      .split(' ')
      .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
      .join(' ');

    if (!formattedCity) {
      setDetectedAreas([]);
      return;
    }

    // Check local lookup database first
    if (NEARBY_CITIES_DATABASE[normalized]) {
      setDetectedAreas([formattedCity, ...NEARBY_CITIES_DATABASE[normalized]]);
    } else if (val.trim().length > 2) {
      // Clean, professional fallback algorithm for any US/Canada location
      const fallbackNeighborhoods = [
        formattedCity,
        `Downtown ${formattedCity}`,
        `Greater ${formattedCity} Region`,
        `${formattedCity} Central`,
        `${formattedCity} Estates`
      ];
      setDetectedAreas(fallbackNeighborhoods);
    } else {
      setDetectedAreas([]);
    }

    // Auto generate H1 Headline
    setCustomH1(`${primaryService} in ${formattedCity}, ${stateCode || 'CA'}`);
  };

  const handleAddCustomArea = () => {
    if (newAreaInput.trim() && !detectedAreas.includes(newAreaInput.trim())) {
      setDetectedAreas([...detectedAreas, newAreaInput.trim()]);
      setNewAreaInput('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setDetectedAreas(detectedAreas.filter(a => a !== area));
  };

  const saveRecordsToStorage = (records: ClientSiteRecord[]) => {
    setClientRecords(records);
    try {
      localStorage.setItem('aurahaven_client_prospects', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  };

  // Generate Website & Link Handler
  const handleGenerateClientSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !clientName) {
      alert('Please fill in Client Business Name and City.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const generatedH1 = customH1.trim() || `${primaryService} in ${city.trim()}, ${stateCode}`;
      const liveGeneratedUrl = createCleanShortUrl(clientName.trim(), city.trim(), stateCode.trim(), phone.trim(), '', generatedH1, detectedAreas, linkStyle);

      const whatsappText = `Salam ${clientName}! Men ne ap k business k liye aik 100% Local SEO Optimized website ready ki hay. Is me ap k city (${city}) aur surrounding areas (${detectedAreas.slice(0, 4).join(', ')}) ka complete H1, Schema.org aur Geo-Tagging set hay. Ap apni custom website ka Live Demo yahan dekhen: ${liveGeneratedUrl}. Agr ap isko own krna chahty hen to mjy WhatsApp reply kray. Thanks!`;

      const newRecord: ClientSiteRecord = {
        id: 'client-' + Date.now(),
        clientName: clientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: stateCode.trim(),
        country,
        primaryService,
        serviceAreas: detectedAreas,
        seoCustomH1: customH1 || `${primaryService} in ${city.trim()}, ${stateCode}`,
        generatedUrl: liveGeneratedUrl,
        createdAt: new Date().toLocaleDateString(),
        whatsappMessage: whatsappText
      };

      const updated = [newRecord, ...clientRecords];
      saveRecordsToStorage(updated);

      // Optionally apply changes to live preview right now
      onUpdateSiteSettings({
        targetCity: city.trim(),
        targetState: stateCode.trim(),
        companyName: clientName.trim(),
        seoCustomH1: customH1 || `${primaryService} in ${city.trim()}, ${stateCode}`,
        serviceAreas: detectedAreas,
        contactPhone: phone || currentSettings.contactPhone,
        contactEmail: email || currentSettings.contactEmail
      });

      setIsGenerating(false);
      setActiveTab('history');
      
      // Reset Form
      setClientName('');
      setEmail('');
      setPhone('');
      setCity('');
      setCustomH1('');
      setDetectedAreas([]);
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this client record?')) {
      const updated = clientRecords.filter(r => r.id !== id);
      saveRecordsToStorage(updated);
    }
  };

  const filteredRecords = clientRecords.filter(r =>
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">
              SEO Outreach Engine 100x
            </span>
            <span className="text-slate-400 text-xs">· USA & Canada Geo-Targeting</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            Client Site Generator & WhatsApp Demo Launcher
          </h2>
          <p className="text-xs text-slate-300 font-light mt-1 max-w-2xl">
            Pora process 100x automated hay. Yahan client ka Name, Address, Phone aur City put krein. AI automatically nearby cities/areas generate karega aur unique Live SEO Demo Link tayyar kr day ga.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'bulk'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-[#D4AF37]/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" /> ⚡ Bulk CSV Generator (300-500)
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-[#D4AF37] text-slate-950 shadow-lg shadow-[#D4AF37]/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> Single Demo
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#D4AF37] text-slate-950 shadow-lg shadow-[#D4AF37]/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" /> Link Library ({clientRecords.length})
          </button>
        </div>
      </div>

      {/* URL Link Style & Custom Domain Configurator */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <span className="font-bold text-white text-sm block">Custom Domain & Clean Outreach Link Format:</span>
              <span className="text-slate-400 text-xs">
                Enter your custom domain below (e.g. <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded">realtordemos.site</code> or <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded">farooqmarketing.com</code>) to generate ultra-short, trustworthy links for your clients.
              </span>
            </div>
          </div>

          {/* Custom Domain Input */}
          <div className="w-full lg:w-auto shrink-0 flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs pl-2 font-mono">https://</span>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => handleCustomDomainChange(e.target.value)}
              placeholder="realtordemos.site or farooqmarketing.com"
              className="bg-transparent text-xs text-amber-300 font-mono font-bold focus:outline-none w-56 placeholder:text-slate-600"
            />
            {customDomain && (
              <button
                type="button"
                onClick={() => handleCustomDomainChange('')}
                className="text-xs text-slate-500 hover:text-rose-400 px-1.5"
                title="Reset to default GitHub Pages URL"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Link Format Options */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-slate-400 text-xs font-semibold mr-1">Select Link Format:</span>

          <button
            type="button"
            onClick={() => setLinkStyle('ultra-short')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              linkStyle === 'ultra-short'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="Ultra-Short Path: https://realtordemos.site/farooqmarketing"
          >
            🔥 Ultra-Short Path ({customDomain ? `https://${customDomain}/farooqmarketing` : `?agency=farooqmarketing`})
          </button>

          <button
            type="button"
            onClick={() => setLinkStyle('compact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              linkStyle === 'compact'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="Short Encoded Link: ?d=abc123xyz"
          >
            ⚡ Compact Encoded (?d=...)
          </button>

          <button
            type="button"
            onClick={() => setLinkStyle('slug')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              linkStyle === 'slug'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="Realtor Hash Slug: #farooqmarketing"
          >
            🏷️ Hash Slug (#farooqmarketing)
          </button>

          <button
            type="button"
            onClick={() => setLinkStyle('full')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              linkStyle === 'full'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="Full Parameter Link"
          >
            📋 Full Parameters
          </button>
        </div>
      </div>

      {activeTab === 'bulk' ? (
        /* Bulk CSV Generator Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400 fill-current" /> 500+ Bulk CSV Dynamic Link Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Paste Excel/CSV rows (Name, City, State, Phone, Service) to generate 500 targeted landing page URLs instantly!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 font-semibold text-xs hover:text-white transition-all flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload .CSV File</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleLeads}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-amber-500/30 text-amber-300 font-semibold text-xs hover:bg-slate-700 transition-all"
                >
                  ⚡ Auto-Fill 20 Sample Prospects
                </button>
              </div>
            </div>

            {bulkStatusMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{bulkStatusMessage}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-2">
                Paste CSV or Excel Data (Format: <code className="text-amber-300">Client Name, City, State, Phone, Service</code>)
              </label>
              <textarea
                rows={10}
                value={bulkInputText}
                onChange={(e) => setBulkInputText(e.target.value)}
                placeholder={`Waterloo Luxury Realty, Waterloo, ON, +15195550199, Luxury Real Estate & Homes for Sale\nKitchener Premier Estates, Kitchener, ON, +15195550288, Luxury Real Estate & Homes for Sale\nToronto Penthouse Group, Toronto, ON, +14165550999, Luxury Penthouse & Real Estate\nMiami Beach Front Estates, Miami, FL, +13055550888, Luxury Real Estate & Homes for Sale...`}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-400 leading-relaxed focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleProcessBulkCsv}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-amber-500/20"
              >
                <Zap className="w-4 h-4 fill-current" /> 🚀 Generate 500+ Dynamic Site Links
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-5 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
              >
                📥 Download Exported CSV / Excel
              </button>

              <button
                type="button"
                onClick={handleCopyAllUrls}
                className="px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Copy All URLs
              </button>
            </div>
          </div>

          {/* Right 100x Agency Growth Blueprint */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/90 border border-[#D4AF37]/40 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-serif font-bold text-white">
                  100x Agency Outreach Strategy
                </h4>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">1. Bulk CSV Excel Export</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Import 300-500 client leads from Apollo, LinkedIn, or Google Maps. Export the CSV with generated URLs added directly beside client rows!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <strong className="text-emerald-400 block">2. Personalized WhatsApp & Cold Email</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Use Instantly.ai / Lemlist or WhatsApp bulk broadcaster to send each prospect their custom URL. High conversion rate because their city & brand is pre-built!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <strong className="text-purple-400 block">3. Instant Live Preview Switcher</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Use the floating Agency Live Bar on top of the website to test any city (Waterloo, Kitchener, Toronto, Miami) in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'create' ? (
        /* Form Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" /> Client Outreach Details
              </h3>
              <span className="text-xs text-amber-400 font-mono">100% Automated SEO Demo</span>
            </div>

            <form onSubmit={handleGenerateClientSite} className="space-y-5">
              <div>
                <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                  Client / Agency Business Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paso Robles Luxury Realty / Apex Dental"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                    Client Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="client@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                    WhatsApp Phone Number (with Country Code)
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="+18055550199 or 923001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Geo Location & Auto-Nearby Engine */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-[#D4AF37]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" /> Auto-Nearby Geo Engine (USA & Canada)
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCountry('USA')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        country === 'USA' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      🇺🇸 USA
                    </button>
                    <button
                      type="button"
                      onClick={() => setCountry('Canada')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        country === 'Canada' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      🇨🇦 Canada
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-1">
                      City Location <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paso Robles, Toronto, Los Angeles"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-[#D4AF37]/40 text-sm text-amber-200 font-semibold focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-1">
                      State / Province Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CA or ON"
                      value={stateCode}
                      onChange={(e) => {
                        setStateCode(e.target.value);
                        if (city) setCustomH1(`${primaryService} in ${city}, ${e.target.value}`);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                </div>

                {/* Auto Detected Service Areas */}
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-2">
                    Auto-Generated Nearby Service Areas ({detectedAreas.length})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {detectedAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-medium text-amber-300 border border-slate-700 flex items-center gap-2 shadow-sm"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(area)}
                          className="text-slate-500 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {detectedAreas.length === 0 && (
                      <span className="text-xs text-slate-500 italic">Type a city above (e.g. Paso Robles or Toronto) to auto-calculate nearby neighborhoods!</span>
                    )}
                  </div>

                  {/* Manual Area Add */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add another surrounding area manually..."
                      value={newAreaInput}
                      onChange={(e) => setNewAreaInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomArea(); }}}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomArea}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom H1 Headline */}
              <div>
                <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                  Dynamic Local SEO H1 Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Luxury Real Estate & Homes for Sale in Paso Robles, CA"
                  value={customH1}
                  onChange={(e) => setCustomH1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-[#D4AF37]/30 text-xs text-amber-300 font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin text-slate-950" /> Generating Live Custom Site...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Generate Live Demo Site & WhatsApp Pitch Link
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Explanation & Quick Workflow */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4AF37]" /> How This 100x Automated Workflow Works:
              </h4>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold font-mono text-[11px] flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-white block mb-0.5">Input Client Location & Name</strong>
                    Aap sirf target client ka naam (e.g. Paso Robles Realty) aur Unka City enter krty hen.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold font-mono text-[11px] flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-white block mb-0.5">Auto Geo-Targeting Algorithm</strong>
                    System automatically US/Canada database se nearby areas (Templeton, Atascadero, San Luis Obispo) and SEO Schema inject kr deta hai.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold font-mono text-[11px] flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-white block mb-0.5">1-Click WhatsApp Sales Pitch ($1000 - $1500)</strong>
                    Live custom URL launch ho jata hay. Aap 1 click se client ko WhatsApp par pre-written pitch send kr sakty hen.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Pitch Preview Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Direct Deal Pitch Strategy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Jab aap 30-40 clients per day reach out karein gey, yeh customized live site unko bound kr day gi kyun k unko apny city aur nearby areas k sath website built nazar aye gi.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* History & Generated Client Links Section */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D4AF37]" /> Generated Client Sites & Live Demo Links
              </h3>
              <p className="text-xs text-slate-400">Total prospects created: {clientRecords.length}</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by client or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Globe className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm">No generated client websites found yet.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs"
              >
                Create First Client Site Demo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-[#D4AF37]/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif font-bold text-white text-base">{record.clientName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold">
                        📍 {record.city}, {record.state}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Created {record.createdAt}</span>
                    </div>

                    <p className="text-xs text-amber-200 font-medium">
                      H1: &quot;{record.seoCustomH1}&quot;
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">Service Areas:</span>
                      {record.serviceAreas.slice(0, 5).map((area, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {area}
                        </span>
                      ))}
                      {record.serviceAreas.length > 5 && (
                        <span className="text-[10px] text-slate-500">+{record.serviceAreas.length - 5} more</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & WhatsApp Pitch */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleLoadAndEditLive(record)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                      title="Load this client's site immediately onto live screen to view and edit"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Apply & Edit Live
                    </button>

                    <a
                      href={record.generatedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 flex items-center gap-1.5 transition-all border border-slate-700"
                      title="Open Shareable Preview in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" /> Preview Link
                    </a>

                    <button
                      onClick={() => handleCopy(record.generatedUrl, record.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === record.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Link
                        </>
                      )}
                    </button>

                    {/* WhatsApp Direct Pitch Button */}
                    {record.phone && (
                      <a
                        href={`https://wa.me/${record.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(record.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald-600" /> Send WhatsApp Pitch
                      </a>
                    )}

                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-500 hover:text-red-400 transition-all"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
