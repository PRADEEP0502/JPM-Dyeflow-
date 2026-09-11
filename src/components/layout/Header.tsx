import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavTab } from '../../types';
import { SearchInput } from '../common/SearchInput';
import { MobileNav } from './MobileNav';

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
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center text-white font-semibold text-[11px] tracking-wider">
            JPM
          </div>
          <span className="font-semibold text-[15px] text-neutral-900 tracking-tight">DyeFlow</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ tab, label }) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search LDN, Buyer..."
            className="hidden sm:block w-48 md:w-60 lg:w-64"
          />

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
