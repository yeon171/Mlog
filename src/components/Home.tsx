import React from 'react';
import { User, NavigationSection } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Film, Users, Calendar, Eye, MessageSquare, ShoppingBag, Sparkles, MapPin, Newspaper, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  user: User | null;
  onNavigate: (section: NavigationSection) => void;
}

export function Home({ user, onNavigate }: HomeProps) {
  const quickLinks = [
    { 
      id: 'musicals' as NavigationSection, 
      title: '뮤지컬 아카이브', 
      description: '작품 정보, 캐스팅, OST 탐색',
      icon: Film,
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      id: 'actors' as NavigationSection, 
      title: '배우 데이터베이스', 
      description: '프로필, 필모그래피, 출연 일정',
      icon: Users,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      id: 'schedule' as NavigationSection, 
      title: '공연 일정', 
      description: '달력으로 보는 공연 스케줄',
      icon: Calendar,
      color: 'bg-green-50 text-green-600'
    },
    { 
      id: 'seatview' as NavigationSection, 
      title: '좌석뷰', 
      description: '공연장별 시야 정보와 후기',
      icon: Eye,
      color: 'bg-orange-50 text-orange-600'
    },
  ];

  const features = [
    {
      title: '커뮤니티',
      description: '작품/배우 후기 공유',
      icon: MessageSquare,
      section: 'community' as NavigationSection
    },
    {
      title: '굿즈 마켓',
      description: '중고 거래 & 시세 정보',
      icon: ShoppingBag,
      section: 'marketplace' as NavigationSection
    },
    {
      title: 'AI 추천',
      description: '취향 기반 뮤지컬 추천',
      icon: Sparkles,
      section: 'recommendations' as NavigationSection
    },
    {
      title: '공연장 정보',
      description: '위치, 교통, 주변 맛집',
      icon: MapPin,
      section: 'venues' as NavigationSection
    },
    {
      title: '뉴스',
      description: '티켓 오픈, 캐스팅 소식',
      icon: Newspaper,
      section: 'news' as NavigationSection
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-96">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1503095396549-807759245b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBtdXNpY2FsfGVufDF8fHx8MTc2NTUxNDYzMXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Theater stage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h1 className="mb-4">🎭 뮤지컬 종합 플랫폼</h1>
          <p className="text-xl mb-6 text-white/90">
            작품 정보부터 티켓팅까지, 모든 뮤지컬 정보를 한곳에서
          </p>
          {user ? (
            <p className="text-white/80">
              환영합니다, {user.name || user.email}님! 👋
            </p>
          ) : (
            <p className="text-white/80">
              로그인하고 나만의 뮤지컬 기록을 시작해보세요
            </p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2>인기 메뉴</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card 
                key={link.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate(link.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Features */}
      <div className="mb-12">
        <h2 className="mb-6">전체 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.section}
                onClick={() => onNavigate(feature.section)}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🎬 작품 아카이브</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              모든 뮤지컬 작품의 정보, 캐스팅 히스토리, OST 영상을 한눈에 확인하세요.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎫 티켓 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              좋아하는 배우의 출연 일정과 티켓 오픈 시간을 놓치지 마세요.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💬 커뮤니티</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              다른 팬들과 후기를 공유하고 좌석뷰 정보를 확인하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
