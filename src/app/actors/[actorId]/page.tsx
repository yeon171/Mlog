import React from 'react';

// 배우 데이터 타입을 위한 임시 타입 정의
type Actor = {
  id: string;
  name: string;
  profileImageUrl: string;
  bio: string;
  filmography: { year: number; title: string; role: string }[];
};

// 배우 상세 정보를 가져오는 임시 함수
const getActorDetails = async (id: string): Promise<Actor | null> => {
  console.log(`Fetching data for actor ID: ${id}`);
  if (id === '1') {
    return {
      id: '1',
      name: '조승우',
      profileImageUrl: '/path/to/profile.jpg', // 실제 이미지 경로로 교체해야 합니다.
      bio: '대한민국의 배우. 2000년 영화 ‘춘향뎐’으로 데뷔한 이래, 영화, 드라마, 뮤지컬 등 다양한 장르에서 활발하게 활동하며 대한민국을 대표하는 배우 중 한 명으로 자리매김했다.',
      filmography: [
        { year: 2024, title: '오페라의 유령', role: '오페라의 유령' },
        { year: 2022, title: '헤드윅', role: '헤드윅' },
        { year: 2018, title: '지킬 앤 하이드', role: '지킬/하이드' },
        { year: 2015, title: '베르테르', role: '베르테르' },
      ],
    };
  }
  return null;
};

const ActorDetailPage = async ({ params }: { params: { actorId: string } }) => {
  const actor = await getActorDetails(params.actorId);

  if (!actor) {
    return <div>배우 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
          {/* 프로필 이미지 임시 영역 */}
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">프로필 이미지</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{actor.name}</h1>
          <p className="text-gray-700 leading-relaxed mb-6">{actor.bio}</p>
          <div>
            <h2 className="text-2xl font-semibold mb-4">주요 출연작 (뮤지컬)</h2>
            <ul className="space-y-2">
              {actor.filmography.map((work, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{work.year}</strong> - {work.title} ({work.role})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetailPage;
