import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.headerSpace}>
        <CardTitle className={styles.title}>로그인</CardTitle>
        <CardDescription className={styles.description}>
          이메일과 비밀번호를 입력하여 로그인하세요
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.contentSpace}>
        <div className={styles.inputGroup}>
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
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
          <Input id="password" type="password" required />
        </div>
        <Button className={styles.submitButton} type="submit">
          로그인
        </Button>
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
