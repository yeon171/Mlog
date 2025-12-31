'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { User, Mail, LogOut, KeyRound, Camera, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type View = 'main' | 'password' | 'delete'

export default function MyPage() {
  const router = useRouter()
  const { user, logout: authLogout, loading: authLoading, fetchUser } = useAuth()
  const [view, setView] = useState<View>('main')

  const [name, setName] = useState(user?.name || '')
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameChangeLoading, setNameChangeLoading] = useState(false)
  const [nameChangeError, setNameChangeError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false)
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
    if (user) {
      setName(user.name)
    }
  }, [user, authLoading, router])

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameChangeLoading(true)
    setNameChangeError(null)

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/user/name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '이름 변경에 실패했습니다.')
      }

      await fetchUser()
      setIsEditingName(false)

    } catch (err: any) {
      setNameChangeError(err.message || '이름 변경 중 오류가 발생했습니다.')
    } finally {
      setNameChangeLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordChangeLoading(true)
    setPasswordChangeError(null)
    setPasswordChangeSuccess(null)

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('새 비밀번호가 일치하지 않습니다.')
      setPasswordChangeLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '비밀번호 변경에 실패했습니다.')
      }

      const data = await response.json()
      setPasswordChangeSuccess(data.message || '비밀번호가 성공적으로 변경되었습니다.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setTimeout(() => setView('main'), 2000)

    } catch (err: any) {
      setPasswordChangeError(err.message || '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setPasswordChangeLoading(false)
    }
  }

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (deleteConfirm !== '탈퇴합니다') {
      setDeleteError('정확히 "탈퇴합니다"라고 입력해주세요.')
      return
    }
    setDeleteLoading(true)
    setDeleteError(null)

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '회원 탈퇴에 실패했습니다.')
      }

      alert('회원 탈퇴가 완료되었습니다.')
      authLogout()
      router.push('/')

    } catch (err: any) {
      setDeleteError(err.message || '회원 탈퇴 중 오류가 발생했습니다.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('profileImage', file)

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '프로필 이미지 업로드에 실패했습니다.')
      }

      await fetchUser()

    } catch (err: any) {
      console.error('Profile image upload error:', err)
      alert(err.message || '프로필 이미지 업로드 중 오류가 발생했습니다.')
    }
  }

  const renderMainView = () => (
    <>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profile_image_url || undefined} alt={user.name} />
            <AvatarFallback>
              <User className="h-10 w-10 text-slate-500" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-slate-100 hover:bg-slate-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfileImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">기본 정보</h3>
        {isEditingName ? (
          <form onSubmit={handleNameChange} className="grid gap-2">
            <Label htmlFor="name">이름</Label>
            <div className="flex items-center space-x-2">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Button type="submit" disabled={nameChangeLoading}>
                {nameChangeLoading ? '저장 중...' : '저장'}
              </Button>
              <Button variant="ghost" onClick={() => setIsEditingName(false)}>취소</Button>
            </div>
            {nameChangeError && <p className="text-sm text-red-500">{nameChangeError}</p>}
          </form>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="name">이름</Label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input id="name" value={user.name} readOnly className="bg-slate-50 flex-grow" />
              <Button variant="outline" onClick={() => setIsEditingName(true)}>변경</Button>
            </div>
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input id="email" value={user.email} readOnly className="bg-slate-50" />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">계정 설정</h3>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setView('password')}>비밀번호 변경</Button>
            <Button variant="destructive" onClick={() => setView('delete')}>회원 탈퇴</Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Button variant="outline" onClick={authLogout} className="w-full sm:w-auto">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </>
  )

  const renderPasswordChangeView = () => (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setView('main')}><ArrowLeft className="h-4 w-4"/></Button>
        <h3 className="text-lg font-medium">비밀번호 변경</h3>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="current-password">현재 비밀번호</Label>
        <div className="flex items-center space-x-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <Input id="current-password" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-password">새 비밀번호</Label>
        <div className="flex items-center space-x-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <Input id="new-password" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-new-password">새 비밀번호 확인</Label>
        <div className="flex items-center space-x-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <Input id="confirm-new-password" type="password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        </div>
      </div>
      {passwordChangeError && <p className="text-sm text-red-500">{passwordChangeError}</p>}
      {passwordChangeSuccess && <p className="text-sm text-green-500">{passwordChangeSuccess}</p>}
      <Button type="submit" disabled={passwordChangeLoading}>
        {passwordChangeLoading ? '변경 중...' : '비밀번호 변경'}
      </Button>
    </form>
  )

  const renderDeleteAccountView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setView('main')}><ArrowLeft className="h-4 w-4"/></Button>
        <h3 className="text-lg font-medium text-red-600">회원 탈퇴</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다. 모든 데이터가 삭제되며 복구할 수 없습니다.
      </p>
      <form onSubmit={handleAccountDelete} className="space-y-4">
        <Label htmlFor="delete-confirm">탈퇴를 원하시면 "탈퇴합니다"를 입력하세요.</Label>
        <Input
          id="delete-confirm"
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="max-w-sm"
          placeholder="탈퇴합니다"
        />
        {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
        <Button variant="destructive" type="submit" disabled={deleteLoading || deleteConfirm !== '탈퇴합니다'}>
          {deleteLoading ? '처리 중...' : '계정 영구 삭제'}
        </Button>
      </form>
    </div>
  )

  const renderView = () => {
    switch (view) {
      case 'password':
        return renderPasswordChangeView()
      case 'delete':
        return renderDeleteAccountView()
      case 'main':
      default:
        return renderMainView()
    }
  }

  if (authLoading || !user) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">마이페이지</CardTitle>
          <CardDescription>내 계정 정보를 확인하고 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderView()}
        </CardContent>
      </Card>
    </div>
  )
}
