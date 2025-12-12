import React from 'react';
import { User, NavigationSection } from '../App';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import bannerImage from '../assets/img/test_Banner.png';
import { Button } from './ui/button';
import { Film, Users, Calendar, Eye, MessageSquare, ShoppingBag, Newspaper, TrendingUp, Star, ThumbsUp, Sparkles, Ticket } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  user: User | null;
  onNavigate: (section: NavigationSection) => void;
}

export function Home({ user, onNavigate }: HomeProps) {
  const hotMusicals = [
    { id: '1', title: '레미제라블', poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1080' },
    { id: '2', title: '위키드', poster: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1080' },
    { id: '3', title: '시카고', poster: 'https://images.unsplash.com/photo-1509306250284-4c75c1b83917?q=80&w=1080' },
    { id: '4', title: '오페라의 유령', poster: 'https://images.unsplash.com/photo-1596884762326-a4fcc1254a5f?q=80&w=1080' },
  ];

  const latestReviews = [
    { id: '1', title: '시카고, 재즈의 향연과 날카로운 사회 비평', user: '김뮤지컬', likes: 15 },
    { id: '2', title: '팬텀 주역 배우들의 무대 위 열정', user: '공연리뷰', likes: 22 },
    { id: '3', title: '맘마미아! 역시 믿고 보는 뮤지컬', user: 'ABBA팬', likes: 8 },
  ];

  const recommendations = [
    { id: '1', title: '헤드윅', reason: '록 음악과 감동적인 스토리를 좋아하신다면', poster: 'https://images.unsplash.com/photo-1516280440614-37639448064d?q=80&w=1080' },
    { id: '2', title: '노트르담 드 파리', reason: '웅장한 음악과 비극적인 사랑 이야기를 선호하신다면', poster: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=1080' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden h-60 md:h-80 flex items-center justify-center">
        <ImageWithFallback
          src={bannerImage} // 배너 이미지 경로를 변경했습니다.
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white p-8">
          <h1 className="text-white mb-4">나만의 뮤지컬 라이프, Mlog</h1>
          <p className="text-lg text-white/90">작품 정보부터 커뮤니티까지, 모든 것을 한 곳에서</p>
        </div>
      </div>

      {/* Weekly Ranking */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2>주간 랭킹</h2>
          <Button variant="ghost" onClick={() => onNavigate('musicals')}>더보기 &gt;</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {hotMusicals.map((musical, index) => (
            <div key={musical.id} className="group relative cursor-pointer" onClick={() => onNavigate('musicals')}>
              <ImageWithFallback src={musical.poster} alt={musical.title} className="w-full aspect-[2/3] object-cover rounded-lg shadow-md transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <p className="text-white font-bold text-lg truncate">{musical.title}</p>
              </div>
              <div className="absolute -left-2 -top-2 w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xl font-bold shadow-lg">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations & Latest Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h2>Mlog 추천</h2>
            <Button variant="ghost" onClick={() => onNavigate('recommendations')}>더보기 &gt;</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recommendations.map(rec => (
              <Card key={rec.id} className="overflow-hidden group cursor-pointer" onClick={() => onNavigate('recommendations')}>
                <ImageWithFallback src={rec.poster} alt={rec.title} className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
                <CardHeader>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>{rec.reason}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <h2>최신 후기</h2>
            <Button variant="ghost" onClick={() => onNavigate('community')}>더보기 &gt;</Button>
          </div>
          <div className="space-y-3">
            {latestReviews.map(review => (
              <Card key={review.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('community')}>
                <p className="font-medium text-gray-800 truncate mb-2">{review.title}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {review.user}</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Ticket Open News */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <Ticket className="w-6 h-6 text-indigo-600" />
          <h2>티켓 오픈 소식</h2>
          <Button variant="ghost" onClick={() => onNavigate('news')}>더보기 &gt;</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-bold">레미제라블</p>
                  <p className="text-sm text-gray-500">2024.08.15 (목) 14:00</p>
                </div>
                <Button>예매하기</Button>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-bold">위키드</p>
                  <p className="text-sm text-gray-500">2024.08.20 (화) 11:00</p>
                </div>
                <Button>예매하기</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
