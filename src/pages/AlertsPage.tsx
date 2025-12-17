import React from 'react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Clock,
  User,
  Activity,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, getPatientById } = useHealthData();

  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.isRead);
  const warningAlerts = alerts.filter(a => a.type === 'warning' && !a.isRead);
  const infoAlerts = alerts.filter(a => a.type === 'info' && !a.isRead);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  const getAlertStyle = (type: string, isRead: boolean) => {
    const base = isRead ? 'opacity-60' : '';
    switch (type) {
      case 'critical':
        return `${base} border-l-4 border-l-destructive bg-destructive/5`;
      case 'warning':
        return `${base} border-l-4 border-l-warning bg-warning/5`;
      default:
        return `${base} border-l-4 border-l-info bg-info/5`;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAlertAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    alerts.forEach(alert => {
      if (!alert.isRead) {
        markAlertAsRead(alert.id);
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time health alerts and system notifications
          </p>
        </div>
        <Button variant="outline" onClick={handleMarkAllAsRead}>
          <Check className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="danger">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-3xl font-bold mt-1 text-destructive">{criticalAlerts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning Alerts</p>
                <p className="text-3xl font-bold mt-1 text-warning">{warningAlerts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Information</p>
                <p className="text-3xl font-bold mt-1 text-info">{infoAlerts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Info className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Click on an alert to mark it as read
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No alerts at this time</p>
              </div>
            ) : (
              sortedAlerts.map((alert) => {
                const patient = getPatientById(alert.patientId);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${getAlertStyle(alert.type, alert.isRead)}`}
                    onClick={() => handleMarkAsRead(alert.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{alert.patientName}</span>
                          <Badge
                            variant={
                              alert.type === 'critical' ? 'destructive' :
                              alert.type === 'warning' ? 'outline' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {alert.type}
                          </Badge>
                          {!alert.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                          </span>
                          {alert.metric && (
                            <span className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {alert.metric}: {alert.value}
                            </span>
                          )}
                          {patient && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {patient.diabetesType || 'Not diagnosed'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(alert.id);
                          }}
                          disabled={alert.isRead}
                        >
                          {alert.isRead ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            'Mark as Read'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;
