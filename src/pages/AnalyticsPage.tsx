import React from 'react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { patients, healthMetrics } = useHealthData();

  // Calculate statistics
  const riskDistribution = [
    { name: 'Low', value: patients.filter(p => p.riskLevel === 'low').length, color: 'hsl(var(--success))' },
    { name: 'Medium', value: patients.filter(p => p.riskLevel === 'medium').length, color: 'hsl(var(--warning))' },
    { name: 'High', value: patients.filter(p => p.riskLevel === 'high').length, color: 'hsl(var(--chart-4))' },
    { name: 'Critical', value: patients.filter(p => p.riskLevel === 'critical').length, color: 'hsl(var(--destructive))' },
  ];

  const diabetesTypeData = [
    { name: 'Type 1', count: patients.filter(p => p.diabetesType === 'Type 1').length },
    { name: 'Type 2', count: patients.filter(p => p.diabetesType === 'Type 2').length },
    { name: 'Pre-diabetic', count: patients.filter(p => p.diabetesType === 'Pre-diabetic').length },
    { name: 'None', count: patients.filter(p => p.diabetesType === 'None').length },
  ];

  const ageDistribution = [
    { range: '18-30', count: patients.filter(p => p.age >= 18 && p.age < 30).length },
    { range: '30-45', count: patients.filter(p => p.age >= 30 && p.age < 45).length },
    { range: '45-60', count: patients.filter(p => p.age >= 45 && p.age < 60).length },
    { range: '60+', count: patients.filter(p => p.age >= 60).length },
  ];

  const avgGlucose = patients.reduce((sum, p) => sum + p.glucoseLevel, 0) / patients.length;
  const avgBMI = patients.reduce((sum, p) => sum + p.bmi, 0) / patients.length;
  const avgHbA1c = patients.reduce((sum, p) => sum + p.hba1c, 0) / patients.length;

  // Weekly trend data (mock)
  const weeklyTrend = [
    { day: 'Mon', patients: 12, checkups: 8, alerts: 3 },
    { day: 'Tue', patients: 15, checkups: 12, alerts: 5 },
    { day: 'Wed', patients: 18, checkups: 14, alerts: 2 },
    { day: 'Thu', patients: 14, checkups: 10, alerts: 4 },
    { day: 'Fri', patients: 20, checkups: 16, alerts: 6 },
    { day: 'Sat', patients: 8, checkups: 5, alerts: 1 },
    { day: 'Sun', patients: 6, checkups: 4, alerts: 2 },
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const glucoseTrend = healthMetrics.map(m => ({
    time: formatTime(m.timestamp),
    glucose: Math.round(m.glucose),
    normal: 100,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive health analytics and patient insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="metric">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Glucose</p>
                <p className="text-3xl font-bold mt-1">{avgGlucose.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className={`flex items-center gap-1 ${avgGlucose > 126 ? 'text-destructive' : 'text-success'}`}>
                {avgGlucose > 126 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-sm font-medium">{avgGlucose > 126 ? 'High' : 'Normal'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="metric">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average BMI</p>
                <p className="text-3xl font-bold mt-1">{avgBMI.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg/m²</p>
              </div>
              <div className={`flex items-center gap-1 ${avgBMI > 25 ? 'text-warning' : 'text-success'}`}>
                {avgBMI > 25 ? <TrendingUp className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                <span className="text-sm font-medium">{avgBMI > 30 ? 'Obese' : avgBMI > 25 ? 'Overweight' : 'Healthy'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="metric">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average HbA1c</p>
                <p className="text-3xl font-bold mt-1">{avgHbA1c.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">3-month average</p>
              </div>
              <div className={`flex items-center gap-1 ${avgHbA1c > 6.5 ? 'text-destructive' : avgHbA1c > 5.7 ? 'text-warning' : 'text-success'}`}>
                <Activity className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {avgHbA1c > 6.5 ? 'Diabetic' : avgHbA1c > 5.7 ? 'Pre-diabetic' : 'Normal'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Patient Risk Distribution
            </CardTitle>
            <CardDescription>Breakdown by diabetes risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Diabetes Type Distribution */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Diabetes Type Distribution
            </CardTitle>
            <CardDescription>Patient count by diagnosis type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diabetesTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Trend */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Patient visits, checkups, and alerts this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="patients" fill="hsl(var(--primary))" name="Patients" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="checkups" fill="hsl(var(--accent))" name="Checkups" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="alerts" fill="hsl(var(--destructive))" name="Alerts" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Age Distribution
            </CardTitle>
            <CardDescription>Patient demographics by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ageDistribution}>
                  <defs>
                    <linearGradient id="ageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#ageGradient)"
                    name="Patients"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Glucose Trend */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            24-Hour Glucose Trend Analysis
          </CardTitle>
          <CardDescription>Average patient glucose levels with normal range indicator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={glucoseTrend}>
                <defs>
                  <linearGradient id="glucoseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 220]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="normal"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Normal Threshold"
                />
                <Area
                  type="monotone"
                  dataKey="glucose"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#glucoseAreaGradient)"
                  name="Glucose Level"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
