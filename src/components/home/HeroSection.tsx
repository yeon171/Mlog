import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-black text-white py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">
        당신이 좋아하는 뮤지컬과 배우의 모든 일정
      </h1>
      <p className="text-lg mb-8 text-gray-300">
        공연, 배우, 캐스팅 정보를 한눈에
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/musicals">
          <Button>뮤지컬 둘러보기</Button>
        </Link>
        <Link href="/actors">
          <Button
            variant="ghost"
            className="border border-white hover:bg-white hover:text-black"
          >
            배우 찾아보기
          </Button>
        </Link>
      </div>
    </section>
  )
}
