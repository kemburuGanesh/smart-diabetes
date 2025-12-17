import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  bloodType: string;
  diabetesType?: 'Type 1' | 'Type 2' | 'Pre-diabetic' | 'None';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastCheckup: string;
  glucoseLevel: number;
  hba1c: number;
  bmi: number;
  bloodPressure: { systolic: number; diastolic: number };
  insulinLevel: number;
  cholesterol: number;
  heartRate: number;
  status: 'stable' | 'monitoring' | 'critical';
}

export interface HealthMetric {
  timestamp: string;
  glucose: number;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  isRead: boolean;
  metric?: string;
  value?: number;
}

interface HealthDataContextType {
  patients: Patient[];
  alerts: Alert[];
  selectedPatient: Patient | null;
  healthMetrics: HealthMetric[];
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  markAlertAsRead: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

// Mock data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 52,
    gender: 'male',
    email: 'john.smith@email.com',
    phone: '+1 234-567-8901',
    bloodType: 'A+',
    diabetesType: 'Type 2',
    riskLevel: 'medium',
    lastCheckup: '2024-01-10',
    glucoseLevel: 145,
    hba1c: 7.2,
    bmi: 28.5,
    bloodPressure: { systolic: 135, diastolic: 85 },
    insulinLevel: 15,
    cholesterol: 210,
    heartRate: 78,
    status: 'monitoring',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'female',
    email: 'sarah.j@email.com',
    phone: '+1 234-567-8902',
    bloodType: 'O+',
    diabetesType: 'Pre-diabetic',
    riskLevel: 'low',
    lastCheckup: '2024-01-12',
    glucoseLevel: 110,
    hba1c: 5.8,
    bmi: 24.2,
    bloodPressure: { systolic: 120, diastolic: 78 },
    insulinLevel: 12,
    cholesterol: 185,
    heartRate: 72,
    status: 'stable',
  },
  {
    id: '3',
    name: 'Michael Chen',
    age: 61,
    gender: 'male',
    email: 'michael.chen@email.com',
    phone: '+1 234-567-8903',
    bloodType: 'B+',
    diabetesType: 'Type 2',
    riskLevel: 'high',
    lastCheckup: '2024-01-08',
    glucoseLevel: 210,
    hba1c: 8.5,
    bmi: 32.1,
    bloodPressure: { systolic: 150, diastolic: 95 },
    insulinLevel: 25,
    cholesterol: 245,
    heartRate: 88,
    status: 'critical',
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 38,
    gender: 'female',
    email: 'emily.d@email.com',
    phone: '+1 234-567-8904',
    bloodType: 'AB-',
    diabetesType: 'Type 1',
    riskLevel: 'medium',
    lastCheckup: '2024-01-11',
    glucoseLevel: 125,
    hba1c: 6.8,
    bmi: 22.8,
    bloodPressure: { systolic: 118, diastolic: 75 },
    insulinLevel: 18,
    cholesterol: 178,
    heartRate: 68,
    status: 'stable',
  },
  {
    id: '5',
    name: 'Robert Wilson',
    age: 67,
    gender: 'male',
    email: 'robert.w@email.com',
    phone: '+1 234-567-8905',
    bloodType: 'O-',
    diabetesType: 'Type 2',
    riskLevel: 'critical',
    lastCheckup: '2024-01-09',
    glucoseLevel: 280,
    hba1c: 9.2,
    bmi: 35.8,
    bloodPressure: { systolic: 165, diastolic: 102 },
    insulinLevel: 32,
    cholesterol: 275,
    heartRate: 95,
    status: 'critical',
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    patientId: '5',
    patientName: 'Robert Wilson',
    type: 'critical',
    message: 'Blood glucose level critically high (280 mg/dL)',
    timestamp: new Date().toISOString(),
    isRead: false,
    metric: 'glucose',
    value: 280,
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Michael Chen',
    type: 'warning',
    message: 'Blood pressure elevated (150/95 mmHg)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    metric: 'bloodPressure',
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'John Smith',
    type: 'info',
    message: 'Scheduled checkup reminder for tomorrow',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: true,
  },
  {
    id: '4',
    patientId: '5',
    patientName: 'Robert Wilson',
    type: 'critical',
    message: 'HbA1c level requires immediate attention (9.2%)',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
    metric: 'hba1c',
    value: 9.2,
  },
];

// Generate mock health metrics for charts
const generateMockMetrics = (): HealthMetric[] => {
  const metrics: HealthMetric[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600000);
    metrics.push({
      timestamp: timestamp.toISOString(),
      glucose: 100 + Math.random() * 80 + Math.sin(i / 4) * 20,
      heartRate: 70 + Math.random() * 20,
      bloodPressure: {
        systolic: 115 + Math.random() * 25,
        diastolic: 70 + Math.random() * 15,
      },
      oxygenSaturation: 95 + Math.random() * 4,
      temperature: 36.5 + Math.random() * 1,
    });
  }
  
  return metrics;
};

export const HealthDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [healthMetrics] = useState<HealthMetric[]>(generateMockMetrics());

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  return (
    <HealthDataContext.Provider
      value={{
        patients,
        alerts,
        selectedPatient,
        healthMetrics,
        setSelectedPatient,
        addPatient,
        updatePatient,
        markAlertAsRead,
        getPatientById,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};
