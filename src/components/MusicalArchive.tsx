import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Search, Film, Music, Users as UsersIcon, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Musical {
  id: string;
  title: string;
  poster?: string;
  synopsis?: string;
  genre?: string;
  runningTime?: number;
  numbers?: string[];
  crew?: { role: string; name: string }[];
  premiereDate?: string;
  theater?: string;
}

interface MusicalArchiveProps {
  user: User | null;
  accessToken: string | null;
}

export function MusicalArchive({ user, accessToken }: MusicalArchiveProps) {
  const [musicals, setMusicals] = useState<Musical[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMusical, setSelectedMusical] = useState<Musical | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre: '',
    runningTime: '',
    premiereDate: '',
    theater: '',
  });

  useEffect(() => {
    fetchMusicals();
  }, []);

  const fetchMusicals = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/musicals`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setMusicals(data.musicals || []);
    } catch (error) {
      console.error('Error fetching musicals:', error);
      toast.error('뮤지컬 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMusical = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/musicals`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            runningTime: formData.runningTime ? parseInt(formData.runningTime) : undefined
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add musical');
      }

      toast.success('뮤지컬이 추가되었습니다!');
      setShowAddDialog(false);
      setFormData({
        title: '',
        synopsis: '',
        genre: '',
        runningTime: '',
        premiereDate: '',
        theater: '',
      });
      fetchMusicals();
    } catch (error) {
      console.error('Error adding musical:', error);
      toast.error('뮤지컬 추가에 실패했습니다.');
    }
  };

  const filteredMusicals = musicals.filter((musical) =>
    musical.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    musical.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">🎬 뮤지컬 아카이브</h1>
          <p className="text-gray-600">작품 정보, 캐스팅 히스토리, OST를 탐색하세요</p>
        </div>
        {user && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                작품 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 뮤지컬 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMusical} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">작품명 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">장르</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="예: 뮤지컬 드라마, 로맨스, 코미디"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synopsis">줄거리</Label>
                  <Textarea
                    id="synopsis"
                    value={formData.synopsis}
                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="runningTime">러닝타임 (분)</Label>
                    <Input
                      id="runningTime"
                      type="number"
                      value={formData.runningTime}
                      onChange={(e) => setFormData({ ...formData, runningTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premiereDate">초연 날짜</Label>
                    <Input
                      id="premiereDate"
                      type="date"
                      value={formData.premiereDate}
                      onChange={(e) => setFormData({ ...formData, premiereDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theater">공연장</Label>
                  <Input
                    id="theater"
                    value={formData.theater}
                    onChange={(e) => setFormData({ ...formData, theater: e.target.value })}
                    placeholder="예: 예술의전당 오페라극장"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">추가하기</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    취소
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="작품명이나 장르로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Musicals Grid */}
      {filteredMusicals.length === 0 ? (
        <Card className="p-12 text-center">
          <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">등록된 뮤지컬이 없습니다</h3>
          <p className="text-gray-500">첫 번째 뮤지컬을 추가해보세요!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMusicals.map((musical) => (
            <Card 
              key={musical.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedMusical(musical)}
            >
              <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                {musical.poster ? (
                  <ImageWithFallback
                    src={musical.poster}
                    alt={musical.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="w-16 h-16 text-purple-300" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{musical.title}</CardTitle>
                {musical.genre && (
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{musical.genre}</Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {musical.synopsis && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {musical.synopsis}
                  </p>
                )}
                {musical.theater && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{musical.theater}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Musical Detail Dialog */}
      <Dialog open={!!selectedMusical} onOpenChange={() => setSelectedMusical(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedMusical && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedMusical.title}</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">기본 정보</TabsTrigger>
                  <TabsTrigger value="casting">캐스팅</TabsTrigger>
                  <TabsTrigger value="numbers">넘버</TabsTrigger>
                  <TabsTrigger value="media">미디어</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  {selectedMusical.genre && (
                    <div>
                      <Label>장르</Label>
                      <Badge className="mt-1">{selectedMusical.genre}</Badge>
                    </div>
                  )}
                  
                  {selectedMusical.synopsis && (
                    <div>
                      <Label>줄거리</Label>
                      <p className="mt-2 text-gray-700">{selectedMusical.synopsis}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedMusical.runningTime && (
                      <div>
                        <Label>러닝타임</Label>
                        <p className="mt-1">{selectedMusical.runningTime}분</p>
                      </div>
                    )}
                    {selectedMusical.theater && (
                      <div>
                        <Label>공연장</Label>
                        <p className="mt-1">{selectedMusical.theater}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="casting">
                  <p className="text-gray-500 text-center py-8">
                    캐스팅 정보는 준비 중입니다.
                  </p>
                </TabsContent>
                
                <TabsContent value="numbers">
                  <p className="text-gray-500 text-center py-8">
                    넘버 목록은 준비 중입니다.
                  </p>
                </TabsContent>
                
                <TabsContent value="media">
                  <p className="text-gray-500 text-center py-8">
                    미디어 콘텐츠는 준비 중입니다.
                  </p>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
