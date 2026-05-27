import React from 'react';

const GRADE_TEXT_MAP = { 
  '레전드리': 'text-grade-legendary', 
  '유니크': 'text-grade-unique', 
  '에픽': 'text-grade-epic', 
  '레어': 'text-grade-rare' 
};

const STAT_PRIORITY = {
  str: 1, dex: 2, intel: 3, int: 3, luk: 4,
  max_hp: 5, maxhp: 5, max_mp: 6, maxmp: 6,
  attack_power: 7, attackpower: 7, magic_power: 8, magicpower: 8,
  defense: 9, speed: 10, jump: 11,
  all_stat: 12, allstat: 12,
  boss_damage: 13, bossdamage: 13,
  ignore_target_defense: 14, ignoretargetdefense: 14,
  damage: 15
};

const STAT_LABELS = {
  str: 'STR', dex: 'DEX', intel: 'INT', int: 'INT', luk: 'LUK',
  max_hp: '최대 HP', maxHp: '최대 HP', maxhp: '최대 HP',
  max_mp: '최대 MP', maxMp: '최대 MP', maxmp: '최대 MP',
  attack_power: '공격력', attackPower: '공격력', attackpower: '공격력',
  magic_power: '마력', magicPower: '마력', magicpower: '마력',
  defense: '방어력', speed: '이동속도', jump: '점프력',
  all_stat: '올스탯', allStat: '올스탯', allstat: '올스탯',
  boss_damage: '보스 몬스터 공격 시 데미지', bossDamage: '보스 몬스터 공격 시 데미지', bossdamage: '보스 몬스터 공격 시 데미지',
  ignore_target_defense: '몬스터 방어율 무시', ignoreTargetDefense: '몬스터 방어율 무시', ignoretargetdefense: '몬스터 방어율 무시',
  damage: '데미지'
};

function ItemTooltipModal({ item, onClose }) {
  if (!item) return null;

  const grade = item.potential_option_grade || item.potentialOptionGrade || '일반';
  const name = item.item_name || item.itemName || '알 수 없는 장비';
  const icon = item.item_icon || item.itemIcon;
  const slot = item.item_equipment_slot || item.itemEquipmentSlot || '미확인 슬롯';
  const upgrade = item.scroll_upgrade || item.scrollUpgrade;
  
  const totalOption = item.item_total_option || item.itemTotalOption || {};
  const baseOption = item.item_base_option || item.itemBaseOption || {};
  const addOption = item.item_add_option || item.itemAddOption || {};
  const starforceOption = item.item_starforce_option || item.itemStarforceOption || {};

  const pOpts = [
    item.potential_option_1 || item.potentialOption1, 
    item.potential_option_2 || item.potentialOption2, 
    item.potential_option_3 || item.potentialOption3
  ].filter(Boolean);

  const aOpts = [
    item.additional_potential_option_1 || item.additionalPotentialOption1, 
    item.additional_potential_option_2 || item.additionalPotentialOption2, 
    item.additional_potential_option_3 || item.additionalPotentialOption3
  ].filter(Boolean);

  const validStatKeys = Object.keys(totalOption)
    .filter((key) => {
      const val = totalOption[key];
      if (val === undefined || val === null || val === 0 || val === '0' || val === '0%') return false;
      return true;
    })
    .sort((a, b) => {
      const prioA = STAT_PRIORITY[a.toLowerCase()] || 999;
      const prioB = STAT_PRIORITY[b.toLowerCase()] || 999;
      return prioA - prioB;
    });

  // 💡 스타포스 개수 파악
  const currentStarforce = Number(item.starforce || item.starforce_level || 0);
  const hasStarforce = (item.starforce || item.starforce_level) && item.starforce !== '0';

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="maple-tooltip-modal p-6 text-white font-sans text-xs relative select-none w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 font-bold text-sm">✕</button>

        {/* 💡 [수정] 스타포스 영역: 5개씩 3번(15개) 배치 후 줄바꿈하여 총 2줄 구조 생성 */}
        {hasStarforce && (
          <div className="starforce-container mb-3 border-b border-zinc-700/50 pb-2.5 flex flex-col items-center gap-y-1 text-[11px] tracking-wider">
            {[0, 1].map((lineIndex) => (
              <div key={lineIndex} className="flex justify-center gap-x-1.5">
                {[0, 1, 2].map((groupIndex) => (
                  <div key={groupIndex} className="flex gap-x-0.5">
                    {Array.from({ length: 5 }).map((_, starIndex) => {
                      // 전체 30개 중 현재 별의 절대 위치 인덱스 계산 (0 ~ 29)
                      const globalIndex = (lineIndex * 15) + (groupIndex * 5) + starIndex;
                      return (
                        <span key={starIndex} className="text-amber-400 font-bold select-none">
                          {globalIndex < currentStarforce ? '★' : '☆'}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mb-1.5">
          <h4 className="text-white text-lg font-bold">{name} {upgrade ? `(+${upgrade})` : ''}</h4>
          <span className={`text-[13px] font-bold ${GRADE_TEXT_MAP[grade] || 'text-grade-none'}`}>({grade} 아이템)</span>
        </div>

        <div className="flex justify-center mb-4 pb-4 border-b border-zinc-700/50">
          <div className="w-20 h-20 bg-zinc-900 border-4 border-[#333333] flex justify-center items-center p-1">
            <img src={icon} alt="item" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* 스탯 세부 수치 동적 출력부 */}
        <div className="text-[11px] mb-3 pb-3 border-b border-dashed border-zinc-700 space-y-1.5 font-mono">
          <p className="mb-2 font-sans"><span className="text-zinc-100">장비분류 :</span> <span className="text-white">{slot}</span></p>
          
          {validStatKeys.map((key) => {
            const rawTotal = totalOption[key];
            const total = parseInt(rawTotal, 10);
            if (isNaN(total) || total === 0) return null;

            const base = parseInt(baseOption[key] || 0, 10);
            const add = parseInt(addOption[key] || 0, 10);
            const star = parseInt(starforceOption[key] || 0, 10);
            const scroll = total - (base + add + star);

            const isPercent = String(rawTotal).includes('%') || key.toLowerCase().includes('damage') || key.toLowerCase().includes('ignore') || key.toLowerCase().includes('allstat') || key.toLowerCase().includes('all_stat');
            const unit = isPercent ? '%' : '';

            const label = STAT_LABELS[key] || key;
            const hasBreakdown = (base > 0 || add > 0 || scroll > 0 || star > 0) && !isPercent;

            return (
              <div key={key} className="stat-detail-row flex justify-between items-center w-full min-h-[16px]">
                <span className="font-sans font-medium text-left">
                  {label} : <span className="text-cyan-400 font-bold">+{total}{unit}</span>
                </span>
                
                {hasBreakdown && (
                  <span className="stat-detail-breakdown text-[10px] tracking-wide font-bold text-right shrink-0 font-mono">
                    (&nbsp;
                    <span className="text-white">{base}</span>
                    {add > 0 && <span className="text-[#ccff00]"> +{add}</span>}
                    {scroll > 0 && <span className="text-[#aaaaff]"> +{scroll}</span>}
                    {star > 0 && <span className="text-amber-400"> +{star}</span>}
                    &nbsp;)
                  </span>
                )}
                
                {isPercent && add > 0 && (
                  <span className="text-[10px] font-bold text-[#ccff00] text-right shrink-0 font-mono">
                    (&nbsp;0% <span className="text-[#ccff00]">+{add}%</span>&nbsp;)
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 잠재옵션 & 에디셔널 */}
        {pOpts.length > 0 && (
          <div className="mb-3 border-2 border-green-800 p-3 bg-zinc-950/60 rounded-md">
            <p className="text-green-400 font-bold mb-1">✨ 잠재옵션</p>
            {pOpts.map((opt, i) => <p key={i}>{opt}</p>)}
          </div>
        )}
        {aOpts.length > 0 && (
          <div className="mb-3 border-2 border-sky-800 p-3 bg-zinc-950/60 rounded-md">
            <p className="text-sky-400 font-bold mb-1">✨ 에디셔널 잠재옵션</p>
            {aOpts.map((opt, i) => <p key={i}>{opt}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemTooltipModal;