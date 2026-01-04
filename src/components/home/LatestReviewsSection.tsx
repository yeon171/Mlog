import React from 'react';

const LatestReviewsSection = () => {
  // TODO: Implement review data fetching and rendering
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">최신 리뷰</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for reviews */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-bold">뮤지컬 제목</h3>
            <p className="text-gray-600 mt-2">"정말 감동적인 공연이었어요!"</p>
            <p className="text-sm text-gray-500 text-right mt-4">- 사용자1</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-bold">다른 뮤지컬 제목</h3>
            <p className="text-gray-600 mt-2">"배우들의 연기가 인상 깊었습니다."</p>
            <p className="text-sm text-gray-500 text-right mt-4">- 사용자2</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-bold">또 다른 뮤지컬</h3>
            <p className="text-gray-600 mt-2">"음악이 너무 좋았어요!"</p>
            <p className="text-sm text-gray-500 text-right mt-4">- 사용자3</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestReviewsSection;
