import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/LiveRankDropdown.css';

function LiveRankDropdown({ onRankClick }) {
  const [rankList, setRankList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRollIndex, setCurrentRollIndex] = useState(0);

  useEffect(() => {
    axios.get('/api/rank/current')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setRankList(res.data);
        }
      })
      .catch((err) => console.error('초기 랭킹 로드 실패:', err));
    const ws = new WebSocket('ws://localhost:8080/ws/live-rank');
    ws.onmessage = (event) => {
      setRankList(JSON.parse(event.data));
    };

    return () => ws.close();
  }, []);

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentRollIndex((prevIndex) => (prevIndex + 1) % Math.min(rankList.length, 10));
    }, 3000);

    return () => clearInterval(timer);
  }, [rankList]);

  if (rankList.length === 0) return null;

  const rollingItem = rankList[currentRollIndex];

  return (
    <div className="live-rank-container">
      <div className="live-rank-badge" onClick={() => setIsOpen(!isOpen)}>
        <div className="rolling-wrapper">
          <div className="rolling-content slide-up-anim" key={currentRollIndex}>
            <span className={`rank-num-top ${currentRollIndex < 3 ? 'top-three-bg' : 'normal-bg'}`}>
              {currentRollIndex + 1}
            </span>
            <span className="rank-name-top">{rollingItem?.characterName}</span>
          </div>
        </div>
        <span className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>▲</span>
      </div>

      {isOpen && (
        <div className="live-rank-dropdown-box">
          <div className="dropdown-scroll-area">
            {rankList.map((item, index) => (
              <div 
                key={item.characterName} 
                className="dropdown-item"
                onClick={() => {
                  if (onRankClick) onRankClick(item.characterName);
                  setIsOpen(false);
                }}
              >
                <span className={`rank-number ${index < 3 ? 'top-three' : ''}`}>
                  {index + 1}
                </span>
                <span className="rank-character-name">{item.characterName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveRankDropdown;