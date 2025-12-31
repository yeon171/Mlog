'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search, User, LogOut } from 'lucide-react'
import MlogLogo from '@/assets/img/Mlog_logo.png'
import styles from './Header.module.css'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()

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

        {loading ? (
          <div className="w-20 h-9 bg-slate-200 rounded-md animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{user.name}님</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/mypage')}>
                마이페이지
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              로그인
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
