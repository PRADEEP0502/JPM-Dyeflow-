import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { NavTab } from '../../types';
import { SearchInput } from '../common/SearchInput';
import { MobileNav } from './MobileNav';
import jpmLogo from '../../assets/jpm-logo.png';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const NAV_ITEMS: { tab: NavTab; label: string }[] = [
  { tab: 'dashboard', label: 'Overview' },
  { tab: 'lrn-tracking', label: 'LRN Register' },
  { tab: 'ldn-tracking', label: 'LDN Tracking' },
  { tab: 'waiting-bulk', label: 'Bulk Order Check' },
];

export function Header({ activeTab, onTabChange, searchQuery, onSearchChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: NavTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="w-full px-4 sm:px-6 lg:px-6 xl:px-10 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-3 xl:gap-6">
        <div className="flex items-center gap-2.5 shrink-0 justify-self-start">
          <img
            src={jpmLogo}
            alt="Junior Processing Mill"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-contain shrink-0"
          />
          <span className="font-semibold text-[15px] text-neutral-900 tracking-tight">DyeFlow</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 xl:gap-3 2xl:gap-6 justify-self-center shrink-0">
          {NAV_ITEMS.map(({ tab, label }) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-3 xl:px-4 py-1.5 rounded-full text-[13px] xl:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-neutral-900 text-white shadow-sm shadow-neutral-900/20'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search LDN, Buyer..."
            className="hidden sm:block w-48 md:w-60 lg:w-40 xl:w-56 2xl:w-64"
          />

          <button
            type="button"
            className="hidden sm:flex lg:hidden xl:flex p-2 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors relative shrink-0"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>

          <div
            className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 items-center justify-center text-white text-[11px] font-semibold shrink-0"
            aria-hidden="true"
          >
            JD
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="lg:hidden p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileNav
          navItems={NAV_ITEMS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      )}
    </header>
  );
}
