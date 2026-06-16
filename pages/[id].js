import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Player() {
  const router = useRouter();
  const { id: rawId } = router.query; // Ambil parameter mentah dari URL
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [usePopCash, setUsePopCash] = useState(false);

  // 🛠️ LOGIKA PEMBERSIH EKOR .MP4 (Anti Case-Sensitive & Spasi)
  let id = rawId;
  if (id && typeof id === 'string') {
    id = id.trim().replace(/\.(mp4|map4)$/i, "");
  }

  useEffect(() => {
    if (!id) return;

    // 🎯 RALAT: SISTEM ROTASI HANYA 2 POPUNDER (Adsterra ⇄ PopCash)
    const currentTurn = localStorage.getItem('popunder_turn') || 'adsterra';
    if (currentTurn === 'adsterra') {
      setUsePopCash(false);
      localStorage.setItem('popunder_turn', 'popcash'); // Giliran berikutnya PopCash
    } else {
      setUsePopCash(true);
      localStorage.setItem('popunder_turn', 'adsterra'); // Giliran berikutnya Adsterra
    }

    // 1. DETEKSI ADBLOCK
    const checkAdBlock = async () => {
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      try {
        await fetch(new Request(googleAdUrl, { mode: 'no-cors' }));
        setAdBlockDetected(false);
      } catch (e) {
        setAdBlockDetected(true);
      }
    };
    checkAdBlock();

    // 2. AMBIL JUDUL VIDEO DARI MULTI-TABLE (videos2 & videos1)
    const fetchVideoInfo = async () => {
      let { data, error } = await supabase
        .from('videos2')
        .select('title')
        .eq('videy_id', id)
        .single();
      
      if (!data) {
        const { data: oldData } = await supabase
          .from('videos1')
          .select('title')
          .eq('videy_id', id)
          .single();
        data = oldData;
      }

      if (data) {
        document.title = data.title;
      } else {
        document.title = "Video Player";
      }
    };
    
    fetchVideoInfo();
    localStorage.setItem('download_step', '0');

    return () => {
      localStorage.removeItem('download_step');
    };
  }, [id]);

  const handleDownload = () => {
    let currentStep = parseInt(localStorage.getItem('download_step') || '0');
    
    // 🎯 Direct Link Baru dari Adsterra
    const linkAdstera = 'https://researchingsweatexit.com/qbd728qj?key=843109ad1c064b8f2240ccaa317b3e02';
    const affiliateLinks = ['https://s.shopee.co.id/7fUZHYXISz', 'https://s.shopee.co.id/AUokejQPcI'];

    currentStep++;
    localStorage.setItem('download_step', currentStep.toString());

    if (currentStep === 1) {
      window.open(linkAdstera, '_blank');
    } else if (currentStep === 2 || currentStep === 3) {
      const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
      window.open(affiliateLinks[randomIndex], '_blank');
    } else {
      window.location.href = `https://cdn2.videy.co/${id}.mp4`;
      localStorage.setItem('download_step', '0');
    }
  };

  if (!id) return null;

  return (
    <div className="player-page">
      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #000 !important;
          color: #fff;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }
      `}</style>

      {/* --- 🎯 IKLAN SOCIAL BAR ADSTERRA --- */}
      <Script 
        src="https://researchingsweatexit.com/83/9c/90/839c90344a3063bfed2ec39707b7c58f.js" 
        strategy="afterInteractive" 
      />

      {/* --- 🎯 EKSEKUSI ROTASI 2 POPUNDER --- */}
      {!usePopCash ? (
        // JIKA GILIRAN ADSTERRA
        <Script 
          src="https://researchingsweatexit.com/40/4f/8d/404f8d00f1a7992e63a3f3448fcb5fd4.js" 
          strategy="afterInteractive" 
        />
      ) : (
        // JIKA GILIRAN POPCASH
        <Script id="popcash-script" strategy="afterInteractive">
          {`
            var uid = '502785';
            var wid = '755160';
            var pop_tag = document.createElement('script');pop_tag.src='//cdn.popcash.net/show.js';document.body.appendChild(pop_tag);
            pop_tag.onerror = function() {pop_tag = document.createElement('script');pop_tag.src='//cdn2.popcash.net/show.js';document.body.appendChild(pop_tag);};
          `}
        </Script>
      )}

      {adBlockDetected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>⚠️</div>
          <h2 style={{ fontFamily: 'sans-serif' }}>Adblock Terdeteksi!</h2>
          <p style={{ color: '#ccc', maxWidth: '400px', lineHeight: '1.6' }}>
            Harap <b>matikan Adblock</b> agar kami bisa terus menyediakan layanan gratis.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '12px 25px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            SAYA SUDAH MATIKAN ADBLOCK
          </button>
        </div>
      )}

      <div className="content-wrapper" style={{ filter: adBlockDetected ? 'blur(15px)' : 'none' }}>
        
        <div className="header-nav">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="btn-back">🏠 Beranda</button>
          </Link>
          
          <a href="https://t.me/+Az4uGyWA9Q5kNTI1" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn-join-tele">🚀 Join Grup Tele</button>
          </a>
        </div>

        <div className="video-container">
          <video 
            controls 
            controlsList="nodownload" 
            autoPlay 
            preload="metadata"
            playsInline
            key={id}
          >
            <source src={`https://cdn2.videy.co/${id}.mp4`} type="video/mp4" />
          </video>
        </div>

        <div className="actions">
          <button onClick={handleDownload} className="btn-download">
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
          
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="link-more">Cari video lainnya di sini</span>
          </Link>
        </div>

      </div>

      <style jsx>{`
        .player-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
          background-color: #000;
        }
        .content-wrapper {
          width: 100%;
          max-width: 850px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .header-nav {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          gap: 10px;
        }
        .btn-back {
          background: transparent;
          color: #888;
          border: 1px solid #333;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .btn-back:hover {
          color: #fff;
          border-color: #555;
        }
        .btn-join-tele {
          background-color: #0088cc;
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0, 136, 204, 0.3);
          transition: 0.3s;
        }
        .btn-join-tele:hover {
          background-color: #0077b5;
          transform: translateY(-1px);
        }
        .video-container {
          width: 100%;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(255, 0, 0, 0.1);
          line-height: 0;
        }
        video {
          width: 100%;
          height: auto;
          max-height: 75vh;
          background: #000;
        }
        .actions {
          margin-top: 30px;
          text-align: center;
          width: 100%;
        }
        .btn-download {
          padding: 18px 40px;
          font-size: 1.1rem;
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4);
          transition: 0.3s;
        }
        .btn-download:hover {
          transform: scale(1.05);
          background-color: #218838;
        }
        .link-more {
          display: block;
          margin-top: 20px;
          color: #666;
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
