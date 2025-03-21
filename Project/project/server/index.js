import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Enhanced radar signal generation
function generateRadarSignal() {
  const baseFrequency = 2000 + Math.random() * 1000; // 2-3 GHz
  const signalTypes = ['Pulse', 'FM', 'AM', 'FMCW', 'Chirp'];
  const threats = ['Fighter Jet', 'SAM Site', 'UAV', 'Ground Radar'];
  
  return {
    frequency: baseFrequency,
    amplitude: Math.random() * 100,
    pri: Math.random() * 1000 + 500, // 500-1500 μs
    modulation: signalTypes[Math.floor(Math.random() * signalTypes.length)],
    pulseWidth: Math.random() * 20 + 1, // 1-21 μs
    bandwidth: Math.random() * 100 + 50, // 50-150 MHz
    threatLevel: Math.random() * 100,
    signalToNoise: Math.random() * 30 + 10, // 10-40 dB
    doppler: Math.random() * 1000 - 500, // -500 to +500 Hz
    classification: threats[Math.floor(Math.random() * threats.length)],
    timestamp: new Date().toISOString(),
    coordinates: {
      latitude: (Math.random() * 180 - 90).toFixed(6),
      longitude: (Math.random() * 360 - 180).toFixed(6),
      altitude: Math.round(Math.random() * 30000) // 0-30000 feet
    }
  };
}

// Real-time radar signal endpoint with enhanced data
app.get('/radar-signal', (req, res) => {
  const signal = generateRadarSignal();
  const analysis = {
    signal,
    threatAssessment: {
      level: Math.random() * 100,
      confidence: Math.random() * 100,
      classification: signal.classification,
      recommendedActions: [
        'Engage electronic countermeasures',
        'Modify radar signature',
        'Deploy chaff/flares',
        'Change altitude/heading'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    },
    environmentalConditions: {
      temperature: 20 + Math.random() * 10,
      humidity: Math.random() * 100,
      interference: Math.random() * 50
    }
  };
  res.json(analysis);
});

// Enhanced signal analysis endpoint
app.get('/signal-analysis', (req, res) => {
  const duration = parseInt(req.query.duration) || 60;
  const signals = Array.from({ length: duration }, () => generateRadarSignal());
  
  const analysis = {
    averageFrequency: signals.reduce((acc, sig) => acc + sig.frequency, 0) / signals.length,
    peakAmplitude: Math.max(...signals.map(sig => sig.amplitude)),
    signalStatistics: {
      frequencyRange: {
        min: Math.min(...signals.map(sig => sig.frequency)),
        max: Math.max(...signals.map(sig => sig.frequency))
      },
      modulationTypes: [...new Set(signals.map(sig => sig.modulation))],
      averageSNR: signals.reduce((acc, sig) => acc + sig.signalToNoise, 0) / signals.length
    },
    threatAssessment: {
      level: Math.random() * 100,
      confidence: Math.random() * 100,
      detectedThreats: signals
        .map(sig => sig.classification)
        .filter((v, i, a) => a.indexOf(v) === i),
      recommendations: [
        'Adjust countermeasure frequency',
        'Deploy electronic warfare suite',
        'Modify signal pattern',
        'Engage stealth protocols'
      ]
    },
    signals
  };
  
  res.json(analysis);
});

// Enhanced system status endpoint
app.get('/system-status', (req, res) => {
  res.json({
    status: 'operational',
    uptime: process.uptime(),
    lastMaintenance: new Date(Date.now() - 86400000).toISOString(),
    systemHealth: {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      signalProcessing: Math.random() * 100,
      networkLatency: Math.random() * 50,
      sensorStatus: {
        primary: 'optimal',
        secondary: 'operational',
        auxiliary: 'standby'
      }
    },
    countermeasures: {
      ecm: {
        status: 'active',
        effectiveness: Math.random() * 100
      },
      stealth: {
        status: 'engaged',
        signatureReduction: Math.random() * 100
      }
    },
    alerts: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
      type: ['warning', 'critical', 'info'][Math.floor(Math.random() * 3)],
      message: 'Anomalous signal pattern detected',
      timestamp: new Date().toISOString()
    }))
  });
});

app.listen(port, () => {
  console.log(`Enhanced Anti-Radar System server running on port ${port}`);
});