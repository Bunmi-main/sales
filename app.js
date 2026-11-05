/**
 * SalesPulse Analytics - Core Application Engine
 * Vanilla JavaScript (Zero External Frameworks, WebStorage for persistence)
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'salespulse_analytics_records_v1';
  const QUARTERLY_GOAL = 250000;
  const ITEMS_PER_PAGE = 8;

  // --- State ---
  let transactions = [];
  let currentFilterRange = '30days';
  let searchQuery = '';
  let categoryFilter = '';
  let statusFilter = '';
  let regionFilter = '';
  let sortField = 'date';
  let sortDirection = 'desc'; // 'asc' or 'desc'
  let currentPage = 1;
  let activeTimelineMetric = 'revenue'; // 'revenue' or 'orders'

  // Chart instances
  let timelineChartInstance = null;
  let donutChartInstance = null;
  let regionalChartInstance = null;

  // Category Color Palette (Explicit Hex)
  const categoryColors = {
    'Enterprise Software': '#4f46e5',   // Indigo
    'Hardware & Tech': '#06b6d4',       // Cyan
    'Consulting Services': '#10b981',   // Emerald
    'Cloud Infrastructure': '#f59e0b', // Amber
    'Support & SLA': '#8b5cf6'          // Violet
  };

  // --- Default Seed Dataset ---
  const INITIAL_SEED_DATA = [
    {
      id: "TX-1001",
      date: "2026-11-04",
      customer: "Cyberdyne Systems",
      email: "procurement@cyberdyne.io",
      product: "Enterprise Security Suite",
      category: "Enterprise Software",
      amount: 14500,
      quantity: 1,
      region: "North America",
      salesRep: "Marcus Vance",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1002",
      date: "2026-11-03",
      customer: "Acrobatics Studio",
      email: "finance@acrobatics.de",
      product: "Cloud Storage 50TB Cluster",
      category: "Cloud Infrastructure",
      amount: 8200,
      quantity: 2,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Credit Card",
      status: "Completed"
    },
    {
      id: "TX-1003",
      date: "2026-11-03",
      customer: "Nexus Pacific Ltd",
      email: "contact@nexus.sg",
      product: "Architecture Transformation",
      category: "Consulting Services",
      amount: 19800,
      quantity: 1,
      region: "Asia Pacific",
      salesRep: "David Chen",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1004",
      date: "2026-11-02",
      customer: "Vanguard Logistics",
      email: "accounts@vanguard.com",
      product: "Fleet Management Node Hub",
      category: "Hardware & Tech",
      amount: 6750,
      quantity: 5,
      region: "North America",
      salesRep: "Sarah Jenkins",
      paymentMethod: "Corporate PO",
      status: "Completed"
    },
    {
      id: "TX-1005",
      date: "2026-11-01",
      customer: "Sahara Energy Corp",
      email: "info@saharaenergy.ae",
      product: "Annual Mission Critical SLA",
      category: "Support & SLA",
      amount: 12000,
      quantity: 1,
      region: "Middle East",
      salesRep: "Amara Okafor",
      paymentMethod: "Wire Transfer",
      status: "Pending"
    },
    {
      id: "TX-1006",
      date: "2026-10-31",
      customer: "Nordic Fintech AB",
      email: "ops@nordicfin.se",
      product: "API Gateway Enterprise",
      category: "Enterprise Software",
      amount: 9400,
      quantity: 1,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Stripe Online",
      status: "Completed"
    },
    {
      id: "TX-1007",
      date: "2026-10-30",
      customer: "Rio Mineral Minerals",
      email: "sales@riominerals.br",
      product: "Infrastructure Audit",
      category: "Consulting Services",
      amount: 7500,
      quantity: 1,
      region: "Latin America",
      salesRep: "Marcus Vance",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1008",
      date: "2026-10-29",
      customer: "Apex Media Labs",
      email: "support@apexlabs.com",
      product: "Workstation Cluster X8",
      category: "Hardware & Tech",
      amount: 15400,
      quantity: 2,
      region: "North America",
      salesRep: "Sarah Jenkins",
      paymentMethod: "Credit Card",
      status: "Completed"
    },
    {
      id: "TX-1009",
      date: "2026-10-28",
      customer: "BioGen Innovations",
      email: "admin@biogen.jp",
      product: "High Availability Compute",
      category: "Cloud Infrastructure",
      amount: 11200,
      quantity: 1,
      region: "Asia Pacific",
      salesRep: "David Chen",
      paymentMethod: "Corporate PO",
      status: "Completed"
    },
    {
      id: "TX-1010",
      date: "2026-10-27",
      customer: "Kalahari Solar Tech",
      email: "procure@kalaharisolar.za",
      product: "Quarterly Systems Support",
      category: "Support & SLA",
      amount: 3200,
      quantity: 1,
      region: "Middle East",
      salesRep: "Amara Okafor",
      paymentMethod: "Credit Card",
      status: "Refunded"
    },
    {
      id: "TX-1011",
      date: "2026-10-26",
      customer: "Starlight Digital",
      email: "billing@starlight.co.uk",
      product: "Single Sign-On SSO Engine",
      category: "Enterprise Software",
      amount: 8800,
      quantity: 1,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Stripe Online",
      status: "Completed"
    },
    {
      id: "TX-1012",
      date: "2026-10-24",
      customer: "Pacific Rim Robotics",
      email: "purchasing@pacrimbot.com",
      product: "Industrial Controller Units",
      category: "Hardware & Tech",
      amount: 18200,
      quantity: 6,
      region: "Asia Pacific",
      salesRep: "David Chen",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1013",
      date: "2026-10-22",
      customer: "OmniCorp Worldwide",
      email: "admin@omnicorp.us",
      product: "Business Strategy Engagement",
      category: "Consulting Services",
      amount: 14000,
      quantity: 1,
      region: "North America",
      salesRep: "Sarah Jenkins",
      paymentMethod: "Corporate PO",
      status: "Completed"
    },
    {
      id: "TX-1014",
      date: "2026-10-21",
      customer: "Terra Nova Biotech",
      email: "legal@terranova.cl",
      product: "Multi-Zone Kubernetes Stack",
      category: "Cloud Infrastructure",
      amount: 6900,
      quantity: 1,
      region: "Latin America",
      salesRep: "Marcus Vance",
      paymentMethod: "PayPal",
      status: "Pending"
    },
    {
      id: "TX-1015",
      date: "2026-10-19",
      customer: "Zephyr Automotive",
      email: "it@zephyrauto.de",
      product: "Real-time Telemetry Pipeline",
      category: "Enterprise Software",
      amount: 16500,
      quantity: 1,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1016",
      date: "2026-10-18",
      customer: "Delta Health Systems",
      email: "records@deltahealth.org",
      product: "HIPAA Cloud Vault Tier 1",
      category: "Cloud Infrastructure",
      amount: 13500,
      quantity: 1,
      region: "North America",
      salesRep: "Marcus Vance",
      paymentMethod: "Corporate PO",
      status: "Completed"
    },
    {
      id: "TX-1017",
      date: "2026-10-16",
      customer: "Mirage Hospitality",
      email: "finance@mirage.ae",
      product: "24/7 Priority Support Pass",
      category: "Support & SLA",
      amount: 4500,
      quantity: 1,
      region: "Middle East",
      salesRep: "Amara Okafor",
      paymentMethod: "Credit Card",
      status: "Completed"
    },
    {
      id: "TX-1018",
      date: "2026-10-14",
      customer: "Shinsei Telecom",
      email: "procure@shinsei.co.jp",
      product: "Optical Routing Gateway",
      category: "Hardware & Tech",
      amount: 22000,
      quantity: 4,
      region: "Asia Pacific",
      salesRep: "David Chen",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1019",
      date: "2026-10-12",
      customer: "Alpine Financial",
      email: "it-desk@alpine.ch",
      product: "Legacy Migration Consulting",
      category: "Consulting Services",
      amount: 15800,
      quantity: 1,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1020",
      date: "2026-10-10",
      customer: "Crestview Holdings",
      email: "accounts@crestview.com",
      product: "Analytics Dashboards Seat x50",
      category: "Enterprise Software",
      amount: 7200,
      quantity: 50,
      region: "North America",
      salesRep: "Sarah Jenkins",
      paymentMethod: "Credit Card",
      status: "Completed"
    },
    {
      id: "TX-1021",
      date: "2026-10-08",
      customer: "Amazonas Agro Tech",
      email: "contact@amazonasagro.br",
      product: "Edge Sensor Receiver Hub",
      category: "Hardware & Tech",
      amount: 5100,
      quantity: 3,
      region: "Latin America",
      salesRep: "Marcus Vance",
      paymentMethod: "PayPal",
      status: "Refunded"
    },
    {
      id: "TX-1022",
      date: "2026-10-06",
      customer: "Doha Smart Logistics",
      email: "supply@dohalogistics.qa",
      product: "Logistics Optimization AI",
      category: "Enterprise Software",
      amount: 18500,
      quantity: 1,
      region: "Middle East",
      salesRep: "Amara Okafor",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1023",
      date: "2026-10-04",
      customer: "Solaria Clean Energy",
      email: "orders@solaria.es",
      product: "Dedicated Cloud Pod",
      category: "Cloud Infrastructure",
      amount: 9800,
      quantity: 1,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Corporate PO",
      status: "Completed"
    },
    {
      id: "TX-1024",
      date: "2026-10-02",
      customer: "Blue Horizon Media",
      email: "payables@bluehorizon.com",
      product: "Custom Integration Sprint",
      category: "Consulting Services",
      amount: 11500,
      quantity: 1,
      region: "North America",
      salesRep: "Sarah Jenkins",
      paymentMethod: "Stripe Online",
      status: "Completed"
    },
    {
      id: "TX-1025",
      date: "2026-09-28",
      customer: "Tokyo Sensor Network",
      email: "proc@tokyosensors.jp",
      product: "IoT Edge Gateways Pro",
      category: "Hardware & Tech",
      amount: 12400,
      quantity: 8,
      region: "Asia Pacific",
      salesRep: "David Chen",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1026",
      date: "2026-09-24",
      customer: "Bavaria Engineering",
      email: "it@bavariaeng.de",
      product: "Enterprise Security Suite",
      category: "Enterprise Software",
      amount: 14500,
      quantity: 1,
      region: "Europe",
      salesRep: "Elena Rostova",
      paymentMethod: "Corporate PO",
      status: "Completed"
    },
    {
      id: "TX-1027",
      date: "2026-09-18",
      customer: "Andes Logistics Group",
      email: "facturacion@andeslg.pe",
      product: "Annual Mission Critical SLA",
      category: "Support & SLA",
      amount: 9500,
      quantity: 1,
      region: "Latin America",
      salesRep: "Marcus Vance",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1028",
      date: "2026-09-12",
      customer: "Manhattan Capital LLC",
      email: "deals@mcapital.nyc",
      product: "High Availability Compute",
      category: "Cloud Infrastructure",
      amount: 17300,
      quantity: 2,
      region: "North America",
      salesRep: "Sarah Jenkins",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1029",
      date: "2026-08-30",
      customer: "Red Sea Maritime Co",
      email: "admin@redseaship.sa",
      product: "Navigational Data Stream",
      category: "Enterprise Software",
      amount: 13200,
      quantity: 1,
      region: "Middle East",
      salesRep: "Amara Okafor",
      paymentMethod: "Wire Transfer",
      status: "Completed"
    },
    {
      id: "TX-1030",
      date: "2026-08-20",
      customer: "Seoul NextGen Games",
      email: "servers@nextgengames.kr",
      product: "Low Latency Cloud Zone",
      category: "Cloud Infrastructure",
      amount: 16400,
      quantity: 1,
      region: "Asia Pacific",
      salesRep: "David Chen",
      paymentMethod: "Credit Card",
      status: "Completed"
    }
  ];

  // --- Storage Helper Functions ---
  function loadTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        transactions = JSON.parse(data);
      } else {
        transactions = [...INITIAL_SEED_DATA];
        saveTransactions();
      }
    } catch (e) {
      console.warn("Storage read error, using memory fallback", e);
      transactions = [...INITIAL_SEED_DATA];
    }
  }

  function saveTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error("Storage save error", e);
      showToast("Storage quota or permission error", "error");
    }
  }

  // --- Filtering Helper ---
  function getReferenceDate() {
    if (!transactions.length) return new Date();
    // Use the latest transaction date or today, whichever is later
    let latest = new Date(transactions[0].date);
    for (let i = 1; i < transactions.length; i++) {
      const d = new Date(transactions[i].date);
      if (d > latest) latest = d;
    }
    return latest;
  }

  function getFilteredTransactions() {
    const referenceDate = getReferenceDate();

    return transactions.filter(item => {
      const itemDate = new Date(item.date);

      // Time Range Filter
      if (currentFilterRange === '7days') {
        const diffTime = referenceDate - itemDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays < 0 || diffDays > 7) return false;
      } else if (currentFilterRange === '30days') {
        const diffTime = referenceDate - itemDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays < 0 || diffDays > 30) return false;
      } else if (currentFilterRange === 'quarter') {
        const diffTime = referenceDate - itemDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays < 0 || diffDays > 92) return false;
      } else if (currentFilterRange === 'year') {
        if (itemDate.getFullYear() !== referenceDate.getFullYear()) return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matches =
          item.id.toLowerCase().includes(query) ||
          item.customer.toLowerCase().includes(query) ||
          item.product.toLowerCase().includes(query) ||
          item.salesRep.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.region.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Category Filter
      if (categoryFilter && item.category !== categoryFilter) return false;

      // Status Filter
      if (statusFilter && item.status !== statusFilter) return false;

      // Region Filter
      if (regionFilter && item.region !== regionFilter) return false;

      return true;
    });
  }

  // --- Formatting Helpers ---
  function formatCurrency(val) {
    return '$' + Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const m = parseInt(parts[1], 10) - 1;
      return `${monthNames[m]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
    }
    return dateStr;
  }

  // --- Toast Feedback ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- UI Update: KPIs and Targets ---
  function updateKPIs(filtered) {
    const completedTx = filtered.filter(t => t.status === 'Completed');
    const pendingTx = filtered.filter(t => t.status === 'Pending');
    const refundedTx = filtered.filter(t => t.status === 'Refunded');

    const totalRevenue = completedTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const netProfit = totalRevenue * 0.685; // Est. 68.5% margin
    const totalOrders = completedTx.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalUnits = completedTx.reduce((sum, t) => sum + Number(t.quantity || 1), 0);
    const totalAllCount = filtered.length;
    const fulfillmentRate = totalAllCount > 0 ? (totalOrders / totalAllCount) * 100 : 0;

    // Top Category
    const categoryTotals = {};
    completedTx.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0);
    });

    let topCategoryName = 'None';
    let topCategoryRevenue = 0;
    Object.keys(categoryTotals).forEach(cat => {
      if (categoryTotals[cat] > topCategoryRevenue) {
        topCategoryRevenue = categoryTotals[cat];
        topCategoryName = cat;
      }
    });

    // Write to DOM
    document.getElementById('kpi-total-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpi-net-profit').textContent = formatCurrency(netProfit);
    document.getElementById('kpi-total-orders').textContent = totalOrders.toLocaleString();
    document.getElementById('kpi-pending-orders').textContent = `${pendingTx.length} pending`;
    document.getElementById('kpi-aov').textContent = formatCurrency(aov);
    document.getElementById('kpi-units-sold').textContent = `${totalUnits.toLocaleString()} units fulfilled`;
    document.getElementById('kpi-fulfillment-rate').textContent = `${fulfillmentRate.toFixed(1)}%`;
    document.getElementById('kpi-completed-ratio').textContent = `${totalOrders} of ${totalAllCount} closed`;
    document.getElementById('kpi-top-category').textContent = topCategoryName;
    document.getElementById('kpi-top-category-rev').textContent = `${formatCurrency(topCategoryRevenue)} sales`;

    // Sidebar Target Counter (Quarterly calculation based on Q4 2026)
    const q4Tx = transactions.filter(t => {
      const d = new Date(t.date);
      return t.status === 'Completed' && d >= new Date("2026-10-01") && d <= new Date("2026-12-31");
    });
    const q4Revenue = q4Tx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const targetPct = Math.min(100, Math.round((q4Revenue / QUARTERLY_GOAL) * 100));

    document.getElementById('side-target-current').textContent = formatCurrency(q4Revenue);
    document.getElementById('side-target-pct').textContent = `${targetPct}%`;
    document.getElementById('side-target-fill').style.width = `${targetPct}%`;

    // Nav transaction counter badge
    document.getElementById('nav-tx-count').textContent = transactions.length;
  }

  // --- UI Update: Sales Rep Leaderboard ---
  function updateLeaderboard(filtered) {
    const container = document.getElementById('salesRepLeaderboard');
    if (!container) return;

    const repStats = {};
    const completedTx = filtered.filter(t => t.status === 'Completed');

    completedTx.forEach(t => {
      if (!repStats[t.salesRep]) {
        repStats[t.salesRep] = {
          name: t.salesRep,
          revenue: 0,
          deals: 0
        };
      }
      repStats[t.salesRep].revenue += Number(t.amount || 0);
      repStats[t.salesRep].deals += 1;
    });

    const repsArray = Object.values(repStats).sort((a, b) => b.revenue - a.revenue);

    if (repsArray.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 24px;">No closed deals in this time range</div>`;
      return;
    }

    const maxRev = repsArray[0].revenue || 1;

    container.innerHTML = repsArray.map(rep => {
      const initials = rep.name.split(' ').map(n => n[0]).join('');
      const barPct = Math.round((rep.revenue / maxRev) * 100);

      return `
        <div class="rep-item">
          <div class="rep-profile">
            <div class="rep-avatar">${initials}</div>
            <div class="rep-details">
              <h4>${rep.name}</h4>
              <span>${rep.deals} ${rep.deals === 1 ? 'deal' : 'deals'} closed</span>
            </div>
          </div>
          <div class="rep-stats">
            <div class="rep-revenue">${formatCurrency(rep.revenue)}</div>
            <div class="rep-target-bar">
              <div class="rep-target-fill" style="width: ${barPct}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- UI Update: Charts Rendering ---
  function updateCharts(filtered) {
    // --- 1. Prepare Data ---
    // Group by date
    const dateMap = {};
    const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(t => {
      if (t.status === 'Completed') {
        if (!dateMap[t.date]) {
          dateMap[t.date] = { revenue: 0, orders: 0 };
        }
        dateMap[t.date].revenue += Number(t.amount || 0);
        dateMap[t.date].orders += 1;
      }
    });

    const timelineLabels = Object.keys(dateMap).map(d => formatShortDate(d));
    const timelineValues = Object.keys(dateMap).map(d => {
      return activeTimelineMetric === 'revenue' ? dateMap[d].revenue : dateMap[d].orders;
    });

    // Category Doughnut Data
    const catMap = {};
    const completedTx = filtered.filter(t => t.status === 'Completed');
    completedTx.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount || 0);
    });

    const catLabels = Object.keys(catMap);
    const catValues = Object.values(catMap);
    const catColorsList = catLabels.map(l => categoryColors[l] || '#94a3b8');

    // Category Legend
    const legendContainer = document.getElementById('categoryLegend');
    const totalCatRevenue = catValues.reduce((a, b) => a + b, 0);

    if (legendContainer) {
      if (catLabels.length === 0) {
        legendContainer.innerHTML = `<span style="font-size: 11px; color: #94a3b8; text-align: center;">No category data</span>`;
      } else {
        legendContainer.innerHTML = catLabels.map((cat, idx) => {
          const color = catColorsList[idx];
          const val = catValues[idx];
          const pct = totalCatRevenue > 0 ? Math.round((val / totalCatRevenue) * 100) : 0;
          return `
            <div class="legend-item">
              <div class="legend-info">
                <span class="legend-dot" style="background-color: ${color};"></span>
                <span class="legend-label">${cat}</span>
              </div>
              <span class="legend-val">${pct}%</span>
            </div>
          `;
        }).join('');
      }
    }

    // Regional Bar Data
    const regMap = {};
    completedTx.forEach(t => {
      regMap[t.region] = (regMap[t.region] || 0) + Number(t.amount || 0);
    });
    const regLabels = Object.keys(regMap);
    const regValues = Object.values(regMap);

    // If Chart.js CDN is loaded, use Chart.js for smooth interactive graphs
    if (typeof Chart !== 'undefined') {
      renderChartJsCharts(timelineLabels, timelineValues, catLabels, catValues, catColorsList, regLabels, regValues);
    } else {
      // Pure HTML5 Canvas Fallback (offline support)
      renderCanvasFallbacks(timelineLabels, timelineValues, catLabels, catValues, catColorsList, regLabels, regValues);
    }
  }

  function renderChartJsCharts(timelineLabels, timelineValues, catLabels, catValues, catColorsList, regLabels, regValues) {
    // Timeline Chart
    const timelineCanvas = document.getElementById('revenueTimelineChart');
    if (!timelineCanvas) return;
    const timelineCtx = timelineCanvas.getContext('2d');

    if (timelineChartInstance) {
      timelineChartInstance.destroy();
    }

    const gradient = timelineCtx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.35)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');

    timelineChartInstance = new Chart(timelineCtx, {
      type: 'line',
      data: {
        labels: timelineLabels.length ? timelineLabels : ['No Data'],
        datasets: [{
          label: activeTimelineMetric === 'revenue' ? 'Revenue ($)' : 'Orders Count',
          data: timelineValues.length ? timelineValues : [0],
          borderColor: '#4f46e5',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#4f46e5',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            cornerRadius: 6,
            callbacks: {
              label: function (ctx) {
                if (activeTimelineMetric === 'revenue') {
                  return ' Revenue: ' + formatCurrency(ctx.parsed.y);
                }
                return ' Closed Orders: ' + ctx.parsed.y;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              maxTicksLimit: 8
            }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: function (val) {
                if (activeTimelineMetric === 'revenue') {
                  return val >= 1000 ? '$' + (val / 1000) + 'k' : '$' + val;
                }
                return val;
              }
            }
          }
        }
      }
    });

    // Donut Chart
    const donutCanvas = document.getElementById('categoryDonutChart');
    if (!donutCanvas) return;
    const donutCtx = donutCanvas.getContext('2d');

    if (donutChartInstance) {
      donutChartInstance.destroy();
    }

    donutChartInstance = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: catLabels.length ? catLabels : ['None'],
        datasets: [{
          data: catValues.length ? catValues : [1],
          backgroundColor: catColorsList.length ? catColorsList : ['#e2e8f0'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            cornerRadius: 6,
            callbacks: {
              label: function (ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${formatCurrency(ctx.parsed)} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    // Regional Bar Chart
    const regionalCanvas = document.getElementById('regionalBarChart');
    if (!regionalCanvas) return;
    const regionalCtx = regionalCanvas.getContext('2d');

    if (regionalChartInstance) {
      regionalChartInstance.destroy();
    }

    regionalChartInstance = new Chart(regionalCtx, {
      type: 'bar',
      data: {
        labels: regLabels.length ? regLabels : ['No Data'],
        datasets: [{
          label: 'Regional Revenue ($)',
          data: regValues.length ? regValues : [0],
          backgroundColor: '#06b6d4',
          hoverBackgroundColor: '#0891b2',
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            cornerRadius: 6,
            callbacks: {
              label: function (ctx) {
                return ' ' + formatCurrency(ctx.parsed.y);
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 11 }
            }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: function (val) {
                return val >= 1000 ? '$' + (val / 1000) + 'k' : '$' + val;
              }
            }
          }
        }
      }
    });
  }

  // --- Offline Fallback HTML5 Canvas Renderers ---
  function renderCanvasFallbacks(tLabels, tValues, cLabels, cValues, cColors, rLabels, rValues) {
    // 1. Timeline Fallback
    const tCanvas = document.getElementById('revenueTimelineChart');
    if (tCanvas) {
      const w = tCanvas.width = tCanvas.offsetWidth || 500;
      const h = tCanvas.height = tCanvas.offsetHeight || 280;
      const ctx = tCanvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      if (tValues.length > 0) {
        const padding = 40;
        const maxVal = Math.max(...tValues, 100);
        const chartW = w - padding * 2;
        const chartH = h - padding * 2;

        // Grid lines
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padding + (chartH / 4) * i;
          ctx.beginPath();
          ctx.moveTo(padding, y);
          ctx.lineTo(w - padding, y);
          ctx.stroke();
        }

        // Points
        const points = tValues.map((v, i) => ({
          x: padding + (chartW / (tValues.length - 1 || 1)) * i,
          y: padding + chartH - (v / maxVal) * chartH
        }));

        // Gradient Area
        const grad = ctx.createLinearGradient(0, padding, 0, h - padding);
        grad.addColorStop(0, 'rgba(79, 70, 229, 0.25)');
        grad.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(points[0].x, h - padding);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, h - padding);
        ctx.closePath();
        ctx.fill();

        // Line
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Dots
        points.forEach(p => {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#4f46e5';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      }
    }

    // 2. Donut Fallback
    const dCanvas = document.getElementById('categoryDonutChart');
    if (dCanvas) {
      const w = dCanvas.width = dCanvas.offsetWidth || 240;
      const h = dCanvas.height = dCanvas.offsetHeight || 200;
      const ctx = dCanvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      const total = cValues.reduce((a, b) => a + b, 0);
      const centerX = w / 2;
      const centerY = h / 2;
      const outerR = Math.min(centerX, centerY) - 10;
      const innerR = outerR * 0.72;

      if (total > 0) {
        let startAngle = -Math.PI / 2;
        cValues.forEach((val, i) => {
          const sliceAngle = (val / total) * (Math.PI * 2);
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerR, startAngle, startAngle + sliceAngle);
          ctx.arc(centerX, centerY, innerR, startAngle + sliceAngle, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = cColors[i] || '#94a3b8';
          ctx.fill();
          startAngle += sliceAngle;
        });
      }
    }

    // 3. Regional Bar Fallback
    const rCanvas = document.getElementById('regionalBarChart');
    if (rCanvas) {
      const w = rCanvas.width = rCanvas.offsetWidth || 500;
      const h = rCanvas.height = rCanvas.offsetHeight || 280;
      const ctx = rCanvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      if (rValues.length > 0) {
        const padding = 40;
        const maxVal = Math.max(...rValues, 100);
        const barW = Math.min(30, (w - padding * 2) / (rValues.length * 2));
        const spacing = (w - padding * 2) / rValues.length;

        rValues.forEach((val, i) => {
          const barH = (val / maxVal) * (h - padding * 2);
          const x = padding + spacing * i + (spacing - barW) / 2;
          const y = h - padding - barH;

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 4) : ctx.rect(x, y, barW, barH);
          ctx.fill();

          ctx.fillStyle = '#64748b';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(rLabels[i] ? rLabels[i].substring(0, 8) : '', x + barW / 2, h - padding + 16);
        });
      }
    }
  }

  // --- UI Update: Table & Pagination ---
  function updateTable(filtered) {
    const tbody = document.getElementById('transactionTableBody');
    const emptyNotice = document.getElementById('emptyStateNotice');
    const paginationInfo = document.getElementById('paginationInfo');
    const countLabel = document.getElementById('table-count-label');

    // Sort dataset
    const sorted = [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (sortField === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = sorted.length;
    countLabel.textContent = `${totalCount} transactions found`;

    if (totalCount === 0) {
      tbody.innerHTML = '';
      emptyNotice.style.display = 'block';
      paginationInfo.textContent = 'Showing 0 of 0 entries';
      renderPagination(0, 1);
      return;
    }

    emptyNotice.style.display = 'none';

    // Pagination slice
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    paginationInfo.textContent = `Showing ${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, totalCount)} of ${totalCount} entries`;

    tbody.innerHTML = pageItems.map(item => {
      const statusClass = item.status === 'Completed'
        ? 'status-completed'
        : item.status === 'Pending'
          ? 'status-pending'
          : 'status-refunded';

      return `
        <tr>
          <td style="font-weight: 600; color: #64748b; font-size: 12px;">${item.id}</td>
          <td>${formatShortDate(item.date)}</td>
          <td>
            <div class="customer-cell">
              <span class="customer-name">${escapeHtml(item.customer)}</span>
              <span class="customer-email">${escapeHtml(item.email || 'N/A')}</span>
            </div>
          </td>
          <td>${escapeHtml(item.product)}</td>
          <td>
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${categoryColors[item.category] || '#94a3b8'}; margin-right:6px;"></span>
            ${escapeHtml(item.category)}
          </td>
          <td>${escapeHtml(item.region)}</td>
          <td>${escapeHtml(item.salesRep)}</td>
          <td class="text-right tx-amount">${formatCurrency(item.amount)}</td>
          <td><span class="status-badge ${statusClass}">${item.status}</span></td>
          <td class="text-center">
            <div class="action-btn-group">
              <button class="table-action-btn btn-edit" data-id="${item.id}" title="Edit Transaction">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button class="table-action-btn btn-delete" data-id="${item.id}" title="Delete Transaction">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPagination(totalPages, currentPage);
    bindTableActionButtons();
  }

  function renderPagination(totalPages, current) {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const numbersContainer = document.getElementById('pageNumberButtons');

    prevBtn.disabled = current <= 1;
    nextBtn.disabled = current >= totalPages || totalPages === 0;

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 6 && Math.abs(i - current) > 2 && i !== 1 && i !== totalPages) {
        if (i === 2 || i === totalPages - 1) {
          html += `<span style="padding: 4px; color: #94a3b8;">...</span>`;
        }
        continue;
      }
      html += `
        <button class="page-num ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>
      `;
    }

    numbersContainer.innerHTML = html;

    numbersContainer.querySelectorAll('.page-num').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page, 10);
        refreshView();
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Master Refresh View ---
  function refreshView() {
    const filtered = getFilteredTransactions();
    updateKPIs(filtered);
    updateCharts(filtered);
    updateLeaderboard(filtered);
    updateTable(filtered);
  }

  // --- Table Actions: Edit & Delete ---
  function bindTableActionButtons() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openModalForEdit(id);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to delete transaction record ${id}?`)) {
          transactions = transactions.filter(t => t.id !== id);
          saveTransactions();
          showToast(`Record ${id} removed successfully`, 'info');
          refreshView();
        }
      });
    });
  }

  // --- Modal Form: Add / Edit ---
  const modal = document.getElementById('transactionModal');
  const form = document.getElementById('transactionForm');
  const modalHeading = document.getElementById('modalHeading');

  function openModalForAdd() {
    form.reset();
    document.getElementById('editTxId').value = '';
    modalHeading.textContent = 'Log New Sale';
    // Default today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('formDate').value = today;
    modal.classList.add('open');
  }

  function openModalForEdit(id) {
    const record = transactions.find(t => t.id === id);
    if (!record) return;

    document.getElementById('editTxId').value = record.id;
    document.getElementById('formCustomerName').value = record.customer;
    document.getElementById('formCustomerEmail').value = record.email || '';
    document.getElementById('formProductName').value = record.product;
    document.getElementById('formCategory').value = record.category;
    document.getElementById('formAmount').value = record.amount;
    document.getElementById('formQuantity').value = record.quantity || 1;
    document.getElementById('formStatus').value = record.status;
    document.getElementById('formRegion').value = record.region;
    document.getElementById('formSalesRep').value = record.salesRep;
    document.getElementById('formPaymentMethod').value = record.paymentMethod || 'Wire Transfer';
    document.getElementById('formDate').value = record.date;

    modalHeading.textContent = `Edit Sale (${record.id})`;
    modal.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const editId = document.getElementById('editTxId').value;
    const customer = document.getElementById('formCustomerName').value.trim();
    const email = document.getElementById('formCustomerEmail').value.trim();
    const product = document.getElementById('formProductName').value.trim();
    const category = document.getElementById('formCategory').value;
    const amount = parseFloat(document.getElementById('formAmount').value) || 0;
    const quantity = parseInt(document.getElementById('formQuantity').value, 10) || 1;
    const status = document.getElementById('formStatus').value;
    const region = document.getElementById('formRegion').value;
    const salesRep = document.getElementById('formSalesRep').value;
    const paymentMethod = document.getElementById('formPaymentMethod').value;
    const date = document.getElementById('formDate').value;

    if (editId) {
      // Edit existing
      const index = transactions.findIndex(t => t.id === editId);
      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          customer,
          email,
          product,
          category,
          amount,
          quantity,
          status,
          region,
          salesRep,
          paymentMethod,
          date
        };
        showToast(`Transaction ${editId} updated`, 'success');
      }
    } else {
      // Create new
      const nextNum = transactions.length > 0
        ? Math.max(...transactions.map(t => parseInt(t.id.replace('TX-', ''), 10) || 1000)) + 1
        : 1001;

      const newTx = {
        id: `TX-${nextNum}`,
        customer,
        email,
        product,
        category,
        amount,
        quantity,
        status,
        region,
        salesRep,
        paymentMethod,
        date
      };

      transactions.unshift(newTx);
      showToast(`Sale recorded successfully as ${newTx.id}`, 'success');
    }

    saveTransactions();
    closeModal();
    refreshView();
  });

  // --- Export to CSV ---
  function exportToCsv() {
    const filtered = getFilteredTransactions();
    if (filtered.length === 0) {
      showToast("No records to export", "error");
      return;
    }

    const headers = ["Transaction ID", "Date", "Customer", "Email", "Product", "Category", "Amount", "Quantity", "Region", "Sales Rep", "Payment Method", "Status"];
    const rows = filtered.map(t => [
      t.id,
      t.date,
      `"${(t.customer || '').replace(/"/g, '""')}"`,
      `"${(t.email || '').replace(/"/g, '""')}"`,
      `"${(t.product || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      t.quantity,
      `"${(t.region || '').replace(/"/g, '""')}"`,
      `"${(t.salesRep || '').replace(/"/g, '""')}"`,
      `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
      t.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SalesPulse_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filtered.length} transactions to CSV`, 'info');
  }

  // --- Reset Seed Data ---
  function resetDemoData() {
    if (confirm("Reset dataset back to default demo records? Any custom edits will be replaced.")) {
      transactions = [...INITIAL_SEED_DATA];
      saveTransactions();
      showToast("Default sales demo data restored", "success");
      refreshView();
    }
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Time filter dropdown
    document.getElementById('timeRangeFilter').addEventListener('change', (e) => {
      currentFilterRange = e.target.value;
      currentPage = 1;
      refreshView();
    });

    // Table filters
    document.getElementById('tableSearchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      refreshView();
    });

    document.getElementById('filterCategory').addEventListener('change', (e) => {
      categoryFilter = e.target.value;
      currentPage = 1;
      refreshView();
    });

    document.getElementById('filterStatus').addEventListener('change', (e) => {
      statusFilter = e.target.value;
      currentPage = 1;
      refreshView();
    });

    document.getElementById('filterRegion').addEventListener('change', (e) => {
      regionFilter = e.target.value;
      currentPage = 1;
      refreshView();
    });

    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
      document.getElementById('tableSearchInput').value = '';
      document.getElementById('filterCategory').value = '';
      document.getElementById('filterStatus').value = '';
      document.getElementById('filterRegion').value = '';
      searchQuery = '';
      categoryFilter = '';
      statusFilter = '';
      regionFilter = '';
      currentPage = 1;
      refreshView();
      showToast("Filters reset", "info");
    });

    // Sorting headers
    document.querySelectorAll('.data-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (sortField === field) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortField = field;
          sortDirection = 'desc';
        }
        refreshView();
      });
    });

    // Pagination buttons
    document.getElementById('prevPageBtn').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        refreshView();
      }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
      currentPage++;
      refreshView();
    });

    // Timeline metric toggle buttons
    const revBtn = document.getElementById('metricRevBtn');
    const ordBtn = document.getElementById('metricOrdBtn');

    revBtn.addEventListener('click', () => {
      activeTimelineMetric = 'revenue';
      revBtn.classList.add('active');
      ordBtn.classList.remove('active');
      refreshView();
    });

    ordBtn.addEventListener('click', () => {
      activeTimelineMetric = 'orders';
      ordBtn.classList.add('active');
      revBtn.classList.remove('active');
      refreshView();
    });

    // Modal triggers
    document.getElementById('openAddModalBtn').addEventListener('click', openModalForAdd);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Export & Demo Reset
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCsv);
    document.getElementById('resetDataBtn').addEventListener('click', resetDemoData);

    // Sidebar active nav highlighting
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // --- Live Clock / Date Indicator ---
  function updateLiveDate() {
    const el = document.getElementById('live-date');
    if (!el) return;
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    el.textContent = now.toLocaleDateString('en-US', options);
  }

  // --- App Initialization ---
  function init() {
    loadTransactions();
    setupEventListeners();
    updateLiveDate();
    refreshView();
  }

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
