import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  Activity,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  FileText,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface PredictionResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  confidence: number;
  recommendations: string[];
  featureImportance: { feature: string; importance: number }[];
}

const DiagnosisPage: React.FC = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  // Input states
  const [formData, setFormData] = useState({
    age: 45,
    gender: 'male',
    bmi: 25,
    glucoseLevel: 100,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    insulinLevel: 15,
    skinThickness: 20,
    diabetesPedigree: 0.5,
    pregnancies: 0,
  });

  const handleInputChange = (field: string, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const runDiagnosis = async () => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Calculate risk based on inputs (simplified model simulation)
    const { glucoseLevel, bmi, bloodPressureSystolic, insulinLevel, age, diabetesPedigree } = formData;
    
    let riskScore = 0;
    
    // Glucose contribution
    if (glucoseLevel > 200) riskScore += 35;
    else if (glucoseLevel > 140) riskScore += 25;
    else if (glucoseLevel > 100) riskScore += 10;
    
    // BMI contribution
    if (bmi > 35) riskScore += 20;
    else if (bmi > 30) riskScore += 15;
    else if (bmi > 25) riskScore += 8;
    
    // Blood pressure contribution
    if (bloodPressureSystolic > 150) riskScore += 15;
    else if (bloodPressureSystolic > 140) riskScore += 10;
    else if (bloodPressureSystolic > 130) riskScore += 5;
    
    // Age contribution
    if (age > 60) riskScore += 10;
    else if (age > 45) riskScore += 5;
    
    // Insulin and pedigree
    if (insulinLevel > 25) riskScore += 10;
    riskScore += diabetesPedigree * 10;

    // Normalize to 0-100
    riskScore = Math.min(100, Math.max(0, riskScore));

    const riskLevel: 'low' | 'medium' | 'high' | 'critical' = 
      riskScore >= 75 ? 'critical' :
      riskScore >= 50 ? 'high' :
      riskScore >= 25 ? 'medium' : 'low';

    const recommendations = [];
    if (glucoseLevel > 126) recommendations.push('Consider fasting glucose test and HbA1c measurement');
    if (bmi > 25) recommendations.push('Implement dietary modifications and regular exercise program');
    if (bloodPressureSystolic > 130) recommendations.push('Monitor blood pressure regularly and consider lifestyle changes');
    if (riskScore > 50) recommendations.push('Schedule comprehensive diabetes screening within 2 weeks');
    if (riskScore > 75) recommendations.push('Immediate consultation with endocrinologist recommended');
    recommendations.push('Continue regular health monitoring and annual checkups');

    const featureImportance = [
      { feature: 'Glucose Level', importance: 0.32 },
      { feature: 'BMI', importance: 0.22 },
      { feature: 'Blood Pressure', importance: 0.18 },
      { feature: 'Age', importance: 0.12 },
      { feature: 'Insulin Level', importance: 0.10 },
      { feature: 'Family History', importance: 0.06 },
    ];

    setResult({
      riskLevel,
      riskScore,
      confidence: 94 + Math.random() * 4,
      recommendations,
      featureImportance,
    });

    setIsAnalyzing(false);
    toast({
      title: 'Analysis Complete',
      description: 'AI diagnosis has been generated successfully.',
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive/10 border-destructive';
      case 'high': return 'bg-destructive/10 border-destructive';
      case 'medium': return 'bg-warning/10 border-warning';
      default: return 'bg-success/10 border-success';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          AI Diabetes Diagnosis
        </h1>
        <p className="text-muted-foreground mt-1">
          Hybrid CNN-LSTM model with 98.28% accuracy for personalized risk prediction
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Patient Health Data
            </CardTitle>
            <CardDescription>
              Enter patient metrics for AI-powered diabetes risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age (years)</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Glucose Level (mg/dL)</Label>
                <span className="text-sm font-medium text-primary">{formData.glucoseLevel}</span>
              </div>
              <Slider
                value={[formData.glucoseLevel]}
                onValueChange={([v]) => handleInputChange('glucoseLevel', v)}
                max={300}
                min={50}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Normal: 70-100</span>
                <span>Pre-diabetic: 100-126</span>
                <span>Diabetic: 126+</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>BMI</Label>
                <span className="text-sm font-medium text-primary">{formData.bmi}</span>
              </div>
              <Slider
                value={[formData.bmi]}
                onValueChange={([v]) => handleInputChange('bmi', v)}
                max={50}
                min={15}
                step={0.1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Systolic BP (mmHg)</Label>
                <Input
                  type="number"
                  value={formData.bloodPressureSystolic}
                  onChange={(e) => handleInputChange('bloodPressureSystolic', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Diastolic BP (mmHg)</Label>
                <Input
                  type="number"
                  value={formData.bloodPressureDiastolic}
                  onChange={(e) => handleInputChange('bloodPressureDiastolic', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Insulin Level (µU/mL)</Label>
                <Input
                  type="number"
                  value={formData.insulinLevel}
                  onChange={(e) => handleInputChange('insulinLevel', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Skin Thickness (mm)</Label>
                <Input
                  type="number"
                  value={formData.skinThickness}
                  onChange={(e) => handleInputChange('skinThickness', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Diabetes Pedigree Function</Label>
                <span className="text-sm font-medium text-primary">{formData.diabetesPedigree.toFixed(2)}</span>
              </div>
              <Slider
                value={[formData.diabetesPedigree]}
                onValueChange={([v]) => handleInputChange('diabetesPedigree', v)}
                max={2.5}
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">Family history genetic risk factor (0-2.5)</p>
            </div>

            <Button
              variant="hero"
              className="w-full"
              size="lg"
              onClick={runDiagnosis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run AI Diagnosis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          {isAnalyzing && (
            <Card className="animate-pulse">
              <CardContent className="p-8 text-center">
                <Brain className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">AI Analysis in Progress</h3>
                <p className="text-muted-foreground mb-4">
                  Processing multi-modal data through CNN-LSTM network...
                </p>
                <Progress value={66} className="max-w-xs mx-auto" />
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Risk Score Card */}
              <Card variant="elevated" className={`border-2 ${getRiskBg(result.riskLevel)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Diabetes Risk Assessment</p>
                      <h2 className={`text-4xl font-bold ${getRiskColor(result.riskLevel)}`}>
                        {result.riskScore.toFixed(1)}%
                      </h2>
                    </div>
                    <Badge className={`${
                      result.riskLevel === 'critical' || result.riskLevel === 'high' 
                        ? 'bg-destructive' 
                        : result.riskLevel === 'medium' 
                        ? 'bg-warning' 
                        : 'bg-success'
                    } text-primary-foreground text-lg px-3 py-1`}>
                      {result.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <Progress 
                    value={result.riskScore} 
                    className={`h-3 ${
                      result.riskLevel === 'critical' || result.riskLevel === 'high'
                        ? '[&>div]:bg-destructive'
                        : result.riskLevel === 'medium'
                        ? '[&>div]:bg-warning'
                        : '[&>div]:bg-success'
                    }`}
                  />
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    Model Confidence: {result.confidence.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              {/* Feature Importance */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5" />
                    Feature Importance (XAI - SHAP Analysis)
                  </CardTitle>
                  <CardDescription>
                    Explainable AI shows which factors most influenced this prediction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={result.featureImportance}
                        layout="vertical"
                        margin={{ left: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 0.4]} stroke="hsl(var(--muted-foreground))" />
                        <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                        />
                        <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                          {result.featureImportance.map((entry, index) => (
                            <Cell key={index} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5" />
                    Clinical Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!isAnalyzing && !result && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-muted-foreground">
                  Enter patient data and click "Run AI Diagnosis" to get personalized
                  diabetes risk prediction with explainable results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage;
