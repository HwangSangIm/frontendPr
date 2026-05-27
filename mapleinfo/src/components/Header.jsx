import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Header({ onSearch, isSearched, user, onOpenAuth, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 사이드바 메뉴 열림 상태
  
  const dropdownRef = useRef(null);
  const menuRef = useRef(null); // 메뉴 바깥 클릭 감지용
  const location = useLocation();
  const navigate = useNavigate();

  // 💡 [수정] 데이터 검색 여부(isSearched)와 상관없이, 현재 주소가 서브 페이지라면 무조건 고정 표시
  const showSubUi = location.pathname === '/detail' || location.pathname === '/level';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // 메뉴 바깥 클릭 시 닫기
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-toggle-btn')) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-transparent border-b border-slate-100/50 relative">
      
      {/* 왼쪽: 메뉴 버튼 및 사이드바 */}
      <div className="w-40 shrink-0">
        {showSubUi && (
          <>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="menu-toggle-btn px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
            >
              ☰ 메뉴 열기
            </button>

            {/* 사이드 바 슬라이드 메뉴 */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-all">
                <div 
                  ref={menuRef}
                  className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
                >
                  {/* 메뉴 헤더 */}
                  <div className="p-5 flex justify-between items-center border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
                      <span className="text-xl">📊</span> 메뉴
                    </div>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 text-xl transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 메뉴 아이템 리스트 */}
                  <div className="p-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        navigate('/detail');
                        setIsMenuOpen(false);
                      }}
                      className={`w-full px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all ${
                        location.pathname === '/detail' 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={location.pathname === '/detail' ? 'text-white' : 'text-slate-400'}>👤</span>
                      캐릭터 정보
                    </button>

                    <button
                      onClick={() => {
                        navigate('/level');
                        setIsMenuOpen(false);
                      }}
                      className={`w-full px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all ${
                        location.pathname === '/level' 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={location.pathname === '/level' ? 'text-white' : 'text-slate-400'}>📈</span>
                      경험치 기록
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 중간: 검색창 */}
      <div className="flex-1 max-w-xl mx-4 relative">
        {showSubUi && (
          <div className="relative w-full">
            <input
              type="text"
              placeholder="캐릭터 닉네임 검색"
              className="w-full px-5 py-2.5 rounded-xl bg-white shadow-md shadow-blue-100/30 border border-slate-200 focus:border-blue-300 outline-none text-sm transition-all pr-12 text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={() => searchTerm.trim() && onSearch(searchTerm)} 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 text-xs"
            >
              🔍
            </button>
          </div>
        )}
      </div>

      {/* 오른쪽: 로그인/사용자 드롭다운 */}
      <div className="w-40 shrink-0 flex justify-end relative" ref={dropdownRef}>
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-[18px] text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition-all flex items-center gap-2"
            >
              <span className="text-blue-500">👤</span>
              <span>{user.id}</span>
              <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-[20px] shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 text-[12px] font-bold text-slate-400 tracking-tight">
                  저장된 캐릭터
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {user.nickname && user.nickname.length > 0 ? (
                    user.nickname.map((name, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSearch(name);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all border-b border-slate-50"
                      >
                        <span className="text-xs text-slate-300">👤</span>
                        <span className="hover:text-blue-600 transition-colors">{name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-xs text-slate-400 text-center">등록된 캐릭터가 없습니다.</div>
                  )}
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50/50 flex items-center gap-2 transition-all"
                >
                  <span className="text-xs">➔</span> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={onOpenAuth} 
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-1.5"
          >
            <span>➔</span> 로그인
          </button>
        )}
      </div>

    </header>
  );
}

export default Header;