import { Input } from '@/components/ui/input';
import { Musical } from '@/types/musical';
import Link from 'next/link';
import styles from './musicals.module.css';

// 임시 뮤지컬 데이터 생성 함수
const getMockMusicals = (): Musical[] => {
  return [
    {
      id: '1',
      title: '오페라의 유령',
      posterUrl: 'https://picsum.photos/seed/1/400/600',
      startDate: '2024-07-21',
      endDate: '2024-11-17',
      discountRate: 10,
    },
    {
      id: '2',
      title: '레미제라블',
      posterUrl: 'https://picsum.photos/seed/2/400/600',
      startDate: '2024-08-01',
      endDate: '2024-12-31',
      discountRate: null,
    },
    {
      id: '3',
      title: '위키드',
      posterUrl: 'https://picsum.photos/seed/3/400/600',
      startDate: '2024-09-15',
      endDate: '2025-01-15',
      discountRate: 20,
    },
    {
      id: '4',
      title: '지킬 앤 하이드',
      posterUrl: 'https://picsum.photos/seed/4/400/600',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      discountRate: null,
    },
    {
      id: '5',
      title: '맘마미아!',
      posterUrl: 'https://picsum.photos/seed/5/400/600',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      discountRate: 15,
    },
    {
      id: '6',
      title: '시카고',
      posterUrl: 'https://picsum.photos/seed/6/400/600',
      startDate: '2024-08-15',
      endDate: '2024-10-15',
      discountRate: null,
    },
    {
      id: '7',
      title: '킹키부츠',
      posterUrl: 'https://picsum.photos/seed/7/400/600',
      startDate: '2025-03-01',
      endDate: '2025-06-30',
      discountRate: null,
    },
    {
      id: '8',
      title: '하데스타운',
      posterUrl: 'https://picsum.photos/seed/8/400/600',
      startDate: '2025-04-15',
      endDate: '2025-08-15',
      discountRate: 5,
    }
  ];
};

// API로부터 뮤지컬 데이터를 가져오는 함수 (임시 데이터 사용으로 변경)
async function getMusicals(): Promise<Musical[]> {
  // 실제 API 호출 대신 임시 데이터를 반환합니다.
  // 추후 실제 API 개발
  /*
  const res = await fetch('http://localhost:54321/make-server-2b6147e6/musicals', { cache: 'no-store' });
  if (!res.ok) {
    console.error('Failed to fetch musicals');
    return [];
  }
  const data = await res.json();
  return data.musicals || [];
  */

  // 임시 데이터 반환 (비동기 시뮬레이션)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockMusicals());
    }, 100);
  });
}

// 뮤지컬 카드를 표시하는 간단한 컴포넌트
const MusicalCard = ({ musical }: { musical: Musical }) => (
  <Link href={`/musicals/${musical.id}`} className={styles.cardLink}>
    <div className={styles.cardImageContainer}>
      <img src={musical.posterUrl} alt={musical.title} className={styles.cardImage} />
    </div>
    <h3 className={styles.cardTitle}>{musical.title}</h3>
    <p className={styles.cardDate}>{`${musical.startDate} ~ ${musical.endDate}`}</p>
    {musical.discountRate && (
      <p className={styles.discountBadge}>{musical.discountRate}% 할인</p>
    )}
  </Link>
);

// 뮤지컬 목록을 가로로 스크롤하여 보여주는 컴포넌트
const MusicalList = ({ musicals }: { musicals: Musical[] }) => {
  if (musicals.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>해당하는 뮤지컬이 없습니다.</p>
      </div>
    );
  }
  return (
    <div className={styles.listContainer}>
      {musicals.map(musical => (
        <MusicalCard key={musical.id} musical={musical} />
      ))}
    </div>
  );
};


const MusicalsPage = async () => {
  const allMusicals = await getMusicals();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. 현재 공연 중인 뮤지컬: 오늘 날짜가 공연 시작일과 종료일 사이 (임시 데이터에서는 모든 데이터 표시)
  const nowPlaying = allMusicals.filter(m => m.startDate <= today && m.endDate >= today);

  // 2. 오픈 예정 뮤지컬: 공연 시작일이 오늘보다 미래
  const upcoming = allMusicals.filter(m => m.startDate > today);

  // 3. 할인 중인 뮤지컬: 할인율이 0보다 큼
  const discounted = allMusicals.filter(m => m.discountRate && m.discountRate > 0);

  // 4. 마감 임박 뮤지컬: 공연 종료일이 오늘로부터 30일 이내 (임시 데이터 기준 조정)
  const closingSoon = allMusicals.filter(m => {
    const endDate = new Date(m.endDate);
    const diffTime = endDate.getTime() - new Date(today).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60; // 임시로 60일로 늘림
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>뮤지컬 둘러보기</h1>
        <p className={styles.subtitle}>
          다양한 뮤지컬을 만나보세요.
        </p>
      </header>

      <div className={styles.searchContainer}>
        <Input
          type="search"
          placeholder="찾고 싶은 뮤지컬을 검색해보세요..."
          className={styles.searchInput}
        />
      </div>

      <main className={styles.main}>
        <section>
          <h2 className={styles.sectionTitle}>현재 공연 중</h2>
          <MusicalList musicals={nowPlaying} />
        </section>

        <section>
          <h2 className={styles.sectionTitle}>오픈 예정</h2>
          <MusicalList musicals={upcoming} />
        </section>

        <section>
          <h2 className={styles.sectionTitle}>할인 중</h2>
          <MusicalList musicals={discounted} />
        </section>

        <section>
          <h2 className={styles.sectionTitle}>마감 임박</h2>
          <MusicalList musicals={closingSoon} />
        </section>
      </main>
    </div>
  );
};

export default MusicalsPage;
