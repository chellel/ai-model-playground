import React, { useState } from 'react';
import { Sparkles, Globe, Sun, Moon, LogIn, ChevronDown, User, Shield, Settings, LogOut, Layers } from 'lucide-react';

interface NavbarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSchemaEditor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSchemaEditor,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'ZH'>('EN');

  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Brand & Links */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
              Q
            </div>
            <span className="font-black tracking-tight text-gray-900 text-xl font-sans">
              API <span className="text-purple-600">QIK</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#playground" className="text-purple-600 font-semibold hover:text-purple-700 transition">Models</a>
            <a href="#console" className="hover:text-gray-900 transition flex items-center gap-1">
              <span>Console</span>
            </a>
            <a href="#blog" className="hover:text-gray-900 transition">Blog</a>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSchemaEditor}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-purple-500 text-xs font-medium text-gray-700 hover:text-purple-600 transition bg-white shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Custom JSON Schema</span>
          </button>

          {/* Theme Switcher icon */}
          <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition">
            <Sun className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <button 
            onClick={() => setLang(lang === 'EN' ? 'ZH' : 'EN')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
          >
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>{lang}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          {/* Auth Button / User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-purple-500 bg-white shadow-2xs transition"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-gray-800">开发者控制台</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 text-xs">
                <button className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>API Console</span>
                </button>
                <button className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

