import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Scale, 
  Clock, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Sliders,
  Sparkles,
  Flame,
  Snowflake,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { FoodBatch, VirtualIoTSensorData } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useAppContext } from '../context/AppContext';

interface IoTSimulatorPageProps {
  batches?: FoodBatch[];
  iotData?: Map<string, VirtualIoTSensorData> | VirtualIoTSensorData;
  onUpdateIoT?: (data: VirtualIoTSensorData) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const IoTSimulatorPage: React.FC<IoTSimulatorPageProps> = ({
  batches,
  iotData,
  onUpdateIoT,
  showToast,
}) => {
  const context = useAppContext();
  const effectiveBatches = batches || context.batches;
  const effectiveUpdateIoT = onUpdateIoT || context.handleUpdateIoT;

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    effectiveBatches.find(b => b.remainingKg > 0)?.id || effectiveBatches[0]?.id || ''
  );

  const currentBatchData = React.useMemo(() => {
    if (iotData instanceof Map) {
      return iotData.get(selectedBatchId) || context.getBatchIoT(selectedBatchId);
    }
    if (iotData && typeof iotData === 'object' && 'temperature' in iotData) {
      return iotData;
    }
    return context.getBatchIoT(selectedBatchId);
  }, [iotData, selectedBatchId, context]);

  // Current values initialized from the selected batch's telemetry
  const [temperature, setTemperature] = useState<number>(currentBatchData.temperature);
  const [humidity, setHumidity] = useState<number>(currentBatchData.humidity);
  const [weight, setWeight] = useState<number>(currentBatchData.containerWeight);
  const [storageDuration, setStorageDuration] = useState<number>(currentBatchData.storageDurationHours);
  const [deviceStatus, setDeviceStatus] = useState<'Online' | 'Offline'>(currentBatchData.deviceStatus);

  // Sync state whenever selected batch changes
  React.useEffect(() => {
    setTemperature(currentBatchData.temperature);
    setHumidity(currentBatchData.humidity);
    setWeight(currentBatchData.containerWeight);
    setStorageDuration(currentBatchData.storageDurationHours);
    setDeviceStatus(currentBatchData.deviceStatus);
  }, [selectedBatchId, currentBatchData]);

  // Derive alert level
  const computeAlert = (temp: number, isOnline: boolean, dur: number) => {
    if (!isOnline) {
      return { level: 'red' as const, msg: 'Telemetry Offline: Sensor gateway communication lost.' };
    }
    if (temp > 20) {
      return { level: 'red' as const, msg: `CRITICAL THERMAL ABUSE: Temperature (${temp.toFixed(1)}°C) exceeds danger zone!` };
    }
    if (temp > 8) {
      return { level: 'yellow' as const, msg: `Temperature exceeds the prototype-configured storage threshold (${temp.toFixed(1)}°C > 8.0°C). Immediate human inspection advised.` };
    }
    if (dur > 6) {
      return { level: 'yellow' as const, msg: `Storage duration elevated (${dur} hours). Consume rapidly.` };
    }
    return { level: 'green' as const, msg: `Optimal Storage Condition (Safe temperature maintained at ${temp.toFixed(1)}°C).` };
  };

  const currentAlert = computeAlert(temperature, deviceStatus === 'Online', storageDuration);

  // Sync update
  const commitUpdate = (newTemp: number, newHum: number, newWeight: number, newDur: number, newStatus: 'Online' | 'Offline') => {
    const alert = computeAlert(newTemp, newStatus === 'Online', newDur);
    const newLogItem = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      temp: Math.round(newTemp * 10) / 10,
      humidity: Math.round(newHum),
      weight: Math.round(newWeight * 10) / 10,
      status: alert.level.toUpperCase()
    };

    const updatedData: VirtualIoTSensorData = {
      ...currentBatchData,
      batchId: selectedBatchId,
      temperature: Math.round(newTemp * 10) / 10,
      humidity: Math.round(newHum),
      containerWeight: Math.round(newWeight * 10) / 10,
      storageDurationHours: newDur,
      hoursRemaining: Math.max(0, 5 - newDur),
      deviceStatus: newStatus,
      lastUpdated: new Date().toISOString(),
      alertLevel: alert.level,
      alertMessage: alert.msg,
      readingsHistory: [newLogItem, ...(currentBatchData.readingsHistory || []).slice(0, 9)]
    };

    effectiveUpdateIoT(updatedData);
  };

  // Scenario 1: Normal Storage
  const handleScenarioNormal = () => {
    setTemperature(5.0);
    setHumidity(55);
    setWeight(14.0);
    setStorageDuration(2.0);
    setDeviceStatus('Online');
    commitUpdate(5.0, 55, 14.0, 2.0, 'Online');
    showToast('Scenario Applied', 'Simulating reading within the prototype-configured 8°C threshold (5.0°C, 55% RH, Online). Human approval remains mandatory.', 'success');
  };

  // Scenario 2: High Temperature
  const handleScenarioHighTemp = () => {
    setTemperature(28.0);
    setHumidity(68);
    setWeight(14.0);
    setStorageDuration(3.5);
    setDeviceStatus('Online');
    commitUpdate(28.0, 68, 14.0, 3.5, 'Online');
    showToast('Warning Scenario', 'Simulating High Temperature (28°C Thermal abuse warning triggered).', 'warning');
  };

  // Scenario 3: Expired Food
  const handleScenarioExpired = () => {
    setTemperature(22.0);
    setHumidity(75);
    setWeight(14.0);
    setStorageDuration(8.0);
    setDeviceStatus('Online');
    commitUpdate(22.0, 75, 14.0, 8.0, 'Online');
    showToast('Critical Scenario', 'Simulating Expired Food (Duration > 8 hours, deadline passed).', 'error');
  };

  // Scenario 4: Weight Reduction
  const handleScenarioWeightDrop = () => {
    const droppedWeight = Math.max(2.0, weight - 4.5);
    setWeight(droppedWeight);
    commitUpdate(temperature, humidity, droppedWeight, storageDuration, deviceStatus);
    showToast('Scale Simulation', `Simulating Weight Reduction (-4.5 kg). New weight: ${droppedWeight.toFixed(1)} kg.`, 'info');
  };

  // Scenario 5: Sensor Offline
  const handleScenarioOffline = () => {
    setDeviceStatus('Offline');
    commitUpdate(temperature, humidity, weight, storageDuration, 'Offline');
    showToast('Offline Simulation', 'Simulating IoT Gateway offline mode.', 'error');
  };

  // Scenario 6: Reset
  const handleScenarioReset = () => {
    handleScenarioNormal();
  };

  return (
    <div className="space-y-6">
      {/* Mandatory Software Simulation Banner */}
      <DisclaimerBanner 
        type="iot"
        customMessage="Software Simulation Mode: This page generates virtual IoT data. In production, these values can be received from sensors, weighing systems, smart storage units, or external kitchen APIs."
      />

      {/* Header & Batch Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
              Zero Physical Hardware Requirement
            </span>
            <span className="text-xs text-slate-400">Virtual IoT Simulator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Virtual IoT Kitchen Monitoring Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Emulate digital temperature probes, electronic load cells, and smart container gateways without any physical ESP32 or sensors.
          </p>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Simulate Batch:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => {
              setSelectedBatchId(e.target.value);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {effectiveBatches.map(b => (
              <option key={b.id} value={b.id}>
                {b.foodItem} ({b.remainingKg} kg) - {b.id.slice(-9)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time-style Sensor Cards (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Temperature */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Temperature</span>
            <Thermometer className={`w-4 h-4 ${temperature > 8 ? 'text-rose-500' : 'text-teal-600'}`} />
          </div>
          <div className={`text-2xl font-extrabold font-display ${temperature > 8 ? 'text-rose-600' : 'text-teal-700'}`}>
            {temperature.toFixed(1)}°C
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Threshold: ≤ 8°C</span>
        </div>

        {/* Card 2: Humidity */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-display">
            {humidity.toFixed(0)}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Relative RH</span>
        </div>

        {/* Card 3: Weight */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Container Weight</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-display">
            {weight.toFixed(1)} kg
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Digital load sensor</span>
        </div>

        {/* Card 4: Storage Duration */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Storage Duration</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-display">
            {storageDuration} hrs
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Elapsed time</span>
        </div>

        {/* Card 5: Time Remaining Before Deadline */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Time Remaining</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-display">
            {Math.max(0, 5 - storageDuration)} hrs
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Redistribution window</span>
        </div>

        {/* Card 6: Device Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Gateway Status</span>
            {deviceStatus === 'Online' ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <div className={`text-xl font-extrabold font-display flex items-center gap-1.5 ${
            deviceStatus === 'Online' ? 'text-emerald-700' : 'text-rose-600'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              deviceStatus === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`} />
            {deviceStatus}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Virtual IoT Node</span>
        </div>
      </div>

      {/* Alert Banner Indicator */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
        currentAlert.level === 'green'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : currentAlert.level === 'yellow'
          ? 'bg-amber-50 border-amber-300 text-amber-950'
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-white ${
            currentAlert.level === 'green' ? 'bg-emerald-600' : currentAlert.level === 'yellow' ? 'bg-amber-600' : 'bg-rose-600'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-wider">
              Telemetry Status Level: {currentAlert.level.toUpperCase()}
            </div>
            <div className="text-xs sm:text-sm font-medium mt-0.5">
              {currentAlert.msg}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Sync: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Two Column Grid: Interactive Sliders + Scenario Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders & Manual Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              Manual Sensor Calibration Sliders
            </h3>
            <span className="text-xs text-slate-400">Live Emulation</span>
          </div>

          {/* Slider 1: Temperature (0 - 50 °C) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Temperature Probe (°C)</span>
              <span className={`font-bold ${temperature > 8 ? 'text-rose-600' : 'text-teal-700'}`}>
                {temperature.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={temperature}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTemperature(val);
                commitUpdate(val, humidity, weight, storageDuration, deviceStatus);
              }}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0°C (Cold Storage)</span>
              <span className="text-emerald-600 font-bold">8°C (Safe Limit)</span>
              <span>50°C (Hot Abuse)</span>
            </div>
          </div>

          {/* Slider 2: Humidity (0 - 100 %) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Relative Humidity (%)</span>
              <span className="font-bold text-blue-700">{humidity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={humidity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setHumidity(val);
                commitUpdate(temperature, val, weight, storageDuration, deviceStatus);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0% (Dry)</span>
              <span>55% (Target)</span>
              <span>100% (Condensation)</span>
            </div>
          </div>

          {/* Slider 3: Container Weight (0 - 50 kg) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Container Weight (kg)</span>
              <span className="font-bold text-amber-700">{weight.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={weight}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setWeight(val);
                commitUpdate(temperature, humidity, val, storageDuration, deviceStatus);
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 kg (Empty)</span>
              <span>14 kg (Demo Surplus)</span>
              <span>50 kg (Full Vessel)</span>
            </div>
          </div>

          {/* Slider 4: Storage Duration (0 - 24 hrs) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Storage Duration (hours)</span>
              <span className="font-bold text-purple-700">{storageDuration} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={storageDuration}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setStorageDuration(val);
                commitUpdate(temperature, humidity, weight, val, deviceStatus);
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 hrs (Freshly Cooked)</span>
              <span>4 hrs (Use-by Threshold)</span>
              <span>24 hrs (Stale)</span>
            </div>
          </div>

          {/* Device Status Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Virtual Gateway Telemetry Link</span>
              <span className="text-[11px] text-slate-500">Toggle sensor communication with the cloud server</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const newStatus = deviceStatus === 'Online' ? 'Offline' : 'Online';
                setDeviceStatus(newStatus);
                commitUpdate(temperature, humidity, weight, storageDuration, newStatus);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                deviceStatus === 'Online'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {deviceStatus === 'Online' ? 'Set Offline' : 'Set Online'}
            </button>
          </div>
        </div>

        {/* Preset Scenarios Buttons (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Scenario Simulation Presets
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantly test how the system reacts to edge conditions during Hackathon demonstration.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleScenarioNormal}
                className="w-full p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Snowflake className="w-4 h-4 text-emerald-600" />
                  <span>Simulate Normal Storage (5°C, 55% RH)</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Normal</span>
              </button>

              <button
                type="button"
                onClick={handleScenarioHighTemp}
                className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Simulate High Temperature (28°C Spoilage Risk)</span>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Warning</span>
              </button>

              <button
                type="button"
                onClick={handleScenarioExpired}
                className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/70 text-rose-950 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Simulate Expired Food (Past Use-By Deadline)</span>
                </div>
                <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">Expired</span>
              </button>

              <button
                type="button"
                onClick={handleScenarioWeightDrop}
                className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-950 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <span>Simulate Weight Reduction (Partial Dispense)</span>
                </div>
                <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">Delta</span>
              </button>

              <button
                type="button"
                onClick={handleScenarioOffline}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <WifiOff className="w-4 h-4 text-slate-600" />
                  <span>Simulate Sensor Offline (Connection Drop)</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">Offline</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleScenarioReset}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulation Parameters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Trend Line Charts (Recharts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Temperature Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-teal-600" />
              Temperature Profile (°C)
            </h4>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Safe ≤ 8°C</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentBatchData.readingsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 35]} unit="°C" />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" />
              Humidity Profile (%)
            </h4>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">RH %</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentBatchData.readingsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[30, 90]} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="humidity" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Container Weight Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              Weight Profile (kg)
            </h4>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Mass</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentBatchData.readingsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 25]} unit="kg" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Timestamped Sensor Readings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Timestamped Sensor Telemetry Log
          </h3>
          <span className="text-xs text-slate-400">Continuous sampling stream</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Temperature</th>
                <th className="px-4 py-2.5">Humidity</th>
                <th className="px-4 py-2.5">Weight (kg)</th>
                <th className="px-4 py-2.5">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentBatchData.readingsHistory && currentBatchData.readingsHistory.length > 0 ? (
                currentBatchData.readingsHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="px-4 py-2.5 font-mono text-slate-600">{item.timestamp}</td>
                    <td className="px-4 py-2.5 font-bold text-teal-700">{item.temp}°C</td>
                    <td className="px-4 py-2.5 font-medium text-blue-700">{item.humidity}%</td>
                    <td className="px-4 py-2.5 font-medium text-amber-700">{item.weight} kg</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'NORMAL' || item.status === 'GREEN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'YELLOW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No log readings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
