'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import styles from './login.module.css'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '로그인에 실패했습니다.')
      }

      const data = await response.json()

      // AuthContext의 login 함수 호출
      login(data.user, data.token)

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.headerSpace}>
        <CardTitle className={styles.title}>로그인</CardTitle>
        <CardDescription className={styles.description}>
          이메일과 비밀번호를 입력하여 로그인하세요
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.contentSpace}>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="mlog@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.passwordHeader}>
              <Label htmlFor="password">비밀번호</Label>
              <Link
                href="/auth/forgot-password"
                className={styles.forgotPassword}
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <Button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className={styles.footerSpace}>
        <div className={styles.dividerContainer}>
          <div className={styles.dividerLineContainer}>
            <span className={styles.dividerLine} />
          </div>
          <div className={styles.dividerTextContainer}>
            <span className={styles.dividerText}>
              또는
            </span>
          </div>
        </div>
        <div className={styles.socialButtons}>
          <Button variant="outline" className={styles.socialButton}>
            Google
          </Button>
          <Button variant="outline" className={styles.socialButton}>
            Kakao
          </Button>
        </div>
        <div className={styles.signupContainer}>
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className={styles.signupLink}>
            회원가입
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
