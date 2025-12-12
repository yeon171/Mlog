import React, { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Newspaper, Calendar, Users, Ticket, MessageCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  type: 'ticket' | 'casting' | 'review' | 'interview';
  title: string;
  summary: string;
  content: string;
  date: string;
  author?: string;
  musicalName?: string;
}

interface NewsColumnsProps {
  user: User | null;
}

export function NewsColumns({ user }: NewsColumnsProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const newsItems: NewsItem[] = [
    {
      id: '1',
      type: 'ticket',
      title: '레미제라블 재오픈 티켓 예매 안내',
      summary: '2024년 1월 15일 오전 8시, 인터파크 티켓에서 티켓 재오픈',
      content: '많은 분들이 기다리셨던 레미제라블 재오픈 티켓이 1월 15일 오전 8시에 인터파크 티켓을 통해 판매됩니다. VIP석 150,000원, R석 120,000원, S석 90,000원으로 판매됩니다.',
      date: '2024-01-10',
      musicalName: '레미제라블',
    },
    {
      id: '2',
      type: 'casting',
      title: '위키드 새 시즌 캐스팅 발표',
      summary: '엘파바 역에 김소현, 글린다 역에 박혜나 캐스팅 확정',
      content: '위키드 2024 시즌의 새로운 캐스팅이 발표되었습니다. 엘파바 역에는 김소현, 이지혜가, 글린다 역에는 박혜나, 정선아가 캐스팅되었습니다. 공연은 3월부터 시작됩니다.',
      date: '2024-01-08',
      author: '뮤지컬 타임즈',
      musicalName: '위키드',
    },
    {
      id: '3',
      type: 'review',
      title: '[리뷰] 시카고, 재즈의 향연과 날카로운 사회 비평',
      summary: '화려한 무대와 중독성 있는 음악으로 관객을 사로잡다',
      content: '시카고는 1920년대 시카고를 배경으로 한 범죄 코미디 뮤지컬입니다. 재즈 음악과 화려한 안무, 그리고 날카로운 사회 비평이 돋보이는 작품입니다. 특히 "All That Jazz"와 "Cell Block Tango" 넘버는 관객들에게 큰 호응을 얻고 있습니다.',
      date: '2024-01-05',
      author: '김뮤지컬 기자',
      musicalName: '시카고',
    },
    {
      id: '4',
      type: 'interview',
      title: '[인터뷰] 팬텀 주역 배우들이 말하는 무대 위의 열정',
      summary: '팬텀 역의 이정열, 크리스틴 역의 송은혜 배우 인터뷰',
      content: '팬텀의 주역 배우들을 만나 무대 위의 열정과 캐릭터에 대한 깊이 있는 이야기를 들어보았습니다. 이정열 배우는 "팬텀이라는 캐릭터는 단순히 악역이 아니라 사랑에 목마른 한 인간"이라고 말했습니다.',
      date: '2024-01-03',
      author: '공연리뷰',
      musicalName: '팬텀',
    },
  ];

  const typeLabels = {
    ticket: '티켓 오픈',
    casting: '캐스팅 소식',
    review: '공연 리뷰',
    interview: '인터뷰',
  };

  const typeIcons = {
    ticket: Ticket,
    casting: Users,
    review: MessageCircle,
    interview: Newspaper,
  };

  const typeColors = {
    ticket: 'bg-red-100 text-red-700 border-red-200',
    casting: 'bg-blue-100 text-blue-700 border-blue-200',
    review: 'bg-green-100 text-green-700 border-green-200',
    interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const getNewsByType = (type: NewsItem['type']) => {
    return newsItems.filter(item => item.type === type);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="mb-2">📰 뉴스 & 칼럼</h1>
        <p className="text-gray-600">최신 뮤지컬 소식과 칼럼을 확인하세요</p>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="ticket">티켓 오픈</TabsTrigger>
          <TabsTrigger value="casting">캐스팅</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="interview">인터뷰</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {newsItems.map((news) => {
              const Icon = typeIcons[news.type];
              return (
                <Card
                  key={news.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedNews(news)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={typeColors[news.type]}>
                            <Icon className="w-3 h-3 mr-1" />
                            {typeLabels[news.type]}
                          </Badge>
                          {news.musicalName && (
                            <Badge variant="secondary">{news.musicalName}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                        <p className="text-gray-600">{news.summary}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(news.date).toLocaleDateString('ko-KR')}</span>
                        </div>
                        {news.author && (
                          <p className="text-xs text-gray-500 mt-1">{news.author}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ticket" className="mt-6">
          <div className="space-y-4">
            {getNewsByType('ticket').map((news) => (
              <Card
                key={news.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedNews(news)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={typeColors.ticket}>
                          <Ticket className="w-3 h-3 mr-1" />
                          티켓 오픈
                        </Badge>
                        {news.musicalName && (
                          <Badge variant="secondary">{news.musicalName}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                      <p className="text-gray-600">{news.summary}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(news.date).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="casting" className="mt-6">
          <div className="space-y-4">
            {getNewsByType('casting').map((news) => (
              <Card
                key={news.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedNews(news)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={typeColors.casting}>
                          <Users className="w-3 h-3 mr-1" />
                          캐스팅 소식
                        </Badge>
                        {news.musicalName && (
                          <Badge variant="secondary">{news.musicalName}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                      <p className="text-gray-600">{news.summary}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(news.date).toLocaleDateString('ko-KR')}</span>
                      </div>
                      {news.author && (
                        <p className="text-xs text-gray-500 mt-1">{news.author}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <div className="space-y-4">
            {getNewsByType('review').map((news) => (
              <Card
                key={news.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedNews(news)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={typeColors.review}>
                          <MessageCircle className="w-3 h-3 mr-1" />
                          공연 리뷰
                        </Badge>
                        {news.musicalName && (
                          <Badge variant="secondary">{news.musicalName}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                      <p className="text-gray-600">{news.summary}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(news.date).toLocaleDateString('ko-KR')}</span>
                      </div>
                      {news.author && (
                        <p className="text-xs text-gray-500 mt-1">{news.author}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interview" className="mt-6">
          <div className="space-y-4">
            {getNewsByType('interview').map((news) => (
              <Card
                key={news.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedNews(news)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={typeColors.interview}>
                          <Newspaper className="w-3 h-3 mr-1" />
                          인터뷰
                        </Badge>
                        {news.musicalName && (
                          <Badge variant="secondary">{news.musicalName}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                      <p className="text-gray-600">{news.summary}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(news.date).toLocaleDateString('ko-KR')}</span>
                      </div>
                      {news.author && (
                        <p className="text-xs text-gray-500 mt-1">{news.author}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* News Detail Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNews(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={typeColors[selectedNews.type]}>
                  {typeLabels[selectedNews.type]}
                </Badge>
                {selectedNews.musicalName && (
                  <Badge variant="secondary">{selectedNews.musicalName}</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{selectedNews.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedNews.date).toLocaleDateString('ko-KR')}</span>
                </div>
                {selectedNews.author && <span>by {selectedNews.author}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 text-lg mb-4">{selectedNews.summary}</p>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedNews.content}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
