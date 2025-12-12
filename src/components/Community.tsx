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
import { Plus, MessageSquare, ThumbsUp, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  type: 'musical' | 'actor' | 'goods';
  targetId: string;
  targetName: string;
  title: string;
  content: string;
  hasSpoiler: boolean;
  rating?: number;
  likes: number;
  userName: string;
  userId: string;
  createdAt: string;
}

interface CommunityProps {
  user: User | null;
  accessToken: string | null;
}

export function Community({ user, accessToken }: CommunityProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [activeTab, setActiveTab] = useState<'musical' | 'actor' | 'goods' | 'qna'>('musical');

  const [formData, setFormData] = useState({
    type: 'musical' as 'musical' | 'actor' | 'goods',
    targetName: '',
    title: '',
    content: '',
    hasSpoiler: false,
    rating: 5,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Mock data for demonstration
      setReviews([]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('후기를 불러오는데 실패했습니다.');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            targetId: 'temp-id',
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      toast.success('후기가 등록되었습니다!');
      setShowAddDialog(false);
      setFormData({
        type: 'musical',
        targetName: '',
        title: '',
        content: '',
        hasSpoiler: false,
        rating: 5,
      });
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('후기 등록에 실패했습니다.');
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === 'qna') return false; // QnA is separate
    return review.type === activeTab && (showSpoilers || !review.hasSpoiler);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">💬 커뮤니티</h1>
          <p className="text-gray-600">후기를 공유하고 다른 팬들과 소통하세요</p>
        </div>
        {user && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                후기 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>후기 작성하기</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">후기 유형 *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="musical">작품 후기</option>
                    <option value="actor">배우 후기</option>
                    <option value="goods">굿즈 후기</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetName">
                    {formData.type === 'musical' ? '작품명' : formData.type === 'actor' ? '배우 이름' : '굿즈 이름'} *
                  </Label>
                  <Input
                    id="targetName"
                    value={formData.targetName}
                    onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                {formData.type === 'musical' && (
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
                )}
                <div className="space-y-2">
                  <Label htmlFor="content">내용 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    required
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm">스포일러 포함</p>
                      <p className="text-xs text-gray-600">이 후기에 스포일러가 포함되어 있나요?</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.hasSpoiler}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasSpoiler: checked })}
                  />
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

      {/* Spoiler filter */}
      <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          {showSpoilers ? (
            <Eye className="w-5 h-5 text-gray-600" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-600" />
          )}
          <p className="text-sm">
            {showSpoilers ? '스포일러 보기' : '스포일러 숨기기'}
          </p>
        </div>
        <Switch checked={showSpoilers} onCheckedChange={setShowSpoilers} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="musical">작품 후기</TabsTrigger>
          <TabsTrigger value="actor">배우 후기</TabsTrigger>
          <TabsTrigger value="goods">굿즈 후기</TabsTrigger>
          <TabsTrigger value="qna">Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="musical" className="mt-6">
          {filteredReviews.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">등록된 후기가 없습니다</h3>
              <p className="text-gray-500">첫 번째 후기를 작성해보세요!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card 
                  key={review.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedReview(review)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{review.title}</CardTitle>
                          {review.hasSpoiler && (
                            <Badge variant="destructive" className="text-xs">스포일러</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{review.targetName}</p>
                      </div>
                      {review.rating && (
                        <div className="text-right">
                          <div className="text-2xl">⭐</div>
                          <div className="text-sm">{review.rating}/5</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3 mb-4">{review.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>by {review.userName} · {new Date(review.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.likes}</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="actor" className="mt-6">
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">등록된 배우 후기가 없습니다</h3>
            <p className="text-gray-500">첫 번째 후기를 작성해보세요!</p>
          </Card>
        </TabsContent>

        <TabsContent value="goods" className="mt-6">
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">등록된 굿즈 후기가 없습니다</h3>
            <p className="text-gray-500">첫 번째 후기를 작성해보세요!</p>
          </Card>
        </TabsContent>

        <TabsContent value="qna" className="mt-6">
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Q&A 게시판</h3>
            <p className="text-gray-500">뮤지컬 관련 질문을 자유롭게 남겨주세요!</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedReview && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedReview.title}</DialogTitle>
                  {selectedReview.hasSpoiler && (
                    <Badge variant="destructive">스포일러</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{selectedReview.targetName}</p>
              </DialogHeader>
              <div className="space-y-4">
                {selectedReview.rating && (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-xl">{selectedReview.rating} / 5</div>
                  </div>
                )}
                <div>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedReview.content}</p>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    작성자: {selectedReview.userName} ·{' '}
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </p>
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    좋아요 {selectedReview.likes}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
