import { useState, useEffect } from 'react';
import axios from 'axios';
import './AffiliatePortal.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export default function AffiliatePortal() {
  const [token, setToken] = useState(localStorage.getItem('securestack_affiliate_token') || '');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  
  // Tab control
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login'
  
  // Auth Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPayMethod, setRegPayMethod] = useState('EcoCash');
  const [regPayDetails, setRegPayDetails] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Settings Form State
  const [payMethod, setPayMethod] = useState('');
  const [payDetails, setPayDetails] = useState('');
  const [phone, setPhone] = useState('');
  
  // Notification / Alert Message
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch Stats when authenticated
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/affiliate/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.affiliate);
      setStats(response.data.stats);
      setLeads(response.data.referred_leads);
      setPayMethod(response.data.affiliate.payment_method);
      setPayDetails(response.data.affiliate.payment_details);
      setPhone(response.data.affiliate.phone || '');
      setErrorMsg('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      // If unauthorized, clear token
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        setErrorMsg('Error loading dashboard statistics.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await axios.post(`${API_URL}/affiliate/register/`, {
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        payment_method: regPayMethod,
        payment_details: regPayDetails
      });
      setSuccessMsg('Account created successfully! Please log in to view your dashboard.');
      setActiveTab('login');
      setLoginEmail(regEmail);
      // Clear registration inputs
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegPayDetails('');
      setRegPhone('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Registration failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await axios.post(`${API_URL}/affiliate/login/`, {
        email: loginEmail,
        password: loginPassword
      });
      const userToken = response.data.token;
      localStorage.setItem('securestack_affiliate_token', userToken);
      setToken(userToken);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Invalid email or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('securestack_affiliate_token');
    setToken('');
    setUser(null);
    setStats(null);
    setLeads([]);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const token = localStorage.getItem('securestack_affiliate_token');
    if (!phone) {
      setErrorMsg('Please enter a phone/mobile number for your payout.');
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/affiliate/update-profile/`,
        { phone, payment_method: payMethod, payment_details: payDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg(response.data.detail || 'Payout details saved!');
      // Update local user state
      setPhone(response.data.phone || phone);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to save. Please try again.');
    }
  };

  const copyReferralLink = () => {
    if (!user) return;
    const link = `${window.location.origin}?ref=${user.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Render Dashboard ──
  if (token && user && stats) {
    return (
      <div className="affiliate-dashboard-container">
        <header className="page-hero">
          <div className="container">
            <div className="hero-flex">
              <div>
                <span className="tag">Affiliate Portal</span>
                <h1 className="section-title">Welcome Back, <span className="gradient-text">{user.name}</span></h1>
                <p className="section-subtitle">Track your referred leads, monitor click metrics, and manage your commission earnings in real-time.</p>
              </div>
              <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </header>

        <section className="section-sm">
          <div className="container">
            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            {/* Referral Link Card */}
            <div className="card referral-link-card">
              <div className="card-info">
                <h3>Your Unique Referral Link</h3>
                <p>Share this link on your website, blog, social media, or directly with clients. Any enquiry submitted via this link will automatically credit your account.</p>
              </div>
              <div className="link-copy-container">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}?ref=${user.code}`} 
                  className="link-input"
                />
                <button 
                  onClick={copyReferralLink} 
                  className={`btn ${copied ? 'btn-blue' : 'btn-primary'}`}
                >
                  {copied ? 'Copied! ✓' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid-4 stats-grid">
              <div className="card stat-card">
                <div className="icon-box">🖱</div>
                <div className="stat-content">
                  <span className="stat-label">Total Clicks</span>
                  <span className="stat-val">{stats.clicks}</span>
                </div>
              </div>
              <div className="card stat-card">
                <div className="icon-box blue">📩</div>
                <div className="stat-content">
                  <span className="stat-label">Enquiries Referred</span>
                  <span className="stat-val">{stats.leads}</span>
                </div>
              </div>
              <div className="card stat-card">
                <div className="icon-box">🏆</div>
                <div className="stat-content">
                  <span className="stat-label">Conversions</span>
                  <span className="stat-val">{stats.converted}</span>
                </div>
              </div>
              <div className="card stat-card">
                <div className="icon-box blue">💵</div>
                <div className="stat-content">
                  <span className="stat-label">Total Earnings</span>
                  <span className="stat-val">${parseFloat(stats.total_earnings).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Split layout: Referred Leads & Payment Settings */}
            <div className="dashboard-grid-main">
              {/* Referred Leads list */}
              <div className="card leads-table-card">
                <h3>Your Referral Log</h3>
                <p className="card-subtitle">Real-time status updates on clients referred by you.</p>
                {leads.length === 0 ? (
                  <div className="empty-state">
                    <p>No referrals recorded yet. Share your link to start generating commissions!</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="leads-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Lead Name</th>
                          <th>Service Inquired</th>
                          <th>Deal Status</th>
                          <th>Reward</th>
                          <th>Payout Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id}>
                            <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                            <td className="lead-name">{lead.name}</td>
                            <td><span className="service-badge">{lead.service || 'General Inquiries'}</span></td>
                            <td>
                              <span className={`status-badge status-${lead.status}`}>
                                {lead.status === 'pending' && 'Enquiry Pending'}
                                {lead.status === 'converted' && 'Project Won'}
                                {lead.status === 'rejected' && 'Unqualified'}
                              </span>
                            </td>
                            <td className="reward-val">${parseFloat(lead.reward_amount).toFixed(2)}</td>
                            <td>
                              {lead.status === 'converted' ? (
                                <span className={`payout-badge payout-${lead.reward_status}`}>
                                  {lead.reward_status === 'paid' ? 'Paid' : 'Pending'}
                                </span>
                              ) : (
                                <span className="payout-badge payout-na">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Payment Settings Card */}
              <div className="card payment-settings-card">
                <h3>Payout Details</h3>
                <p className="card-subtitle">Specify how you'd like to receive your commissions.</p>
                <form onSubmit={handleUpdatePayment} className="payment-form">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select 
                      value={payMethod} 
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="form-control"
                    >
                      <option value="EcoCash">EcoCash</option>
                      <option value="InnBucks">InnBucks</option>
                      <option value="OneMoney">OneMoney</option>
                      <option value="ZIPIT / Bank Transfer">ZIPIT / Bank Transfer</option>
                      <option value="Mukuru">Mukuru</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      {['EcoCash','InnBucks','OneMoney','Mukuru'].includes(payMethod)
                        ? '📱 Mobile Number (for e-wallet)'
                        : 'Account / Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={
                        ['EcoCash','InnBucks','OneMoney','Mukuru'].includes(payMethod)
                          ? 'e.g. 0771234567 or +263771234567'
                          : 'Phone number or account number'
                      }
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      {payMethod === 'ZIPIT / Bank Transfer' ? 'Bank Name & Account Details' 
                        : payMethod === 'PayPal' ? 'PayPal Email Address'
                        : 'Additional Details (optional)'}
                    </label>
                    <textarea 
                      rows="2" 
                      value={payDetails} 
                      onChange={(e) => setPayDetails(e.target.value)}
                      placeholder={
                        payMethod === 'ZIPIT / Bank Transfer' ? 'Bank name, branch, account number...'
                        : payMethod === 'PayPal' ? 'e.g. yourname@paypal.com'
                        : 'Any additional payout info...'
                      }
                      className="form-control"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Save Payout Method</button>
                </form>

                <div className="commission-info-notice">
                  <h4>💡 Commission Structure</h4>
                  <p>Commissions are <strong>10%</strong> of the initial contract value for any successful cybersecurity or software development deal closed within 90 days of referral click.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Render Registration / Login Landing Page ──
  return (
    <div className="affiliate-portal-landing">
      <header className="page-hero">
        <div className="container text-center">
          <span className="tag">Earn with SecureStack</span>
          <h1 className="section-title">SecureStack <span className="gradient-text">Partner & Affiliate Program</span></h1>
          <p className="section-subtitle">
            Introduce enterprise clients to our cybersecurity testing, compliance advisory, and premium software development services and earn up to <strong>10% commission</strong> per deal.
          </p>
        </div>
      </header>

      <section className="section-sm">
        <div className="container">
          <div className="portal-landing-grid">
            
            {/* Left side: Program Information */}
            <div className="program-features">
              <h2>Why partner with SecureStack?</h2>
              <p>We build premium web application architectures and run deep penetration testing. When you refer clients in need of enterprise-grade security and software, you connect them with elite engineers, and we reward you generously.</p>
              
              <div className="feature-item">
                <div className="feature-icon">💸</div>
                <div className="feature-text">
                  <h4>High Commissions</h4>
                  <p>Earn 10% commission on the primary deal value. High contract sizes mean your payout per client can range from $250 to over $3,000.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <div className="feature-text">
                  <h4>Full Transparency</h4>
                  <p>Log into your personal dashboard to track in real-time when referred clients submit forms, request quotes, and sign contracts.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <h4>90-Day Cookie Window</h4>
                  <p>Once a client visits through your link, you receive credit for any project they purchase with us within 90 days.</p>
                </div>
              </div>
            </div>

            {/* Right side: Auth Cards (Register / Login toggler) */}
            <div className="portal-auth-card card">
              <div className="auth-tabs">
                <button 
                  className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                >
                  Join Program
                </button>
                <button 
                  className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                >
                  Log In
                </button>
              </div>

              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

              {activeTab === 'register' ? (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="John Doe" 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="john@example.com" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="grid-2-sm">
                    <div className="form-group">
                      <label>Payout Option</label>
                      <select 
                        className="form-control"
                        value={regPayMethod}
                        onChange={(e) => setRegPayMethod(e.target.value)}
                      >
                        <option value="EcoCash">EcoCash</option>
                        <option value="InnBucks">InnBucks</option>
                        <option value="OneMoney">OneMoney</option>
                        <option value="ZIPIT / Bank Transfer">ZIPIT / Bank Transfer</option>
                        <option value="Mukuru">Mukuru</option>
                        <option value="PayPal">PayPal</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        {['EcoCash','InnBucks','OneMoney','Mukuru'].includes(regPayMethod)
                          ? '📱 Mobile Number'
                          : 'Account Number'}
                      </label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder={
                          ['EcoCash','InnBucks','OneMoney','Mukuru'].includes(regPayMethod)
                            ? 'e.g. 0771234567'
                            : 'Account or PayPal email'
                        }
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {regPayMethod === 'ZIPIT / Bank Transfer' && (
                    <div className="form-group">
                      <label>Bank Name &amp; Account Details</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Bank name, branch, account number"
                        value={regPayDetails}
                        onChange={(e) => setRegPayDetails(e.target.value)}
                      />
                    </div>
                  )}
                  {regPayMethod === 'PayPal' && (
                    <div className="form-group">
                      <label>PayPal Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="e.g. yourname@paypal.com"
                        value={regPayDetails}
                        onChange={(e) => setRegPayDetails(e.target.value)}
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-block">Create Partner Account</button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-group">
                    <label>Registered Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="john@example.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Access Dashboard</button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
