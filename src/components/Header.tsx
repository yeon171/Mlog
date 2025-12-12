import React, { useState } from 'react';
import { NavigationSection, User } from '../App';
import { Button } from './ui/button';
import { LogIn, User as UserIcon, LogOut, Menu, Search } from 'lucide-react';
import { cn } from './ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Input } from './ui/input';
import '../styles/Header.css';

interface NavigationItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SubNavigationItem {
  id: string;
  label: string;
  children: NavigationItem[];
}

interface HeaderProps {
  navigationItems: (NavigationItem | SubNavigationItem)[];
  currentSection: NavigationSection;
  onNavigate: (section: NavigationSection) => void;
  user: User | null;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export function Header({
  navigationItems,
  currentSection,
  onNavigate,
  user,
  onAuthClick,
  onSignOut,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainNavItems = navigationItems.filter(
    (item) => item.id !== 'home' && item.id !== 'profile'
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left-section">
          <button onClick={() => onNavigate('home')} className="header-logo-button">
            <h1 className="header-logo-h1">Mlog</h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="header-desktop-nav">
            {mainNavItems.flatMap((item) => {
              if ('children' in item) {
                return item.children.map((child) => {
                  const isActive = child.id === currentSection;
                  return (
                    <Button key={child.id} variant="ghost" onClick={() => onNavigate(child.id)} className={cn('header-nav-button', isActive ? 'header-nav-button-active' : 'header-nav-button-inactive')}>
                      {child.label}
                    </Button>
                  );
                });
              }
              // This part is for non-dropdown menu items, if any.
              return (
                <button key={item.id} onClick={() => onNavigate(item.id as NavigationSection)}>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="header-search-container">
          <div className="header-search-inner">
            <Input 
              type="text" 
              placeholder="뮤지컬, 배우, 공연장 검색"
              className="header-search-input"
            />
            <Search className="header-search-icon" />
          </div>
        </div>


        {/* Right side: Auth and Mobile Menu */}
        <div className="header-right-section">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="header-user-menu-trigger">
                  <div className="header-user-menu-avatar">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <UserIcon className="header-user-menu-item-icon" />
                  <span>내 프로필</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="header-user-menu-item-icon" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onAuthClick} variant="ghost">
              <LogIn className="header-login-button-icon" />
              로그인
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <div className="header-mobile-menu-container">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="header-mobile-menu-sheet-title">Mlog</SheetTitle>
                </SheetHeader>
                <div className="header-mobile-menu-search-container">
                  <div className="header-search-inner">
                    <Input 
                      type="text" 
                      placeholder="검색"
                      className="header-search-input"
                    />
                    <Search className="header-search-icon" />
                  </div>
                </div>
                <nav className="header-mobile-menu-nav">
                  {mainNavItems.map((item) => {
                    if ('children' in item) {
                      return (
                        <div key={item.id}>
                          <h3 className="header-mobile-menu-group-title">{item.label}</h3>
                          <div className="header-mobile-menu-group">
                            {item.children.map((child) => (
                              <Button
                                key={child.id}
                                variant="ghost"
                                className="header-mobile-menu-button"
                                onClick={() => {
                                  onNavigate(child.id);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                <child.icon className="header-mobile-menu-icon" />
                                {child.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}