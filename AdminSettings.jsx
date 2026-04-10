@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html, body, #root {
  height: 100%;
}

body {
  @apply bg-slate-50 text-slate-800 font-sans antialiased;
  transition: background-color .2s ease, color .2s ease;
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  .btn-primary {
    @apply btn bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow focus:ring-brand-500;
  }
  .btn-secondary {
    @apply btn bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300;
  }
  .btn-ghost {
    @apply btn text-slate-600 hover:bg-slate-100;
  }
  .card {
    @apply bg-white rounded-2xl shadow-card border border-slate-100;
  }
  .input {
    @apply w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition;
  }
  .label {
    @apply block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5;
  }
  .badge {
    @apply inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold;
  }
  .section-title {
    @apply text-2xl md:text-3xl font-bold text-slate-900 tracking-tight;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { @apply bg-slate-300 rounded-full; }
::-webkit-scrollbar-thumb:hover { @apply bg-slate-400; }

.fade-in { animation: fadeIn .4s ease both; }
@keyframes fadeIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: none;} }

.skeleton {
  @apply bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-pulse rounded-lg;
}

/* ============================================================
   DARK MODE
   Triggered by `.dark` class on <html>. A broad token-level
   override so every page reacts without us touching each file.
   ============================================================ */
html.dark { color-scheme: dark; }

html.dark body {
  background-color: #0b1020;
  color: #e2e8f0;
}

html.dark .card {
  background-color: #141a2e;
  border-color: #1e2740;
  color: #e2e8f0;
}

html.dark .btn-secondary {
  background-color: #1a2238;
  color: #e2e8f0;
  border-color: #2a3452;
}
html.dark .btn-secondary:hover { background-color: #222b46; }

html.dark .input {
  background-color: #141a2e;
  color: #e2e8f0;
  border-color: #2a3452;
}
html.dark .input::placeholder { color: #64748b; }

html.dark .label { color: #94a3b8; }

/* Slate utility overrides so text & surfaces invert properly */
html.dark .bg-white { background-color: #141a2e !important; }
html.dark .bg-slate-50 { background-color: #0e1528 !important; }
html.dark .bg-slate-100 { background-color: #1a2238 !important; }
html.dark .bg-slate-200 { background-color: #222b46 !important; }

html.dark .text-slate-900 { color: #f1f5f9 !important; }
html.dark .text-slate-800 { color: #e2e8f0 !important; }
html.dark .text-slate-700 { color: #cbd5e1 !important; }
html.dark .text-slate-600 { color: #94a3b8 !important; }
html.dark .text-slate-500 { color: #94a3b8 !important; }
html.dark .text-slate-400 { color: #64748b !important; }

html.dark .border-slate-100 { border-color: #1e2740 !important; }
html.dark .border-slate-200 { border-color: #2a3452 !important; }

html.dark .bg-brand-50 { background-color: rgba(31, 84, 245, 0.15) !important; }
html.dark .bg-brand-100 { background-color: rgba(31, 84, 245, 0.25) !important; }

html.dark .hover\:bg-slate-50:hover { background-color: #1a2238 !important; }
html.dark .hover\:bg-slate-100:hover { background-color: #222b46 !important; }

html.dark table thead { background-color: #0e1528 !important; }
html.dark tr { border-color: #1e2740 !important; }

html.dark .shadow-card { box-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4); }

/* Print styles for receipts */
@media print {
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white;
    color: black;
    padding: 24px;
  }
  .no-print { display: none !important; }
}
