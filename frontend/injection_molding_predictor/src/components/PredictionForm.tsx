import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_ENDPOINT = "https://manufacturing-output-api.onrender.com/predict";

interface FormData {
  Injection_Temperature: string;
  Cycle_Time: string;
  Machine_Age: string;
  Injection_Pressure: string;
  Cooling_Time: string;
  Maintenance_Hours: string;
  Temperature_Pressure_Ratio: string;
  Total_Cycle_Time: string;
  Operator_Experience: string;
  Material_Viscosity: string;
  Ambient_Temperature: string;
  Machine_Utilization: string;
  Material_Grade: string;
  Shift: string;
  Efficiency_Score: string;
  Machine_Type: string;
  Day_of_Week: string;
}

const PredictionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    Injection_Temperature: "",
    Cycle_Time: "",
    Machine_Age: "",
    Injection_Pressure: "",
    Cooling_Time: "",
    Maintenance_Hours: "",
    Temperature_Pressure_Ratio: "",
    Total_Cycle_Time: "",
    Operator_Experience: "",
    Material_Viscosity: "",
    Ambient_Temperature: "",
    Machine_Utilization: "",
    Material_Grade: "",
    Shift: "",
    Efficiency_Score: "",
    Machine_Type: "",
    Day_of_Week: "",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const payload = {
        Injection_Temperature: Number(formData.Injection_Temperature),
        Cycle_Time: Number(formData.Cycle_Time),
        Machine_Age: Number(formData.Machine_Age),
        Injection_Pressure: Number(formData.Injection_Pressure),
        Cooling_Time: Number(formData.Cooling_Time),
        Maintenance_Hours: Number(formData.Maintenance_Hours),
        Temperature_Pressure_Ratio: Number(formData.Temperature_Pressure_Ratio),
        Total_Cycle_Time: Number(formData.Total_Cycle_Time),
        Operator_Experience: Number(formData.Operator_Experience),
        Material_Viscosity: Number(formData.Material_Viscosity),
        Ambient_Temperature: Number(formData.Ambient_Temperature),
        Machine_Utilization: Number(formData.Machine_Utilization),
        Material_Grade: formData.Material_Grade,
        Shift: formData.Shift,
        Efficiency_Score: Number(formData.Efficiency_Score),
        Machine_Type: formData.Machine_Type,
        Day_of_Week: formData.Day_of_Week,
      };

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data.predicted_parts_per_hour);
      toast({
        title: "Prediction Complete",
        description: "Machine output prediction calculated successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(
        errorMessage.includes("Failed to fetch")
          ? "API server not running. Please ensure the server is running on http://127.0.0.1:8080"
          : errorMessage
      );
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not connect to the API server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Injection Molding Predictor
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Advanced ML-powered prediction system for optimizing parts per hour output
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Injection & Material */}
          <Card className="p-6 bg-gradient-card border-border shadow-glow">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">1</div>
              Injection & Material Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="injection_temp" className="text-foreground">Injection Temperature (°C)</Label>
                <Input
                  id="injection_temp"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Injection_Temperature}
                  onChange={(e) => handleInputChange("Injection_Temperature", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="injection_pressure" className="text-foreground">Injection Pressure (bar)</Label>
                <Input
                  id="injection_pressure"
                  type="number"
                  required
                  value={formData.Injection_Pressure}
                  onChange={(e) => handleInputChange("Injection_Pressure", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material_grade" className="text-foreground">Material Grade</Label>
                <Select value={formData.Material_Grade} onValueChange={(value) => handleInputChange("Material_Grade", value)} required>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="Grade_A">Grade A</SelectItem>
                    <SelectItem value="Grade_B">Grade B</SelectItem>
                    <SelectItem value="Grade_C">Grade C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="material_viscosity" className="text-foreground">Material Viscosity</Label>
                <Input
                  id="material_viscosity"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Material_Viscosity}
                  onChange={(e) => handleInputChange("Material_Viscosity", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp_pressure_ratio" className="text-foreground">Temperature/Pressure Ratio</Label>
                <Input
                  id="temp_pressure_ratio"
                  type="number"
                  step="0.001"
                  required
                  value={formData.Temperature_Pressure_Ratio}
                  onChange={(e) => handleInputChange("Temperature_Pressure_Ratio", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          {/* Group 2: Time & Environment */}
          <Card className="p-6 bg-gradient-card border-border shadow-glow">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">2</div>
              Time & Environment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cycle_time" className="text-foreground">Cycle Time (s)</Label>
                <Input
                  id="cycle_time"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Cycle_Time}
                  onChange={(e) => handleInputChange("Cycle_Time", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cooling_time" className="text-foreground">Cooling Time (s)</Label>
                <Input
                  id="cooling_time"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Cooling_Time}
                  onChange={(e) => handleInputChange("Cooling_Time", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_cycle_time" className="text-foreground">Total Cycle Time (s)</Label>
                <Input
                  id="total_cycle_time"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Total_Cycle_Time}
                  onChange={(e) => handleInputChange("Total_Cycle_Time", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ambient_temp" className="text-foreground">Ambient Temperature (°C)</Label>
                <Input
                  id="ambient_temp"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Ambient_Temperature}
                  onChange={(e) => handleInputChange("Ambient_Temperature", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift" className="text-foreground">Shift</Label>
                <Select value={formData.Shift} onValueChange={(value) => handleInputChange("Shift", value)} required>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Swing">Swing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="day_of_week" className="text-foreground">Day of Week</Label>
                <Select value={formData.Day_of_Week} onValueChange={(value) => handleInputChange("Day_of_Week", value)} required>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Group 3: Machine & Operator */}
          <Card className="p-6 bg-gradient-card border-border shadow-glow">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">3</div>
              Machine & Operator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="machine_age" className="text-foreground">Machine Age (years)</Label>
                <Input
                  id="machine_age"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Machine_Age}
                  onChange={(e) => handleInputChange("Machine_Age", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="machine_type" className="text-foreground">Machine Type</Label>
                <Select value={formData.Machine_Type} onValueChange={(value) => handleInputChange("Machine_Type", value)} required>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="Type_A">Type A</SelectItem>
                    <SelectItem value="Type_B">Type B</SelectItem>
                    <SelectItem value="Type_C">Type C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance_hours" className="text-foreground">Maintenance Hours</Label>
                <Input
                  id="maintenance_hours"
                  type="number"
                  required
                  value={formData.Maintenance_Hours}
                  onChange={(e) => handleInputChange("Maintenance_Hours", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="machine_utilization" className="text-foreground">Machine Utilization (%)</Label>
                <Input
                  id="machine_utilization"
                  type="number"
                  step="0.01"
                  required
                  value={formData.Machine_Utilization}
                  onChange={(e) => handleInputChange("Machine_Utilization", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operator_experience" className="text-foreground">Operator Experience (years)</Label>
                <Input
                  id="operator_experience"
                  type="number"
                  step="0.1"
                  required
                  value={formData.Operator_Experience}
                  onChange={(e) => handleInputChange("Operator_Experience", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="efficiency_score" className="text-foreground">Efficiency Score</Label>
                <Input
                  id="efficiency_score"
                  type="number"
                  step="0.01"
                  required
                  value={formData.Efficiency_Score}
                  onChange={(e) => handleInputChange("Efficiency_Score", e.target.value)}
                  className="bg-secondary border-border focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-12 py-6 text-lg shadow-glow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Calculate Prediction"
              )}
            </Button>
          </div>

          {/* Prediction Result */}
          {prediction !== null && (
            <Card className="p-8 bg-gradient-card border-primary/50 shadow-glow">
              <div className="text-center">
                <h3 className="text-xl text-muted-foreground mb-4">Predicted Hourly Output</h3>
                <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {prediction.toFixed(2)}
                </div>
                <p className="text-lg text-muted-foreground">Parts Per Hour</p>
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;
