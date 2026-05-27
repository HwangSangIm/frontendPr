import React, { useState } from 'react';
import axios from 'axios';

function AuthModal({ isOpen, onClose , onLoginSuccess}) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [email, setEmail] = useState('');
  const [nicknames, setNicknames] = useState(['']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
  const addNicknameField = () => {
    if (nicknames.length < 5) {
      setNicknames([...nicknames, '']);
    } else {
      alert("캐릭터는 최대 5개까지 등록 가능합니다.");
    }
  };
  const handleNicknameChange = (index, value) => {
    const newNicknames = [...nicknames];
    newNicknames[index] = value;
    setNicknames(newNicknames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (isLoginTab) {
        try {
            const response = await axios.post('/api/user/login', { id, password: pw });
            alert("로그인 성공!");
            onLoginSuccess(response.data);
            onClose();
            setId('');
            setPw('');
        } catch (err) {
            alert(err.response?.data?.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    } else {
        const validNicknames = nicknames.filter(name => name.trim() !== '');
        if (validNicknames.length === 0) {
            alert("최소 1개 이상의 캐릭터 닉네임을 입력해 주세요.");
            setLoading(false);
            return;
        }
        const signupData = {
            id: id,
            password: pw,
            email: email || null,
            nickname: validNicknames
        };
        try {
            const response = await axios.post('/api/user/signup', signupData);
            alert("회원가입이 완료되었습니다!");
            setId('');
            setPw('');
            setEmail('');
            setNicknames(['']);
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[480px] rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-6 mb-4">
          <div className="flex gap-6">
            <button 
              className={`text-lg font-bold ${isLoginTab ? 'text-slate-800' : 'text-slate-300'}`}
              onClick={() => setIsLoginTab(true)}
            >로그인</button>
            <button 
              className={`text-lg font-bold ${!isLoginTab ? 'text-slate-800' : 'text-slate-300'}`}
              onClick={() => setIsLoginTab(false)}
            >회원가입</button>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 overflow-y-auto custom-scrollbar">
          <div className="mb-5">
            <label className="block text-[14px] font-bold text-slate-600 mb-2">아이디 *</label>
            <input 
              type="text" placeholder="아이디를 입력하세요" required
              className="w-full px-5 py-4 rounded-[18px] border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 outline-none transition-all"
              value={id} onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block text-[14px] font-bold text-slate-600 mb-2">비밀번호 *</label>
            <input 
              type="password" placeholder="비밀번호를 입력하세요" required
              className="w-full px-5 py-4 rounded-[18px] border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 outline-none transition-all"
              value={pw} onChange={(e) => setPw(e.target.value)}
            />
          </div>

          {!isLoginTab && (
            <>
              <div className="mb-2">
                <label className="block text-[14px] font-bold text-slate-600 mb-2">캐릭터 닉네임 (최대 5개) *</label>
                <div className="flex flex-col gap-3">
                  {nicknames.map((name, index) => (
                    <input 
                      key={index}
                      type="text" 
                      placeholder={`캐릭터 ${index + 1}`} 
                      required
                      className="w-full px-5 py-4 rounded-[18px] border border-slate-200 bg-white focus:border-blue-500 outline-none transition-all"
                      value={name}
                      onChange={(e) => handleNicknameChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              {nicknames.length < 5 && (
                <button 
                  type="button"
                  onClick={addNicknameField}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[18px] text-slate-400 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 mb-6"
                >
                  <span className="text-xl">+</span> 캐릭터 추가
                </button>
              )}
            </>
          )}
          <button 
            type="submit"
            className="w-full py-5 bg-[#3b82f6] text-white rounded-[18px] text-[16px] font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all"
          >
            {isLoginTab ? '로그인' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;