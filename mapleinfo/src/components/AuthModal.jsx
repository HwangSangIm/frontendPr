import React, { useState } from 'react';
import axios from 'axios';
import '../css/AuthModal.css';

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
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
        alert(err.response?.data || "로그인에 실패했습니다.");
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
        nickname: validNicknames
      };
      try {
        await axios.post('/api/user/signup', signupData);
        alert("회원가입이 완료되었습니다!");
        setIsLoginTab(true);
        setId('');
        setPw('');
        setNicknames(['']);
        onClose();
      } catch (err) {
        const errorMsg = err.response?.data || "회원가입 중 오류가 발생했습니다.";
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <div className="tab-container">
            <button 
              className={`tab-button ${isLoginTab ? 'active' : 'inactive'}`}
              onClick={() => setIsLoginTab(true)}
            >
              로그인
            </button>
            <button 
              className={`tab-button ${!isLoginTab ? 'active' : 'inactive'}`}
              onClick={() => setIsLoginTab(false)}
            >
              회원가입
            </button>
          </div>
          <button onClick={onClose} className="close-x-button">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form custom-scrollbar">
          <div className="form-group">
            <label className="form-label">아이디 *</label>
            <input 
              type="text" placeholder="아이디를 입력하세요" required
              className="form-input"
              value={id} onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호 *</label>
            <input 
              type="password" placeholder="비밀번호를 입력하세요" required
              className="form-input"
              value={pw} onChange={(e) => setPw(e.target.value)}
            />
          </div>

          {/* 회원가입 탭 전용 필드 */}
          {!isLoginTab && (
            <>
              <div className="mb-2">
                <label className="form-label">캐릭터 닉네임 (최대 5개) *</label>
                <div className="nickname-container">
                  {nicknames.map((name, index) => (
                    <input 
                      key={index}
                      type="text" 
                      placeholder={`캐릭터 ${index + 1}`} 
                      required
                      className="nickname-input"
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
                  className="add-field-button"
                >
                  <span className="text-xl">+</span> 캐릭터 추가
                </button>
              )}
            </>
          )}
          
          <button type="submit" className="submit-button">
            {isLoginTab ? '로그인' : '회원가입'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default AuthModal;