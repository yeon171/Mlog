import React, { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Car, Train, Utensils, Phone, Clock, Users } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: string;
  phone: string;
  parking: string;
  transit: string[];
  restaurants: { name: string; distance: string; type: string }[];
  acoustics: string;
  seatTips: string[];
}

interface VenueInfoProps {
  user: User | null;
}

export function VenueInfo({ user }: VenueInfoProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const venues: Venue[] = [
    {
      id: '1',
      name: '예술의전당 오페라극장',
      address: '서울특별시 서초구 남부순환로 2406',
      capacity: '2,300석',
      phone: '02-580-1300',
      parking: '지하 주차장 1,200대 (유료)',
      transit: ['2호선 남부터미널역 5번 출구 (도보 15분)', '3호선 남부터미널역 5번 출구 (도보 15분)', '간선버스 141, 148, 441, 462'],
      restaurants: [
        { name: '이탈리안 레스토랑 피오렌티나', distance: '도보 5분', type: '이탈리안' },
        { name: '한정식 명가원', distance: '도보 7분', type: '한식' },
        { name: '스타벅스 예술의전당점', distance: '도보 2분', type: '카페' },
      ],
      acoustics: '오페라 전용 극장답게 음향이 매우 우수합니다. 특히 2층 발코니석에서도 선명한 음질을 경험할 수 있습니다.',
      seatTips: [
        '1층 중앙 M-P열이 가장 인기 있는 구역입니다.',
        '2층 발코니석은 전체 무대를 조망하기 좋습니다.',
        '3층은 높이가 있지만 가격 대비 만족도가 높습니다.',
      ],
    },
    {
      id: '2',
      name: 'LG아트센터',
      address: '서울특별시 강남구 역삼동 679',
      capacity: '1,300석',
      phone: '02-2005-0114',
      parking: '건물 내 주차장 200대 (유료)',
      transit: ['2호선 강남역 12번 출구 (도보 10분)', '신분당선 강남역 (도보 7분)', '지선버스 4432, 강남05'],
      restaurants: [
        { name: '스시 이치방', distance: '도보 3분', type: '일식' },
        { name: '애슐리 강남점', distance: '도보 5분', type: '뷔페' },
        { name: '카페 드롭탑', distance: '도보 2분', type: '카페' },
      ],
      acoustics: '최신 음향 시스템으로 어느 자리에서든 균일한 음질을 제공합니다.',
      seatTips: [
        '1층 E-G열이 무대와의 거리가 적당합니다.',
        '2층 A-C열은 전체 무대 조망이 좋습니다.',
        '측면석도 무대가 잘 보이는 편입니다.',
      ],
    },
    {
      id: '3',
      name: '샤롯데씨어터',
      address: '서울특별시 송파구 올림픽로 240 롯데월드몰',
      capacity: '1,200석',
      phone: '1544-7744',
      parking: '롯데월드몰 주차장 4,000대 (유료, 공연 관람객 할인)',
      transit: ['2호선/8호선 잠실역 1, 2번 출구 (도보 7분)', '지선버스 3217, 3313, 3314'],
      restaurants: [
        { name: '아웃백 스테이크하우스', distance: '건물 내', type: '양식' },
        { name: '딘타이펑', distance: '건물 내', type: '중식' },
        { name: '투썸플레이스', distance: '건물 내', type: '카페' },
      ],
      acoustics: '현대적인 음향 설계로 뮤지컬에 최적화되어 있습니다.',
      seatTips: [
        'VIP석은 무대와 매우 가까워 몰입감이 높습니다.',
        'R석 중앙도 충분히 만족스러운 시야를 제공합니다.',
        '롯데월드몰 내부에 있어 공연 전후 식사/쇼핑이 편리합니다.',
      ],
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="mb-2">📍 공연장 정보</h1>
        <p className="text-gray-600">공연장 위치, 교통, 주변 정보를 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue List */}
        <div className="lg:col-span-1 space-y-4">
          {venues.map((venue) => (
            <Card
              key={venue.id}
              className={`cursor-pointer transition-all ${
                selectedVenue?.id === venue.id ?
                  'border-indigo-600 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedVenue(venue)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{venue.capacity}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{venue.address}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Venue Details */}
        <div className="lg:col-span-2">
          {selectedVenue ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{selectedVenue.name}</CardTitle>
                <Badge variant="secondary">{selectedVenue.capacity}</Badge>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">기본 정보</TabsTrigger>
                    <TabsTrigger value="transit">교통</TabsTrigger>
                    <TabsTrigger value="food">주변 맛집</TabsTrigger>
                    <TabsTrigger value="tips">좌석 팁</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6 mt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <h3>주소</h3>
                      </div>
                      <p className="text-gray-700">{selectedVenue.address}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <h3>전화번호</h3>
                      </div>
                      <p className="text-gray-700">{selectedVenue.phone}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-gray-600" />
                        <h3>주차 정보</h3>
                      </div>
                      <p className="text-gray-700">{selectedVenue.parking}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-blue-900 mb-2">🎵 음향 특징</h3>
                      <p className="text-blue-800 text-sm">{selectedVenue.acoustics}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="transit" className="space-y-4 mt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Train className="w-5 h-5 text-gray-600" />
                        <h3>대중교통</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedVenue.transit.map((route, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                            <Badge variant="outline" className="mt-0.5">
                              {route.includes('버스') ? '버스' : '지하철'}
                            </Badge>
                            <p className="text-sm text-gray-700">{route}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="pt-4">
                        <p className="text-sm text-green-800">
                          💡 <strong>Tip:</strong> 공연 시작 30분 전에 도착하시는 것을 권장합니다.
                          주말과 공휴일에는 교통이 혼잡할 수 있습니다.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="food" className="space-y-4 mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Utensils className="w-5 h-5 text-gray-600" />
                      <h3>추천 맛집</h3>
                    </div>
                    <div className="grid gap-4">
                      {selectedVenue.restaurants.map((restaurant, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                              <Badge variant="secondary">{restaurant.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{restaurant.distance}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-4 mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <h3>좌석 선택 팁</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedVenue.seatTips.map((tip, index) => ( <
                        div key = { index } className = "flex items-start gap-3 p-4 rounded-lg bg-indigo-50 border border-indigo-100" >
                          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm text-white bg-indigo-600 rounded-full">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>

                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="pt-4">
                        <p className="text-sm text-yellow-800">
                          ⭐ 더 자세한 좌석 시야 정보는 <strong>좌석뷰</strong> 메뉴에서 확인하세요!
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-600 mb-2">공연장을 선택해주세요</h3>
                <p className="text-gray-500">왼쪽에서 공연장을 선택하면 상세 정보를 볼 수 있습니다.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
