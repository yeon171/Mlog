import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import styles from './signup.module.css'

export default function SignupPage() {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.headerSpace}>
        <CardTitle className={styles.title}>회원가입</CardTitle>
        <CardDescription className={styles.description}>
          새로운 계정을 만들어 Mlog를 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.contentSpace}>
        <div className={styles.inputGroup}>
          <Label htmlFor="name">이름</Label>
          <Input id="name" placeholder="홍길동" required />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="password">비밀번호</Label>
          <Input id="password" type="password" required />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <Input id="confirm-password" type="password" required />
        </div>
        <Button className={styles.submitButton} type="submit">
          회원가입
        </Button>
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
