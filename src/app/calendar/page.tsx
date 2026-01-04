'use client'; // 캘린더는 사용자와의 상호작용이 많으므로 클라이언트 컴포넌트로 만듭니다.

import React, { useState } from 'react';

// 임시 공연 데이터
const events = {
  '2024-08-03': [{ time: '14:00', title: '오페라의 유령' }, { time: '19:30', title: '레미제라블' }],
  '2024-08-10': [{ time: '19:30', title: '오페라의 유령' }],
  '2024-08-15': [{ time: '15:00', title: '캣츠' }, { time: '20:00', title: '위키드' }],
  '2024-08-24': [{ time: '14:00', title: '레미제라블' }, { time: '19:30', title: '오페라의 유령' }],
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2024-08-01'));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = firstDayOfMonth.getDay(); // 0: Sun, 1: Mon, ...
  const daysInMonth = lastDayOfMonth.getDate();

  const days = Array.from({ length: startDay }, (_, i) => <div key={`empty-${i}`} className="border p-2 h-28"></div>)
    .concat(Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events[dateStr] || [];

      return (
        <div key={day} className="border p-2 h-28 flex flex-col">
          <span className="font-bold">{day}</span>
          <div className="mt-1 text-xs overflow-y-auto">
            {dayEvents.map((event, index) => (
              <div key={index} className="bg-blue-100 rounded px-1 mb-1">
                {event.time} {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }));

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="px-4 py-2 bg-gray-200 rounded">이전 달</button>
        <h1 className="text-2xl font-bold">{`${year}년 ${month + 1}월`}</h1>
        <button onClick={goToNextMonth} className="px-4 py-2 bg-gray-200 rounded">다음 달</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center font-bold border p-2">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default CalendarPage;
