import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Search, Eye, Star, MapPin, Upload } from 'lucide-react';import { toast } from 'sonner';

interface SeatViewData {
  id: string;
  venueId: string;
  venueName: string;
  section: string;
  row: string;
  seat: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  userName: string;
  createdAt: string;
  visibilityNotes?: string;
}

interface SeatViewProps {
  user: User | null;
  accessToken: string | null;
}

export function SeatView({ user, accessToken }: SeatViewProps) {
  const [seatViews, setSeatViews] = useState<SeatViewData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSeatView, setSelectedSeatView] = useState<SeatViewData | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    venueName: '',
    section: '',
    row: '',
    seat: '',
    rating: 5,
    comment: '',
    visibilityNotes: '',
  });

  useEffect(() => {
    fetchSeatViews();
  }, []);

  const fetchSeatViews = async () => {
    try {
      // Mock data for demonstration
      setSeatViews([]);
    } catch (error) {
      console.error('Error fetching seat views:', error);
      toast.error('좌석뷰 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeatView = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/seatviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            venueId: 'temp-venue-id'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add seat view');
      }

      toast.success('좌석뷰가 추가되었습니다!');
      setShowAddDialog(false);
      setFormData({
        venueName: '',
        section: '',
        row: '',
        seat: '',
        rating: 5,
        comment: '',
        visibilityNotes: '',
      });
      fetchSeatViews();
    } catch (error) {
      console.error('Error adding seat view:', error);
      toast.error('좌석뷰 추가에 실패했습니다.');
    }
  };

  const venues = [
    { id: '1', name: '예술의전당 오페라극장', capacity: '2300석' },
    { id: '2', name: 'LG아트센터', capacity: '1300석' },
    { id: '3', name: '샤롯데씨어터', capacity: '1200석' },
    { id: '4', name: '블루스퀘어', capacity: '1400석' },
    { id: '5', name: '충무아트센터', capacity: '1250석' },
  ];

  const filteredViews = seatViews.filter((view) =>
    view.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    view.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
          <h1 className="mb-2">👁️ 좌석뷰 정보</h1>
          <p className="text-gray-600">공연장별 실제 시야 정보와 후기를 확인하세요</p>
        </div>
        {user && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                좌석뷰 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>좌석뷰 등록하기</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSeatView} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venueName">공연장 *</Label>
                  <Input
                    id="venueName"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    placeholder="예: 예술의전당 오페라극장"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="section">구역 *</Label>
                    <Input
                      id="section"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      placeholder="예: 1층"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="row">열 *</Label>
                    <Input
                      id="row"
                      value={formData.row}
                      onChange={(e) => setFormData({ ...formData, row: e.target.value })}
                      placeholder="예: A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seat">번호 *</Label>
                    <Input
                      id="seat"
                      value={formData.seat}
                      onChange={(e) => setFormData({ ...formData, seat: e.target.value })}
                      placeholder="예: 15"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">시야 평점 ({formData.rating}/5)</Label>
                  <Input
                    id="rating"
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(formData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibilityNotes">시야 특징</Label>
                  <Textarea
                    id="visibilityNotes"
                    value={formData.visibilityNotes}
                    onChange={(e) => setFormData({ ...formData, visibilityNotes: e.target.value })}
                    placeholder="예: 1막 ○○ 장면에서 주인공 잘 보임, 2막에서 약간 가림"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">전체 후기 *</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>좌석 사진 업로드</Label>
                  <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">사진을 드래그하거나 클릭하여 업로드</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">등록하기</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    취소
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="venues" className="mb-6">
        <TabsList>
          <TabsTrigger value="venues">공연장별</TabsTrigger>
          <TabsTrigger value="reviews">전체 후기</TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="transition-shadow cursor-pointer hover:shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1760170437237-a3654545ab4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc2VhdHMlMjBhdWRpZW5jZXxlbnwxfHx8fDE3NjU0NDAxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{venue.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.capacity}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    좌석뷰 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="공연장이나 구역으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredViews.length === 0 ? (
            <Card className="p-12 text-center">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">등록된 좌석뷰가 없습니다</h3>
              <p className="text-gray-500">첫 번째 좌석뷰를 등록해보세요!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredViews.map((view) => (
                <Card 
                  key={view.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSeatView(view)}
                >
                  {view.photoUrl && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={view.photoUrl}
                        alt={`${view.venueName} ${view.section} ${view.row}${view.seat}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{view.venueName}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {view.section} {view.row}열 {view.seat}번
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{view.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-3">{view.comment}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      by {view.userName} · {new Date(view.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Seat View Detail Dialog */}
      <Dialog open={!!selectedSeatView} onOpenChange={() => setSelectedSeatView(null)}>
        <DialogContent className="max-w-3xl">
          {selectedSeatView && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedSeatView.venueName} - {selectedSeatView.section} {selectedSeatView.row}열{' '}
                  {selectedSeatView.seat}번
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedSeatView.photoUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedSeatView.photoUrl}
                      alt="Seat view"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Label>시야 평점:</Label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedSeatView.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2">{selectedSeatView.rating}/5</span>
                  </div>
                </div>
                {selectedSeatView.visibilityNotes && (
                  <div>
                    <Label>시야 특징</Label>
                    <p className="mt-2 text-gray-700">{selectedSeatView.visibilityNotes}</p>
                  </div>
                )}
                <div>
                  <Label>전체 후기</Label>
                  <p className="mt-2 text-gray-700">{selectedSeatView.comment}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    작성자: {selectedSeatView.userName} ·{' '}
                    {new Date(selectedSeatView.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
