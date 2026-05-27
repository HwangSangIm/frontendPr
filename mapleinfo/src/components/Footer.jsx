import React from 'react';

function Footer() {
  return (
    <footer className="w-full py-8 flex flex-col items-center justify-center text-slate-400 border-t border-slate-100 bg-transparent mt-auto">
      <p className="text-xs mb-1 text-slate-500">
        © 2026 MapleStory Character Info. All rights reserved.
      </p>
      <p className="text-[10px] font-bold tracking-wider opacity-80 text-slate-500 mb-1">
        Data provided by NEXON Open API
      </p>
      <p className="text-[9px] opacity-60 text-slate-400 text-center max-w-md">
        This site is not affiliated with or endorsed by NEXON Korea Corporation.
      </p>
    </footer>
  );
}

export default Footer;