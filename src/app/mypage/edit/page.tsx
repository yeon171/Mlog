'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

const EditProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!supabase) {
      setError('Supabase 클라이언트가 초기화되지 않았습니다. 환경 변수를 확인해주세요.');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata.name || '');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      alert('Supabase 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const updates: { data: { name: string }, password?: string } = {
      data: { name },
    };

    if (newPassword) {
      updates.password = newPassword;
    }

    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      alert('정보 수정에 실패했습니다: ' + error.message);
    } else {
      alert('회원 정보가 성공적으로 수정되었습니다.');
      router.push('/mypage');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">오류 발생</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto p-8 text-center">로딩 중...</div>;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">회원 정보 수정</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            이메일 (수정 불가)
          </label>
          <input
            id="email"
            type="email"
            value={user.email || ''}
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-200"
          />
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
        <p className="text-sm text-gray-600 mb-4">비밀번호를 변경하려면 새 비밀번호를 입력하세요. 변경하지 않으려면 비워두세요.</p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
            새 비밀번호
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
            새 비밀번호 확인
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:shadow-outline"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
