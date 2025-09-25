'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/airplanebtn';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LandingPage() {
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
              <span className="text-emerald-300 font-semibold tracking-wider text-sm">DISCOVER JHARKHAND</span>
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
              Plan Your
            </span>
            <br />
            <span className="text-white/90">Journey</span>
          </h1>

          <p
            className="mt-6 text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ 
              animationDelay: '0.6s', 
              animationFillMode: 'forwards',
              textShadow: '0 0 20px rgba(0,0,0,0.8)'
            }}
          >
            Discover Jharkhand's hidden gems through immersive experiences, 
            ancient tribal heritage, and breathtaking natural wonders that tell stories of millennia.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <Link href="/plan">
              <Button />
            </Link>
            <Link href="/destinations">
              <Button>Explore Destinations</Button>
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
              Featured <span className="text-green-300">Destinations</span>
            </h2>
            <p className="text-xl text-green-200 max-w-4xl mx-auto">
              Explore the most captivating attractions that define Jharkhand's natural and spiritual heritage
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
                  <span className="text-white text-sm font-medium">Wildlife Sanctuary</span>
                </div>
                <div className="absolute bottom-4 left-4 text-8xl text-white drop-shadow-2xl">🐅</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">Betla National Park</h3>
                <p className="text-green-200 mb-6 leading-relaxed">
                  Home to majestic Royal Bengal Tigers and diverse wildlife, this pristine sanctuary offers thrilling safari experiences through dense forests and scenic landscapes, showcasing Jharkhand's incredible biodiversity.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">Entry Fee</span>
                    <div className="text-white font-bold">₹50 - ₹200</div>
                  </div>
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">Timings</span>
                    <div className="text-white font-bold">6AM - 6PM</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <span>🌟 Best Time: October - March</span>
                  <span className="ml-auto">📍 Palamu District</span>
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
                  <span className="text-white text-sm font-medium">Sacred Jyotirlinga</span>
                </div>
                <div className="absolute bottom-4 left-4 text-8xl text-white drop-shadow-2xl">🕉️</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">Baidyanath Temple</h3>
                <p className="text-green-200 mb-6 leading-relaxed">
                  One of the twelve sacred Jyotirlingas, this ancient temple in Deoghar attracts millions of devotees annually. Experience profound spirituality and witness centuries-old architectural magnificence.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">Entry Fee</span>
                    <div className="text-white font-bold">Free Darshan</div>
                  </div>
                  <div className="bg-green-800/30 p-3 rounded-lg">
                    <span className="text-green-300 text-sm font-medium">Timings</span>
                    <div className="text-white font-bold">4AM - 9PM</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <span>🌟 Best Time: July - August (Sawan)</span>
                  <span className="ml-auto">📍 Deoghar</span>
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
              Authentic <span className="text-purple-300">Handicrafts</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto">
              Take home pieces of Jharkhand's soul through these traditional artworks crafted by skilled tribal artisans
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
                <h3 className="text-xl font-bold text-white mb-3">Dokra Art</h3>
                <p className="text-purple-200 text-sm mb-4">Ancient bronze casting technique creating stunning figurines with 4000+ years of history</p>
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
                <h3 className="text-xl font-bold text-white mb-3">Sohrai Paintings</h3>
                <p className="text-purple-200 text-sm mb-4">Traditional wall art celebrating harvest festivals with natural pigments and geometric patterns</p>
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
                <h3 className="text-xl font-bold text-white mb-3">Bamboo Crafts</h3>
                <p className="text-purple-200 text-sm mb-4">Eco-friendly baskets and decorative items showcasing sustainable tribal living practices</p>
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
                <h3 className="text-xl font-bold text-white mb-3">Tribal Jewelry</h3>
                <p className="text-purple-200 text-sm mb-4">Traditional ornaments with cultural significance crafted from brass, silver and natural materials</p>
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
              Traveler <span className="text-yellow-400">Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Hear from fellow adventurers who discovered the magic of Jharkhand through our platform
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
                      <p className="text-gray-400 text-sm">Wildlife Photographer</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400 text-lg">★★★★★</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "The tiger safari at Betla was absolutely incredible! The platform's recommendations were spot-on, and the secure booking process gave me complete peace of mind. Captured amazing shots!"
                  </p>
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
                      <p className="text-gray-400 text-sm">Cultural Explorer</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400 text-lg">★★★★★</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "The handicraft shopping guide was amazing! I found authentic Dokra art pieces directly from artisans. The cultural insights were invaluable for understanding the traditions."
                  </p>
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
                      <p className="text-gray-400 text-sm">Spiritual Seeker</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400 text-lg">★★★★★</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "Visiting Baidyanath Temple through this platform was seamless. The real-time updates about crowd levels helped me plan the perfect darshan time. Truly divine experience!"
                  </p>
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