import React from 'react';
import Image from 'next/image';
import { Heart, Share2, Calendar as CalendarIcon, Clock, MapPin, ExternalLink, Info, CreditCard, Map, Youtube, Instagram, BookOpen, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

// 실제 뮤지컬 데이터 타입을 위한 임시 타입 정의
type Musical = {
  id: string;
  title: string;
  posterUrl: string;
  synopsis: string;
  cast: { name: string; role: string; profileUrl?: string }[];
  schedule: string[];
  venue: string;
  runningTime: string;
  ageRating: string;
  status: 'performing' | 'upcoming' | 'ended';
  startDate: string;
  endDate: string;
  bookingUrl?: string;
  discounts?: { title: string; rate: string; description: string; prices?: string[] }[]; // 할인된 가격 정보 배열로 변경
  venueSeeyaUrl?: string;
  productionInstagramUrl?: string;
  productionYoutubeUrl?: string;
  namuWikiUrl?: string;
  price?: string; // 기본 가격 정보 추가
};

// 임시 뮤지컬 데이터 생성 함수
const getMockMusicalDetails = (id: string): Musical | null => {
  const musicals: Record<string, Musical> = {
    '1': {
      id: '1',
      title: '오페라의 유령',
      posterUrl: 'https://picsum.photos/seed/1/400/600',
      synopsis: '19세기 파리 오페라 하우스를 배경으로, 천재적인 음악적 재능을 가졌지만 흉측한 외모 때문에 지하에 숨어 사는 ‘오페라의 유령’과 프리마돈나 ‘크리스틴’, 그리고 크리스틴을 사랑하는 귀족 청년 ‘라울’의 비극적인 사랑 이야기를 그린 뮤지컬입니다.',
      cast: [
        { name: '조승우', role: '오페라의 유령', profileUrl: 'https://picsum.photos/seed/actor1/100/100' },
        { name: '김소현', role: '크리스틴', profileUrl: 'https://picsum.photos/seed/actor2/100/100' },
        { name: '손준호', role: '라울', profileUrl: 'https://picsum.photos/seed/actor3/100/100' },
      ],
      schedule: ['2024-08-01 19:30', '2024-08-02 19:30', '2024-08-03 14:00', '2024-08-03 19:30'],
      venue: '샤롯데씨어터',
      runningTime: '150분 (인터미션 20분 포함)',
      ageRating: '8세 이상 관람가',
      status: 'performing',
      startDate: '2024-07-21',
      endDate: '2024-11-17',
      bookingUrl: 'https://tickets.interpark.com/',
      price: 'VIP석 170,000원 / R석 140,000원 / S석 110,000원 / A석 80,000원',
      discounts: [
        {
          title: '조기예매 할인',
          rate: '20%',
          description: '8/1 ~ 8/15 공연 예매 시',
          prices: ['VIP석 136,000원', 'R석 112,000원', 'S석 88,000원', 'A석 64,000원']
        },
        {
          title: '재관람 할인',
          rate: '15%',
          description: '2023-2024 시즌 유료 티켓 소지자',
          prices: ['VIP석 144,500원', 'R석 119,000원', 'S석 93,500원', 'A석 68,000원']
        },
        {
          title: '청소년 할인',
          rate: '30%',
          description: '초/중/고등학생 본인 (S/A석 한정)',
          prices: ['S석 77,000원', 'A석 56,000원']
        },
      ],
      venueSeeyaUrl: 'https://musicalseeya.com/seeyatheater/19',
      productionInstagramUrl: 'https://www.instagram.com/snco_official/',
      productionYoutubeUrl: 'https://www.youtube.com/@snco_official',
      namuWikiUrl: 'https://namu.wiki/w/오페라의%20유령(뮤지컬)',
    },
    '2': {
      id: '2',
      title: '레미제라블',
      posterUrl: 'https://picsum.photos/seed/2/400/600',
      synopsis: '프랑스 혁명기를 배경으로 한 빅토르 위고의 소설을 원작으로 한 뮤지컬. 빵 한 조각을 훔친 죄로 19년의 감옥살이를 한 장발장의 이야기를 다룬다.',
      cast: [
        { name: '민우혁', role: '장발장', profileUrl: 'https://picsum.photos/seed/actor4/100/100' },
        { name: '카이', role: '자베르', profileUrl: 'https://picsum.photos/seed/actor5/100/100' },
      ],
      schedule: ['2024-08-05 19:30', '2024-08-06 19:30'],
      venue: '블루스퀘어 신한카드홀',
      runningTime: '180분 (인터미션 20분 포함)',
      ageRating: '8세 이상 관람가',
      status: 'performing',
      startDate: '2024-08-01',
      endDate: '2024-12-31',
      bookingUrl: 'https://tickets.interpark.com/',
      price: 'VIP석 180,000원 / R석 150,000원 / S석 120,000원 / A석 90,000원',
      discounts: [
        {
          title: '오프닝 위크 할인',
          rate: '10%',
          description: '8/1 ~ 8/7 공연 예매 시',
          prices: ['VIP석 162,000원', 'R석 135,000원', 'S석 108,000원', 'A석 81,000원']
        },
      ],
      venueSeeyaUrl: 'https://musicalseeya.com/search?q=블루스퀘어',
      productionInstagramUrl: 'https://www.instagram.com/lesmis_korea/',
      productionYoutubeUrl: 'https://www.youtube.com/@lesmiskorea',
      namuWikiUrl: 'https://namu.wiki/w/레%20미제라블(뮤지컬)',
    },
    '3': {
      id: '3',
      title: '위키드',
      posterUrl: 'https://picsum.photos/seed/3/400/600',
      synopsis: '오즈의 마법사의 숨겨진 이야기를 다룬 뮤지컬. 초록 마녀 엘파바와 하얀 마녀 글린다의 우정과 성장을 그린다.',
      cast: [
        { name: '박혜나', role: '엘파바', profileUrl: 'https://picsum.photos/seed/actor6/100/100' },
        { name: '정선아', role: '글린다', profileUrl: 'https://picsum.photos/seed/actor7/100/100' },
      ],
      schedule: ['2024-09-20 19:30', '2024-09-21 14:00'],
      venue: '부산 드림씨어터',
      runningTime: '170분 (인터미션 20분 포함)',
      ageRating: '8세 이상 관람가',
      status: 'upcoming',
      startDate: '2024-09-15',
      endDate: '2025-01-15',
      bookingUrl: 'https://tickets.interpark.com/',
      price: 'VIP석 170,000원 / R석 140,000원 / S석 110,000원 / A석 80,000원',
      discounts: [],
      venueSeeyaUrl: 'https://musicalseeya.com/search?q=드림씨어터',
      productionInstagramUrl: 'https://www.instagram.com/snco_official/',
      productionYoutubeUrl: 'https://www.youtube.com/@snco_official',
      namuWikiUrl: 'https://namu.wiki/w/위키드(뮤지컬)',
    },
  };

  return musicals[id] || null;
};

const getMusicalDetails = async (id: string): Promise<Musical | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockMusicalDetails(id));
    }, 100);
  });
};

const MusicalDetailPage = async ({ params }: { params: { musicalId: string } }) => {
  const musical = await getMusicalDetails(params.musicalId);

  if (!musical) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">뮤지컬 정보를 찾을 수 없습니다.</h1>
        <p className="text-gray-500">요청하신 뮤지컬 ID에 해당하는 정보가 없습니다.</p>
        <Button className="mt-4" asChild>
          <a href="/musicals">목록으로 돌아가기</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* 상단 정보 섹션 */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* 포스터 이미지 */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={musical.posterUrl}
              alt={musical.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Badge variant={musical.status === 'performing' ? 'default' : 'secondary'} className="mb-2">
                {musical.status === 'performing' ? '공연중' : musical.status === 'upcoming' ? '공연예정' : '공연종료'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{musical.title}</h1>
              <p className="text-gray-500 text-lg">{musical.venue}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="font-medium">공연 기간:</span>
              <span>{musical.startDate} ~ {musical.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="font-medium">관람 시간:</span>
              <span>{musical.runningTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="font-medium">공연 장소:</span>
              <a
                href={musical.venueSeeyaUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-primary transition-colors flex items-center gap-1"
                title="좌석 시야 확인하기"
              >
                {musical.venue}
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center font-bold text-gray-400 text-xs border rounded-full">Age</span>
              <span className="font-medium">관람 등급:</span>
              <span>{musical.ageRating}</span>
            </div>
            {/* 가격 정보 추가 */}
            <div className="flex items-start gap-2 md:col-span-2">
              <Ticket className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-medium">티켓 가격:</span>
                <span className="text-gray-700">{musical.price}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-auto pt-8">
            <Button className="flex-1 md:flex-none md:w-40 gap-2" asChild>
              <a href={musical.bookingUrl || '#'} target="_blank" rel="noopener noreferrer">
                예매처 이동 <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="secondary" className="flex-1 md:flex-none md:w-40">공연장 정보</Button>
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 섹션 */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-8">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            상세정보
          </TabsTrigger>
          <TabsTrigger
            value="cast"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            출연진
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            관람후기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-12">
          {/* 시놉시스 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6" /> 시놉시스
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{musical.synopsis}</p>
            </div>
          </section>

          {/* 할인 정보 */}
          {musical.discounts && musical.discounts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6" /> 할인 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {musical.discounts.map((discount, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{discount.title}</h3>
                        <span className="text-red-500 font-bold text-xl">{discount.rate}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{discount.description}</p>
                      {/* 할인된 가격 표시 (여러 좌석) */}
                      {discount.prices && discount.prices.length > 0 && (
                        <div className="pt-3 border-t border-dashed space-y-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">할인가</p>
                          {discount.prices.map((price, idx) => (
                            <p key={idx} className="font-bold text-gray-900">{price}</p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 관련 정보 (제작사 SNS, 나무위키) */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ExternalLink className="w-6 h-6" /> 관련 정보
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 제작사 인스타그램 */}
              {musical.productionInstagramUrl && (
                <a
                  href={musical.productionInstagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Instagram className="w-8 h-8 text-pink-600 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">제작사 인스타그램</span>
                </a>
              )}

              {/* 제작사 유튜브 */}
              {musical.productionYoutubeUrl && (
                <a
                  href={musical.productionYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Youtube className="w-8 h-8 text-red-600 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">제작사 유튜브</span>
                </a>
              )}

              {/* 나무위키 */}
              {musical.namuWikiUrl && (
                <a
                  href={musical.namuWikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <BookOpen className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">나무위키 정보</span>
                </a>
              )}
            </div>
          </section>

          {/* 공연장 안내 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Map className="w-6 h-6" /> 공연장 안내
            </h2>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center flex-col gap-2">
              <MapPin className="w-8 h-8 text-gray-400" />
              <a
                href={musical.venueSeeyaUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 font-medium hover:underline hover:text-primary transition-colors flex items-center gap-1"
              >
                {musical.venue}
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-gray-400">공연장 이름을 클릭하여 좌석 시야를 확인하세요</p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="cast">
          <h2 className="text-2xl font-bold mb-6">출연진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {musical.cast.map((actor, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="relative aspect-square rounded-full overflow-hidden mb-3 mx-auto w-32 h-32 border-2 border-transparent group-hover:border-primary transition-all">
                  {actor.profileUrl ? (
                    <Image
                      src={actor.profileUrl}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg">{actor.name}</h3>
                <p className="text-gray-500 text-sm">{actor.role} 역</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-2">아직 작성된 후기가 없습니다.</h3>
            <p className="text-gray-500 mb-6">첫 번째 후기의 주인공이 되어보세요!</p>
            <Button variant="outline">후기 작성하기</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicalDetailPage;
