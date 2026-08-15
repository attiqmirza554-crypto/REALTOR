import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PROPERTIES, INITIAL_TESTIMONIALS, INITIAL_LEADS, INITIAL_SETTINGS } from './src/data/initialData';
import { Property, Lead, Testimonial, SiteSettings } from './src/types';

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory data store for live modifications
  let properties: Property[] = [...INITIAL_PROPERTIES];
  let leads: Lead[] = [...INITIAL_LEADS];
  let testimonials: Testimonial[] = [...INITIAL_TESTIMONIALS];
  let siteSettings: SiteSettings = { ...INITIAL_SETTINGS };

  // Helper for JWT authentication simulation
  const ADMIN_EMAIL = 'admin@aurahaven.com';
  const ADMIN_PASS = 'admin123';

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Authentication
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const token = `jwt-token-${Date.now()}-aurahaven-secret-key`;
      return res.json({
        success: true,
        user: {
          id: 'usr-admin-1',
          email: ADMIN_EMAIL,
          name: 'Victoria Sterling (Admin)',
          role: 'admin',
          token
        }
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
  });

  // Properties API
  app.get('/api/properties', (req, res) => {
    let result = [...properties];

    const {
      search,
      location,
      propertyType,
      purpose,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status,
      isFeatured,
      sortBy
    } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (location && typeof location === 'string' && location !== 'All') {
      result = result.filter((p) => p.location.toLowerCase().includes((location as string).toLowerCase()));
    }

    if (propertyType && typeof propertyType === 'string' && propertyType !== 'All') {
      result = result.filter((p) => p.propertyType === propertyType);
    }

    if (purpose && typeof purpose === 'string' && purpose !== 'All') {
      result = result.filter((p) => p.purpose === purpose);
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (bedrooms && bedrooms !== 'All') {
      if (bedrooms === '4+') {
        result = result.filter((p) => p.bedrooms >= 4);
      } else {
        result = result.filter((p) => p.bedrooms === Number(bedrooms));
      }
    }

    if (bathrooms && bathrooms !== 'All') {
      if (bathrooms === '4+') {
        result = result.filter((p) => p.bathrooms >= 4);
      } else {
        result = result.filter((p) => p.bathrooms === Number(bathrooms));
      }
    }

    if (status && status !== 'All') {
      result = result.filter((p) => p.status === status);
    }

    if (isFeatured === 'true') {
      result = result.filter((p) => p.isFeatured);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({ success: true, count: result.length, data: result });
  });

  app.get('/api/properties/:slugOrId', (req, res) => {
    const { slugOrId } = req.params;
    const item = properties.find((p) => p.id === slugOrId || p.slug === slugOrId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment views counter
    item.viewsCount = (item.viewsCount || 0) + 1;
    res.json({ success: true, data: item });
  });

  app.post('/api/properties', (req, res) => {
    const newProp: Property = {
      ...req.body,
      id: `prop-${Date.now()}`,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      agent: req.body.agent || {
        name: 'Victoria Sterling',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        phone: '+1 (310) 555-0199',
        email: 'v.sterling@aurahaven.com',
        whatsapp: '13105550199',
        role: 'Senior Luxury Advisor'
      }
    };

    properties.unshift(newProp);
    res.status(201).json({ success: true, data: newProp });
  });

  app.put('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    const index = properties.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    properties[index] = { ...properties[index], ...req.body, id };
    res.json({ success: true, data: properties[index] });
  });

  app.delete('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    const initialLen = properties.length;
    properties = properties.filter((p) => p.id !== id);

    if (properties.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, message: 'Property deleted successfully' });
  });

  app.post('/api/properties/:id/duplicate', (req, res) => {
    const { id } = req.params;
    const target = properties.find((p) => p.id === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const duplicated: Property = {
      ...target,
      id: `prop-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      viewsCount: 0
    };

    properties.unshift(duplicated);
    res.status(201).json({ success: true, data: duplicated });
  });

  app.patch('/api/properties/:id/toggle-featured', (req, res) => {
    const { id } = req.params;
    const item = properties.find((p) => p.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    item.isFeatured = !item.isFeatured;
    res.json({ success: true, data: item });
  });

  // Leads API
  app.get('/api/leads', (req, res) => {
    res.json({ success: true, count: leads.length, data: leads });
  });

  app.post('/api/leads', (req, res) => {
    const newLead: Lead = {
      ...req.body,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    leads.unshift(newLead);
    res.status(201).json({ success: true, data: newLead });
  });

  app.patch('/api/leads/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const target = leads.find((l) => l.id === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    target.status = status;
    res.json({ success: true, data: target });
  });

  app.delete('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    leads = leads.filter((l) => l.id !== id);
    res.json({ success: true, message: 'Lead deleted' });
  });

  app.get('/api/leads/export/csv', (req, res) => {
    const headers = 'ID,Type,Property,Name,Email,Phone,Date,Time,Status,CreatedAt\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.type}","${l.propertyTitle || ''}","${l.name}","${l.email}","${l.phone}","${l.preferredDate || ''}","${l.preferredTime || ''}","${l.status}","${l.createdAt}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="aura_haven_leads.csv"');
    res.send(headers + rows);
  });

  // Testimonials API
  app.get('/api/testimonials', (req, res) => {
    res.json({ success: true, data: testimonials });
  });

  app.post('/api/testimonials', (req, res) => {
    const newTestimonial: Testimonial = {
      ...req.body,
      id: `test-${Date.now()}`
    };

    testimonials.unshift(newTestimonial);
    res.status(201).json({ success: true, data: newTestimonial });
  });

  app.put('/api/testimonials/:id', (req, res) => {
    const { id } = req.params;
    const idx = testimonials.findIndex((t) => t.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonials[idx] = { ...testimonials[idx], ...req.body, id };
    res.json({ success: true, data: testimonials[idx] });
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    const { id } = req.params;
    testimonials = testimonials.filter((t) => t.id !== id);
    res.json({ success: true, message: 'Testimonial deleted' });
  });

  // Settings API
  app.get('/api/settings', (req, res) => {
    res.json({ success: true, data: siteSettings });
  });

  app.put('/api/settings', (req, res) => {
    siteSettings = { ...siteSettings, ...req.body };
    res.json({ success: true, data: siteSettings });
  });

  // AI Assistant Chatbot API Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, clientSettings } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      const activeSettings = clientSettings || siteSettings;
      const agencyName = activeSettings.companyName || 'Aura Haven Luxury Real Estate';
      const city = activeSettings.targetCity || 'Waterloo';
      const state = activeSettings.targetState || 'ON';
      const phone = activeSettings.contactPhone || '+1 (519) 555-0199';
      const email = activeSettings.contactEmail || 'contact@aurahaven.com';
      const address = activeSettings.officeAddress || '100 King St N, Waterloo, ON';

      const propertiesSummary = properties.slice(0, 8).map(p => 
        `- ${p.title} (${p.purpose}): $${p.price.toLocaleString()} in ${p.location}, ${p.city}. ${p.bedrooms} Beds, ${p.bathrooms} Baths, ${p.area.toLocaleString()} sqft. Amenities: ${p.amenities.slice(0, 4).join(', ')}`
      ).join('\n');

      const systemInstruction = `You are Aura AI, the premier luxury real estate AI assistant for "${agencyName}" operating in ${city}, ${state}.
Office Address: ${address}
Direct Line: ${phone}
Email: ${email}

Your goal:
1. Provide ultra-polite, sophisticated, and insightful advice to buyers, sellers, and renters interested in luxury properties in ${city}, ${state}.
2. Recommend suitable properties from our current portfolio below when asked.
3. Encourage clients to schedule a private tour, request a consultation, or leave their contact details.
4. Keep answers concise, elegantly formatted with bullet points where appropriate, and enthusiastic.

Current Portfolio Highlights:
${propertiesSummary}`;

      // Try Gemini API if key is available
      if (process.env.GEMINI_API_KEY && ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const replyText = response.text || "I am at your service. How may I assist with your luxury property search or tour request today?";
        return res.json({ success: true, reply: replyText, source: 'gemini' });
      }

      // Intelligent Fallback AI logic if API key isn't provided or during dev offline
      const msgLower = message.toLowerCase();
      let replyText = `Welcome to ${agencyName}! I am your AI Luxury Concierge in ${city}, ${state}.\n\n`;

      if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('budget') || msgLower.includes('cheap') || msgLower.includes('expensive')) {
        replyText += `Our portfolio in ${city} ranges from accessible luxury residences starting around $850,000 up to grand trophy estates at $8,500,000+. \n\nWould you like me to filter properties based on your target price range?`;
      } else if (msgLower.includes('contact') || msgLower.includes('phone') || msgLower.includes('address') || msgLower.includes('office') || msgLower.includes('call')) {
        replyText += `You can reach our senior luxury advisors directly:\n• 📞 Phone: ${phone}\n• 📧 Email: ${email}\n• 📍 Office: ${address}\n\nWould you like to schedule a private call or consultation?`;
      } else if (msgLower.includes('tour') || msgLower.includes('book') || msgLower.includes('visit') || msgLower.includes('viewing')) {
        replyText += `We would be delighted to arrange an exclusive private viewing for you in ${city}. Simply click the "Book Visit" button at the top or leave your name and phone number here!`;
      } else if (msgLower.includes('bedroom') || msgLower.includes('bed') || msgLower.includes('pool') || msgLower.includes('villa') || msgLower.includes('penthouse')) {
        replyText += `We have stunning luxury estates featuring private infinity pools, smart automation, panoramic views, and up to 6+ spacious bedrooms. Check out our Featured Estates on the home page or let me know your specifications!`;
      } else {
        replyText += `How may I assist your real estate journey today? I can help you explore luxury homes in ${city}, schedule a private walkthrough, or connect you with our lead broker at ${phone}.`;
      }

      return res.json({ success: true, reply: replyText, source: 'local' });

    } catch (err: any) {
      console.error('AI Chat Error:', err);
      return res.status(500).json({ 
        success: false, 
        reply: "I apologize, but I am currently experiencing a momentary sync delay. Please feel free to reach out directly to our agency line or try again shortly."
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
