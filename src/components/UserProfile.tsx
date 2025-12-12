import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Plus, Film, Calendar, BarChart3, Heart, LogOut, Trophy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WatchedMusical {
  id: string;
  musicalTitle: string;
  date: string;
  venue: string;
  castMembers?: string[];
  rating?: number;
  notes?: string;
}

interface UserProfileProps {
  user: User | null;
  accessToken: string | null;
  onSignOut: () => void;
}

export function UserProfile({ user, accessToken, onSignOut }: UserProfileProps) {
  const [watchedMusicals, setWatchedMusicals] = useState<WatchedMusical[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    musicalTitle: '',
    date: '',
    venue: '',
    rating: 5,
    notes: '',
  });

  useEffect(() => {
    if (user && accessToken) {
      fetchWatchedMusicals();
    }
  }, [user, accessToken]);

  const fetchWatchedMusicals = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/user/watched`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      const data = await response.json();
      setWatchedMusicals(data.watched || []);
    } catch (error) {
      console.error('Error fetching watched musicals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatched = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/user/watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add watched musical');
      }

      toast.success('관람 기록이 추가되었습니다!');
      setShowAddDialog(false);
      setFormData({
        musicalTitle: '',
        date: '',
        venue: '',
        rating: 5,
        notes: '',
      });
      fetchWatchedMusicals();
    } catch (error) {
      console.error('Error adding watched musical:', error);
      toast.error('관람 기록 추가에 실패했습니다.');
    }
  };

  if (!user) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <Film className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-600 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-500">프로필을 보려면 로그인해주세요.</p>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const totalWatched = watchedMusicals.length;
  const averageRating = totalWatched > 0
    ? (watchedMusicals.reduce((sum, m) => sum + (m.rating || 0), 0) / totalWatched).toFixed(1)
    : 0;
  const favoriteVenue = watchedMusicals.length > 0
    ? watchedMusicals.reduce((acc, m) => {
        acc[m.venue] = (acc[m.venue] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  const mostVisitedVenue = Object.keys(favoriteVenue).length > 0
    ? Object.entries(favoriteVenue).sort((a, b) => b[1] - a[1])[0][0]
    : '없음';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-3xl">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="mb-2">{user.name || '사용자'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">
                  <Trophy className="w-3 h-3 mr-1" />
                  뮤지컬 애호가
                </Badge>
                {totalWatched >= 10 && (
                  <Badge variant="default">
                    🎭 10회 관람 달성
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Film className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 관람 횟수</p>
                <CardTitle className="text-2xl">{totalWatched}회</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Heart className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">평균 평점</p>
                <CardTitle className="text-2xl">⭐ {averageRating}</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">자주 가는 공연장</p>
                <CardTitle className="text-lg line-clamp-1">{mostVisitedVenue}</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="watched">
        <TabsList>
          <TabsTrigger value="watched">관람 기록</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="watched" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2>관람한 뮤지컬</h2>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  기록 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>관람 기록 추가</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddWatched} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="musicalTitle">작품명 *</Label>
                    <Input
                      id="musicalTitle"
                      value={formData.musicalTitle}
                      onChange={(e) => setFormData({ ...formData, musicalTitle: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">관람 날짜 *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">공연장 *</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">평점 ({formData.rating}/5)</Label>
                    <Input
                      id="rating"
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    />
                    <div className="text-center text-2xl">⭐ {formData.rating}</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">메모</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="간단한 감상을 남겨보세요"
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
          </div>

          {watchedMusicals.length === 0 ? (
            <Card className="p-12 text-center">
              <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">아직 관람 기록이 없습니다</h3>
              <p className="text-gray-500">첫 번째 기록을 추가해보세요!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {watchedMusicals.map((musical) => (
                <Card key={musical.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{musical.musicalTitle}</CardTitle>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(musical.date).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Film className="w-4 h-4" />
                            <span>{musical.venue}</span>
                          </div>
                        </div>
                      </div>
                      {musical.rating && (
                        <div className="text-right">
                          <div className="text-2xl">⭐</div>
                          <div className="text-sm">{musical.rating}</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {musical.notes && (
                    <CardContent>
                      <p className="text-gray-700">{musical.notes}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  월별 관람 통계
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  통계 차트는 준비 중입니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  장르별 선호도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  장르 분석은 준비 중입니다.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>나의 Top 10 뮤지컬</CardTitle>
              </CardHeader>
              <CardContent>
                {watchedMusicals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    관람 기록을 추가하면 자동으로 생성됩니다.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {watchedMusicals
                      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                      .slice(0, 10)
                      .map((musical, index) => (
                        <div
                          key={musical.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p>{musical.musicalTitle}</p>
                            <p className="text-sm text-gray-600">{musical.venue}</p>
                          </div>
                          <div className="text-yellow-500">⭐ {musical.rating || 0}</div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">즐겨찾기 기능</h3>
            <p className="text-gray-500">
              좋아하는 배우와 작품을 즐겨찾기에 추가하세요!
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
