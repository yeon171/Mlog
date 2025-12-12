import React from 'react';
import { NavigationSection, User } from '../App';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { cn } from './ui/utils';

interface NavigationItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  navigationItems: NavigationItem[];
  currentSection: NavigationSection;
  onNavigate: (section: NavigationSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: User | null;
  onAuthClick: () => void;
}

export function Sidebar({
  navigationItems,
  currentSection,
  onNavigate,
  collapsed,
  onToggleCollapse,
  user,
  onAuthClick,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-indigo-600">Mlog</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('w-5 h-5', collapsed && 'w-6 h-6')} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')} title={user.name || user.email}>
            <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-full">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user.name || user.email}</p>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={onAuthClick}
            variant="outline"
            className={cn('w-full', collapsed && 'px-2')}
          >
            <LogIn className="w-5 h-5" />
            {!collapsed && <span className="ml-2">로그인</span>}
          </Button>
        )}
      </div>
    </aside>
  );
}
