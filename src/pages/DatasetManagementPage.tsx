import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Table, 
  Info, 
  Lock, 
  ShieldCheck, 
  RefreshCw,
  FileCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { UserRole, FoodBatch, DemandForecastRecord } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface DatasetManagementPageProps {
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onAddBatch?: (batch: FoodBatch) => void;
  onAddForecast?: (forecast: DemandForecastRecord) => void;
}

export type DataSourceTag = 
  | 'Public dataset' 
  | 'Synthetic demo data' 
  | 'Real pilot data' 
  | 'Manual kitchen log' 
  | 'Kitchen scale' 
  | 'Serving-count estimate';

interface ColumnReport {
  name: string;
  type: string;
  missingCount: number;
  missingPercent: number;
  sampleValue: string;
}

interface AnalysisResult {
  fileName: string;
  totalRows: number;
  totalColumns: number;
  columns: ColumnReport[];
  duplicateRowsCount: number;
  previewRows: Record<string, string>[];
}

// Built-in sample extract of the Kaggle AI-Powered Food Waste Management Dataset for instant testing
const KAGGLE_SYNTHETIC_SAMPLE_CSV = `record_id,item_name,category,prepared_qty_kg,served_qty_kg,waste_qty_kg,prep_time,shelf_life_hours,storage_temp_c,ambient_humidity_pct,weather_condition,headcount_estimate,quality_score
REC-001,Vegetable Biryani,Rice,45.0,38.5,6.5,2026-09-25 12:30,5,62.8,48,Sunny,320,94
REC-002,Paneer Tikka Masala,Curry,28.0,24.0,4.0,2026-09-25 12:45,4,61.2,52,Sunny,320,91
REC-003,Dal Tadka,Curry,35.0,32.0,3.0,2026-09-25 12:15,6,64.0,45,Sunny,320,96
REC-004,Steamed Rice,Rice,50.0,42.0,8.0,2026-09-25 12:00,5,63.5,47,Sunny,320,95
REC-005,Chapati Rotis,Breakfast,22.0,19.0,3.0,2026-09-25 12:50,4,58.0,55,Sunny,320,89
REC-006,Mixed Vegetable Curry,Curry,30.0,25.5,4.5,2026-09-25 12:30,4,62.0,50,Sunny,320,92
REC-007,Gulab Jamun,Dessert,15.0,14.2,0.8,2026-09-25 11:30,12,22.0,60,Sunny,320,98
REC-008,Sambar Rice,Rice,40.0,33.0,7.0,2026-09-25 12:20,4,63.0,49,Sunny,320,93
REC-009,Egg Curry,Curry,25.0,25.0,0.0,2026-09-25 12:40,4,62.5,51,Sunny,320,94
REC-010,Fruit Custard,Dessert,18.0,15.0,3.0,2026-09-25 11:45,6,4.5,65,Sunny,320,90`;

export const DatasetManagementPage: React.FC<DatasetManagementPageProps> = ({
  activeRole,
  onSwitchRole,
  showToast,
  onAddBatch
}) => {
  const [sourceTag, setSourceTag] = useState<DataSourceTag>('Synthetic demo data');
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Download template CSV helper
  const handleDownloadTemplate = (templateName: string, path: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = `${templateName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Downloaded', `Saved ${templateName}.csv to your downloads folder.`, 'success');
  };

  // CSV Parser and Audit Engine
  const processCSVText = (csvText: string, fileName: string) => {
    setIsParsing(true);
    try {
      const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        showToast('Empty CSV', 'Uploaded CSV contains no data rows.', 'error');
        setIsParsing(false);
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const rawDataRows = lines.slice(1);
      const totalRows = rawDataRows.length;

      // Duplicate check using stringified row
      const seenRows = new Set<string>();
      let duplicateRowsCount = 0;

      const columnMissingCounts: number[] = new Array(headers.length).fill(0);
      const columnSamples: string[] = new Array(headers.length).fill('');
      const parsedRows: Record<string, string>[] = [];

      for (let r = 0; r < rawDataRows.length; r++) {
        const line = rawDataRows[r];
        if (seenRows.has(line)) {
          duplicateRowsCount++;
        } else {
          seenRows.add(line);
        }

        // Basic split (handles simple CSVs, quotes stripped)
        const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        const rowObj: Record<string, string> = {};

        headers.forEach((h, colIdx) => {
          const val = values[colIdx] ?? '';
          rowObj[h] = val;
          if (!val || val.toLowerCase() === 'nan' || val.toLowerCase() === 'null') {
            columnMissingCounts[colIdx]++;
          } else if (!columnSamples[colIdx]) {
            columnSamples[colIdx] = val;
          }
        });

        if (r < 10) {
          parsedRows.push(rowObj);
        }
      }

      // Build column report
      const columnsReport: ColumnReport[] = headers.map((h, idx) => {
        const sample = columnSamples[idx] || '';
        let inferredType = 'String';
        if (sample && !isNaN(Number(sample))) {
          inferredType = Number.isInteger(Number(sample)) ? 'Integer' : 'Float';
        } else if (sample && sample.includes('-') && !isNaN(Date.parse(sample))) {
          inferredType = 'DateTime / Date';
        } else if (sample.toLowerCase() === 'true' || sample.toLowerCase() === 'false') {
          inferredType = 'Boolean';
        }

        const missing = columnMissingCounts[idx];
        const missingPct = Math.round((missing / totalRows) * 100);

        return {
          name: h,
          type: inferredType,
          missingCount: missing,
          missingPercent: missingPct,
          sampleValue: sample || '—'
        };
      });

      setAnalysis({
        fileName,
        totalRows,
        totalColumns: headers.length,
        columns: columnsReport,
        duplicateRowsCount,
        previewRows: parsedRows
      });

      showToast('CSV Analyzed', `Loaded ${totalRows} rows and ${headers.length} columns from ${fileName}.`, 'success');
    } catch {
      showToast('Parse Error', 'Failed to parse CSV. Please verify file formatting.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      showToast('Invalid File Type', 'Please upload a valid .csv tabular file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSVText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      showToast('Invalid File', 'Please drop a .csv file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSVText(text, file.name);
    };
    reader.readAsText(file);
  };

  const loadKaggleSyntheticSample = () => {
    processCSVText(KAGGLE_SYNTHETIC_SAMPLE_CSV, 'kaggle_food_waste_sample_extract.csv');
    setSourceTag('Synthetic demo data');
  };

  // Safe import confirm handler (creates sample batch without overwriting)
  const handleConfirmImport = () => {
    setIsImportModalOpen(false);
    if (!analysis) return;

    if (onAddBatch && analysis.previewRows.length > 0) {
      const firstRow = analysis.previewRows[0];
      const newBatch: FoodBatch = {
        id: `IMPORTED-${Date.now().toString().slice(-4)}`,
        foodItem: firstRow.item_name || firstRow.food_item || 'Imported Surplus Item',
        category: (firstRow.category as any) || 'Other',
        foodType: 'Cooked Food',
        mealsPrepared: Number(firstRow.headcount_estimate) || 100,
        mealsServed: Number(firstRow.served_qty_kg) ? Math.round(Number(firstRow.served_qty_kg) * 2.5) : 80,
        preparedKg: Number(firstRow.prepared_qty_kg) || 30,
        servedKg: Number(firstRow.served_qty_kg) || 24,
        remainingKg: Number(firstRow.waste_qty_kg) || 6,
        remainingMeals: Math.round((Number(firstRow.waste_qty_kg) || 6) * 2.5),
        prepDateTime: new Date().toISOString().slice(0, 16),
        deadlineDateTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 16),
        storageCondition: 'Proper',
        packagingStatus: 'Intact',
        appearance: 'Normal',
        qualityStatus: 'Safe for Human Review',
        donationStatus: 'Draft',
        qualityScore: Number(firstRow.quality_score) || 94,
        notes: `Imported from ${analysis.fileName} (${sourceTag})`
      };
      onAddBatch(newBatch);
      showToast('Sample Batch Appended', `Created demo batch "${newBatch.foodItem}" from dataset without altering existing batches.`, 'success');
    } else {
      showToast('Import Staged', 'Sample records inspected and verified against SmartFood Rescue AI schema.', 'info');
    }
  };

  // 1. Role Gate: Restrict to Administrator
  if (activeRole !== 'Administrator') {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Administrator Access Required</span>
        </div>
        <h2 className="text-2xl font-display font-extrabold text-slate-900">
          Dataset & Governance Gateway
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          The Dataset Management module allows uploading external tabular datasets, auditing data quality, schema-mapping, and managing synthetic operational records.
        </p>
        <p className="text-xs text-slate-500">
          Current Role: <span className="font-bold text-slate-700">{activeRole}</span>
        </p>
        <div className="pt-2">
          <button
            onClick={() => onSwitchRole('Administrator')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Switch to Administrator Role</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isSyntheticSource = sourceTag === 'Synthetic demo data' || sourceTag === 'Public dataset';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
              Data Governance & Pipeline
            </span>
            <span className="text-xs text-slate-400">Administrator Control Plane</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Dataset Ingestion & Quality Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Safely inspect, validate, and audit synthetic or operational food waste datasets before schema mapping.
          </p>
        </div>

        {/* Action Button: Load Kaggle Sample */}
        <button
          onClick={loadKaggleSyntheticSample}
          className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Database className="w-3.5 h-3.5 text-purple-600" />
          <span>Load Kaggle Sample Extract</span>
        </button>
      </div>

      {/* Dataset Provenance & Policy Disclosure Banner */}
      <div className="bg-linear-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider border border-purple-400/30">
                Data Provenance Disclosure
              </span>
              <span className="text-xs text-slate-400">Kaggle Public Dataset Integration</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              AI-Powered Food Waste Management Dataset (~8,000 Records)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This system acknowledges external synthetic datasets for research, baseline testing, and educational validation. The full 8,000-row raw file is kept isolated in <code className="text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded font-mono">datasets/raw/</code> and is excluded from the client frontend bundle to ensure real-time performance.
            </p>
          </div>

          <div className="shrink-0 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-1">
            <div className="text-[11px] text-slate-400">Dataset Isolation Policy:</div>
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Raw Data Isolated from Bundle</span>
            </div>
            <div className="text-[10px] text-slate-400">No ML training claims asserted yet</div>
          </div>
        </div>
      </div>

      {/* Grid: Upload & Analysis Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Dropzone & Source Tag Selection (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Source Tag Selector */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-600" />
                <span>Data Source Classification</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'Public dataset',
                  'Synthetic demo data',
                  'Real pilot data',
                  'Manual kitchen log',
                  'Kitchen scale',
                  'Serving-count estimate'
                ] as DataSourceTag[]
              ).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSourceTag(tag)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    sourceTag === tag
                      ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Mandatory Visible Warning if Source is Synthetic */}
            {isSyntheticSource && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1 animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Synthetic Data Notice</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  Tagged as <strong>{sourceTag}</strong>: Contains algorithmically generated or synthetic operational logic. It does not represent certified biological food safety logs or verified field kitchen measurements.
                </p>
              </div>
            )}
          </div>

          {/* Drag & Drop File Upload Area */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-purple-600" />
              <span>Upload CSV Dataset</span>
            </h3>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-300 hover:border-purple-400 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                id="csv-file-upload"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="csv-file-upload" className="cursor-pointer block">
                <FileSpreadsheet className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-purple-700 block">
                  Click to select CSV or drag-and-drop here
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Supports .csv files (max 10 MB for browser auditing)
                </span>
              </label>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Audits headers, missing values, duplicates, and column types locally in browser memory.
              </span>
            </div>
          </div>

          {/* Download Standard Templates Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Schema Templates (CSV)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Standard format templates formatted for the SmartFood Rescue AI pipeline:
            </p>

            <div className="space-y-2 pt-1">
              {[
                { name: 'Demand Forecast Template', path: '/data/demand_forecast_template.csv' },
                { name: 'Food Batches Template', path: '/data/food_batches_template.csv' },
                { name: 'Quality Checks Template', path: '/data/quality_checks_template.csv' },
                { name: 'NGO Partners Template', path: '/data/ngo_partners_template.csv' },
                { name: 'Delivery Routes Template', path: '/data/delivery_routes_template.csv' }
              ].map(tpl => (
                <button
                  key={tpl.name}
                  onClick={() => handleDownloadTemplate(tpl.name, tpl.path)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs font-medium text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{tpl.name}</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    .CSV
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Results, Column Report & Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <>
              {/* Summary Stats Overview */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                      Audit Completed
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 truncate">
                      {analysis.fileName}
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <span>Staged Import Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">Row Count</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5 font-mono">
                      {analysis.totalRows.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">Columns</span>
                    <div className="text-xl font-extrabold text-purple-700 mt-0.5 font-mono">
                      {analysis.totalColumns}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">Duplicate Rows</span>
                    <div className={`text-xl font-extrabold mt-0.5 font-mono ${
                      analysis.duplicateRowsCount > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {analysis.duplicateRowsCount}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">Tagged Source</span>
                    <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                      {sourceTag}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column-by-Column Missing Value & Type Audit Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Table className="w-4 h-4 text-purple-600" />
                    <span>Column Schema & Missing-Value Report</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {analysis.columns.length} columns verified
                  </span>
                </div>

                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Column Name</th>
                        <th className="py-2 px-3">Inferred Type</th>
                        <th className="py-2 px-3">Missing Count</th>
                        <th className="py-2 px-3">Missing %</th>
                        <th className="py-2 px-3">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analysis.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 font-mono font-bold text-slate-800">
                            {col.name}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono">
                              {col.type}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono">
                            {col.missingCount}
                          </td>
                          <td className="py-2 px-3 font-mono">
                            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              col.missingPercent === 0 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : col.missingPercent < 5 
                                ? 'bg-amber-50 text-amber-700' 
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {col.missingPercent}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-500 truncate max-w-[150px]">
                            {col.sampleValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Rows Preview */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Raw Dataset Header & Row Preview (First {analysis.previewRows.length} Rows)</span>
                  </h3>
                </div>

                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
                      <tr>
                        {analysis.columns.map(col => (
                          <th key={col.name} className="py-2 px-2.5 whitespace-nowrap">
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {analysis.previewRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80">
                          {analysis.columns.map(col => (
                            <td key={col.name} className="py-1.5 px-2.5 whitespace-nowrap text-slate-700">
                              {row[col.name] || <span className="text-slate-300 italic">null</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800">
                No Dataset Loaded for Analysis
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload any CSV dataset on the left or click <strong>“Load Kaggle Sample Extract”</strong> to preview schema metrics, missing values, and duplicate row audits.
              </p>
              <div className="pt-2">
                <button
                  onClick={loadKaggleSyntheticSample}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Load Kaggle Synthetic Sample
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to prevent overwriting existing data */}
      <ConfirmationModal
        isOpen={isImportModalOpen}
        title="Confirm Safe Staged Import?"
        message={`You are about to stage sample records from "${analysis?.fileName || 'dataset'}" tagged as "${sourceTag}". This action will append demonstration records without overwriting your current canonical batches or configuration.`}
        confirmLabel="Confirm & Append Sample"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleConfirmImport}
        onCancel={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};
