import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  
  // 🎯 1. FILTER JALUR: Hanya periksa halaman penayang video ([id].js)
  if (
    url.pathname === '/' || 
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/admin') || 
    url.pathname.startsWith('/bulk') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  const userAgentLower = userAgent.toLowerCase();

  // 🎯 2. BOT LIST REVISI (Murni hanya robot scanner Meta & Crawler Sosmed resmi gess)
  // Kode 'fb_iab', 'fb4a', dan 'fbios' TELAH DIHAPUS agar penonton asli dari aplikasi FB tidak dituduh bot!
  const botList = [
    'facebookexternalhit', 'facebookplatform', 'facebot', 'meta-externalagent',
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'twitterbot',
    'telegrambot', 'discordbot', 'slackbot', 'bot', 'crawler', 'spider'
  ];

  const isBot = botList.some(bot => userAgentLower.includes(bot));

  // 🎯 3. PROXY DETECTION (Menyaring pengguna VPN / Proxy server)
  const via = request.headers.get('via');
  const isProxy = via || request.headers.get('forwarded') || request.headers.get('x-forwarded-for')?.includes(',');

  // 🎯 EKSEKUSI PENYAMARAN GAIB
  if (isBot || isProxy) {
    // Robot FB/VPN akan terkunci melihat artikel kesehatan mata gess! Aman 100% dari banned!
    url.pathname = '/artikel-kamuflase'; 
    return NextResponse.rewrite(url);
  }

  // Jika lolos (Terdeteksi Manusia Asli), langsung gass ke video player + setelan lama yang gacor gess!
  return NextResponse.next();
}
