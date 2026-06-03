/**
 * analyticsService.js
 * 
 * Provides client-side analytics logging and dashboard data.
 * Merges real local navigation history stored in localStorage with 
 * realistic B2B traffic data to make the admin console interactive and alive.
 */

// Helper to format dates like "YYYY-MM-DD"
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper to format timestamps like "YYYY-MM-DD HH:MM:SS"
const formatTimestamp = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

/**
 * Tracks page navigation locally in localStorage.
 * 
 * @param {string} path Page route (e.g., "/services")
 * @param {string} referrer Referral URL or "Direct"
 */
export function logPageView(path, referrer = 'Direct') {
  try {
    // 1. Get existing local views list
    const rawViews = localStorage.getItem('securestack_local_views');
    const localViews = rawViews ? JSON.parse(rawViews) : [];

    // 2. Append new view
    const now = new Date();
    const newView = {
      path,
      referrer: referrer || 'Direct',
      timestamp: formatTimestamp(now),
      date: formatDate(now),
      isUnique: false
    };

    // 3. Simple unique visitor tracking based on sessionStorage
    const sessionKey = 'securestack_session_active';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      newView.isUnique = true;
    }

    localViews.unshift(newView); // Keep newest at the top
    
    // Cap local history at 100 entries to prevent localStorage bloat
    localStorage.setItem('securestack_local_views', JSON.stringify(localViews.slice(0, 100)));
    console.log('[AnalyticsService] Logged pageview:', path, `(Ref: ${newView.referrer})`);
  } catch (err) {
    console.error('[AnalyticsService] Error logging pageview:', err);
  }
}

/**
 * Generates and compiles dashboard metrics.
 * Combines localStorage logs with pre-seeded data for presentation.
 * 
 * @returns {Object} Dashboard metrics object matching expected Django schema
 */
export function getDashboardData() {
  try {
    // 1. Fetch real local views logged by this user
    const rawViews = localStorage.getItem('securestack_local_views');
    const realViews = rawViews ? JSON.parse(rawViews) : [];

    // 2. Define base mock statistics
    const baseTotalViews = 842;
    const baseUniques = 265;
    const baseTodayViews = 38;
    const baseTodayUniques = 14;

    // Calculate dynamic updates from user session
    const realCount = realViews.length;
    const realUniquesCount = realViews.filter(v => v.isUnique).length;
    
    const today = formatDate(new Date());
    const realTodayCount = realViews.filter(v => v.date === today).length;
    const realTodayUniquesCount = realViews.filter(v => v.date === today && v.isUnique).length;

    // 3. Compile Summary stats
    const summary = {
      total_views: baseTotalViews + realCount,
      unique_visitors: baseUniques + (realUniquesCount || 1), // Always at least 1 for the current user
      today_views: baseTodayViews + realTodayCount,
      today_uniques: baseTodayUniques + (realTodayUniquesCount || 1)
    };

    // 4. Compile popular paths (base stats + real logs)
    const basePaths = {
      '/': 345,
      '/services': 190,
      '/security-compliance': 152,
      '/contact': 85,
      '/industries': 48,
      '/front-end-development': 18,
      '/back-end-development-services': 12
    };

    // Add user's real views
    realViews.forEach(v => {
      basePaths[v.path] = (basePaths[v.path] || 0) + 1;
    });

    const popular_paths = Object.entries(basePaths)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    // 5. Compile top referrers
    const baseReferrers = {
      'Direct': 390,
      'google.com': 225,
      'linkedin.com': 148,
      'github.com': 45,
      't.co': 34 // Twitter/X shortener
    };

    realViews.forEach(v => {
      // Clean up referrer for stats mapping
      let refKey = v.referrer;
      if (refKey.includes('localhost') || refKey.includes('securestack.co.zw')) {
        refKey = 'Direct';
      }
      baseReferrers[refKey] = (baseReferrers[refKey] || 0) + 1;
    });

    const top_referrers = Object.entries(baseReferrers)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count);

    // 6. Assemble recent views (merge user logs with B2B pings)
    const mockPings = [
      { path: '/services', referrer: 'google.com', timestamp: '2026-06-03 17:34:12' },
      { path: '/', referrer: 'linkedin.com', timestamp: '2026-06-03 17:32:05' },
      { path: '/security-compliance', referrer: 'Direct', timestamp: '2026-06-03 17:30:58' },
      { path: '/contact', referrer: 'linkedin.com', timestamp: '2026-06-03 17:28:44' },
      { path: '/services', referrer: 'google.com', timestamp: '2026-06-03 17:15:10' }
    ];

    // Align mock pings timestamps around the current system time to make them look recent
    const now = new Date();
    const mockPingsRecent = mockPings.map((ping, index) => {
      const minutesOffset = (index + 1) * 3 + 2;
      const pingTime = new Date(now.getTime() - minutesOffset * 60 * 1000);
      return {
        ...ping,
        timestamp: formatTimestamp(pingTime)
      };
    });

    // Put real views at the top, followed by mock views
    const recent_views = [...realViews, ...mockPingsRecent].slice(0, 15);

    // 7. Compile 7-day history trend
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);

      // Base random-looking but stable numbers
      let views = 90 + Math.floor(Math.sin(d.getDate()) * 30) + (d.getDay() % 2 === 0 ? 15 : 0);
      let uniques = Math.floor(views * 0.35) + Math.floor(Math.cos(d.getDate()) * 5);

      // If it's today, add the current user's real views
      if (dateStr === today) {
        views += realTodayCount;
        uniques += realTodayUniquesCount;
      }

      // Format date label (e.g. "Jun 03" or standard ISO depending on preference)
      // Dashboard code displays `h.date`, let's match the date format of the locale
      const options = { month: 'short', day: '2-digit' };
      const formattedDateLabel = d.toLocaleDateString('en-US', options);

      history.push({
        date: formattedDateLabel,
        views,
        uniques
      });
    }

    return {
      summary,
      popular_paths,
      top_referrers,
      recent_views,
      history
    };
  } catch (err) {
    console.error('[AnalyticsService] Error reading dashboard data:', err);
    return null;
  }
}
