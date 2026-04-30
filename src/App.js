import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'https://hustlehub-backend-3h1v.onrender.com';

export default function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [tab, setTab] = useState('hustles');
  const [phone, setPhone] = useState('');
  const [payStatus, setPayStatus] = useState('idle');

  useEffect(() => {
    setIsPremium(localStorage.getItem('hh_premium') === 'true');
  }, []);

  const handlePay = async () => {
    if (!phone || phone.length < 10) return alert('Enter valid phone');
    setPayStatus('sending');

    try {
      const res = await fetch(`${BACKEND_URL}/stkpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: 100, userId: 'user-1' })
      });
      const data = await res.json();

      if (data.success) {
        setPayStatus('waiting');
        pollStatus(data.data.checkoutRequestId);
      } else {
        setPayStatus('failed');
      }
    } catch (e) {
      setPayStatus('failed');
    }
  };

  const pollStatus = (id) => {
    let tries = 0;
    const iv = setInterval(async () => {
      tries++;
      const res = await fetch(`${BACKEND_URL}/payment-status/${id}`);
      const data = await res.json();

      if (data.status === 'success') {
        clearInterval(iv);
        setIsPremium(true);
        localStorage.setItem('hh_premium', 'true');
        setPayStatus('success');
      }
      if (tries > 30) { clearInterval(iv); setPayStatus('failed'); }
    }, 5000);
  };

  const hustles = [
    { id: 1, title: 'Online Surveys', pay: 'KES 50-200', free: true },
    { id: 2, title: 'Freelance Writing', pay: 'KES 500-2,000', free: true },
    { id: 3, title: 'Social Media Mgmt', pay: 'KES 5K-15K/mo', free: false },
    { id: 4, title: 'Forex Signals', pay: 'KES 2K-10K/day', free: false },
    { id: 5, title: 'Dropshipping', pay: 'KES 10K-50K/mo', free: false },
    { id: 6, title: 'Virtual Assistant', pay: 'KES 300-800/hr', free: false },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#0a0a1a', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: '#12122a', borderBottom: '1px solid #1a1a3e' }}>
        <b style={{ color: '#ffd700', fontSize: '20px' }}>🔥 HustleHub Pro</b>
        {isPremium ? (
          <span style={{ background: '#ffd700', color: '#1a1a2e', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ PRO</span>
        ) : (
          <button onClick={() => setShowPay(true)} style={{ background: '#00d26a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Unlock Pro</button>
        )}
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Earn <span style={{ color: '#00d26a' }}>KES 500-5,000</span> Daily</h1>
        <p style={{ color: '#aaa' }}>Join 10,000+ Kenyans making money online</p>
        {!isPremium && (
          <button onClick={() => setShowPay(true)} style={{ background: '#00d26a', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>Start Earning Now →</button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '0 16px', marginBottom: '24px' }}>
        {['👥 10K+ Users', '💵 KES 2M+ Paid', '⭐ 4.8/5 Rating', '🛡️ 100% Secure'].map((s, i) => (
          <div key={i} style={{ background: '#12122a', padding: '16px', borderRadius: '12px', textAlign: 'center', fontSize: '13px' }}>
            <div style={{ fontWeight: 'bold', color: '#ffd700' }}>{s.split(' ')[0]}</div>
            <div style={{ color: '#888' }}>{s.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '24px' }}>
        {['hustles', 'deals', 'earnings'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: tab === t ? '#00d26a' : '#1a1a3e', color: tab === t ? '#fff' : '#aaa', fontWeight: 'bold', cursor: 'pointer' }}>
            {t === 'hustles' ? '💼 Hustles' : t === 'deals' ? '🎯 Deals' : '💰 Earnings'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 40px' }}>
        {tab === 'hustles' && hustles.map(h => (
          <div key={h.id} style={{ background: '#12122a', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #1a1a3e', position: 'relative' }}>
            {!h.free && !isPremium && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,26,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', gap: '12px' }}>
                <div style={{ fontSize: '40px' }}>🔒</div>
                <b style={{ color: '#ffd700' }}>Pro Feature</b>
                <button onClick={() => setShowPay(true)} style={{ background: '#ffd700', color: '#1a1a2e', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Unlock Now</button>
              </div>
            )}
            <h3>{h.title}</h3>
            <p style={{ color: '#00d26a', fontWeight: 'bold' }}>{h.pay}</p>
            {(h.free || isPremium) && <button style={{ background: '#00d26a', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>Start Earning →</button>}
          </div>
        ))}

        {tab === 'deals' && !isPremium && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#12122a', borderRadius: '16px' }}>
            <div style={{ fontSize: '60px' }}>🎯</div>
            <h2>Premium Deals Locked</h2>
            <p style={{ color: '#aaa' }}>Get exclusive high-paying deals from verified partners.</p>
            <button onClick={() => setShowPay(true)} style={{ background: '#ffd700', color: '#1a1a2e', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>Unlock Deals for KES 100</button>
          </div>
        )}

        {tab === 'earnings' && (
          <div>
            <div style={{ background: '#12122a', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
              <h2>💰 Total Earnings</h2>
              <p style={{ fontSize: '40px', fontWeight: 'bold', color: '#00d26a' }}>KES 0</p>
            </div>
            <p style={{ textAlign: 'center', color: '#888' }}>Complete hustles to see earnings here!</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={() => setShowPay(false)}>
          <div style={{ background: '#12122a', borderRadius: '20px', padding: '28px', maxWidth: '420px', width: '100%', border: '1px solid #1a1a3e' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPay(false)} style={{ float: 'right', background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>×</button>

            {payStatus === 'idle' && (
              <>
                <h2 style={{ textAlign: 'center', color: '#ffd700', marginBottom: '8px' }}>Unlock HustleHub Pro</h2>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ textDecoration: 'line-through', color: '#888' }}>KES 500</span>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#00d26a', margin: '0 12px' }}>KES 100</span>
                  <span style={{ background: '#ff4757', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>80% OFF</span>
                </div>
                <input type="tel" placeholder="Enter M-Pesa number" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #1a1a3e', background: '#0a0a1a', color: '#fff', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }} />
                <button onClick={handlePay} style={{ width: '100%', padding: '18px', borderRadius: '12px', border: 'none', background: '#00d26a', color: '#fff', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }}>🔒 Pay with M-Pesa & Unlock</button>
              </>
            )}

            {payStatus === 'sending' && <div style={{ textAlign: 'center', padding: '40px' }}><div style={{ width: '48px', height: '48px', border: '4px solid #1a1a3e', borderTop: '4px solid #00d26a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div><p>Connecting to M-Pesa...</p></div>}

            {payStatus === 'waiting' && <div style={{ textAlign: 'center', padding: '40px' }}><div style={{ width: '48px', height: '48px', border: '4px solid #1a1a3e', borderTop: '4px solid #00d26a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div><p>Check your phone! Enter M-Pesa PIN.</p></div>}

            {payStatus === 'success' && <div style={{ textAlign: 'center', padding: '40px' }}><div style={{ fontSize: '64px' }}>🎉</div><h2 style={{ color: '#00d26a' }}>Welcome to Pro!</h2><button onClick={() => setShowPay(false)} style={{ background: '#ffd700', color: '#1a1a2e', border: 'none', padding: '16px 32px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>Start Earning Now →</button></div>}

            {payStatus === 'failed' && <div style={{ textAlign: 'center', padding: '40px' }}><div style={{ fontSize: '48px' }}>😕</div><h2 style={{ color: '#ff4757' }}>Payment Failed</h2><button onClick={() => setPayStatus('idle')} style={{ background: 'transparent', border: '2px solid #ff4757', color: '#ff4757', padding: '14px 32px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>Try Again</button></div>}
          </div>
        </div>
      )}
    </div>
  );
}
