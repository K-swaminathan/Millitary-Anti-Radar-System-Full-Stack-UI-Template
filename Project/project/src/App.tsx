import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Activity, AlertTriangle, Power, Signal, Crosshair, Radar, Target, Zap, ShieldAlert, Siren, MapPin, Wifi, Radio as Radio2, Waypoints, Waves } from 'lucide-react';
import axios from 'axios';

// Radar Grid Component
function RadarGrid() {
  return (
    <div className="absolute inset-0">
      {/* Concentric circles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-green-500/10"
          style={{
            top: `${i * 10}%`,
            left: `${i * 10}%`,
            width: `${100 - i * 20}%`,
            height: `${100 - i * 20}%`,
          }}
        />
      ))}
      {/* Crosshair lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-green-500/10" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-green-500/10" />
      </div>
      {/* Degree markers */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
        <div
          key={degree}
          className="absolute top-1/2 left-1/2 origin-left -translate-y-1/2 text-green-500/30 text-xs"
          style={{ transform: `rotate(${degree}deg) translateX(48%)` }}
        >
          {degree}°
        </div>
      ))}
    </div>
  );
}

// Enhanced Radar Sweep
function RadarSweep() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-green-500/60 to-transparent origin-left"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '0 50%' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-green-500/20 origin-left"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '0 50%' }}
        />
      </div>
    </div>
  );
}

// Target Marker Component
function TargetMarker({ signal, onHover }: { signal: any; onHover: (data: any) => void }) {
  const markerColors = {
    hostile: 'bg-red-500',
    friendly: 'bg-green-500',
    unknown: 'bg-yellow-500'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute"
      style={{
        top: `${50 + Math.cos(signal.bearing * Math.PI / 180) * signal.distance/2}%`,
        left: `${50 + Math.sin(signal.bearing * Math.PI / 180) * signal.distance/2}%`
      }}
      onMouseEnter={() => onHover(signal)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className={`w-3 h-3 rounded-full ${markerColors[signal.type]} relative`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className={`absolute inset-0 ${markerColors[signal.type]} rounded-full`}
          animate={{ scale: [1, 2], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [radarData, setRadarData] = useState({
    frequency: 2500,
    signalStrength: 75,
    threats: [],
    jamming: {
      status: 'active',
      effectiveness: 85
    },
    stealthStatus: {
      camouflageLevel: 90,
      detection: 'minimal'
    },
    detectedSignals: []
  });

  const [selectedTarget, setSelectedTarget] = useState(null);
  const [threatLevel, setThreatLevel] = useState(0);
  const [systemStatus, setSystemStatus] = useState({
    signalProcessing: 98,
    aiAnalysis: 95,
    countermeasures: 87,
    powerOutput: 92
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [signalRes, statusRes] = await Promise.all([
          axios.get('http://localhost:3000/radar-signal'),
          axios.get('http://localhost:3000/system-status')
        ]);

        setThreatLevel(signalRes.data.threatLevel);
        setSystemStatus(prev => ({
          ...prev,
          signalProcessing: statusRes.data.systemHealth.signalProcessing
        }));

        // Generate realistic target data
        const targets = Array.from({ length: 5 }, () => ({
          id: Math.random().toString(36),
          type: ['hostile', 'friendly', 'unknown'][Math.floor(Math.random() * 3)],
          distance: Math.round(Math.random() * 100),
          bearing: Math.round(Math.random() * 360),
          speed: Math.round(Math.random() * 1000),
          altitude: Math.round(Math.random() * 30000),
          coordinates: {
            lat: (Math.random() * 180 - 90).toFixed(6),
            lon: (Math.random() * 360 - 180).toFixed(6)
          }
        }));

        setRadarData(prev => ({
          ...prev,
          detectedSignals: targets
        }));
      } catch (error) {
        console.error('Error fetching radar data:', error);
      }
    };

    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f18] text-green-400 font-mono">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-green-900/30 bg-[#0a0f18]/90 backdrop-blur-lg fixed w-full top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-green-500">
                MILITARY ANTI-RADAR DEFENSE SYSTEM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded"
              >
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">SYSTEM ACTIVE</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-12 gap-6">
          {/* Enhanced Radar Display */}
          <div className="col-span-8 bg-[#0a1f1c]/40 border border-green-500/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Radar className="w-5 h-5 mr-2" />
                TACTICAL RADAR DISPLAY
              </h2>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">LAT: 51°30'N</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">LONG: 0°7'W</span>
                </div>
                <div className="flex items-center">
                  <Wifi className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">RANGE: 200KM</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-square bg-black/50 rounded-full border border-green-500/30 overflow-hidden">
              <RadarGrid />
              <RadarSweep />
              {radarData.detectedSignals.map((signal) => (
                <TargetMarker
                  key={signal.id}
                  signal={signal}
                  onHover={setSelectedTarget}
                />
              ))}
            </div>

            {/* Target Information Panel */}
            <AnimatePresence>
              {selectedTarget && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-8 left-8 bg-black/80 border border-green-500/30 rounded-lg p-4 text-sm"
                >
                  <h3 className="font-bold mb-2">TARGET INFORMATION</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>Type: {selectedTarget.type.toUpperCase()}</p>
                      <p>Distance: {selectedTarget.distance}km</p>
                      <p>Bearing: {selectedTarget.bearing}°</p>
                    </div>
                    <div>
                      <p>Speed: {selectedTarget.speed}km/h</p>
                      <p>Altitude: {selectedTarget.altitude}ft</p>
                      <p>Coordinates: {selectedTarget.coordinates.lat}, {selectedTarget.coordinates.lon}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Control Panel */}
          <div className="col-span-4 space-y-6">
            {/* Threat Assessment */}
            <motion.div 
              className="bg-[#0a1f1c]/40 border border-green-500/30 rounded-lg p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-lg font-bold flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 mr-2" />
                THREAT ANALYSIS
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Threat Level</span>
                    <span className={threatLevel > 70 ? 'text-red-500' : 'text-green-500'}>
                      {Math.round(threatLevel)}%
                    </span>
                  </div>
                  <div className="h-2 bg-black/30 rounded">
                    <motion.div
                      className={`h-full rounded ${
                        threatLevel > 70 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${threatLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Countermeasures */}
            <motion.div 
              className="bg-[#0a1f1c]/40 border border-green-500/30 rounded-lg p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-lg font-bold flex items-center mb-4">
                <Signal className="w-5 h-5 mr-2" />
                COUNTERMEASURES
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-green-500/30 rounded">
                    <div className="flex items-center justify-between">
                      <span>ECM Status</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-green-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="p-3 border border-green-500/30 rounded">
                    <div className="flex items-center justify-between">
                      <span>Jamming</span>
                      <span className="text-green-500">ACTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 border border-green-500/30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span>Stealth System</span>
                    <span className="text-green-500">92%</span>
                  </div>
                  <div className="h-1 bg-black/30 rounded">
                    <motion.div
                      className="h-full rounded bg-green-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '92%' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div 
              className="bg-[#0a1f1c]/40 border border-green-500/30 rounded-lg p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-lg font-bold flex items-center mb-4">
                <ShieldAlert className="w-5 h-5 mr-2" />
                SYSTEM STATUS
              </h2>
              <div className="space-y-4">
                {Object.entries(systemStatus).map(([key, value]) => (
                  <div key={key} className="p-3 border border-green-500/30 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                      <span className="text-green-500">{value}%</span>
                    </div>
                    <div className="h-1 bg-black/30 rounded">
                      <motion.div
                        className="h-full rounded bg-green-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;