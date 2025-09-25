// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useSettings } from './SettingsProvider';
// import SignInModal from './SignIn';
// import SignUpModal from './Signup';

// const NAV_ITEMS = [
//   { key: 'destinations', fallback: 'Destinations', href: '/destinations' },
//   { key: 'handicrafts', fallback: 'Handicrafts', href: '/handicrafts' },
//   { key: 'plan', fallback: 'Plan', href: '/plan' },
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);
//   const [showSignIn, setShowSignIn] = useState(false);
//   const [showSignUp, setShowSignUp] = useState(false);
//   const btnRef = useRef(null);
//   const menuRef = useRef(null);
//   const { togglePanel, t } = useSettings();

//   useEffect(() => {
//     const onKey = (e) => e.key === 'Escape' && setOpen(false);
//     const onClick = (e) => {
//       if (!open) return;
//       const t = e.target;
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(t) &&
//         btnRef.current &&
//         !btnRef.current.contains(t)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('keydown', onKey);
//     document.addEventListener('click', onClick);
//     return () => {
//       document.removeEventListener('keydown', onKey);
//       document.removeEventListener('click', onClick);
//     };
//   }, [open]);

//   const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

//   const handleSignInClick = () => {
//     setShowSignIn(true);
//     setOpen(false); // Close mobile menu if open
//   };

//   const handleSignUpClick = () => {
//     setShowSignUp(true);
//     setOpen(false); // Close mobile menu if open
//   };

//   const switchToSignUp = () => {
//     setShowSignIn(false);
//     setShowSignUp(true);
//   };

//   const switchToSignIn = () => {
//     setShowSignUp(false);
//     setShowSignIn(true);
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-50">
//         <nav
//           className="bg-white/80 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-neutral-200/60 dark:border-neutral-800 shadow-sm"
//           aria-label="Primary"
//         >
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 items-center justify-between">
//               {/* Brand */}
//               <div className="flex items-center gap-2">
//                 <div className="bg-gradient-to-br from-green-600 to-emerald-700 w-10 h-10 rounded-full grid place-items-center">
//                   <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
//                   </svg>
//                   <span className="sr-only">Jharkhand Journeys</span>
//                 </div>
//                 <Link
//                   href="/"
//                   className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent"
//                 >
//                   Jharkhand Journeys
//                 </Link>
//               </div>

//               {/* Desktop nav */}
//               <div className="hidden md:flex items-center gap-6">
//                 {NAV_ITEMS.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={[
//                       'inline-flex items-center gap-1 text-sm font-medium transition-colors',
//                       'hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30 rounded-sm px-1 py-1',
//                       isActive(item.href) ? 'text-green-700' : 'text-neutral-700 dark:text-neutral-300',
//                     ].join(' ')}
//                   >
//                     {t(item.key) || item.fallback}
//                     {isActive(item.href) && <span className="ml-1 h-1 w-1 rounded-full bg-green-700" aria-hidden="true" />}
//                   </Link>
//                 ))}

//                 {/* Settings button */}
//                 <button
//                   onClick={togglePanel}
//                   className="relative inline-flex items-center justify-center rounded-full p-2 text-neutral-700 hover:text-green-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
//                   aria-label={t('settings')}
//                 >
//                   <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35.533-.129 1.004-.5 1.065-1.066.94-1.543.826-3.31 2.37-2.37.68.414 1.54.18 2.573-1.065z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </button>

//                 {/* Auth / CTA */}
//                 <div className="flex items-center gap-3 pl-2">
//                   <button
//                     onClick={handleSignInClick}
//                     className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30 rounded-sm px-1 py-1"
//                   >
//                     {t('login') || 'Login'}
//                   </button>
//                   <button
//                     onClick={handleSignUpClick}
//                     className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-green-700 hover:to-emerald-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
//                   >
//                     {t('signUp') || 'Sign Up'}
//                   </button>
//                 </div>
//               </div>

//               <div className="md:hidden">
//                 <button
//                   ref={btnRef}
//                   type="button"
//                   className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
//                   aria-label="Open main menu"
//                   aria-haspopup="true"
//                   aria-expanded={open}
//                   aria-controls="mobile-menu"
//                   onClick={() => setOpen((v) => !v)}
//                 >
//                   {open ? (
//                     <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   ) : (
//                     <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div
//             id="mobile-menu"
//             ref={menuRef}
//             className={[
//               'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
//               open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
//             ].join(' ')}
//           >
//             <div className="bg-white/95 dark:bg-neutral-950/90 border-t border-neutral-200/60 dark:border-neutral-800 backdrop-blur">
//               <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
//                 <div className="flex flex-col gap-3">
//                   {NAV_ITEMS.map((item) => (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       onClick={() => setOpen(false)}
//                       className={[
//                         'flex items-center justify-between rounded-md px-3 py-2 text-base font-medium',
//                         isActive(item.href) ? 'text-green-700 bg-green-50' : 'text-neutral-800 hover:bg-neutral-100',
//                       ].join(' ')}
//                     >
//                       <span>{t(item.key) || item.fallback}</span>
//                       {isActive(item.href) ? (
//                         <span className="h-1.5 w-1.5 rounded-full bg-green-700" aria-hidden="true" />
//                       ) : null}
//                     </Link>
//                   ))}

//                   <div className="mt-2 grid grid-cols-2 gap-3">
//                     <button
//                       onClick={handleSignInClick}
//                       className="inline-flex items-center justify-center rounded-md border border-green-600/30 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
//                     >
//                       {t('login') || 'Login'}
//                     </button>
//                     <button
//                       onClick={handleSignUpClick}
//                       className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
//                     >
//                       {t('signUp') || 'Sign Up'}
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => { setOpen(false); togglePanel(); }}
//                     className="mt-3 inline-flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                   >
//                     {t('settings') || 'Settings'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* Auth Modals */}
//       <SignInModal 
//         isOpen={showSignIn} 
//         onClose={() => setShowSignIn(false)}
//         onSwitchToSignUp={switchToSignUp}
//       />
//       <SignUpModal 
//         isOpen={showSignUp} 
//         onClose={() => setShowSignUp(false)}
//         onSwitchToSignIn={switchToSignIn}
//       />
//     </>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from './SettingsProvider';
import SignInModal from './SignIn';
import SignUpModal from './SignUp';
import UserProfileDropdown from './userprofile';
import axios from 'axios';

const NAV_ITEMS = [
  { key: 'destinations', fallback: 'Destinations', href: '/destinations' },
  { key: 'handicrafts', fallback: 'Handicrafts', href: '/handicrafts' },
  { key: 'plan', fallback: 'Plan', href: '/plan' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const { togglePanel, t } = useSettings();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me', { withCredentials: true });
      if (response.data.user) {
        // Fetch full user details if needed
        setUser(response.data.user);
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => {
      if (!open) return;
      const t = e.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  const handleSignInClick = () => {
    setShowSignIn(true);
    setOpen(false); // Close mobile menu if open
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setOpen(false); // Close mobile menu if open
  };

  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const handleSignInSuccess = (userData) => {
    setUser(userData);
    setShowSignIn(false);
  };

  const handleSignUpSuccess = (userData) => {
    setUser(userData);
    setShowSignUp(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <nav
          className="bg-white/80 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-neutral-200/60 dark:border-neutral-800 shadow-sm"
          aria-label="Primary"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 w-10 h-10 rounded-full grid place-items-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Jharkhand Journeys</span>
                </div>
                <Link
                  href="/"
                  className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent"
                >
                  Jharkhand Journeys
                </Link>
              </div>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                      'hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30 rounded-sm px-1 py-1',
                      isActive(item.href) ? 'text-green-700' : 'text-neutral-700 dark:text-neutral-300',
                    ].join(' ')}
                  >
                    {t(item.key) || item.fallback}
                    {isActive(item.href) && <span className="ml-1 h-1 w-1 rounded-full bg-green-700" aria-hidden="true" />}
                  </Link>
                ))}

                {/* Settings button */}
                <button
                  onClick={togglePanel}
                  className="relative inline-flex items-center justify-center rounded-full p-2 text-neutral-700 hover:text-green-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
                  aria-label={t('settings')}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35.533-.129 1.004-.5 1.065-1.066.94-1.543.826-3.31 2.37-2.37.68.414 1.54.18 2.573-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* Auth / CTA - Show profile dropdown if user is logged in, otherwise show login/signup */}
                <div className="flex items-center gap-3 pl-2">
                  {!loading && (
                    user ? (
                      <UserProfileDropdown user={user} onLogout={handleLogout} />
                    ) : (
                      <>
                        <button
                          onClick={handleSignInClick}
                          className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30 rounded-sm px-1 py-1"
                        >
                          {t('login') || 'Login'}
                        </button>
                        <button
                          onClick={handleSignUpClick}
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-green-700 hover:to-emerald-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
                        >
                          {t('signUp') || 'Sign Up'}
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>

              <div className="md:hidden">
                <button
                  ref={btnRef}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
                  aria-label="Open main menu"
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div
            id="mobile-menu"
            ref={menuRef}
            className={[
              'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
              open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
            ].join(' ')}
          >
            <div className="bg-white/95 dark:bg-neutral-950/90 border-t border-neutral-200/60 dark:border-neutral-800 backdrop-blur">
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        'flex items-center justify-between rounded-md px-3 py-2 text-base font-medium',
                        isActive(item.href) ? 'text-green-700 bg-green-50' : 'text-neutral-800 hover:bg-neutral-100',
                      ].join(' ')}
                    >
                      <span>{t(item.key) || item.fallback}</span>
                      {isActive(item.href) ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-green-700" aria-hidden="true" />
                      ) : null}
                    </Link>
                  ))}

                  {/* Mobile Auth/Profile Section */}
                  {!loading && (
                    user ? (
                      // Show user info in mobile menu
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-3 px-3 py-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => {
                              setOpen(false);
                              handleLogout();
                            }}
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Show login/signup buttons
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <button
                          onClick={handleSignInClick}
                          className="inline-flex items-center justify-center rounded-md border border-green-600/30 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                        >
                          {t('login') || 'Login'}
                        </button>
                        <button
                          onClick={handleSignUpClick}
                          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
                        >
                          {t('signUp') || 'Sign Up'}
                        </button>
                      </div>
                    )
                  )}

                  <button
                    onClick={() => { setOpen(false); togglePanel(); }}
                    className="mt-3 inline-flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {t('settings') || 'Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Auth Modals */}
      <SignInModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={switchToSignUp}
        onSuccess={handleSignInSuccess}
      />
      <SignUpModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={switchToSignIn}
        onSuccess={handleSignUpSuccess}
      />
    </>
  );
}