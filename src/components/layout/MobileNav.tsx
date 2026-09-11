import { NavTab } from '../../types';
import { SearchInput } from '../common/SearchInput';

interface NavItem {
  tab: NavTab;
  label: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function MobileNav({ navItems, activeTab, onTabChange, searchQuery, onSearchChange }: MobileNavProps) {
  return (
    <div className="lg:hidden border-t border-neutral-100 bg-neutral-50 px-4 py-3 space-y-3">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search LDN, LRN, Buyer..."
        className="sm:hidden"
      />

      <div className="grid grid-cols-1 gap-1">
        {navItems.map(({ tab, label }) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
