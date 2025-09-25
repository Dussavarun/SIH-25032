'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Wifi, Car, Waves, Wind, Utensils, Dumbbell, Umbrella, Shield, Lock, Phone, Star, MapPin, Users, Calendar as CalendarIcon, Home, Check, ChevronLeft, ChevronRight, X, Award, Verified } from 'lucide-react';

const JharkhandTourismBooking = () => {
  // Initialize dates relative to today
  const today = new Date();
  const defaultCheckIn = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const defaultCheckOut = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const [checkInDate, setCheckInDate] = useState(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [qrGenerated, setQrGenerated] = useState(false);
  const canvasRef = useRef(null);
  const checkInCalRef = useRef(null);
  const checkOutCalRef = useRef(null);

  // Helper: normalize to start of day for safe comparisons
  const startOfDay = (d) => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setHours(0, 0, 0, 0);
    return x;
  };

  // Accurate nights calculation (UTC safe) with minimum 1 night
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysBetween = (a, b) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const diff = Math.round((utc2 - utc1) / msPerDay);
    return Math.max(1, diff);
  };

  const basePrice = 1000; // Changed to 1000 as requested
  const nights = daysBetween(checkInDate, checkOutDate);
  const roomTotal = basePrice * rooms * nights;
  const taxes = Math.round(roomTotal * 0.18); // 18% tax
  const total = roomTotal + taxes;

  // Calendar Component
  const DateCalendar = ({ selectedDate, onSelectDate, onClose, minDate, innerRef }) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    // Keep calendar month in sync with the selected date
    useEffect(() => {
      if (selectedDate) {
        setCurrentMonth(new Date(selectedDate));
      }
    }, [selectedDate]);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    const handleDateClick = (day) => {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const min = minDate ? startOfDay(minDate) : null;
      const cand = startOfDay(newDate);
      if (min && cand < min) return; // Prevent picking dates before minDate
      onSelectDate(newDate);
      onClose();
    };
    
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    
    const renderCalendarDays = () => {
      const days = [];
      const totalDays = daysInMonth(currentMonth);
      const startingDayOfWeek = firstDayOfMonth(currentMonth);
      const today = startOfDay(new Date());

      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
      }

      for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const isSelected = selectedDate && startOfDay(date).getTime() === startOfDay(selectedDate).getTime();
        const isPast = startOfDay(date) < today;
        const isDisabled = isPast || (minDate && startOfDay(date) < startOfDay(minDate));

        days.push(
          <div
            key={day}
            onClick={() => !isDisabled && handleDateClick(day)}
            className={`p-2 text-center cursor-pointer rounded-lg transition-colors
              ${isSelected ? 'bg-blue-600 text-white' : ''}
              ${isDisabled ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-gray-700 text-white'}
              ${!isSelected && !isDisabled ? 'text-gray-200' : ''}
            `}
          >
            {day}
          </div>
        );
      }

      return days;
    };

    return (
      <div ref={innerRef} className="absolute z-50 bg-gray-800 rounded-lg shadow-2xl p-4 w-80 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-700 rounded text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-700 rounded text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white"
        >
          Close
        </button>
      </div>
    );
  };

  // Close calendars on outside click
  useEffect(() => {
    const handler = (e) => {
      const inIn = checkInCalRef.current && checkInCalRef.current.contains(e.target);
      const inOut = checkOutCalRef.current && checkOutCalRef.current.contains(e.target);
      const togglers = Array.from(document.querySelectorAll('[data-cal-toggle]'));
      const clickedToggler = togglers.some(el => el.contains(e.target));
      if (!inIn && !inOut && !clickedToggler) {
        setShowCheckInCalendar(false);
        setShowCheckOutCalendar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Certificate Modal Component
  const CertificateModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl border-4 border-yellow-400">
        {/* Certificate Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-600 rounded-full p-4">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">CERTIFICATE OF VERIFICATION</h2>
          <div className="w-32 h-1 bg-yellow-600 mx-auto rounded"></div>
        </div>

        {/* Certificate Body */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Royal Heritage Ranchi</h3>
          <p className="text-gray-700 mb-6">
            is a verified and trusted accommodation provider registered with the
          </p>
          <div className="bg-emerald-600 text-white py-2 px-6 rounded-full inline-block font-semibold mb-6">
            JHARKHAND TOURISM BOARD
          </div>
        </div>

        {/* Verification Features */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-white p-3 rounded-lg shadow">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-800">Safety Verified</span>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-800">Quality Assured</span>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow">
            <Verified className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm text-gray-800">Licensed Property</span>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow">
            <Check className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-sm text-gray-800">Govt. Approved</span>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="border-t-2 border-yellow-400 pt-4 flex justify-between items-end">
          <div className="text-left">
            <p className="text-sm text-gray-600">Certificate No.</p>
            <p className="font-bold text-gray-800">JTB-2024-RHR-001</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-16 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-2">
              OFFICIAL<br/>STAMP
            </div>
            <p className="text-xs text-gray-600">Valid until Dec 2025</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Authorized by</p>
            <p className="font-bold text-gray-800">Tourism Secretary</p>
            <p className="text-sm text-gray-600">Jharkhand Govt.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Load QRCode library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.1/qrcode.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleCheckInSelect = (date) => {
    setCheckInDate(date);
    setShowCheckInCalendar(false);
    if (startOfDay(checkOutDate) <= startOfDay(date)) {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      setCheckOutDate(nextDay);
    }
  };

  const handleCheckOutSelect = (date) => {
    setCheckOutDate(date);
    setShowCheckOutCalendar(false);
  };

  const generateQR = () => {
    const upiID = "7995621337@ybl";
    const vendorName = "Royal Heritage Ranchi";
    const amount = total;
    const itemName = `Hotel Booking - ${rooms} Room(s) for ${nights} night(s)`;
    const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(vendorName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(itemName)}`;

    if (typeof window !== 'undefined' && window.QRCode) {
      setShowQR(true);
      setQrGenerated(false);
      setTimeout(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          window.QRCode.toCanvas(canvasRef.current, upiLink, {
            width: 250,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' }
          }, function(error) {
            if (error) alert('Failed to generate QR code. Please try again.');
            else {
              setQrGenerated(true);
              const txn = { itemName, amount, vendorName, checkIn: formatDate(checkInDate), checkOut: formatDate(checkOutDate), timestamp: new Date().toLocaleString() };
              setTransactions(prev => [txn, ...prev]);
            }
          });
        }
      }, 100);
    } else alert('QR Code generator is loading. Please try again in a moment.');
  };

  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const handleBackToMap = () => {
    window.location.href = '/my-tours';
  };

  const nearbyAttractions = [
    { name: 'Hundru Falls', distance: '45 km away', img: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=100&h=80&fit=crop' },
    { name: 'Betla National Park', distance: '120 km away', img: 'https://images.unsplash.com/photo-1601758123927-43b9b1c93e3c?w=100&h=80&fit=crop' },
    { name: 'Patratu Valley', distance: '35 km away', img: 'https://images.unsplash.com/photo-1579546928680-7ee096cd5b4d?w=100&h=80&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={handleBackToMap}
            className="flex items-center text-gray-300 hover:text-white text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to My Tours</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Jharkhand Journeys</h1>
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
          >
            <Award className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Verified</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Hero Image Section */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg mb-4 sm:mb-8">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop" 
                alt="Royal Heritage Ranchi"
                className="w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-3xl font-bold text-white">Royal Heritage Ranchi</h2>
                  <div className="bg-green-600 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />)}
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400/50 text-yellow-400" />
                    <span className="ml-2 text-white text-sm sm:text-base">4.5 (1247 reviews)</span>
                  </div>
                  <div className="flex items-center text-white">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="text-sm sm:text-base">Ranchi, Jharkhand</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4 sm:mb-8 text-sm sm:text-base px-2 sm:px-0">
              Experience the perfect blend of traditional Jharkhand hospitality and modern luxury at Royal Heritage Ranchi.
            </p>

            {/* Owner Contact Information */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow mb-4 sm:mb-8 border border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Property Manager</p>
                    <p className="font-semibold text-white">Mr. Rajesh Kumar Singh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <p className="font-semibold text-blue-400">+91 99560 78901</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-blue-400">booking@royalheritageranchi.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">WhatsApp Booking</p>
                    <p className="font-semibold text-green-400">+91 99560 78901</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow mb-4 sm:mb-8 border border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2"><Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Free Wi-Fi</span></div>
                <div className="flex items-center space-x-2"><Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Free Parking</span></div>
                <div className="flex items-center space-x-2"><Waves className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Swimming Pool</span></div>
                <div className="flex items-center space-x-2"><Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Air Conditioning</span></div>
                <div className="flex items-center space-x-2"><Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Restaurant</span></div>
                <div className="flex items-center space-x-2"><Umbrella className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Room Service</span></div>
                <div className="flex items-center space-x-2"><Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Fitness Center</span></div>
                <div className="flex items-center space-x-2"><Umbrella className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Tour Desk</span></div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow border border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Security Features</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2"><Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /><span className="text-xs sm:text-sm text-gray-300">24/7 CCTV</span></div>
                <div className="flex items-center space-x-2"><Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /><span className="text-xs sm:text-sm text-gray-300">Security Guards</span></div>
                <div className="flex items-center space-x-2"><Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /><span className="text-xs sm:text-sm text-gray-300">Electronic Locks</span></div>
                <div className="flex items-center space-x-2"><Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /><span className="text-xs sm:text-sm text-gray-300">Emergency Contact</span></div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 sticky top-20 border border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Reserve Your Stay</h3>
              <div className="mb-4">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  ₹{basePrice.toLocaleString()}<span className="text-sm sm:text-base font-normal text-gray-400"> per night</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 relative">
                <div className="relative">
                  <label className="text-xs sm:text-sm text-gray-400 mb-1 block">Check-in</label>
                  <div data-cal-toggle onClick={() => { setShowCheckInCalendar(v => !v); setShowCheckOutCalendar(false); }} className="border border-gray-600 bg-gray-700 rounded-lg p-2 flex items-center cursor-pointer hover:border-blue-400 text-white">
                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2" />
                    <span className="text-xs sm:text-sm">{formatDate(checkInDate)}</span>
                  </div>
                  {showCheckInCalendar && (
                    <DateCalendar
                      selectedDate={checkInDate}
                      onSelectDate={handleCheckInSelect}
                      onClose={() => setShowCheckInCalendar(false)}
                      minDate={startOfDay(new Date())}
                      innerRef={checkInCalRef}
                    />
                  )}
                </div>
                <div className="relative">
                  <label className="text-xs sm:text-sm text-gray-400 mb-1 block">Check-out</label>
                  <div data-cal-toggle onClick={() => { setShowCheckOutCalendar(v => !v); setShowCheckInCalendar(false); }} className="border border-gray-600 bg-gray-700 rounded-lg p-2 flex items-center cursor-pointer hover:border-blue-400 text-white">
                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2" />
                    <span className="text-xs sm:text-sm">{formatDate(checkOutDate)}</span>
                  </div>
                  {showCheckOutCalendar && (
                    <DateCalendar
                      selectedDate={checkOutDate}
                      onSelectDate={handleCheckOutSelect}
                      onClose={() => setShowCheckOutCalendar(false)}
                      minDate={checkInDate}
                      innerRef={checkOutCalRef}
                    />
                  )}
                </div>
              </div>

              {/* Nights Info */}
              <div className="mb-3 text-gray-300 text-sm">
                <span className="font-semibold">{nights}</span> night{nights > 1 ? 's' : ''} • {rooms} room{rooms > 1 ? 's' : ''}
              </div>

              {/* Guests and Rooms */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-400 mb-1 block">Guests</label>
                  <input type="number" min="1" max="10" value={guests} onChange={e => {
                      const v = Math.max(1, Math.min(10, parseInt(e.target.value || '0')));
                      setGuests(v);
                    }} className="w-full border border-gray-600 bg-gray-700 rounded-lg p-2 text-sm sm:text-base text-white focus:border-blue-400 focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-400 mb-1 block">Rooms</label>
                  <input type="number" min="1" max="5" value={rooms} onChange={e => {
                      const v = Math.max(1, Math.min(5, parseInt(e.target.value || '0')));
                      setRooms(v);
                    }} className="w-full border border-gray-600 bg-gray-700 rounded-lg p-2 text-sm sm:text-base text-white focus:border-blue-400 focus:outline-none"/>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-600 pt-4 mb-4">
                <div className="flex justify-between mb-1 text-gray-300"><span>Room Total</span><span>₹{roomTotal.toLocaleString()}</span></div>
                <div className="flex justify-between mb-1 text-gray-300"><span>Taxes & Fees</span><span>₹{taxes.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-white"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>

              <button onClick={generateQR} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm sm:text-base mb-2 transition-colors">
                Generate UPI QR
              </button>

              {showQR && (
                <div className="mt-2 flex flex-col items-center">
                  <canvas ref={canvasRef} className="border border-gray-600 p-2 bg-white rounded" />
                  {qrGenerated && <span className="text-xs sm:text-sm text-green-400 mt-2">QR Generated Successfully!</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && <CertificateModal />}
    </div>
  );
};

export default JharkhandTourismBooking;