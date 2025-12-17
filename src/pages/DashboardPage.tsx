import React from 'react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  Heart,
  Droplets,
  Thermometer,
  Zap,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { patients, alerts, healthMetrics } = useHealthData();
  const { user } = useAuth();

  const criticalPatients = patients.filter(p => p.status === 'critical').length;
  const monitoringPatients = patients.filter(p => p.status === 'monitoring').length;
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = healthMetrics.map(m => ({
    time: formatTime(m.timestamp),
    glucose: Math.round(m.glucose),
    heartRate: Math.round(m.heartRate),
    systolic: Math.round(m.bloodPressure.systolic),
  }));

  const metricCards = [
    {
      title: 'Total Patients',
      value: patients.length,
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Critical Cases',
      value: criticalPatients,
      change: '-8%',
      isPositive: true,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Under Monitoring',
      value: monitoringPatients,
      change: '+5%',
      isPositive: false,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Active Alerts',
      value: unreadAlerts,
      change: '-15%',
      isPositive: true,
      icon: Zap,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const recentPatients = patients.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-gradient">{user?.name || 'Doctor'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your patients today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            System Online
          </div>
          <Link to="/dashboard/diagnosis">
            <Button variant="hero">
              New Diagnosis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card
            key={metric.title}
            variant="metric"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold mt-2">{metric.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${metric.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {metric.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {metric.change} from last week
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Glucose Monitoring Chart */}
        <Card variant="default" className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  Glucose Levels (24h)
                </CardTitle>
                <CardDescription>Average patient glucose monitoring</CardDescription>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 200]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="glucose"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#glucoseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate & BP Chart */}
        <Card variant="default" className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-destructive" />
                  Vital Signs (24h)
                </CardTitle>
                <CardDescription>Heart rate and blood pressure trends</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                    name="Heart Rate"
                  />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                    name="Systolic BP"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <Card variant="default" className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Patients</CardTitle>
              <Link to="/dashboard/patients">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-primary-foreground ${
                      patient.status === 'critical' ? 'bg-destructive' :
                      patient.status === 'monitoring' ? 'bg-warning' : 'bg-success'
                    }`}>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.diabetesType} • {patient.age} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{patient.glucoseLevel} mg/dL</p>
                      <p className="text-xs text-muted-foreground">Glucose</p>
                    </div>
                    <Badge
                      variant={
                        patient.riskLevel === 'critical' ? 'destructive' :
                        patient.riskLevel === 'high' ? 'destructive' :
                        patient.riskLevel === 'medium' ? 'outline' : 'secondary'
                      }
                    >
                      {patient.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card variant="default" className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <Link to="/dashboard/alerts">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'border-l-destructive bg-destructive/5' :
                    alert.type === 'warning' ? 'border-l-warning bg-warning/5' :
                    'border-l-info bg-info/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{alert.patientName}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                    {!alert.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
