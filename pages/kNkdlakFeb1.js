import { useEffect } from 'react';
import Script from 'next/script';

export default function ShopeeLink1() {
  const shopeeTarget = "https://justpaste.it/kdsi6";

  useEffect(() => {
    // 🎯 LANGSUNG REDIRECT INSTAN SEKETIKA TANPA JEDA TIMER
    window.location.href = shopeeTarget;
  }, []);

  return (
    <>
      {/* Skeptis/Iklan tetap dipasang di atas, 
        walaupun jalannya akan balapan dengan kecepatan redirect browser.
      */}
      <Script 
        src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" 
        strategy="beforeInteractive" // Diubah ke sebelum interaktif biar dimuat secepat mungkin
      />
      
      {/* Halaman dibiarkan kosong melompong tanpa teks dan loader */}
      <div style={{ backgroundColor: '#000', height: '100vh' }}></div>
    </>
  );
}
