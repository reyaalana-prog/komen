import { useEffect } from 'react';
import Script from 'next/script';

export default function ShopeeLink1() {
  // GANTI LINK DI BAWAH INI DENGAN LINK SHOPEE AFFILIATE KAMU
  const shopeeTarget = "https://s.shopee.co.id/8zzw008PFz";

  useEffect(() => {
    // Memberi sedikit jeda agar script iklan (Popunder) sempat terpicu
    const timer = setTimeout(() => {
      window.location.href = shopeeTarget;
    }, 1500); // Jeda 1.5 detik

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#000', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: '#fff',
      fontFamily: 'sans-serif' 
    }}>
      
      {/* SCRIPT IKLAN ADSTERRA (Biar tetep dapet cuan pas redirect) */}
      <Script 
        src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" 
        strategy="afterInteractive" 
      />

      <div className="loader"></div>
      <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>Mengarahkan ke halaman streaming</p>
      <p style={{ color: '#444', fontSize: '0.8rem' }}>cdnviduy.site Safe Link</p>

      <style jsx>{`
        .loader {
          border: 4px solid #333;
          border-top: 4px solid #ee4d2d;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
