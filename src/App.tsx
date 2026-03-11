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

    // Get user location for "live location" distance feature
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

  // Mock distance calculation (Tirupattur center approx: 12.4934, 78.5678)
  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      const updated = restaurants.map(r => ({
        ...r,
        distance: Math.random() * 5 + 0.5 // Mock distance in km
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
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <span className="text-xl font-bold tracking-tight text-emerald-800 hidden sm:block">
                {t.title}
              </span>
            </div>

            {/* Amazon-style Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-stone-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-stone-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-1 text-stone-600 hover:text-emerald-600 transition-colors font-medium"
              >
                <Globe className="w-5 h-5" />
                <span>{t.language}</span>
              </button>
              <button className="relative p-2 text-stone-600 hover:text-emerald-600 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>
              <button className="md:hidden p-2 text-stone-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-200 mb-8 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
          <div className="md:hidden max-w-md mx-auto mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full bg-white rounded-full py-3 pl-12 pr-4 shadow-xl focus:ring-2 focus:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-stone-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Restaurants Section */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-2">{t.restaurants}</h2>
              <p className="text-stone-500">{t.featured}</p>
            </div>
            <button className="text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <motion.div 
                key={restaurant.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-stone-200 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&sig=${restaurant.id}`} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-emerald-700">
                    <Star className="w-4 h-4 fill-emerald-700" />
                    {restaurant.rating}
                  </div>
                  {restaurant.distance && (
                    <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {restaurant.distance.toFixed(1)} km
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-stone-800">{restaurant.name}</h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-sm text-stone-600">
                      <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                      <span>{restaurant.location}</span>
                    </div>
                    {restaurant.phone && (
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setSelectedRestaurant(restaurant);
                        setIsBookingModalOpen(true);
                      }}
                      className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                      {t.bookNow}
                    </button>
                    <a 
                      href={restaurant.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                      title={t.viewMap}
                    >
                      <MapPin className="w-5 h-5 text-stone-600" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Food Menu Section */}
        <div>
          <h2 className="text-3xl font-bold text-stone-900 mb-8">{t.foods}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredFoods.map((food) => (
              <motion.div 
                key={food.id}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all">
                  <img 
                    src={food.image_url} 
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-bold text-stone-800 text-center mb-1">{food.name}</h4>
                <p className="text-emerald-600 font-bold text-center">₹{food.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{t.bookingTitle}</h3>
                  <p className="text-emerald-100 text-sm">{selectedRestaurant?.name}</p>
                </div>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-stone-900 mb-2">Success!</h4>
                    <p className="text-stone-500">{t.bookingSuccess}</p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1.5 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" />
                        {t.name}
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          {t.date}
                        </label>
                        <input 
                          required
                          type="date" 
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          {t.time}
                        </label>
                        <input 
                          required
                          type="time" 
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1.5 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" />
                        {t.guests}
                      </label>
                      <select className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none">
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n} {t.guests}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 mt-4"
                    >
                      {t.confirmBooking}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="text-xl font-bold text-white">{t.title}</span>
          </div>
          <p className="mb-8 max-w-md mx-auto">
            {t.subtitle}
          </p>
          <div className="border-t border-stone-800 pt-8">
            <p>{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
