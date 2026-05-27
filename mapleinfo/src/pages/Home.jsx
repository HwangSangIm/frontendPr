import React, { useState } from 'react';

function Home({ onSearch, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-12">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🍁</span>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">
            메이플스토리 캐릭터 정보
          </h1>
        </div>
        <p className="text-slate-400 font-medium text-base md:text-lg">
          캐릭터 닉네임으로 정보를 조회하세요
        </p>
      </div>
      <div className="w-full max-w-2xl relative mb-16">
        <input
          type="text"
          placeholder="캐릭터 닉네임을 입력하세요"
          className="w-full px-8 py-5 rounded-2xl bg-white shadow-xl shadow-blue-100/50 border-2 border-transparent focus:border-blue-300 outline-none text-lg transition-all pr-16 text-slate-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          onClick={() => onSearch(searchTerm)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-500 transition-all"
        >
          🔍
        </button>
        
        {error && !loading &&(
          <p className="absolute -bottom-8 left-4 text-red-500 text-sm font-medium">
            ⚠️ {error}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <FeatureCard icon="👤" title="캐릭터 정보" desc="레벨, 직업, 월드, 길드 등 캐릭터의 기본 정보를 확인하세요" color="bg-blue-50" />
        <FeatureCard icon="🛡️" title="스탯 & 장비" desc="캐릭터의 상세 스탯과 장착 중인 장비 정보를 한눈에" color="bg-purple-50" />
        <FeatureCard icon="📈" title="경험치 기록" desc="일일 경험치 획득량과 성장 추이를 그래프로 확인" color="bg-emerald-50" />
        <FeatureCard icon="⚡" title="즐겨찾기" desc="여러 캐릭터를 저장하고 빠르게 조회하세요" color="bg-amber-50" />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-blue-600 font-bold tracking-tight">메이플 데이터를 스카우팅 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-100/30 hover:-translate-y-1 transition-all cursor-pointer group">
      <div className={`${color} w-14 h-14 rounded-2xl flex justify-center items-center mb-4 text-2xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default Home;