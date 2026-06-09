import React, { useState } from 'react';
import '../css/Home.css';

function Home({ onSearch, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-title-wrapper">
          <span className="home-logo-emoji">🍁</span>
          <h1 className="home-title">메이플스토리 캐릭터 정보</h1>
        </div>
        <p className="home-subtitle">캐릭터 닉네임으로 정보를 조회하세요</p>
      </div>
      <div className="search-box-wrapper">
        <input type="text" placeholder="캐릭터 닉네임을 입력하세요" className="search-box-input"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
        <button onClick={() => onSearch(searchTerm)}className="search-box-btn">🔍</button>
        {error && !loading && (
          <p className="search-error-msg">⚠️ {error}</p>
        )}
      </div>
      <div className="feature-grid">
        <FeatureCard icon="👤" title="캐릭터 정보" desc="레벨, 직업, 월드, 길드 등 캐릭터의 기본 정보를 확인하세요" color="bg-blue-50" />
        <FeatureCard icon="🛡️" title="스탯 & 장비" desc="캐릭터의 상세 스탯과 장착 중인 장비 정보를 한눈에" color="bg-purple-50" />
        <FeatureCard icon="📈" title="경험치 기록" desc="일일 경험치 획득량과 성장 추이를 그래프로 확인" color="bg-emerald-50" />
        <FeatureCard icon="⚡" title="즐겨찾기" desc="여러 캐릭터를 저장하고 빠르게 조회하세요" color="bg-amber-50" />
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content-box">
            <div className="loading-circle-spinner"></div>
            <p className="loading-status-text">데이터 가지고 오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="feature-card">
      <div className={`feature-card-icon-box ${color}`}>
        {icon}
      </div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-desc">{desc}</p>
    </div>
  );
}

export default Home;