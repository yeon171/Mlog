'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import styles from './signup.module.css'
import { CheckCircle, XCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isEmailChecking, setIsEmailChecking] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [emailCheckError, setEmailCheckError] = useState<string | null>(null)

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setEmailAvailable(null)
        return
      }
      setIsEmailChecking(true)
      setEmailCheckError(null)
      try {
        const response = await fetch(`/api/auth/check-email?email=${email}`)
        const data = await response.json()
        setEmailAvailable(data.available)
      } catch (err) {
        setEmailCheckError('이메일 확인 중 오류 발생')
      } finally {
        setIsEmailChecking(false)
      }
    }

    const debounce = setTimeout(checkEmail, 500)
    return () => clearTimeout(debounce)
  }, [email])

  useEffect(() => {
    setPasswordValidations({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [password])

  const isPasswordMatch = password && password === confirmPassword
  const isPasswordValid = Object.values(passwordValidations).every(Boolean)
  const isFormValid = name && email && emailAvailable && isPasswordValid && isPasswordMatch

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setError('입력 양식을 다시 확인해주세요.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '회원가입에 실패했습니다.')
      }

      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      router.push('/auth/login')

    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const ValidationCheck = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center text-sm ${isValid ? 'text-green-500' : 'text-slate-400'}`}>
      {isValid ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
      {text}
    </div>
  )

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.headerSpace}>
        <CardTitle className={styles.title}>회원가입</CardTitle>
        <CardDescription className={styles.description}>
          새로운 계정을 만들어 Mlog를 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.contentSpace}>
        <form onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="홍길동"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isEmailChecking && <div className="text-sm text-slate-500 mt-1">이메일 중복 확인 중...</div>}
            {emailCheckError && <div className="text-sm text-red-500 mt-1">{emailCheckError}</div>}
            {emailAvailable === true && <div className="text-sm text-green-500 mt-1">사용 가능한 이메일입니다.</div>}
            {emailAvailable === false && <div className="text-sm text-red-500 mt-1">이미 사용 중인 이메일입니다.</div>}
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-2 space-y-1">
              <ValidationCheck isValid={passwordValidations.minLength} text="8자 이상" />
              <ValidationCheck isValid={passwordValidations.hasNumber} text="숫자 포함" />
              <ValidationCheck isValid={passwordValidations.hasSpecialChar} text="특수문자 포함" />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor="confirm-password">비밀번호 확인</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && !isPasswordMatch && <div className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</div>}
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <Button className={styles.submitButton} type="submit" disabled={loading || !isFormValid}>
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className={styles.footerSpace}>
        <div className={styles.loginContainer}>
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className={styles.loginLink}>
            로그인
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
