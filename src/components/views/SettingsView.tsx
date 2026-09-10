import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { 
  Settings, 
  Database, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Server, 
  ShieldCheck, 
  Key, 
  Sliders, 
  Cpu,
  Building2,
  Terminal
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    lastSyncTime, 
    syncWithErp, 
    isSyncing, 
    addToast 
  } = useDyeFlow();

  const [erpEndpoint, setErpEndpoint] = useState('https://erp.juniorprocessingmills.com/api/v4');
  const [apiKey, setApiKey] = useState('jpm_live_sec_9948218840192');
  const [runningSeq, setRunningSeq] = useState('8165');
  const [yearCode, setYearCode] = useState('26');
  const [autoSyncInterval, setAutoSyncInterval] = useState('5');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'ERP Integration Parameters Updated',
      message: 'Saved Selsoft ERP endpoint, API auth tokens & Lab numbering sequences.'
    });
  };

  const sampleJsonPayload = JSON.stringify({
    system: "JPM DyeFlow -> Selsoft ERP Connector",
    version: "4.2.0-Enterprise",
    dataSchema: {
      labApproval: {
        format: "{runningNumber}-{yearCode}/{colorCode}",
        example: "8157-26/A",
        primaryKey: true
      },
      bulkOrder: {
        orderKey: "B-2026-001",
        foreignKey: "8157-26/A",
        quantityKg: 2000
      },
      productionBatch: {
        vessel: "Softflow Vessel 03",
        status: "Dyeing",
        deltaE: 0.42
      },
      logistics: {
        vehicle: "TN 39 BK 4821",
        podStatus: "Signed"
      }
    }
  }, null, 2);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#d1d9e2] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              SYSTEM CONFIGURATION &amp; ERP INTEROPERABILITY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display mt-0.5">
            Settings &amp; Selsoft ERP API Architecture
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Data contract configuration connecting JPM DyeFlow with Selsoft ERP, plant scales, and spectrophotometer hardware.
          </p>
        </div>

        <button
          type="button"
          onClick={syncWithErp}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded font-mono text-xs font-bold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
          <span>{isSyncing ? 'Synchronizing...' : 'Trigger Full ERP Pull'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Parameters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Lab Numbering Formula Config */}
          <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Layers className="w-4 h-4 text-indigo-700" />
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Lab Approval Number Sequence Rule
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              JPM standard requires every lab sample to receive a unique alphanumeric key: <strong>[Running Number]-[Year Code]/[Colour Code]</strong>.
            </p>

            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono">
              <div>
                <label className="text-slate-500 text-[10px] block font-sans font-semibold">Current Running No</label>
                <input
                  type="text"
                  value={runningSeq}
                  onChange={(e) => setRunningSeq(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block font-sans font-semibold">Fiscal Year Code</label>
                <input
                  type="text"
                  value={yearCode}
                  onChange={(e) => setYearCode(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block font-sans font-semibold">Next Sample Output</label>
                <div className="p-1.5 bg-slate-900 text-amber-300 font-bold rounded mt-1 text-center">
                  {runningSeq}-{yearCode}/A
                </div>
              </div>
            </div>
          </div>

          {/* Selsoft ERP Connector Form */}
          <form onSubmit={handleSaveConfig} className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Server className="w-4 h-4 text-indigo-700" />
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Selsoft ERP API Integration Endpoints
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Selsoft API Base Gateway</label>
                <input
                  type="text"
                  value={erpEndpoint}
                  onChange={(e) => setErpEndpoint(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">API Authentication Token</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Auto Sync Cadence (Minutes)</label>
                  <select
                    value={autoSyncInterval}
                    onChange={(e) => setAutoSyncInterval(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium"
                  >
                    <option value="1">Every 1 Minute (Real-time)</option>
                    <option value="5">Every 5 Minutes (Recommended)</option>
                    <option value="15">Every 15 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <div className="text-[11px] font-mono text-slate-500">
                  Status: <span className="text-emerald-700 font-bold">200 OK · Connected</span>
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs shadow-xs"
                >
                  Save Integration Parameters
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Right Panel: Live JSON Schema / Data Architecture (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f2438] rounded-lg border border-slate-800 p-4 text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-xs font-bold text-amber-300 uppercase">
                  SELSOFT ERP JSON DATA MODEL
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                SCHEMA VERIFIED
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Clean relational schema designed for future 2-way live sync with Junior Processing Mills core ERP ledger.
            </p>

            <pre className="bg-[#091522] p-3 rounded border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {sampleJsonPayload}
            </pre>
          </div>

          <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 font-mono uppercase text-xs">
              Hardware Calibration Profiles
            </h4>
            <div className="space-y-1.5 font-mono text-[11px] text-slate-600">
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span>Spectrophotometer:</span>
                <strong className="text-slate-900">Datacolor 800 (Calibrated Today)</strong>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span>Light Cabinet:</span>
                <strong className="text-slate-900">VeriVide CAC 60 (D65 / TL84)</strong>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span>Weigh Scales:</span>
                <strong className="text-slate-900">Mettler Toledo Industrial (± 0.05 KG)</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
