'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HandicraftsPage = () => {
  // Paste your handicrafts data array here
  const handicrafts = [
      {
        id: 1,
        name: 'Tribal Dokra Art',
        category: 'metal',
        image: 'https://static.wixstatic.com/media/9dd462_3aaaf70758974cb69131c26efb783e06~mv2.jpg/v1/fill/w_711,h_483,al_c/9dd462_3aaaf70758974cb69131c26efb783e06~mv2.jpg',
        description: 'Ancient lost-wax casting technique creating exquisite bronze figurines and decorative items.',
        price: '₹500 - ₹5,000',
        locations: [
          { place: 'Ranchi Main Road', area: 'Handicraft Emporium', distance: '2km from Ranchi Railway Station', nearestTouristSpot: 'Rock Garden Ranchi - 1.5km' },
          { place: 'Deoghar Temple Market', area: 'Near Baidyanath Temple', distance: '500m from temple entrance', nearestTouristSpot: 'Baidyanath Temple - 100m' },
          { place: 'Tribal Museum Shop', area: 'Morabadi, Ranchi', distance: '3km from Birsa Munda Airport', nearestTouristSpot: 'Tribal Research Institute - 200m' }
        ],
        speciality: 'UNESCO recognized art form',
        artisans: 'Dhokra craftsmen of Jharkhand',
        icon: '🏺',
        colors: 'from-amber-600 to-orange-700',
        onlineAvailable: false,
        culturalSignificance: 'Dokra art represents the ancient metallurgical skills of tribal communities, often depicting musicians, dancers, and animals that hold spiritual significance.',
        makingProcess: 'Made using the lost-wax technique where clay models are covered with wax, then clay again. Molten brass is poured, melting the wax and creating hollow figurines.',
        authenticity: 'Look for irregular surfaces, slight asymmetry, and the characteristic brass-bronze color. Genuine pieces have a distinctive metallic ring when tapped.'
      },
      {
        id: 2,
        name: 'Sohrai Paintings',
        category: 'art',
        image: 'https://static.wixstatic.com/media/9dd462_9259ff4a55994eadace4e709eb97a38f~mv2.jpg/v1/fill/w_480,h_332,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/9dd462_9259ff4a55994eadace4e709eb97a38f~mv2.jpg',
        description: 'Traditional wall art celebrating harvest festival with natural pigments.',
        price: '₹300 - ₹2,500',
        locations: [
          { place: 'Hazaribagh Art Center', area: 'Gandhi Chowk', distance: '1km from Hazaribagh Bus Stand', nearestTouristSpot: 'Hazaribagh National Park - 15km' },
          { place: 'Jamshedpur Craft Market', area: 'Sakchi Market', distance: '2km from Tatanagar Railway Station', nearestTouristSpot: 'Jubilee Park - 3km' },
          { place: 'Khunti Village Tours', area: 'Khunti District', distance: '45km from Ranchi city center', nearestTouristSpot: 'Ulihatu (Birsa Birthplace) - 20km' }
        ],
        speciality: 'Prehistoric rock art inspired',
        artisans: 'Women of Kurmi and Agaria tribes',
        icon: '🎨',
        colors: 'from-red-500 to-pink-600',
        onlineAvailable: false,
        culturalSignificance: 'Created during Sohrai festival to welcome cattle and celebrate harvest. Paintings are believed to bring prosperity and protect livestock.',
        makingProcess: 'Natural pigments from clay, charcoal, and ochre are mixed with water. Finger painting technique creates geometric patterns and animal figures on freshly plastered mud walls.',
        authenticity: 'Authentic Sohrai paintings use only natural colors - red ochre, white clay, yellow clay, and charcoal black. Look for traditional motifs like elephants, peacocks, and geometric patterns.'
      },
      {
        id: 3,
        name: 'Bamboo Craft',
        category: 'utility',
        image: 'https://indianetzone.wordpress.com/wp-content/uploads/2024/08/bamboo.jpg?w=500',
        description: 'Eco-friendly baskets, furniture, and decorative items crafted from bamboo.',
        price: '₹150 - ₹3,000',
        locations: [
          { place: 'Ranchi Haat Bazaar', area: 'Kanke Road', distance: '5km from Ranchi University', nearestTouristSpot: 'Kanke Dam - 8km' },
          { place: 'Netarhat Hill Station', area: 'Local market near viewpoint', distance: '2km from Netarhat sunset point', nearestTouristSpot: 'Netarhat Sunset Point - 2km' },
          { place: 'Betla National Park', area: 'Park entrance shops', distance: '1km from main gate', nearestTouristSpot: 'Betla National Park - 500m' }
        ],
        speciality: 'Sustainable & lightweight',
        artisans: 'Tribal artisans of Palamu region',
        icon: '🎍',
        colors: 'from-green-500 to-emerald-600',
        onlineAvailable: false,
        culturalSignificance: 'Bamboo crafts represent sustainable living practices of tribal communities. Different weaving patterns have cultural meanings passed through generations.',
        makingProcess: 'Fresh bamboo is dried, split into strips, and woven using traditional interlacing techniques. Natural dyes are applied for colored patterns.',
        authenticity: 'Check for tight, even weaving patterns. Quality bamboo crafts have smooth finish and no loose ends. The bamboo should have a natural, light color unless dyed.'
      },
      {
        id: 4,
        name: 'Tribal Jewelry',
        category: 'jewelry',
        image: 'https://cultureandheritage.org/wp-content/uploads/2021/10/abcd.jpg',
        description: 'Traditional ornaments made from brass, silver, beads, and natural materials.',
        price: '₹200 - ₹8,000',
        locations: [
          { place: 'Deoghar Silver Market', area: 'Temple Road', distance: '200m from Baidyanath Temple', nearestTouristSpot: 'Baidyanath Temple - 200m' },
          { place: 'Ranchi Jewelry Street', area: 'Main Road, Ranchi', distance: '1km from Albert Ekka Chowk', nearestTouristSpot: 'Jagannath Temple - 2km' },
          { place: 'Saraikela Handicraft Center', area: 'Saraikela town', distance: '60km from Jamshedpur', nearestTouristSpot: 'Saraikela Palace - 1km' }
        ],
        speciality: 'Authentic tribal designs',
        artisans: 'Santhal and Munda craftswomen',
        icon: '💍',
        colors: 'from-purple-500 to-indigo-600',
        onlineAvailable: false,
        culturalSignificance: 'Each design has meaning - spirals represent life cycles, animal motifs provide protection, and geometric patterns ward off evil spirits.',
        makingProcess: 'Hand-forged using traditional tools. Silver is melted and shaped, then detailed work is done using small hammers and engraving tools.',
        authenticity: 'Look for handmade irregularities, traditional motifs, and proper hallmarking on silver pieces. Brass items should have a warm, golden color.'
      },
      {
        id: 5,
        name: 'Paitkar Paintings',
        category: 'art',
        image: 'https://static.wixstatic.com/media/9dd462_bc8b985154b14e87926ef9c16d574c7c~mv2.jpg/v1/fill/w_480,h_360,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/9dd462_bc8b985154b14e87926ef9c16d574c7c~mv2.jpg',
        description: 'Narrative scroll paintings depicting mythological stories and tribal legends.',
        price: '₹800 - ₹6,000',
        locations: [
          { place: 'Dumka Art Gallery', area: 'Dumka town center', distance: '2km from Dumka Railway Station', nearestTouristSpot: 'Massanjore Dam - 25km' },
          { place: 'Ranchi Cultural Center', area: 'Kutchery Road', distance: '1.5km from Ranchi High Court', nearestTouristSpot: 'Birsa Zoological Park - 5km' },
          { place: 'Santhal Museum', area: 'Dumka district', distance: '3km from Dumka city center', nearestTouristSpot: 'Santhal Museum - 100m' }
        ],
        speciality: 'Storytelling through art',
        artisans: 'Santhal Paitkar artists',
        icon: '📜',
        colors: 'from-blue-500 to-cyan-600',
        onlineAvailable: false,
        culturalSignificance: 'Used by Santhal bards to narrate creation myths and tribal history. These scrolls are musical performances where paintings guide the storytelling.',
        makingProcess: 'Natural pigments from stones, leaves, and bark are mixed with gum. Stories are painted in panels on long scrolls made from handmade paper.',
        authenticity: 'Original Paitkar paintings tell complete stories across multiple panels. Look for natural color variations and traditional Santhal characters and motifs.'
      },
      {
        id: 6,
        name: 'Stone Carvings',
        category: 'sculpture',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Temples_of_Maluti_in_Jharkhand_10.jpg',
        description: 'Intricate sculptures carved from local sandstone and granite.',
        price: '₹1,000 - ₹15,000',
        locations: [
          { place: 'Parasnath Hill Market', area: 'Giridih district', distance: '5km from Parasnath Railway Station', nearestTouristSpot: 'Parasnath Hill (Sammed Shikharji) - 5km' },
          { place: 'Rajrappa Temple Area', area: 'Ramgarh district', distance: '1km from Rajrappa Temple', nearestTouristSpot: 'Rajrappa Temple - 1km' },
          { place: 'Hundru Falls Shops', area: 'Near waterfall entrance', distance: '35km from Ranchi city', nearestTouristSpot: 'Hundru Falls - 500m' }
        ],
        speciality: 'Religious & decorative sculptures',
        artisans: 'Traditional stone carvers of Giridih',
        icon: '🗿',
        colors: 'from-gray-600 to-slate-700',
        onlineAvailable: false,
        culturalSignificance: 'Stone carvings serve both religious and decorative purposes. Many depict Hindu deities, while others show tribal totems and nature spirits.',
        makingProcess: 'Using traditional chisels and hammers, artisans slowly carve detailed figures from local sandstone and granite blocks over several weeks.',
        authenticity: 'Check for tool marks showing hand-carving. Machine-made pieces have uniform surfaces. Traditional pieces often have slight asymmetries.'
      },
      {
        id: 7,
        name: 'Tribal Textiles',
        category: 'textile',
        image: 'https://www.assocham.org/CoEtribalentrepreneur/assets/images/bifurcation/Jharkhand.jpg',
        description: 'Handwoven fabrics with traditional motifs using natural dyes.',
        price: '₹400 - ₹4,000',
        locations: [
          { place: 'Khadi Gramodyog', area: 'Ranchi Main Road', distance: '1km from GPO Ranchi', nearestTouristSpot: 'Birsa Munda Central Jail Museum - 2km' },
          { place: 'Jamshedpur Handloom', area: 'Bistupur Market', distance: '3km from Jamshedpur city center', nearestTouristSpot: 'Dalma Wildlife Sanctuary - 25km' },
          { place: 'Chaibasa Tribal Market', area: 'West Singhbhum', distance: '2km from Chaibasa Railway Station', nearestTouristSpot: 'Chaibasa Forest Reserve - 10km' }
        ],
        speciality: 'Natural dyes & organic cotton',
        artisans: 'Tribal weavers across Jharkhand',
        icon: '🧵',
        colors: 'from-teal-500 to-blue-600',
        onlineAvailable: false,
        culturalSignificance: 'Textile patterns represent clan identities and social status. Colors and motifs indicate tribal affiliation and ceremonial importance.',
        makingProcess: 'Cotton is hand-spun, dyed with natural colors from plants and minerals, then woven on traditional pit looms by skilled tribal women.',
        authenticity: 'Look for slight color variations showing natural dyes. Hand-woven textiles have minor irregularities in weave pattern. Check for traditional tribal motifs.'
      },
      {
        id: 8,
        name: 'Lac Bangles',
        category: 'jewelry',
        image: 'https://spaindustrialdesign.wordpress.com/wp-content/uploads/2020/12/lac-bangles.jpg',
        description: 'Colorful bangles made from lac (natural resin) with intricate designs.',
        price: '₹50 - ₹500',
        locations: [
          { place: 'Ranchi Women\'s Market', area: 'Firayalal Chowk', distance: '2km from Ranchi Railway Station', nearestTouristSpot: 'Pahari Mandir - 3km' },
          { place: 'Hazaribagh Lac Center', area: 'Market Road', distance: '1km from Hazaribagh collectorate', nearestTouristSpot: 'Hazaribagh Lake - 2km' },
          { place: 'Koderma Lac Factory', area: 'Koderma town', distance: '3km from Koderma Railway Station', nearestTouristSpot: 'Koderma Rock Paintings - 15km' }
        ],
        speciality: 'Natural lac production center',
        artisans: 'Lac workers of Koderma & Hazaribagh',
        icon: '💫',
        colors: 'from-pink-500 to-rose-600',
        onlineAvailable: false,
        culturalSignificance: 'Lac bangles are considered auspicious for married women. Different colors signify different occasions - red for weddings, green for festivals.',
        makingProcess: 'Natural lac resin is heated, shaped on mandrels, then decorated with gold leaf, mirrors, and colorful patterns while still warm.',
    authenticity: 'Real lac bangles have a warm feel and slight flexibility. They should have natural color variations and traditional designs, not machine-printed patterns.'
    }
    ];  
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const heroTextRef = useRef(null);
  const heroSubtextRef = useRef(null);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const tl = gsap.timeline();
    
    tl.fromTo(heroTextRef.current, 
      { 
        y: 100, 
        opacity: 0, 
        scale: 0.8 
      }, 
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        ease: "power4.out" 
      }
    )
    .fromTo(heroSubtextRef.current, 
      { 
        y: 50, 
        opacity: 0 
      }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.6"
    );

    // Cards scroll animations
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const isEven = index % 2 === 0;
        
        gsap.set(card, {
          x: isEven ? -200 : 200,
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotation: isEven ? -15 : 15
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
          onEnter: () => {
            gsap.to(card, {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 1,
              delay: index * 0.1,
              ease: "power4.out"
            });
          },
          onLeave: () => {
            gsap.to(card, {
              x: isEven ? -200 : 200,
              y: 100,
              opacity: 0,
              scale: 0.8,
              rotation: isEven ? -15 : 15,
              duration: 0.6,
              ease: "power3.in"
            });
          },
          onEnterBack: () => {
            gsap.to(card, {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "power4.out"
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              x: isEven ? -200 : 200,
              y: 100,
              opacity: 0,
              scale: 0.8,
              rotation: isEven ? -15 : 15,
              duration: 0.6,
              ease: "power3.in"
            });
          }
        });

        // Hover animations
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [handicrafts]);

  // Modal animations
  useEffect(() => {
    if (isModalOpen) {
      gsap.fromTo('.modal-content',
        {
          scale: 0.8,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power4.out"
        }
      );
    }
  }, [isModalOpen]);

  const openModal = (craft) => {
    setSelectedCraft(craft);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    gsap.to('.modal-content', {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsModalOpen(false);
        setSelectedCraft(null);
        document.body.style.overflow = 'unset';
      }
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-emerald-900/30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-48 h-48 bg-orange-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 
            ref={heroTextRef}
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-orange-400 to-purple-400 mb-8 leading-tight"
          >
            Jharkhand
            <br />
            <span className="text-6xl md:text-8xl text-white font-light">Handicrafts</span>
          </h1>
          
          <div 
            ref={heroSubtextRef}
            className="max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Discover authentic tribal artistry crafted by generations of skilled artisans
            </p>
            
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-emerald-400/20">
              <p className="text-emerald-300 text-lg font-semibold mb-3">
                Available Offline Only
              </p>
              <p className="text-gray-200 text-base">
                These precious handicrafts must be purchased directly from local markets and artisan centers across Jharkhand
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Handicrafts Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              Authentic Treasures
            </h2>
            <p className="text-xl text-gray-400">
              Each piece tells a story of tradition and craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {handicrafts.map((craft, index) => (
              <div
                key={craft.id}
                ref={el => cardsRef.current[index] = el}
                className="group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
                onClick={() => openModal(craft)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={craft.image} 
                    alt={craft.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-emerald-300 px-3 py-2 rounded-full text-sm font-semibold">
                    {craft.price}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                    {craft.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {craft.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-sm font-medium">
                      {craft.speciality}
                    </span>
                    <div className="flex items-center gap-2 text-orange-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">View Details</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedCraft && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={closeModal}
  >
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
    
    <div 
      className="modal-content relative bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10"
      onClick={(e) => e.stopPropagation()}
    >
            {/* Modal Header */}
            <div className="relative">
              <img 
                src={selectedCraft.image} 
                alt={selectedCraft.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {selectedCraft.name}
                </h2>
                <p className="text-emerald-300 text-lg font-medium">
                  {selectedCraft.speciality}
                </p>
                <p className="text-orange-300 text-base mt-1">
                  {selectedCraft.price}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Cultural Significance
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {selectedCraft.culturalSignificance}
                  </p>
                  
                  <h3 className="text-xl font-bold text-white mb-4">
                    Artisan Details
                  </h3>
                  <p className="text-emerald-400 font-medium">
                    {selectedCraft.artisans}
                  </p>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Shopping Locations
                  </h3>
                  <div className="space-y-4">
                    {selectedCraft.locations?.map((location, idx) => (
                      <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="font-semibold text-emerald-300 mb-2">
                          {location.place}
                        </div>
                        <div className="text-sm text-gray-400 mb-1">
                          {location.area}
                        </div>
                        <div className="text-sm text-orange-400">
                          {location.distance}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-red-900/20 border border-red-400/20 rounded-xl">
                    <p className="text-red-300 text-sm font-medium">
                      Available offline only - Visit these locations to purchase authentic pieces
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandicraftsPage;