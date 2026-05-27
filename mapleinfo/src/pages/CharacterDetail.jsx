import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemTooltipModal from './ItemTooltipModal'; 
import '../css/CharacterDetail.css';

const GRADE_CLASS_MAP = { 
  '레전드리': 'grade-legendary', 
  '유니크': 'grade-unique', 
  '에픽': 'grade-epic', 
  '레어': 'grade-rare' 
};

function CharacterDetail({ character, stat, equipment }) {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  if (!character) return <div className="text-center py-20 text-slate-500">정보가 없습니다.</div>;

  const getStatValue = (name) => {
    const found = stat?.final_stat?.find(s => s.stat_name === name);
    return found ? (isNaN(found.stat_value) ? found.stat_value : Number(found.stat_value).toLocaleString()) : '0';
  };

  const itemList = 
    equipment?.equipment?.item_equipment || 
    equipment?.item_equipment || 
    equipment?.itemEquipment || 
    (Array.isArray(equipment) ? equipment : []);

  return (
    <div className="detail-container animate-in fade-in duration-200 w-full max-w-5xl flex flex-col gap-6">
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-8 items-center">
        <div className="avatar-box rounded-2xl p-3 w-36 h-36 flex justify-center items-center border shrink-0">
          <img src={character.character_image || character.character_img} alt="Avatar" className="w-28 h-auto object-contain" />
        </div>
        <div className="w-full">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{character.character_name}</h2>
          <div className="flex gap-2 mb-3 text-xs font-bold text-white">
            <span className="bg-blue-500 px-3 py-0.5 rounded-full">{character.world_name}</span>
            <span className="bg-purple-500 px-3 py-0.5 rounded-full">{character.character_class}</span>
            <span className="bg-green-500 px-3 py-0.5 rounded-full">Lv. {character.character_level}</span>
          </div>
          <div className="w-full flex items-center gap-4 text-xs font-bold text-slate-400">
            <span>경험치 ({character.character_exp_rate}%)</span>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border exp-bar-track">
              <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${Math.min(Number(character.character_exp_rate || 0), 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">스탯 정보</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['STR', 'DEX', 'INT', 'LUK', '공격력', '마력', '방어율 무시', '보스 몬스터 데미지','크리티컬 확률' , '크리티컬 데미지' , '아이템 드롭률' , '메소 획득량' , '버프 지속시간' , '재사용 대기시간 감소 (초)'].map(lbl => (
            <StatBox key={lbl} label={lbl} value={getStatValue(lbl)} />
          ))}
        </div>
      </div>

      {/* [3] 장비 리스트 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">장비 정보</h3>
        {itemList.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">착용 중인 장비 정보가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {itemList.map((item, i) => {
              const grade = item.potential_option_grade || item.potentialOptionGrade || '일반';
              const slot = item.item_equipment_slot || item.itemEquipmentSlot || '미확인 슬롯';
              const name = item.item_name || item.itemName || '알 수 없는 장비';
              const icon = item.item_icon || item.itemIcon;

              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedItem(item)} 
                  className={`border-2 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-all eq-card ${GRADE_CLASS_MAP[grade] || 'grade-none'}`}
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex justify-center items-center shrink-0 border border-slate-100 p-1">
                    {icon && <img src={icon} alt={name} className="w-10 h-10 object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">{slot}</span>
                    <h4 className="text-sm font-bold text-slate-800 truncate">{name}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 💡 에러 위험이 없는 확실한 모달 조건부 렌더링 */}
      {selectedItem && (
        <ItemTooltipModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-[#f8faff] border border-slate-100 p-4 rounded-xl flex flex-col justify-between min-h-[85px]">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold text-slate-800">{value}</span>
    </div>
  );
}

export default CharacterDetail;