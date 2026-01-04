import React from 'react';

const AnnouncementsSection = () => {
  // TODO: Implement announcement data fetching and rendering
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">공지사항</h2>
        <ul className="space-y-4">
          {/* Placeholder for announcements */}
          <li className="border-b pb-2">
            <a href="#" className="hover:text-blue-500">
              [이벤트] '오페라의 유령' 관람 후기 이벤트 안내
            </a>
            <span className="text-sm text-gray-500 ml-4">2024-07-25</span>
          </li>
          <li className="border-b pb-2">
            <a href="#" className="hover:text-blue-500">
              [업데이트] 새로운 결제 수단이 추가되었습니다.
            </a>
            <span className="text-sm text-gray-500 ml-4">2024-07-24</span>
          </li>
          <li className="border-b pb-2">
            <a href="#" className="hover:text-blue-500">
              [공지] 시스템 점검 안내 (7/28 02:00 ~ 04:00)
            </a>
            <span className="text-sm text-gray-500 ml-4">2024-07-23</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
