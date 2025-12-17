import React, { useState } from 'react';
import { useHealthData, Patient } from '@/contexts/HealthDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Activity,
  Heart,
  Droplets,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PatientsPage: React.FC = () => {
  const { patients, addPatient, selectedPatient, setSelectedPatient } = useHealthData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<{
    name: string;
    age: string;
    gender: 'male' | 'female' | 'other';
    email: string;
    phone: string;
    bloodType: string;
  }>({
    name: '',
    age: '',
    gender: 'male',
    email: '',
    phone: '',
    bloodType: '',
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    addPatient({
      name: newPatient.name,
      age: parseInt(newPatient.age) || 0,
      gender: newPatient.gender,
      email: newPatient.email,
      phone: newPatient.phone,
      bloodType: newPatient.bloodType || 'Unknown',
      diabetesType: 'None',
      riskLevel: 'low',
      lastCheckup: new Date().toISOString().split('T')[0],
      glucoseLevel: 100,
      hba1c: 5.5,
      bmi: 22,
      bloodPressure: { systolic: 120, diastolic: 80 },
      insulinLevel: 10,
      cholesterol: 180,
      heartRate: 72,
      status: 'stable',
    });

    toast({
      title: 'Success',
      description: 'Patient added successfully',
    });

    setIsAddDialogOpen(false);
    setNewPatient({ name: '', age: '', gender: 'male', email: '', phone: '', bloodType: '' });
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive';
      case 'monitoring': return 'bg-warning';
      default: return 'bg-success';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all your patients in one place.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <UserPlus className="w-4 h-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter patient details to create a new record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    placeholder="45"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value) =>
                      setNewPatient({ ...newPatient, gender: value as 'male' | 'female' | 'other' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  placeholder="patient@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="+1 234-567-8900"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={newPatient.bloodType}
                    onValueChange={(value) => setNewPatient({ ...newPatient, bloodType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPatient}>Add Patient</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Diabetes Type</TableHead>
                <TableHead className="hidden lg:table-cell">Glucose</TableHead>
                <TableHead className="hidden lg:table-cell">HbA1c</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${getStatusColor(patient.status)} flex items-center justify-center text-primary-foreground font-semibold text-sm`}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.age} yrs • {patient.gender}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(patient.status)}`} />
                      <span className="capitalize text-sm">{patient.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.diabetesType || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-primary" />
                      {patient.glucoseLevel} mg/dL
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {patient.hba1c}%
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>
                      {patient.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${getStatusColor(selectedPatient.status)} flex items-center justify-center text-primary-foreground font-semibold`}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {selectedPatient.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedPatient.email} • {selectedPatient.phone}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                <Card variant="metric">
                  <CardContent className="p-4 text-center">
                    <Droplets className="w-6 h-6 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{selectedPatient.glucoseLevel}</p>
                    <p className="text-xs text-muted-foreground">Glucose (mg/dL)</p>
                  </CardContent>
                </Card>
                <Card variant="metric">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto text-accent mb-2" />
                    <p className="text-2xl font-bold">{selectedPatient.hba1c}%</p>
                    <p className="text-xs text-muted-foreground">HbA1c</p>
                  </CardContent>
                </Card>
                <Card variant="metric">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-6 h-6 mx-auto text-destructive mb-2" />
                    <p className="text-2xl font-bold">{selectedPatient.heartRate}</p>
                    <p className="text-xs text-muted-foreground">Heart Rate (bpm)</p>
                  </CardContent>
                </Card>
                <Card variant="metric">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto text-warning mb-2" />
                    <p className="text-2xl font-bold">{selectedPatient.bloodPressure.systolic}/{selectedPatient.bloodPressure.diastolic}</p>
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedPatient.age} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{selectedPatient.bloodType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">BMI</p>
                  <p className="font-medium">{selectedPatient.bmi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cholesterol</p>
                  <p className="font-medium">{selectedPatient.cholesterol} mg/dL</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Diabetes Type</p>
                  <p className="font-medium">{selectedPatient.diabetesType || 'Not diagnosed'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Checkup</p>
                  <p className="font-medium">{selectedPatient.lastCheckup}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsPage;
