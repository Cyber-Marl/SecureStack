import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import './AnalyticsDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New section tabs: 'analytics' | 'affiliates'
  const [activeSection, setActiveSection] = useState('analytics');
  const [affiliatesData, setAffiliatesData] = useState(null);
  const [loadingAffiliates, setLoadingAffiliates] = useState(false);
  const [editingRewards, setEditingRewards] = useState({}); // leadId -> rewardVal



  // Check if already authenticated in this session
  useEffect(() => {
    const authStatus = localStorage.getItem('securestack_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeSection === 'affiliates') {
      fetchAffiliateData();
    }
  }, [isAuthenticated, activeSection]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Use robust passcode lock.
    if (password === 'securestack2026' || password === 'admin123') {
      localStorage.setItem('securestack_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(false);
      setPassword('');
      fetchDashboardData();
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 600); // Shaking animation duration
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/analytics/dashboard/`);
      setData(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Unable to fetch live analytics data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliateData = async () => {
    setLoadingAffiliates(true);
    try {
      const response = await axios.get(`${API_URL}/affiliate/admin/stats/`);
      setAffiliatesData(response.data);
      // Pre-fill editing reward values
      const rewardsMap = {};
      response.data.leads.forEach(l => {
        rewardsMap[l.id] = l.reward_amount;
      });
      setEditingRewards(rewardsMap);
    } catch (err) {
      console.error('Failed to fetch affiliate data:', err);
    } finally {
      setLoadingAffiliates(false);
    }
  };

  const handleUpdateLeadField = async (leadId, fields) => {
    try {
      await axios.post(`${API_URL}/affiliate/admin/update-lead/`, {
        lead_id: leadId,
        ...fields
      });
      fetchAffiliateData(); // Refresh list
    } catch (err) {
      console.error('Failed to update lead:', err);
      alert('Failed to update lead. Please try again.');
    }
  };

  const handleRewardValChange = (leadId, val) => {
    setEditingRewards(prev => ({
      ...prev,
      [leadId]: val
    }));
  };

  const handleSaveReward = (leadId) => {
    const amount = editingRewards[leadId];
    handleUpdateLeadField(leadId, { reward_amount: amount });
    alert(`Reward amount updated successfully.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('securestack_admin_auth');
    setIsAuthenticated(false);
    setData(null);
    setAffiliatesData(null);
  };

  // Render password lock screen
  if (!isAuthenticated) {
    return (
      <main className="analytics-lock-container">
        <SEO title="Console Authorization" description="Authorized personnel administrative dashboard lock screen." path="/admin/dashboard" />
        <div className="analytics-lock-bg-blobs">
          <div className="lock-blob blob-1"></div>
          <div className="lock-blob blob-2"></div>
        </div>
        <div className={`analytics-lock-card ${loginError ? 'shake' : ''}`}>
          <div className="analytics-lock-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Console Authorization</h2>
          <p>Provide administrative passcode to access SecureStack's privacy-first analytics terminal.</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="lock-input-group">
              <input
                type="password"
                placeholder="Enter Access Key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <span className="input-glow-line"></span>
            </div>
            {loginError && <p className="lock-error-msg">Invalid passcode. Please try again.</p>}
            <button type="submit" className="btn btn-primary lock-submit-btn">
              Authenticate Console
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="analytics-dashboard-root">
      <SEO title="Analytics Terminal" description="Privacy-first B2B traffic monitoring console." path="/admin/dashboard" />
      <div className="dashboard-container">
        
        {/* Header Block */}
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-badge">
              <span className="badge-pulse"></span>
              LIVE DATA STREAM
            </div>
            <h1>SecureStack Analytics Terminal</h1>
            <p className="db-subtitle">Privacy-First, cookie-less daily traffic insights without tracking cookies.</p>
            
            {/* Tabs Navigation */}
            <div className="admin-db-tabs" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button 
                onClick={() => setActiveSection('analytics')}
                className={`btn ${activeSection === 'analytics' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                📊 Traffic Analytics
              </button>
              <button 
                onClick={() => setActiveSection('affiliates')}
                className={`btn ${activeSection === 'affiliates' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                🤝 Affiliate Program
              </button>
            </div>
          </div>
          
          <div className="db-header-right">
            <button 
              className="btn btn-outline db-refresh-btn" 
              onClick={activeSection === 'analytics' ? fetchDashboardData : fetchAffiliateData} 
              disabled={loading || loadingAffiliates}
            >
              {loading || loadingAffiliates ? (
                <span className="spinner"></span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              )}
              Refresh Terminal
            </button>
            <button className="btn btn-outline db-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="db-error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── SECTION 1: TRAFFIC ANALYTICS ── */}
        {activeSection === 'analytics' && data && typeof data === 'object' && data.summary && (
          <>
            <section className="db-summary-grid">
              <div className="db-stat-card">
                <div className="stat-icon orange-glow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Total Page Hits</span>
                  <h2 className="stat-value">{data.summary.total_views}</h2>
                </div>
              </div>

              <div className="db-stat-card">
                <div className="stat-icon blue-glow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">All-time Visitors (Uniques)</span>
                  <h2 className="stat-value">{data.summary.unique_visitors}</h2>
                </div>
              </div>

              <div className="db-stat-card">
                <div className="stat-icon orange-glow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Today's Page Views</span>
                  <h2 className="stat-value">{data.summary.today_views}</h2>
                </div>
              </div>

              <div className="db-stat-card">
                <div className="stat-icon blue-glow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Today's Active Users (DAU)</span>
                  <h2 className="stat-value">{data.summary.today_uniques}</h2>
                </div>
              </div>
            </section>

            <div className="db-main-grid">
              <div className="db-panel card">
                <h3>Most Visited Routes</h3>
                <p className="panel-desc">Top application views logged during this period.</p>
                <div className="panel-list">
                  {data.popular_paths.length === 0 ? (
                    <div className="empty-state">No recorded page routes yet.</div>
                  ) : (
                    data.popular_paths.map((p, idx) => {
                      const totalHits = Math.max(...data.popular_paths.map(item => item.count));
                      const percentage = totalHits > 0 ? (p.count / totalHits) * 100 : 0;
                      return (
                        <div key={idx} className="panel-list-item bar-item">
                          <div className="bar-info">
                            <span className="route-name">{p.path}</span>
                            <span className="route-count">{p.count} hits</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill orange-bg" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="db-panel card">
                <h3>Top Referral Channels</h3>
                <p className="panel-desc">Where your high-value prospective clients arrive from.</p>
                <div className="panel-list">
                  {data.top_referrers.length === 0 ? (
                    <div className="empty-state">No referral logs available.</div>
                  ) : (
                    data.top_referrers.map((r, idx) => {
                      const totalHits = Math.max(...data.top_referrers.map(item => item.count));
                      const percentage = totalHits > 0 ? (r.count / totalHits) * 100 : 0;
                      return (
                        <div key={idx} className="panel-list-item bar-item">
                          <div className="bar-info">
                            <span className="route-name">{r.referrer}</span>
                            <span className="route-count">{r.count} sessions</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill blue-bg" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="db-bottom-grid">
              <div className="db-panel card history-panel">
                <h3>Daily Visitor Trend (Last 7 Days)</h3>
                <p className="panel-desc">Aggregated session volumes and unique users daily.</p>
                <div className="history-table-wrapper">
                  {data.history.length === 0 ? (
                    <div className="empty-state">No historical records in the last 7 days.</div>
                  ) : (
                    <table className="db-history-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Total Pageviews</th>
                          <th>Unique Visitors</th>
                          <th>Average Load Ratio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.history.map((h, idx) => (
                          <tr key={idx}>
                            <td>{h.date}</td>
                            <td className="table-highlight">{h.views}</td>
                            <td>{h.uniques}</td>
                            <td>
                              <span className="ratio-tag">
                                {h.uniques > 0 ? (h.views / h.uniques).toFixed(1) : 0}x
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="db-panel card terminal-panel">
                <h3>Activity Stream</h3>
                <p className="panel-desc">Real-time live traffic ping feed from local routes.</p>
                <div className="terminal-shell">
                  <div className="shell-header">
                    <span className="shell-dot red"></span>
                    <span className="shell-dot yellow"></span>
                    <span className="shell-dot green"></span>
                    <span className="shell-title">securestack-shell --logs</span>
                  </div>
                  <div className="shell-body">
                    {data.recent_views.length === 0 ? (
                      <div className="shell-line comment"># Waiting for incoming traffic connections...</div>
                    ) : (
                      data.recent_views.map((v, idx) => (
                        <div key={idx} className="shell-line">
                          <span className="shell-time">[{v.timestamp.split(' ')[1]}]</span>{' '}
                          <span className="shell-action">GET</span>{' '}
                          <span className="shell-path">{v.path}</span>{' '}
                          <span className="shell-ref">via {v.referrer}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SECTION 2: AFFILIATE PROGRAM MANAGEMENT ── */}
        {activeSection === 'affiliates' && affiliatesData && (
          <div className="admin-affiliates-section" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Table 1: Registered Partners */}
            <div className="db-panel card" style={{ padding: '32px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px' }}>Registered Partners</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Overview of all registered affiliates and their conversion scores.</p>
              </div>
              <div className="table-responsive">
                <table className="db-history-table">
                  <thead>
                    <tr>
                      <th>Name / Email</th>
                      <th>Referral Code</th>
                      <th>Phone / Payout No.</th>
                      <th>Clicks</th>
                      <th>Enquiries</th>
                      <th>Conversions</th>
                      <th>Unpaid Rewards</th>
                      <th>Paid Rewards</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliatesData.affiliates.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="empty-state">No registered affiliates yet.</td>
                      </tr>
                    ) : (
                      affiliatesData.affiliates.map((aff) => (
                        <tr key={aff.id}>
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{aff.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{aff.email}</div>
                          </td>
                          <td><span className="ratio-tag" style={{ fontSize: '13px', background: 'rgba(254,145,76,0.1)', color: 'var(--orange)' }}>{aff.code}</span></td>
                          <td>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-heading)' }}>{aff.phone || '—'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{aff.payment_method || ''}</div>
                          </td>
                          <td>{aff.clicks}</td>
                          <td>{aff.leads}</td>
                          <td>{aff.converted}</td>
                          <td style={{ fontWeight: '600' }}>${parseFloat(aff.unpaid_rewards).toFixed(2)}</td>
                          <td style={{ color: 'var(--blue-l)', fontWeight: '600' }}>${parseFloat(aff.paid_rewards).toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${aff.is_active ? 'status-converted' : 'status-rejected'}`}>
                              {aff.is_active ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Referred Leads Pipeline */}
            <div className="db-panel card" style={{ padding: '32px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px' }}>Referred Lead Pipeline</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Attributed customer enquiries. Modify deal outcomes and assign payout rewards.</p>
              </div>
              <div className="table-responsive">
                <table className="db-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client Info</th>
                      <th>Referrer</th>
                      <th>Service</th>
                      <th>Deal Status</th>
                      <th>Reward Comm. ($)</th>
                      <th>Payout Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliatesData.leads.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">No referred enquiries recorded yet.</td>
                      </tr>
                    ) : (
                      affiliatesData.leads.map((lead) => (
                        <tr key={lead.id}>
                          <td style={{ fontSize: '12px' }}>{lead.created_at.split(' ')[0]}</td>
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{lead.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{lead.email}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '13px' }}>{lead.referred_by_name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--orange)' }}>code: {lead.referred_by_code}</div>
                          </td>
                          <td>
                            <span className="ratio-tag" style={{ whiteSpace: 'nowrap' }}>{lead.service || 'Enquiry'}</span>
                          </td>
                          <td>
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadField(lead.id, { status: e.target.value })}
                              style={{
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--border)',
                                color: 'var(--text)',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="pending">🟡 Pending enquiry</option>
                              <option value="converted">🟢 Converted (Won)</option>
                              <option value="rejected">🔴 Rejected / Invalid</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span style={{ fontSize: '14px', color: 'var(--text-3)' }}>$</span>
                              <input
                                type="number"
                                value={editingRewards[lead.id] !== undefined ? editingRewards[lead.id] : lead.reward_amount}
                                onChange={(e) => handleRewardValChange(lead.id, e.target.value)}
                                style={{
                                  width: '80px',
                                  background: 'rgba(0,0,0,0.3)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text)',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  textAlign: 'right',
                                  outline: 'none'
                                }}
                              />
                              <button 
                                onClick={() => handleSaveReward(lead.id)}
                                style={{
                                  background: 'var(--orange)',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </td>
                          <td>
                            {lead.status === 'converted' ? (
                              <select
                                value={lead.reward_status}
                                onChange={(e) => handleUpdateLeadField(lead.id, { reward_status: e.target.value })}
                                style={{
                                  background: 'rgba(0,0,0,0.3)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text)',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  outline: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="unpaid">⏳ Unpaid</option>
                                <option value="paid">✅ Paid</option>
                              </select>
                            ) : (
                              <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>N/A (Pending deal)</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        )}
        
      </div>
    </main>
  );
}
