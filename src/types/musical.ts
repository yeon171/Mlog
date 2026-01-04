export interface Musical {
  id: string;
  title: string;
  posterUrl: string; // 포스터 이미지 URL
  startDate: string; // 공연 시작일 (YYYY-MM-DD)
  endDate: string;   // 공연 종료일 (YYYY-MM-DD)
  discountRate?: number | null; // 할인율 (%), 없으면 null 또는 undefined
}
