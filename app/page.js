'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/airplanebtn';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '@/components/SettingsProvider';

export default function LandingPage() {
  const { language } = useSettings();
  const L = language === 'hi'
    ? {
        heroTag: 'झारखंड की खोज करें',
        heroTitlePart1: 'योजना बनाएं',
        heroTitlePart2: 'अपनी यात्रा',
        heroDesc:
          'झारखंड के छिपे रत्नों को immersive अनुभवों, प्राचीन जनजातीय विरासत और मनमोहक प्राकृतिक आश्चर्यों के माध्यम से खोजें जो सहस्राब्दियों की कहानियाँ सुनाते हैं।',
        exploreDestinations: 'गंतव्यों का अन्वेषण करें',
        featuredDestinations: 'विशेष',
        destinations: 'गंतव्य',
        destsSub:
          "झारखंड की प्राकृतिक और आध्यात्मिक विरासत को परिभाषित करने वाले सबसे आकर्षक स्थलों का अन्वेषण करें",
        wildlifeSanctuary: 'वन्यजीव अभयारण्य',
        betlaTitle: 'बेतला राष्ट्रीय उद्यान',
        betlaDesc:
          'शानदार रॉयल बंगाल टाइगर और विविध वन्यजीवों का घर, यह स्वच्छ अभयारण्य घने जंगलों और सुरम्य परिदृश्यों के बीच रोमांचक सफारी अनुभव प्रदान करता है।',
        entryFee: 'प्रवेश शुल्क',
        timings: 'समय',
        bestTime: 'सबसे अच्छा समय',
        bestTimeBetla: 'अक्टूबर - मार्च',
        location: 'स्थान',
        palamu: 'पलामू ज़िला',
        jyotirlinga: 'पवित्र ज्योतिर्लिंग',
        baidyanathTitle: 'बैद्यनाथ मंदिर',
        baidyanathDesc:
          'बारह पवित्र ज्योतिर्लिंगों में से एक, देवघर का यह प्राचीन मंदिर हर साल लाखों भक्तों को आकर्षित करता है। गहन आध्यात्मिकता और सदियों पुराने स्थापत्य वैभव का अनुभव करें।',
        freeDarshan: 'नि:शुल्क दर्शन',
        fourToNine: 'सुबह 4 बजे - रात 9 बजे',
        bestTimeBaidya: 'जुलाई - अगस्त (सावन)',
        deoghar: 'देवघर',
        handicrafts: 'प्रामाणिक',
        handicrafts2: 'हस्तशिल्प',
        handiSub:
          'कुशल जनजातीय कारीगरों द्वारा बनाए गए इन पारंपरिक कलाकृतियों के माध्यम से झारखंड की आत्मा को घर लेकर जाएँ',
        dokra: 'ढोकरा कला',
        dokraDesc:
          'प्राचीन कांस्य ढलाई तकनीक, जो 4000+ वर्षों के इतिहास के साथ शानदार प्रतिमाएँ बनाती है',
        sohrai: 'सोहराय पेंटिंग्स',
        sohraiDesc:
          'प्राकृतिक रंगों और ज्यामितीय पैटर्न के साथ फसल त्योहारों का उत्सव मनाने वाली पारंपरिक दीवार कला',
        bamboo: 'बाँस शिल्प',
        bambooDesc:
          'पर्यावरण-अनुकूल टोकरी और सजावटी वस्तुएँ जो सतत जनजातीय जीवनशैली को दर्शाती हैं',
        jewelry: 'जनजातीय आभूषण',
        jewelryDesc:
          'पीतल, चाँदी और प्राकृतिक सामग्री से बने सांस्कृतिक महत्व वाले पारंपरिक आभूषण',
        price: 'मूल्य',
        testimonialsTitle1: 'यात्रियों की',
        testimonialsTitle2: 'कहानियाँ',
        testiSub:
          'उन सहयात्रियों से सुनें जिन्होंने हमारे प्लेटफ़ॉर्म के माध्यम से झारखंड का जादू खोजा',
        anitaRole: 'वन्यजीव फ़ोटोग्राफर',
        rajRole: 'संस्कृति अन्वेषक',
        mayaRole: 'आध्यात्मिक साधक',
        quote1:
          'बेतला में टाइगर सफारी अद्भुत थी! प्लेटफ़ॉर्म की सिफारिशें बिल्कुल सही रहीं और सुरक्षित बुकिंग प्रक्रिया ने पूरी तरह भरोसा दिया। शानदार शॉट्स मिले!',
        quote2:
          'हस्तशिल्प शॉपिंग गाइड कमाल की थी! मुझे कारीगरों से सीधे असली ढोकरा कला मिली। परंपराओं को समझने में सांस्कृतिक जानकारियाँ बहुत उपयोगी रहीं।',
        quote3:
          'इस प्लेटफ़ॉर्म से बैद्यनाथ मंदिर जाना बहुत सहज रहा। भीड़ के स्तर के रियल-टाइम अपडेट्स ने परफेक्ट दर्शन समय चुनने में मदद की। सच में दिव्य अनुभव!',
      }
    : {
        heroTag: 'DISCOVER JHARKHAND',
        heroTitlePart1: 'Plan Your',
        heroTitlePart2: 'Journey',
        heroDesc:
          "Discover Jharkhand's hidden gems through immersive experiences, ancient tribal heritage, and breathtaking natural wonders that tell stories of millennia.",
        exploreDestinations: 'Explore Destinations',
        featuredDestinations: 'Featured',
        destinations: 'Destinations',
        destsSub:
          "Explore the most captivating attractions that define Jharkhand's natural and spiritual heritage",
        wildlifeSanctuary: 'Wildlife Sanctuary',
        betlaTitle: 'Betla National Park',
        betlaDesc:
          "Home to majestic Royal Bengal Tigers and diverse wildlife, this pristine sanctuary offers thrilling safari experiences through dense forests and scenic landscapes, showcasing Jharkhand's incredible biodiversity.",
        entryFee: 'Entry Fee',
        timings: 'Timings',
        bestTime: 'Best Time',
        bestTimeBetla: 'October - March',
        location: 'Location',
        palamu: 'Palamu District',
        jyotirlinga: 'Sacred Jyotirlinga',
        baidyanathTitle: 'Baidyanath Temple',
        baidyanathDesc:
          'One of the twelve sacred Jyotirlingas, this ancient temple in Deoghar attracts millions of devotees annually. Experience profound spirituality and witness centuries-old architectural magnificence.',
        freeDarshan: 'Free Darshan',
        fourToNine: '4AM - 9PM',
        bestTimeBaidya: 'July - August (Sawan)',
        deoghar: 'Deoghar',
        handicrafts: 'Authentic',
        handicrafts2: 'Handicrafts',
        handiSub:
          "Take home pieces of Jharkhand's soul through these traditional artworks crafted by skilled tribal artisans",
        dokra: 'Dokra Art',
        dokraDesc:
          'Ancient bronze casting technique creating stunning figurines with 4000+ years of history',
        sohrai: 'Sohrai Paintings',
        sohraiDesc:
          'Traditional wall art celebrating harvest festivals with natural pigments and geometric patterns',
        bamboo: 'Bamboo Crafts',
        bambooDesc:
          'Eco-friendly baskets and decorative items showcasing sustainable tribal living practices',
        jewelry: 'Tribal Jewelry',
        jewelryDesc:
          'Traditional ornaments with cultural significance crafted from brass, silver and natural materials',
        price: 'Price',
        testimonialsTitle1: 'Traveler',
        testimonialsTitle2: 'Stories',
        testiSub:
          'Hear from fellow adventurers who discovered the magic of Jharkhand through our platform',
        anitaRole: 'Wildlife Photographer',
        rajRole: 'Cultural Explorer',
        mayaRole: 'Spiritual Seeker',
        quote1:
          "The tiger safari at Betla was absolutely incredible! The platform's recommendations were spot-on, and the secure booking process gave me complete peace of mind. Captured amazing shots!",
        quote2:
          'The handicraft shopping guide was amazing! I found authentic Dokra art pieces directly from artisans. The cultural insights were invaluable for understanding the traditions.',
        quote3:
          'Visiting Baidyanath Temple through this platform was seamless. The real-time updates about crowd levels helped me plan the perfect darshan time. Truly divine experience!',
      };
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);
  const destinationsRef = useRef(null);
  const handicraftsRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Video autoplay failed:", error);
        });
      }
    }

    // INSANE ScrollTrigger Animations for all cards
    if (mounted) {
      // Destinations Cards
      gsap.utils.toArray('.destination-card').forEach((card, i) => {
        gsap.set(card, { x: i % 2 === 0 ? -400 : 400, opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -8 : 8 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => {
            gsap.to(card, {
              x: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.1,
              ease: 'power4.out',
              overwrite: 'auto'
            });
          },
          onLeave: () => {
            gsap.to(card, {
              y: -80,
              opacity: 0.5,
              scale: 0.9,
              rotate: i % 2 === 0 ? -8 : 8,
              duration: 0.7,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          },
          onEnterBack: () => {
            gsap.to(card, {
              y: 0,
              x: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.8,
              ease: 'power4.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              x: i % 2 === 0 ? -400 : 400,
              opacity: 0,
              scale: 0.8,
              rotate: i % 2 === 0 ? -8 : 8,
              duration: 0.8,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          }
        });
      });

      // Handicraft Cards
      gsap.utils.toArray('.handicraft-item').forEach((card, i) => {
        gsap.set(card, { y: 200, opacity: 0, scale: 0.7, rotate: i % 2 === 0 ? 12 : -12 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 90%',
          end: 'bottom 10%',
          onEnter: () => {
            gsap.to(card, {
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1,
              ease: 'elastic.out(1, 0.5)',
              overwrite: 'auto'
            });
          },
          onLeave: () => {
            gsap.to(card, {
              y: -80,
              opacity: 0.5,
              scale: 0.85,
              rotate: i % 2 === 0 ? 12 : -12,
              duration: 0.7,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          },
          onEnterBack: () => {
            gsap.to(card, {
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.8,
              ease: 'elastic.out(1, 0.5)',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              y: 200,
              opacity: 0,
              scale: 0.7,
              rotate: i % 2 === 0 ? 12 : -12,
              duration: 0.8,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          }
        });
      });

      // Testimonials Cards
      gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.set(card, { x: 350, opacity: 0, scale: 0.8, rotateY: 45 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 90%',
          end: 'bottom 10%',
          onEnter: () => {
            gsap.to(card, {
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
              duration: 1,
              ease: 'power4.out',
              overwrite: 'auto'
            });
          },
          onLeave: () => {
            gsap.to(card, {
              x: 350,
              opacity: 0,
              scale: 0.8,
              rotateY: 45,
              duration: 0.7,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          },
          onEnterBack: () => {
            gsap.to(card, {
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
              duration: 0.8,
              ease: 'power4.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              x: 350,
              opacity: 0,
              scale: 0.8,
              rotateY: 45,
              duration: 0.8,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted]);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
          playsInline
        >
          <source src="/v.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(0,200,255,0.10) 100%)'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center z-10">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="inline-block px-6 py-3 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-emerald-300 font-semibold tracking-wider text-sm">{L.heroTag}</span>
            </div>
          </div>

          <h1
            className="text-5xl md:text-8xl font-black text-white mb-6 leading-none opacity-0 animate-fade-in-up"
            style={{ 
              animationDelay: '0.4s', 
              animationFillMode: 'forwards',
              textShadow: '0 0 60px rgba(255,255,255,0.3)'
            }}
          >
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {L.heroTitlePart1}
            </span>
            <br />
            <span className="text-white/90">{L.heroTitlePart2}</span>
          </h1>

          <p
            className="mt-6 text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ 
              animationDelay: '0.6s', 
              animationFillMode: 'forwards',
              textShadow: '0 0 20px rgba(0,0,0,0.8)'
            }}
          >
            {L.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <Link href="/plan">
              <Button />
            </Link>
            <Link href="/destinations">
              <Button>{L.exploreDestinations}</Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section
        ref={destinationsRef}
        className="relative py-32 z-10 min-h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://wallpaperaccess.com/full/7853230.jpg')" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {L.featuredDestinations} <span className="text-green-300">{L.destinations}</span>
            </h2>
            <p className="text-xl text-green-200 max-w-4xl mx-auto">
              {L.destsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="destination-card bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-3xl overflow-hidden border border-green-400/30 shadow-2xl">
              <div className="relative h-80">
                <img 
                  src="https://indroyc.com/wp-content/uploads/2023/12/img20231202150138.jpg?w=872"
                  alt="Betla National Park" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">{L.wildlifeSanctuary}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-8xl text-white drop-shadow-2xl">🐅</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">{L.betlaTitle}</h3>
                <p className="text-green-200 mb-6 leading-relaxed">
                  {L.betlaDesc}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">{L.entryFee}</span>
                    <div className="text-white font-bold">₹50 - ₹200</div>
                  </div>
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">{L.timings}</span>
                    <div className="text-white font-bold">6AM - 6PM</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <span>🌟 {L.bestTime}: {L.bestTimeBetla}</span>
                  <span className="ml-auto">📍 {L.palamu}</span>
                </div>
              </div>
            </div>

            <div className="destination-card bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-3xl overflow-hidden border border-green-400/30 shadow-2xl">
              <div className="relative h-80">
                <img 
                  src="https://www.pilgrimagetour.in/blog/wp-content/uploads/2023/11/Baba-Baidyanath-Temple-Rituals.jpg"
                  alt="Baidyanath Temple" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">{L.jyotirlinga}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-8xl text-white drop-shadow-2xl">🕉️</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">{L.baidyanathTitle}</h3>
                <p className="text-green-200 mb-6 leading-relaxed">
                  {L.baidyanathDesc}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">{L.entryFee}</span>
                    <div className="text-white font-bold">{L.freeDarshan}</div>
                  </div>
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">{L.timings}</span>
                    <div className="text-white font-bold">{L.fourToNine}</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <span>🌟 {L.bestTime}: {L.bestTimeBaidya}</span>
                  <span className="ml-auto">📍 {L.deoghar}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Handicrafts Section */}
      <section ref={handicraftsRef}
      className="relative py-32 z-10 min-h-screen flex items-center bg-cover bg-center bg-black/80"
      style={{ backgroundImage: "url(pot.jpg)", boxShadow: 'inset 0 0 150px 75px rgba(0,0,0,0.8)'}}>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {L.handicrafts} <span className="text-purple-300">{L.handicrafts2}</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto">
              {L.handiSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="handicraft-item bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-400/30 shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
                <img 
                  src="https://tse2.mm.bing.net/th/id/OIP.4LogSAroxt-6YhJwJd25HwHaEK?pid=Api&P=0&h=180" 
                  alt="Dokra Art" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative text-6xl text-white drop-shadow-2xl"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{L.dokra}</h3>
                <p className="text-purple-200 text-sm mb-4">{L.dokraDesc}</p>
                <div className="text-amber-400 text-sm font-semibold">₹500 - ₹5,000</div>
              </div>
            </div>

            <div className="handicraft-item bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-400/30 shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-red-600 to-pink-700 flex items-center justify-center">
                <img 
                  src="https://i.pinimg.com/originals/a6/f3/6a/a6f36a914cd05498b425f44aead527db.jpg" 
                  alt="Sohrai Paintings" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative text-6xl text-white drop-shadow-2xl"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{L.sohrai}</h3>
                <p className="text-purple-200 text-sm mb-4">{L.sohraiDesc}</p>
                <div className="text-red-400 text-sm font-semibold">₹300 - ₹2,500</div>
              </div>
            </div>

            <div className="handicraft-item bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-400/30 shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-green-600 to-teal-700 flex items-center justify-center">
                <img 
                  src="https://im.hunt.in/cg/jhar/About/bamboo.jpg" 
                  alt="Bamboo Crafts" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative text-6xl text-white drop-shadow-2xl"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{L.bamboo}</h3>
                <p className="text-purple-200 text-sm mb-4">{L.bambooDesc}</p>
                <div className="text-green-400 text-sm font-semibold">₹150 - ₹3,000</div>
              </div>
            </div>

            <div className="handicraft-item bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-400/30 shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                <img
                  src="https://tse3.mm.bing.net/th/id/OIP.hfbgZS56ffgxV4iVyc4GNgHaD8?pid=Api&P=0&h=180" 
                  alt="Tribal Jewelry" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative text-6xl text-white drop-shadow-2xl"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{L.jewelry}</h3>
                <p className="text-purple-200 text-sm mb-4">{L.jewelryDesc}</p>
                <div className="text-purple-400 text-sm font-semibold">₹200 - ₹8,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="relative py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {L.testimonialsTitle1} <span className="text-yellow-400">{L.testimonialsTitle2}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              {L.testiSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-3xl overflow-hidden border border-yellow-400/30 shadow-2xl">
              <div className="relative h-32 bg-gradient-to-br from-blue-600 to-purple-700">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b332c1c9?w=400&h=150&fit=crop&crop=face" 
                  alt="Anita Sharma" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                  A
                </div>
                <div className="pt-8">
                  <div className="flex items-center mb-4">
                    <div>
                      <h4 className="text-white font-bold text-lg">Anita Sharma</h4>
                      <p className="text-gray-400 text-sm">{L.anitaRole}</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400 text-lg">★★★★★</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">“{L.quote1}”</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-3xl overflow-hidden border border-yellow-400/30 shadow-2xl">
              <div className="relative h-32 bg-gradient-to-br from-green-600 to-teal-700">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=150&fit=crop&crop=face" 
                  alt="Raj Patel" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                  R
                </div>
                <div className="pt-8">
                  <div className="flex items-center mb-4">
                    <div>
                      <h4 className="text-white font-bold text-lg">Raj Patel</h4>
                      <p className="text-gray-400 text-sm">{L.rajRole}</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400 text-lg">★★★★★</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">“{L.quote2}”</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-3xl overflow-hidden border border-yellow-400/30 shadow-2xl">
              <div className="relative h-32 bg-gradient-to-br from-orange-600 to-red-700">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=150&fit=crop&crop=face" 
                  alt="Maya Singh" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                  M
                </div>
                <div className="pt-8">
                  <div className="flex items-center mb-4">
                    <div>
                      <h4 className="text-white font-bold text-lg">Maya Singh</h4>
                      <p className="text-gray-400 text-sm">{L.mayaRole}</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400 text-lg">★★★★★</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">“{L.quote3}”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-pulse {
          animation: pulse 1.2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}