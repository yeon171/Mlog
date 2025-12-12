import React, { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Search, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MarketplaceItem {
  id: string;
  type: 'photocard' | 'program' | 'goods' | 'other';
  title: string;
  musicalName: string;
  actorName?: string;
  price: number;
  condition: 'new' | 'like-new' | 'used';
  description: string;
  images?: string[];
  seller: string;
  sellerId: string;
  createdAt: string;
}

interface MarketplaceProps {
  user: User | null;
  accessToken: string | null;
}

export function Marketplace({ user, accessToken }: MarketplaceProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  const [formData, setFormData] = useState({
    type: 'photocard' as MarketplaceItem['type'],
    title: '',
    musicalName: '',
    actorName: '',
    price: '',
    condition: 'like-new' as MarketplaceItem['condition'],
    description: '',
  });

  const priceRanges = [
    { type: '포토카드', range: '5,000 - 30,000원', trend: 'up' },
    { type: '프로그램북', range: '15,000 - 25,000원', trend: 'stable' },
    { type: '사인 굿즈', range: '50,000 - 300,000원', trend: 'up' },
    { type: '한정판 굿즈', range: '30,000 - 100,000원', trend: 'down' },
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const newItem: MarketplaceItem = {
      id: Date.now().toString(),
      ...formData,
      price: parseInt(formData.price),
      seller: user.name || user.email,
      sellerId: user.id,
      createdAt: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    toast.success('상품이 등록되었습니다!');
    setShowAddDialog(false);
    setFormData({
      type: 'photocard',
      title: '',
      musicalName: '',
      actorName: '',
      price: '',
      condition: 'like-new',
      description: '',
    });
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.musicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.actorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeLabels = {
    photocard: '포토카드',
    program: '프로그램북',
    goods: '굿즈',
    other: '기타',
  };

  const conditionLabels = {
    new: '새 상품',
    'like-new': '거의 새것',
    used: '사용감 있음',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">🛍️ 굿즈 마켓</h1>
          <p className="text-gray-600">뮤지컬 굿즈를 사고 팔고 시세를 확인하세요</p>
        </div>
        {user && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                상품 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>굿즈 판매 등록</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">상품 유형 *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="photocard">포토카드</option>
                    <option value="program">프로그램북</option>
                    <option value="goods">굿즈</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">상품명 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="예: 레미제라블 포토카드 세트"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="musicalName">작품명 *</Label>
                    <Input
                      id="musicalName"
                      value={formData.musicalName}
                      onChange={(e) => setFormData({ ...formData, musicalName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actorName">배우 이름</Label>
                    <Input
                      id="actorName"
                      value={formData.actorName}
                      onChange={(e) => setFormData({ ...formData, actorName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">가격 (원) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">상태 *</Label>
                    <select
                      id="condition"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="new">새 상품</option>
                      <option value="like-new">거의 새것</option>
                      <option value="used">사용감 있음</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">상세 설명 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
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

      <Tabs defaultValue="market" className="mb-6">
        <TabsList>
          <TabsTrigger value="market">중고 마켓</TabsTrigger>
          <TabsTrigger value="prices">시세 정보</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="mt-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="상품명, 작품명, 배우 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">등록된 상품이 없습니다</h3>
              <p className="text-gray-500">첫 번째 상품을 등록해보세요!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-pink-100 to-indigo-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-indigo-300" />
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline">{typeLabels[item.type]}</Badge>
                      <Badge variant="outline">{conditionLabels[item.condition]}</Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                    <p className="text-sm text-gray-600">{item.musicalName}</p>
                    {item.actorName && (
                      <p className="text-xs text-gray-500">{item.actorName}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-600">{item.price.toLocaleString()}원</span>
                      <span className="text-xs text-gray-500">{item.seller}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prices" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priceRanges.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.type}</CardTitle>
                    <div className="flex items-center gap-1">
                      {item.trend === 'up' ? (
                        <>
                          <TrendingUp className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-red-500">상승</span>
                        </>
                      ) : item.trend === 'down' ? (
                        <>
                          <TrendingUp className="w-5 h-5 text-blue-500 rotate-180" />
                          <span className="text-sm text-blue-500">하락</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">안정</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">{item.range}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    최근 30일 평균 거래 가격
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">💡 시세 정보 안내</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• 시세는 최근 거래 내역을 기반으로 자동 계산됩니다.</p>
              <p>• 배우, 시즌, 회차에 따라 가격이 크게 달라질 수 있습니다.</p>
              <p>• 한정판 굿즈나 초기 시즌 상품은 프리미엄이 붙을 수 있습니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{typeLabels[selectedItem.type]}</Badge>
                  <Badge variant="outline">{conditionLabels[selectedItem.condition]}</Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
                <p className="text-gray-600">
                  {selectedItem.musicalName}
                  {selectedItem.actorName && ` · ${selectedItem.actorName}`}
                </p>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-center rounded-lg aspect-video bg-gradient-to-br from-pink-100 to-indigo-100">
                  <ShoppingBag className="w-24 h-24 text-indigo-300" />
                </div>
                
                <div>
                  <Label>가격</Label>
                  <p className="mt-1 text-3xl font-bold text-indigo-600">
                    {selectedItem.price.toLocaleString()}원
                  </p>
                </div>

                <div>
                  <Label>상세 설명</Label>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Label>판매자 정보</Label>
                  <p className="mt-1 text-gray-700">{selectedItem.seller}</p>
                  <p className="text-sm text-gray-500">
                    등록일: {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {user && user.id !== selectedItem.sellerId && (
                  <Button className="w-full" size="lg">
                    판매자에게 문의하기
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
