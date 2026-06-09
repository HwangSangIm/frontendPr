import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';
import '../css/CharacterLevel.css';

function CharacterLevel({ character, history }) {
  if (!character) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="font-medium text-sm">경험치 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const expRate = character?.character_exp_rate ? Number(character.character_exp_rate) : 0;

  const calculatePrediction = () => {
    if (!history || history.length < 2) return { status: 'insufficient_data' };

    const sorted = [...history].sort((a, b) => String(a.date).localeCompare(b.date));
    const oldest = sorted[0];
    const latest = sorted[sorted.length - 1];

    const getVal = (obj, keys) => keys.reduce((acc, key) => acc ?? obj[key], null) ?? 0;
    
    const oldestLevel = getVal(oldest, ['character_level', 'characterLevel', 'level']);
    const latestLevel = getVal(latest, ['character_level', 'characterLevel', 'level']);
    
    const oldestRate = Number(getVal(oldest, ['character_exp_rate', 'characterExpRate', 'expRate']));
    const latestRate = Number(getVal(latest, ['character_exp_rate', 'characterExpRate', 'expRate']));

    const totalDays = sorted.length - 1;
    if (totalDays <= 0) return { status: 'insufficient_data' };

    let totalGainRate = 0;
    if (latestLevel === oldestLevel) {
      totalGainRate = latestRate - oldestRate;
    } else if (latestLevel > oldestLevel) {
      const levelDiff = latestLevel - oldestLevel;
      totalGainRate = (100 - oldestRate) + ((levelDiff - 1) * 100) + latestRate;
    }

    const avgDailyExpRate = totalGainRate / totalDays;
    if (avgDailyExpRate <= 0) return { status: 'no_pace', avgDailyExpRate: 0, daysLeft: '-' };
    if (expRate >= 100) return { status: 'max', avgDailyExpRate, daysLeft: 0 };

    const daysLeft = Math.ceil((100 - expRate) / avgDailyExpRate);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysLeft);
    
    const formattedTargetDate = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(targetDate);

    return {
      status: 'success',
      avgDailyExpRate,
      daysLeft,
      targetDateStr: formattedTargetDate
    };
  };

  const prediction = calculatePrediction();

  const chartData = history 
    ? [...history]
        .sort((a, b) => String(a.date).localeCompare(b.date))
        .map(day => {
          const rawDate = day.date || '';
          let displayDate = rawDate;
          if (rawDate.includes('-')) {
            const parts = rawDate.split('-');
            displayDate = `${Number(parts[1])}/${Number(parts[2])}`; 
          }
          
          const todayStr = new Date().toISOString().split('T')[0];
          if (rawDate === todayStr) {
            displayDate = 'NOW';
          }

          const currentRate = day.character_exp_rate || day.characterExpRate || day.expRate || 0;

          return {
            dateLabel: displayDate,
            level: day.character_level || day.characterLevel || day.level || 0,
            rate: Number(currentRate),
            topLabel: `${Number(currentRate).toFixed(1)}%`
          };
        })
    : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip-box">
          <p className="chart-tooltip-title">{data.level}Lv, {data.dateLabel}</p>
          <div className="chart-tooltip-data">
            <span className="chart-tooltip-marker" />
            <p className="chart-tooltip-value">{Number(data.rate).toFixed(3)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="level-container">
      <div className="level-wrapper">
        <div className="dashboard-box">
          <div className="dashboard-title-bar">
            <h3 className="dashboard-title">{character.character_name}님의 경험치 히스토리</h3>
          </div>

          <div className="dashboard-content-grid">
            <div className="chart-area-wrapper">
              {chartData.length === 0 ? (
                <div className="no-data-msg">히스토리 데이터가 없습니다.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 25, right: 10, left: -25, bottom: 5 }} barSize={38}>
                    <CartesianGrid strokeDasharray="none" vertical={true} horizontal={false} stroke="#5b6573/40" />
                    <XAxis 
                      dataKey="dateLabel" 
                      stroke="#cbd5e1" 
                      fontSize={11} 
                      tickLine={false}
                      dy={8}
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const currentItem = chartData[payload.index];
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text x={0} y={0} dy={4} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight="600">
                              {currentItem.level}
                            </text>
                            <text x={0} y={15} dy={4} textAnchor="middle" fill="#94a3b8" fontSize={10}>
                              {payload.value}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <YAxis stroke="none" domain={[0, 100]} />
                    
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ fill: '#ffffff', opacity: 0.05 }}
                      isAnimationActive={false}
                    />
                    
                    <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#eab308" />
                      ))}
                      <LabelList 
                        dataKey="topLabel" 
                        position="top" 
                        fill="#f8fafc" 
                        fontSize={11} 
                        fontWeight="500"
                        offset={6}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="summary-spec-panel">
              <ul className="summary-list">
                <li className="summary-item">
                  <span className="summary-bullet">▪</span>
                  <p>
                    평균 일일 경험치 :{' '}
                    <span className="summary-highlight-cyan">
                      {prediction.status === 'success' ? `${prediction.avgDailyExpRate.toFixed(4)}%` : '0.0000%'}
                    </span>
                  </p>
                </li>

                <li className="summary-item">
                  <span className="summary-bullet">▪</span>
                  <div>
                    레벨업 예상일 :{' '}
                    {prediction.status === 'success' ? (
                      <span className="summary-highlight-white">
                        <span className="summary-highlight-green">{prediction.targetDateStr}</span>
                        <span className="summary-days-subtext">
                          (약 <span className="summary-highlight-red">{prediction.daysLeft}일</span> 남음)
                        </span>
                      </span>
                    ) : prediction.status === 'max' ? (
                      <span className="summary-highlight-green font-bold">MAX 레벨 도달</span>
                    ) : (
                      <span className="summary-text-disabled">측정 데이터 부족</span>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterLevel;