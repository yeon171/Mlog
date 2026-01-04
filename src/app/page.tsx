import HeroSection from '@/components/home/HeroSection'
import NowPlayingSection from '@/components/home/NowPlayingSection'
import DiscountedMusicalsSection from '@/components/home/DiscountedMusicalsSection'
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection'
import LatestReviewsSection from '@/components/home/LatestReviewsSection'
import AnnouncementsSection from '@/components/home/AnnouncementsSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <NowPlayingSection />
      <DiscountedMusicalsSection />
      <UpcomingEventsSection />
      <LatestReviewsSection />
      <AnnouncementsSection />
    </main>
  )
}
