import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate , useLocation} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import LiveRankDropdown from "./components/LiveRankDropdown";
import Home from "./pages/Home";
import CharacterDetail from "./pages/CharacterDetail";
import CharacterLevel from './pages/CharacterLevel';
import Notfound from "./pages/Notfound";
import './App.css';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [characterData, setCharacterData] = useState(null);
  const [characterStat, setCharacterStat] = useState(null);
  const [characterEquipment, setCharacterEquipment] = useState(null);
  const [characterLevel, setCharacterLevel] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('mapleUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  React.useEffect(() => {
    const lastSearched = sessionStorage.getItem('lastSearchedCharacter');
    const currentPath = window.location.pathname;

    if (lastSearched && (currentPath === '/detail' || currentPath === '/level')) {
      onSearchCharacter(lastSearched, currentPath);
    }
  }, []);

  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    const { token, ...pureUserData } = userData; 
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    setUser(pureUserData);
    sessionStorage.setItem('mapleUser', JSON.stringify(pureUserData));
  };

  const onSearchCharacter = async (characterName , targetPath = '/detail') => {
    if (!characterName.trim()) return;
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      setIsAuthOpen(true);
      return;
    }

    if (window.location.pathname === '/') {
      navigate('/');
    }
    setLoading(true);
    setError(null);
    sessionStorage.setItem('lastSearchedCharacter', characterName);
    
    try {
      const response = await axios.get(`/api/maple/character-all?name=${characterName}`);
      const data = response.data;
      if (data) {
        setCharacterData(data.character);
        setCharacterStat(data.stat);
        setCharacterEquipment(data.equipment);
        setCharacterLevel(data.level);
        setLoading(false);
        navigate(targetPath);
      } else {
        setError("캐릭터 기본 정보를 찾을 수 없습니다.");
        setLoading(false);
      }
    } catch (err) {
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('mapleUser');
    localStorage.removeItem('accessToken');
    alert("로그아웃 되었습니다.");
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col font-sans text-slate-700">
      <Header onSearch={onSearchCharacter} onOpenAuth={() => setIsAuthOpen(true)} user={user} isSearched={!!characterData} onLogout={handleLogout} />

      <div className="w-full max-w-7xl mx-auto px-6 pt-4 flex justify-end">
        <LiveRankDropdown onRankClick={(name) => onSearchCharacter(name, '/detail')} />
      </div>
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col justify-center">
        <Routes>
          <Route path="/" element={
            <Home onSearch={onSearchCharacter} loading={loading} error={error} />
          } />
          
          <Route path="/detail" element={
            characterData ?(
            <CharacterDetail 
              character={characterData} 
              stat={characterStat} 
              equipment={characterEquipment}
            />
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/>
              </div>
            )
          } />
          <Route path="/level" element={
            characterData ? (
              <CharacterLevel
                character={characterData}
                history={characterLevel}
              />
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/>
              </div>
            )
          } />

          <Route path="*" element={<Notfound />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
