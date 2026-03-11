import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Star, 
  ShoppingBag, 
  Globe, 
  Menu, 
  X, 
  ChevronRight,
  Clock,
  Users,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from './translations';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  phone: string;
  map_url: string;
  rating: number;
  description: string;
  distance?: number;
}

interface Food {
  id: number;
  name: string;
  image_url: string;
  price: number;
}

export default function App() {
  const [lang, setLang] = useState<Language>('ta');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const t = translations[lang];

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data));

    fetch('/api/foods')
      .then(res => res.json())
      .then(data => setFoods(data));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      const updated = restaurants.map(r => ({
        ...r,
        distance: Math.random() * 5 + 0.5
      }));
      setRestaurants(updated);
    }
  }, [userLocation]);

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setIsBookingModalOpen(false);
      setBookingSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#eaeded] font-sans text-stone-900">
      {/* Amazon Header */}
      <header className="sticky top-0 z-50">
        {/* Main Header */}
        <div className="bg-[#131921] text-white px-4 py-2 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1 border border-transparent hover:border-white p-1 cursor-pointer">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <span className="text-xl font-bold tracking-tight hidden lg:block">
              {t.title}
            </span>
          </div>

          {/* Deliver To */}
          <div className="hidden sm:flex items-center gap-1 border border-transparent hover:border-white p-1 cursor-pointer">
            <MapPin className="w-4 h-4 mt-2" />
            <div className="flex flex-col">
              <span className="text-[12px] text-stone-300 leading-none">{t.deliverTo}</span>
              <span className="text-[14px] font-bold leading-tight">{t.tirupattur}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex h-10">
            <div className="bg-stone-100 text-stone-600 px-3 flex items-center rounded-l-md border-r border-stone-300 text-sm cursor-pointer hover:bg-stone-200">
              {t.all}
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="flex-1 px-3 text-stone-900 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 rounded-r-md flex items-center justify-center">
              <Search className="w-6 h-6 text-[#131921]" />
            </button>
          </div>

          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            className="hidden md:flex items-center gap-1 border border-transparent hover:border-white p-2 cursor-pointer"
          >
            <Globe className="w-5 h-5" />
            <span className="text-[14px] font-bold">{t.language}</span>
          </button>

          {/* Account & Lists */}
          <div className="hidden md:flex flex-col border border-transparent hover:border-white p-1 cursor-pointer">
            <span className="text-[12px] leading-none">{t.hello}</span>
            <span className="text-[14px] font-bold leading-tight">{t.account}</span>
          </div>

          {/* Orders */}
          <div className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 cursor-pointer">
            <span className="text-[12px] leading-none">{t.orders}</span>
            <span className="text-[14px] font-bold leading-tight">Orders</span>
          </div>

          {/* Cart */}
          <div className="flex items-end border border-transparent hover:border-white p-1 cursor-pointer relative">
            <div className="relative">
              <ShoppingBag className="w-8 h-8" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#f08804] font-bold text-lg">0</span>
            </div>
            <span className="text-[14px] font-bold mb-1 ml-1">{t.cart}</span>
          </div>
        </div>

        {/* Sub Header */}
        <div className="bg-[#232f3e] text-white px-4 py-1.5 flex items-center gap-4 text-[14px] font-medium overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center gap-1 cursor-pointer hover:border-white border border-transparent px-1">
            <Menu className="w-5 h-5" />
            <span>{t.all}</span>
          </div>
          <span className="cursor-pointer hover:border-white border border-transparent px-1">{t.bestSeller}</span>
          <span className="cursor-pointer hover:border-white border border-transparent px-1">{t.dealOfTheDay}</span>
          <span className="cursor-pointer hover:border-white border border-transparent px-1">Customer Service</span>
          <span className="cursor-pointer hover:border-white border border-transparent px-1">Registry</span>
          <span className="cursor-pointer hover:border-white border border-transparent px-1">Gift Cards</span>
          <span className="cursor-pointer hover:border-white border border-transparent px-1">Sell</span>
        </div>
      </header>

      {/* Hero Carousel Mock */}
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eaeded]" />
        </div>
      </section>

      <main className="max-w-[1500px] mx-auto px-4 -mt-40 relative z-10 pb-20">
        {/* Amazon-style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {restaurants.slice(0, 4).map((r, idx) => (
            <div key={r.id} className="bg-white p-5 flex flex-col">
              <h3 className="text-[21px] font-bold mb-2 text-stone-900">{r.name}</h3>
              <div className="flex-1 aspect-square mb-4 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80&sig=${r.id}`} 
                  alt={r.name}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    setSelectedRestaurant(r);
                    setIsBookingModalOpen(true);
                  }}
                />
              </div>
              <button 
                onClick={() => {
                  setSelectedRestaurant(r);
                  setIsBookingModalOpen(true);
                }}
                className="text-emerald-600 text-[13px] hover:text-[#c45500] hover:underline text-left"
              >
                {t.bookNow}
              </button>
            </div>
          ))}
        </div>

        {/* Featured Food Strip */}
        <div className="bg-white p-5 mb-8 overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[21px] font-bold">{t.foods}</h2>
            <span className="text-emerald-600 text-sm hover:underline cursor-pointer">Shop all deals</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {foods.map((f) => (
              <div key={f.id} className="min-w-[200px] flex flex-col">
                <div className="bg-stone-100 aspect-square rounded mb-2 overflow-hidden flex items-center justify-center">
                  <img 
                    src={f.image_url} 
                    alt={f.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#cc0c39] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">
                    {t.limitedTime}
                  </span>
                </div>
                <span className="text-[13px] font-bold text-stone-900">₹{f.price}</span>
                <span className="text-[13px] text-stone-600 truncate">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Restaurant List with Live Map */}
        <div className="bg-white p-5">
          <h2 className="text-[21px] font-bold mb-6">{t.restaurants} {t.nearYou}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              {filteredRestaurants.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row gap-4 border-b border-stone-200 pb-6 last:border-0">
                  <div className="w-full sm:w-48 h-48 shrink-0 bg-stone-100 rounded overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80&sig=${r.id + 10}`} 
                      alt={r.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-stone-900 hover:text-[#c45500] cursor-pointer">{r.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex text-[#ffa41c]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(r.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="text-emerald-600 text-sm font-medium ml-1">{r.rating}</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-2">{r.description}</p>
                    <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{r.location}</span>
                      </div>
                      {r.distance && (
                        <div className="font-bold text-emerald-700">
                          {r.distance.toFixed(1)} km away
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setSelectedRestaurant(r);
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 px-6 py-1.5 rounded-full text-sm font-medium shadow-sm"
                      >
                        {t.bookNow}
                      </button>
                      <button 
                        onClick={() => setSelectedRestaurant(r)}
                        className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 px-6 py-1.5 rounded-full text-sm font-medium shadow-sm"
                      >
                        {t.viewMap}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Map Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-40 bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
                <div className="p-4 bg-white border-b border-stone-200">
                  <h4 className="font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    Live Location Map
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {selectedRestaurant ? `Showing: ${selectedRestaurant.name}` : 'Select a restaurant to see location'}
                  </p>
                </div>
                <div className="h-[400px] bg-stone-200 relative">
                  {selectedRestaurant ? (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(selectedRestaurant.name + ' Tirupattur')}`}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                      <div>
                        <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <p className="text-stone-400 font-medium">Click "View on Map" to see the live location of the restaurant here.</p>
                      </div>
                    </div>
                  )}
                  {/* Mock Map Overlay for Demo */}
                  {!selectedRestaurant && (
                    <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                      <div className="text-center p-6">
                        <MapPin className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                        <p className="text-stone-500 text-sm">Select a restaurant to view its live location on the map.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Amazon-style Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-4 bg-stone-100 border-b border-stone-200 flex justify-between items-center">
                <h3 className="text-lg font-bold">{t.bookingTitle}</h3>
                <button onClick={() => setIsBookingModalOpen(false)} className="p-1 hover:bg-stone-200 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {bookingSuccess ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Success!</h4>
                    <p className="text-stone-600">{t.bookingSuccess}</p>
                  </div>
                ) : (
                  <div className="flex gap-6">
                    <div className="w-32 h-32 shrink-0 bg-stone-100 rounded overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80&sig=${selectedRestaurant?.id}`} 
                        alt={selectedRestaurant?.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <form onSubmit={handleBooking} className="flex-1 space-y-4">
                      <h4 className="font-bold text-lg leading-tight">{selectedRestaurant?.name}</h4>
                      <div>
                        <label className="block text-xs font-bold mb-1">{t.name}</label>
                        <input required type="text" className="w-full border border-stone-300 rounded px-3 py-1.5 focus:border-emerald-500 outline-none shadow-inner" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">{t.date}</label>
                          <input required type="date" className="w-full border border-stone-300 rounded px-3 py-1.5 focus:border-emerald-500 outline-none shadow-inner" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">{t.time}</label>
                          <input required type="time" className="w-full border border-stone-300 rounded px-3 py-1.5 focus:border-emerald-500 outline-none shadow-inner" />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 py-2 rounded-lg font-medium shadow-sm border border-[#fcd200]"
                      >
                        {t.confirmBooking}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-[#232f3e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full bg-[#37475a] hover:bg-[#485769] py-4 mb-12 text-sm font-medium"
          >
            Back to top
          </button>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="text-xl font-bold">{t.title}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left text-sm mb-12 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h5 className="font-bold">Get to Know Us</h5>
              <p className="hover:underline cursor-pointer">Careers</p>
              <p className="hover:underline cursor-pointer">Blog</p>
              <p className="hover:underline cursor-pointer">About Kavin</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold">Make Money with Us</h5>
              <p className="hover:underline cursor-pointer">Sell on Kavin</p>
              <p className="hover:underline cursor-pointer">Become an Affiliate</p>
              <p className="hover:underline cursor-pointer">Advertise Your Food</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold">Kavin Payment Products</h5>
              <p className="hover:underline cursor-pointer">Kavin Rewards</p>
              <p className="hover:underline cursor-pointer">Kavin Currency Converter</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold">Let Us Help You</h5>
              <p className="hover:underline cursor-pointer">Your Account</p>
              <p className="hover:underline cursor-pointer">Your Orders</p>
              <p className="hover:underline cursor-pointer">Help</p>
            </div>
          </div>
          <p className="text-xs text-stone-400">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
