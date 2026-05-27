import React from 'react';

function CharacterLevel({ character, history }) {
  if (!character) {
    return (
      <div className="w-full flex flex-col justify-center items-center min-h-[50vh] text-slate-500">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"/>
        <p className="font-medium text-sm">경험치 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const expRate = character?.character_exp_rate ? Number(character.character_exp_rate) : 0;

  return (
    <div className="w-full text-slate-700 flex flex-col items-center font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-8 items-center">
          <div className="bg-[#e0e7ff]/40 rounded-2xl p-3 w-36 h-36 flex justify-center items-center border border-slate-100/80 shrink-0">
            <img src={character.character_image || character.character_img} alt="Avatar" className="w-28 h-auto object-contain" />
          </div>
          <div className="profile-info w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{character.character_name}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-[#dbeafe] text-[#2563eb] px-3 py-0.5 rounded-full text-xs font-bold">{character.world_name}</span>
              <span className="bg-[#f3e8ff] text-[#9333ea] px-3 py-0.5 rounded-full text-xs font-bold">{character.character_class}</span>
              <span className="bg-[#bbf7d0] text-[#16a34a] px-3 py-0.5 rounded-full text-xs font-bold">Lv. {character.character_level}</span>
            </div>
            <p className="text-sm text-slate-400 font-medium mb-3">
              길드: <span className="text-slate-600 font-semibold">{character.character_guild_name || '없음'}</span>
            </p>
            <div className="w-full flex items-center gap-4">
              <span className="text-xs text-slate-400 font-bold">경험치</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div className="h-full bg-[#9333ea] rounded-full transition-all duration-500" style={{ width: `${Math.min(expRate, 100)}%` }}></div>
              </div>
              <span className="text-xs text-slate-400 font-bold">{character.character_exp_rate}%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">최근 7일 경험치 변동 히스토리</h3>
          
          {!history || history.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">최근 경험치 히스토리 데이터를 불러올 수 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-5">날짜</th>
                    <th className="py-3 px-5">레벨</th>
                    <th className="py-3 px-5">현재 경험치</th>
                    <th className="py-3 px-5">경험치 비율</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {history.map((day, index) => (
                    <tr key={day.date || index} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-semibold text-slate-600">{day.date}</td>
                      <td className="py-4 px-5"><span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-lg text-xs">Lv. {day.character_level}</span></td>
                      <td className="py-4 px-5 text-slate-500 font-mono">{day.character_exp?.toLocaleString() ?? '-'}</td>
                      <td className="py-4 px-5 text-purple-600 font-bold font-mono">{day.character_exp_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
export default CharacterLevel;