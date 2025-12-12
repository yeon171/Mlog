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
import { Plus, Search, Users, Instagram, Twitter, Bell, BellOff } from 'lucide-react';import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Actor {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
  birthDate?: string;
  debut?: string;
  agency?: string;
  instagram?: string;
  twitter?: string;
  filmography?: { title: string; role: string; year: string }[];
}

interface ActorDatabaseProps {
  user: User | null;
  accessToken: string | null;
}

export function ActorDatabase({ user, accessToken }: ActorDatabaseProps) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    agency: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/actors`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setActors(data.actors || []);
    } catch (error) {
      console.error('Error fetching actors:', error);
      toast.error('배우 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/actors`,
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
        throw new Error('Failed to add actor');
      }

      toast.success('배우가 추가되었습니다!');
      setShowAddDialog(false);
      setFormData({
        name: '',
        bio: '',
        agency: '',
        instagram: '',
        twitter: '',
      });
      fetchActors();
    } catch (error) {
      console.error('Error adding actor:', error);
      toast.error('배우 추가에 실패했습니다.');
    }
  };

  const toggleFollow = (actorId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setFollowing((prev) => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(actorId)) {
        newFollowing.delete(actorId);
        toast.success('알림이 해제되었습니다.');
      } else {
        newFollowing.add(actorId);
        toast.success('출연 알림이 설정되었습니다!');
      }
      return newFollowing;
    });
  };

  const filteredActors = actors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.agency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
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
          <h1 className="mb-2">👤 배우 데이터베이스</h1>
          <p className="text-gray-600">프로필, 필모그래피, 출연 일정을 확인하세요</p>
        </div>
        {user && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                배우 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 배우 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddActor} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">소개</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency">소속사</Label>
                  <Input
                    id="agency"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="@username"
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
            placeholder="배우 이름이나 소속사로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Actors Grid */}
      {filteredActors.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">등록된 배우가 없습니다</h3>
          <p className="text-gray-500">첫 번째 배우를 추가해보세요!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredActors.map((actor) => (
            <Card 
              key={actor.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div 
                className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden"
                onClick={() => setSelectedActor(actor)}
              >
                {actor.photo ? (
                  <ImageWithFallback
                    src={actor.photo}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-16 h-16 text-blue-300" />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle onClick={() => setSelectedActor(actor)}>{actor.name}</CardTitle>
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(actor.id);
                      }}
                    className="p-2 rounded-full transition-colors hover:bg-gray-100"
                    >
                      {following.has(actor.id) ? (
                      <Bell className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <BellOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
                {actor.agency && (
                  <Badge variant="secondary" className="mt-2">{actor.agency}</Badge>
                )}
              </CardHeader>
              <CardContent onClick={() => setSelectedActor(actor)}>
                {actor.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {actor.bio}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  {actor.instagram && (
                    <a
                      href={`https://instagram.com/${actor.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Instagram className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {actor.twitter && (
                    <a
                      href={`https://twitter.com/${actor.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Twitter className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Actor Detail Dialog */}
      <Dialog open={!!selectedActor} onOpenChange={() => setSelectedActor(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedActor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedActor.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center flex-shrink-0 w-32 h-32 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    {selectedActor.photo ? (
                      <ImageWithFallback
                        src={selectedActor.photo}
                        alt={selectedActor.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-blue-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    {selectedActor.agency && (
                      <div className="mb-2">
                        <Label>소속사</Label>
                        <p className="mt-1">{selectedActor.agency}</p>
                      </div>
                    )}
                    {selectedActor.bio && (
                      <div>
                        <Label>소개</Label>
                        <p className="mt-1 text-gray-700">{selectedActor.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(selectedActor.instagram || selectedActor.twitter) && (
                  <div>
                    <Label>SNS</Label>
                    <div className="flex gap-3 mt-2">
                      {selectedActor.instagram && (
                        <a
                          href={`https://instagram.com/${selectedActor.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm">{selectedActor.instagram}</span>
                        </a>
                      )}
                      {selectedActor.twitter && (
                        <a
                          href={`https://twitter.com/${selectedActor.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          <span className="text-sm">{selectedActor.twitter}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <Label>필모그래피</Label>
                  <p className="text-gray-500 text-center py-4">
                    필모그래피 정보는 준비 중입니다.
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
