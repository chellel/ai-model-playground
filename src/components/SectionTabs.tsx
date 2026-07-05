import React from 'react';
import { Play, History as HistoryIcon, DollarSign, HelpCircle, Layers } from 'lucide-react';

interface SectionTabsProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const tabs = [
    { id: 'Playground', label: 'Playground', icon: Play },
    { id: 'History', label: 'History', icon: HistoryIcon },
    { id: 'Pricing', label: 'Pricing', icon: DollarSign },
    { id: 'FAQs', label: 'FAQs', icon: HelpCircle },
    { id: 'Similar Models', label: 'Similar Models', icon: Layers },
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-30 shadow-2xs">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSection(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
