import React, { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Heart, Users, Music, Clock, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MusicalRecommendation {
  id: string;
  title: string;
  genre: string;
  rating: number;
  reason: string;
  tags: string[];
}

interface RecommendationsProps {
  user: User | null;
  accessToken: string | null;
}

export function Recommendations({ user, accessToken }: RecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'foryou' | 'beginner' | 'date' | 'trending'>('foryou');

  const recommendations: Record<string, MusicalRecommendation[]> = {
    foryou: [
      {
        id: '1',
        title: '레미제라블',
        genre: '드라마',
        rating: 4.8,
        reason: '당신이 좋아한 "맘마미아"와 비슷한 감동적인 스토리',
        tags: ['웅장한 음악', '감동', '역사물']
      },
      {
        id: '2',
        title: '위키드',
        genre: '판타지',
        rating: 4.7,
        reason: '선호하는 배우 "홍길동"이 출연 예정',
        tags: ['판타지', '우정', '화려한 무대']
      },
      {
        id: '3',
        title: '시카고',
        genre: '범죄/코미디',
        rating: 4.6,
        reason: '재즈와 화려한 안무를 좋아하시네요!',
        tags: ['재즈', '코미디', '섹시']
      },
    ],
    beginner: [
      {
        id: '4',
        title: '맘마미아',
        genre: '로맨틱 코미디',
        rating: 4.5,
        reason: '누구나 아는 ABBA의 히트곡으로 구성',
        tags: ['경쾌함', '쉬운 스토리', '가족']
      },
      {
        id: '5',
        title: '캣츠',
        genre: '판타지',
        rating: 4.3,
        reason: '비언어적 표현이 많아 뮤지컬 입문에 좋음',
        tags: ['무용', '판타지', '시각적']
      },
    ],
    date: [
      {
        id: '6',
        title: '팬텀',
        genre: '로맨스/드라마',
        rating: 4.9,
        reason: '로맨틱한 분위기와 아름다운 음악',
        tags: ['로맨스', '감성', '클래식']
      },
      {
        id: '7',
        title: '노트르담 드 파리',
        genre: '드라마',
        rating: 4.7,
        reason: '강렬한 사랑 이야기로 데이트에 완벽',
        tags: ['사랑', '열정', '프랑스']
      },
    ],
    trending: [
      {
        id: '8',
        title: '해밀턴',
        genre: '힙합/역사',
        rating: 5.0,
        reason: '전 세계적으로 화제가 된 혁신적 작품',
        tags: ['힙합', '혁신', '역사']
      },
      {
        id: '9',
        title: '헤드윅',
        genre: '록/드라마',
        rating: 4.8,
        reason: '독특한 록 뮤지컬로 SNS에서 인기 급상승',
        tags: ['록', '독특함', '감동']
      },
    ],
  };

  const categories = [
    { id: 'foryou' as const, label: '맞춤 추천', icon: Sparkles },
    { id: 'beginner' as const, label: '입문자용', icon: Heart },
    { id: 'date' as const, label: '데이트', icon: Users },
    { id: 'trending' as const, label: '인기 상승', icon: TrendingUp },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="mb-2">✨ 뮤지컬 추천</h1>
        <p className="text-gray-600">
          {user 
            ? '당신의 취향에 맞는 뮤지컬을 추천해드립니다' 
            : '로그인하면 맞춤 추천을 받을 수 있습니다'}
        </p>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {recommendations[selectedCategory].map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765278248936-f6b4eab6474d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2FsJTIwcGVyZm9ybWVyJTIwc2luZ2luZ3xlbnwxfHx8fDE3NjU1MTQ2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt={rec.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-xl">{rec.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm">{rec.rating}</span>
                </div>
              </div>
              <Badge variant="secondary">{rec.genre}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{rec.reason}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {rec.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-4">자세히 보기</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preference Quiz Card */}
      {!user && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle>🎯 더 정확한 추천을 받고 싶으신가요?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              로그인하고 간단한 취향 테스트를 완료하면 AI가 당신만을 위한 맞춤 뮤지컬을 추천해드립니다.
            </p>
            <Button variant="default">로그인하고 취향 분석 받기</Button>
          </CardContent>
        </Card>
      )}

      {/* Recommendation Stats */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Music className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">선호 장르</p>
                  <CardTitle className="text-lg">드라마/로맨스</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">팔로우 배우</p>
                  <CardTitle className="text-lg">5명</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">관람 횟수</p>
                  <CardTitle className="text-lg">12회</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
