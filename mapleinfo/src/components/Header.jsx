import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate , Link} from 'react-router-dom';
import '../css/Header.css';

function Header({ onSearch, isSearched, user, onOpenAuth, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const showSubUi = location.pathname === '/detail' || location.pathname === '/level';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) onSearch(searchTerm);
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-toggle-btn')) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header-container">
      <div className="header-left">
        {showSubUi && (
          <>
            <button onClick={() => setIsMenuOpen(true)} className="menu-toggle-btn">
              ☰ 메뉴 열기
            </button>
            {isMenuOpen && (
              <div className="sidebar-overlay">
                <div ref={menuRef} className="sidebar-menu">
                  <div className="sidebar-header">
                    <div className="sidebar-title">
                      <span className="text-xl">📊</span> 메뉴
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="sidebar-close-btn">
                      ✕
                    </button>
                  </div>
                  <div className="sidebar-content">
                    <button onClick={() => {navigate('/detail');setIsMenuOpen(false);
                      }}
                      className={`sidebar-link-btn ${location.pathname === '/detail' ? 'active' : 'inactive'}`}
                    >
                      <span className={location.pathname === '/detail' ? 'text-white' : 'text-slate-400'}>👤</span>
                      캐릭터 정보
                    </button>
                    <button onClick={() => { navigate('/level'); setIsMenuOpen(false);}}
                      className={`sidebar-link-btn ${location.pathname === '/level' ? 'active' : 'inactive'}`}
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
      <div className="header-center">
        {showSubUi && (
          <>
            <Link 
              to="/" 
              className="home-logo-link"
              title="메인 홈으로 이동"
            >
              🍁
            </Link>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="캐릭터 닉네임 검색"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={() => searchTerm.trim() && onSearch(searchTerm)} className="search-submit-btn"> 🔍 </button>
            </div>
          </>
        )}
      </div>
      <div className="header-right" ref={dropdownRef}>
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="user-dropdown-toggle"
            >
              <span className="text-blue-500">👤</span>
              <span>{user.id}</span>
              <span className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : ''}`}> ▼ </span>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header"> 저장된 캐릭터 </div>
                <div className="dropdown-list">
                  {user.nickname && user.nickname.length > 0 ? (
                    user.nickname.map((name, idx) => (
                      <button key={idx} onClick={() => { onSearch(name); setIsDropdownOpen(false); }} className="dropdown-item-btn">
                        <span className="text-xs text-slate-300">👤</span>
                        <span className="hover:text-blue-600 transition-colors">{name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-xs text-slate-400 text-center">등록된 캐릭터가 없습니다.</div>
                  )}
                </div>
                <button onClick={() => {onLogout(); setIsDropdownOpen(false);}} className="dropdown-logout-btn">
                  <span className="text-xs">➔</span> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onOpenAuth} className="login-trigger-btn"> <span>➔</span> 로그인 </button>
        )}
      </div>
    </header>
  );
}

export default Header;