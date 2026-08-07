import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';
import { AmbientSoundWidget } from './AmbientSoundWidget';
import { AuthModal } from './AuthModal';

export const Header = () => {
  const {
    currentRoute,
    navigateTo,
    isFocusGuideActive,
    toggleFocusGuide,
    openFidget,
    openDeescalate,
    toggleReadingEase,
    speakText,
    voiceGender,
    toggleVoiceGender,
    user,
    logoutUser,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal
  } = useSensory();

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'practice', label: 'Practice' },
    { id: 'progress', label: 'Progress' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="w-full bg-bg-secondary border-b border-border py-2.5 px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <button
          onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
          className="flex items-center space-x-2.5 sm:space-x-3 focus:outline-none rounded-xl p-1 btn-press cursor-pointer shrink-0"
          aria-label="MindMirror AI Home"
        >
          <img
            src="/mindmirror_logo.png"
            alt="MindMirror AI Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm border border-[#E5E0D3]"
          />
          <div className="text-left">
            <span className="text-base sm:text-lg font-bold text-[#1F2937] block leading-none">
              MindMirror AI
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium block mt-0.5">
              Communication Practice
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links & Toolbar Pills (Visible on md and up) */}
        <div className="hidden lg:flex flex-wrap items-center gap-2">
          
          {/* Ambient Soundscapes */}
          <div className="shrink-0">
            <AmbientSoundWidget />
          </div>

          {/* Line Guide */}
          <button
            type="button"
            onClick={toggleFocusGuide}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isFocusGuideActive
                ? 'bg-[#BEE3F8] text-[#1E40AF] border-[#90CDF4] shadow-sm'
                : 'bg-[#D4EBF8] text-[#1E56A0] border-[#BDE0FE] hover:bg-[#BEE3F8]'
            }`}
            title="Toggle Dyslexia Focus Line Guide"
          >
            🔍 Line Guide
          </button>

          {/* Fidget Bubble Pad */}
          <button
            type="button"
            onClick={openFidget}
            className="px-3 py-1.5 bg-[#FDE4D6] text-[#C2593F] border border-[#FCD5C1] hover:bg-[#FCD5C1] rounded-full text-xs font-semibold transition-all cursor-pointer"
            title="Open Bubble Pop Fidget Pad"
          >
            ✋ Fidget
          </button>

          {/* Nav Items */}
          <nav className="flex items-center space-x-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-[#D5E8D4] text-[#2C5E2E] border border-[#B8D8B6] shadow-sm' 
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#EAE5D8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Accessibility Gear Button */}
            <button
              onClick={() => setIsToolbarOpen(prev => !prev)}
              className={`p-1.5 ml-1 text-[#4B5563] hover:bg-[#EAE5D8] rounded-xl border border-[#E5E0D3] focus:outline-none cursor-pointer btn-press ${
                isToolbarOpen ? 'bg-[#D5E8D4] text-[#2C5E2E] border-[#B8D8B6]' : ''
              }`}
              title="Toggle Accessibility Toolbar"
            >
              ⚙️
            </button>
          </nav>
        </div>

        {/* Mobile Hamburger Toggle Button (Visible on mobile & tablet < lg) */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#EEF2FF] border border-[#C7D2FE] rounded-full font-bold text-xs text-[#5C5B99]">
              <span>{user.avatar || '🌸'}</span>
              <span className="max-w-[70px] truncate">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-3 py-1 bg-[#5C5B99] hover:bg-[#494787] text-white rounded-full font-bold text-xs cursor-pointer shadow-sm"
            >
              🔐 Log In
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="p-2 text-[#1F2937] hover:bg-[#EAE5D8] rounded-xl border border-[#E5E0D3] cursor-pointer"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>

      {/* Desktop Secondary Floating Bar */}
      <div className="hidden lg:flex max-w-6xl mx-auto items-center justify-end gap-2 pt-2 text-xs">
        {user ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] border border-[#C7D2FE] rounded-full font-bold text-[#5C5B99]">
            <span>{user.avatar || '🌸'}</span>
            <span className="max-w-[100px] truncate">{user.name}</span>
            <button
              onClick={logoutUser}
              className="ml-1 text-[10px] text-gray-500 hover:text-red-600 underline cursor-pointer"
              title="Log Out"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="px-3.5 py-1 bg-[#5C5B99] hover:bg-[#494787] text-white rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm btn-press"
          >
            <span>🔐</span> Log In / Sign Up
          </button>
        )}

        <button
          onClick={() => navigateTo('progress')}
          className="px-3 py-1 bg-[#FCE4EB] text-[#B83280] border border-[#F9C5D5] hover:bg-[#F9C5D5] rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
        >
          <span>📖</span> Journal
        </button>

        <button
          onClick={() => openDeescalate()}
          className="px-3 py-1 bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC] hover:bg-[#B3E5FC] rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
        >
          <span>🌸</span> Zen Zone
        </button>

        {isToolbarOpen && (
          <div className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E0D3] rounded-2xl shadow-md flex items-center gap-2 text-xs animate-fadeIn">
            <span className="font-semibold text-[#6B7280] text-[11px]">Accessibility Toolbar</span>
            <button
              onClick={() => speakText("MindMirror AI Accessibility Toolbar Active.")}
              className="p-1 px-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-lg font-bold border border-[#D1D5DB] cursor-pointer"
              title="Text-to-Speech Audio Reader"
            >
              A🔊
            </button>
            <button
              onClick={() => {
                toggleVoiceGender();
                const nextVoice = voiceGender === 'female' ? 'male' : 'female';
                speakText(nextVoice === 'female' ? "Switched to Female Voice." : "Switched to Male Voice.", nextVoice);
              }}
              className="p-1 px-2.5 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5C5B99] rounded-lg font-bold border border-[#C7D2FE] cursor-pointer flex items-center gap-1 shadow-sm"
              title="Toggle Text-to-Speech Voice (Female 👩 / Male 👨)"
            >
              <span>{voiceGender === 'female' ? '👩 Female' : '👨 Male'}</span>
            </button>
            <button
              onClick={toggleReadingEase}
              className="p-1 px-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-lg font-bold border border-[#D1D5DB] cursor-pointer"
              title="Reading Ease Typography"
            >
              Aa
            </button>
          </div>
        )}
      </div>

      {/* Mobile Slide-Down Menu Drawer (100% Accessible on Mobile & Tablet!) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 bg-[#FDFBF7] border border-[#E5E0D3] rounded-2xl shadow-lg space-y-4 text-xs animate-fadeIn">
          
          {/* Mobile Page Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-3 border-b border-[#E5E0D3]">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigateTo(item.id); setIsMobileMenuOpen(false); }}
                className={`px-3 py-2 text-center font-bold rounded-xl cursor-pointer ${
                  currentRoute === item.id
                    ? 'bg-[#D5E8D4] text-[#2C5E2E] border border-[#B8D8B6]'
                    : 'bg-white text-[#4B5563] border border-[#E5E0D3]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Toolbars & Widgets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <AmbientSoundWidget />

            <button
              type="button"
              onClick={() => { toggleFocusGuide(); setIsMobileMenuOpen(false); }}
              className="px-3 py-1.5 bg-[#D4EBF8] text-[#1E56A0] border border-[#BDE0FE] rounded-full font-semibold"
            >
              🔍 Line Guide
            </button>

            <button
              type="button"
              onClick={() => { openFidget(); setIsMobileMenuOpen(false); }}
              className="px-3 py-1.5 bg-[#FDE4D6] text-[#C2593F] border border-[#FCD5C1] rounded-full font-semibold"
            >
              ✋ Fidget
            </button>

            <button
              onClick={() => { navigateTo('progress'); setIsMobileMenuOpen(false); }}
              className="px-3 py-1.5 bg-[#FCE4EB] text-[#B83280] border border-[#F9C5D5] rounded-full font-semibold"
            >
              📖 Journal
            </button>

            <button
              onClick={() => { openDeescalate(); setIsMobileMenuOpen(false); }}
              className="px-3 py-1.5 bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC] rounded-full font-semibold"
            >
              🌸 Zen Zone
            </button>

            <button
              onClick={() => {
                toggleVoiceGender();
                const nextVoice = voiceGender === 'female' ? 'male' : 'female';
                speakText(nextVoice === 'female' ? "Switched to Female Voice." : "Switched to Male Voice.", nextVoice);
              }}
              className="px-3 py-1.5 bg-[#EEF2FF] text-[#5C5B99] border border-[#C7D2FE] rounded-full font-bold"
            >
              {voiceGender === 'female' ? '👩 Female Voice' : '👨 Male Voice'}
            </button>
          </div>

          {/* Mobile Auth Button */}
          <div className="pt-2 border-t border-[#E5E0D3]">
            {user ? (
              <div className="flex items-center justify-between p-2 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl font-bold text-[#5C5B99]">
                <span className="flex items-center gap-1.5">
                  <span>{user.avatar || '🌸'}</span>
                  <span>{user.name}</span>
                </span>
                <button onClick={logoutUser} className="text-xs text-red-600 underline">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[#5C5B99] text-white rounded-xl font-bold text-center cursor-pointer shadow-sm"
              >
                🔐 Log In / Sign Up
              </button>
            )}
          </div>

        </div>
      )}

      {/* Login & Signup Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

    </header>
  );
};
