'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import MlogLogo from '@/assets/img/Mlog_logo.png'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src={MlogLogo}
          alt="MLog 로고"
          width={50}
          height={32}
          priority
        />
      </Link>

      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="뮤지컬·배우 검색"
          />
        </div>

        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            로그인
          </Button>
        </Link>
      </div>
    </header>
  )
}
