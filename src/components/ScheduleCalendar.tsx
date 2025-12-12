import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface Performance {
  id: string;
  musicalId: string;
  musicalTitle: string;
  date: string;
  time: string;
  venue: string;
  castMembers?: string[];
  ticketPrice?: string;
  ticketUrl?: string;
}

interface ScheduleCalendarProps {
  user: User | null;
  accessToken: string | null;
}

export function ScheduleCalendar({ user, accessToken }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    musicalTitle: '',
    date: '',
    time: '',
    venue: '',
    ticketPrice: '',
  });

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    // In a real app, fetch from the server
    // For now, use mock data
    setPerformances([]);
  };

  const handleAddPerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b6147e6/performances`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            musicalId: 'temp-id'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add performance');
      }

      toast.success('공연 일정이 추가되었습니다!');
      setShowAddDialog(false);
      setFormData({
        musicalTitle: '',
        date: '',
        time: '',
        venue: '',
        ticketPrice: '',
      });
      fetchPerformances();
    } catch (error) {
      console.error('Error adding performance:', error);
      toast.error('공연 일정 추가에 실패했습니다.');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPerformancesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return performances.filter(p => p.date === dateStr);
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">📅 공연 일정</h1>
          <p className="text-gray-600">뮤지컬 공연 일정을 달력으로 확인하세요</p>
        </div>
        {user && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                일정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>새 공연 일정 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPerformance} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="musicalTitle">공연명 *</Label>
                  <Input
                    id="musicalTitle"
                    value={formData.musicalTitle}
                    onChange={(e) => setFormData({ ...formData, musicalTitle: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜 *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">시간 *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
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
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">티켓 가격</Label>
                  <Input
                    id="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    placeholder="예: VIP 150,000원 / R석 120,000원"
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

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle>
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day, index) => (
              <div
                key={day}
                className={`text-center p-2 ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayPerformances = getPerformancesForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isToday ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    setSelectedDate(dateStr);
                  }}
                >
                  <div className={`text-sm mb-1 ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  {dayPerformances.length > 0 && (
                    <div className="space-y-1">
                      {dayPerformances.slice(0, 2).map((perf) => (
                        <div
                          key={perf.id}
                          className="text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded truncate"
                        >
                          {perf.musicalTitle}
                        </div>
                      ))}
                      {dayPerformances.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayPerformances.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming performances */}
      <div className="mt-8">
        <h2 className="mb-4">다가오는 공연</h2>
        {performances.length === 0 ? (
          <Card className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">등록된 공연 일정이 없습니다</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performances.map((perf) => (
              <Card key={perf.id}>
                <CardHeader>
                  <CardTitle>{perf.musicalTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{perf.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{perf.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{perf.venue}</span>
                  </div>
                  {perf.ticketPrice && (
                    <div className="pt-2">
                      <Badge variant="secondary">{perf.ticketPrice}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Date detail dialog */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDate} 공연</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDate && getPerformancesForDate(new Date(selectedDate).getDate()).length === 0 ? (
              <p className="text-center text-gray-500">이 날짜에 예정된 공연이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {selectedDate &&
                  getPerformancesForDate(new Date(selectedDate).getDate()).map((perf) => (
                    <Card key={perf.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{perf.musicalTitle}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{perf.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{perf.venue}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
