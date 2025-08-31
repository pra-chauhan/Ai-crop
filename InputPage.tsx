import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { TestTube, ArrowRight, Cloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

const InputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [soilData, setSoilData] = useState<SoilData>({
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    temperature: 0,
    humidity: 0,
    ph: 7,
    rainfall: 0,
  });
  const [isLoading, setIsLoading] = useState(false);


  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    rainfall: 0,
  });

  const handleInputChange = (field: keyof SoilData, value: string) => {
    setSoilData((prev) => ({
      ...prev,
      [field]: parseFloat(value), 
    }));
  };

  const validateForm = () => {
    for (const [field, value] of Object.entries(soilData)) {
      if (isNaN(value) || value < 0) {
        toast({
          title: "Invalid Input",
          description: `Please enter a valid positive number for ${field}.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      toast({
        title: "Processing",
        description: "Sending your soil data to the model...",
      });

      navigate("/results", { state: soilData });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description:
          "There was an error processing your soil data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherData = () => {
    setWeatherData({
      temperature: 28.5,
      humidity: 70,
      rainfall: 120,
    });
    setIsWeatherOpen(true);
  };

  const applyWeatherData = () => {
    setSoilData((prev) => ({
      ...prev,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      rainfall: weatherData.rainfall,
    }));
    setIsWeatherOpen(false);
    toast({
      title: "Weather Data Applied",
      description: "Temperature, Humidity, and Rainfall have been auto-filled.",
    });
  };

  const inputFields = [
    { key: "nitrogen", label: "Nitrogen (N)", unit: "kg/ha", placeholder: "e.g., 20" },
    { key: "phosphorus", label: "Phosphorus (P)", unit: "kg/ha", placeholder: "e.g., 15" },
    { key: "potassium", label: "Potassium (K)", unit: "kg/ha", placeholder: "e.g., 25" },
    { key: "temperature", label: "Temperature", unit: "°C", placeholder: "e.g., 25.5" },
    { key: "humidity", label: "Humidity", unit: "%", placeholder: "e.g., 65" },
    { key: "ph", label: "pH Level", unit: "", placeholder: "e.g., 6.5" },
    { key: "rainfall", label: "Rainfall", unit: "mm", placeholder: "e.g., 120" },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-card py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <TestTube className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Soil Analysis Input
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Enter your soil parameters below to get personalized crop recommendations
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-foreground">
                Soil Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {inputFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
                        {field.label} {field.unit && `(${field.unit})`}
                      </Label>
                      <Input
                        id={field.key}
                        type="number"
                        step="0.1"
                        placeholder={field.placeholder}
                        value={soilData[field.key as keyof SoilData]}
                        onChange={(e) =>
                          handleInputChange(field.key as keyof SoilData, e.target.value)
                        }
                        className="border-border bg-input"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchWeatherData}
                  >
                    <Cloud className="h-4 w-4 mr-2" />
                    Fetch Weather Data
                  </Button>
                </div>

                <div className="pt-6 text-center">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                    className="w-full md:w-auto min-w-[200px]"
                  >
                    {isLoading ? (
                      "Analyzing Soil..."
                    ) : (
                      <>
                        Analyze Soil
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Your soil data will be processed using our advanced machine learning model to provide accurate crop recommendations.
            </p>
          </div>
        </div>
      </main>

      <Dialog open={isWeatherOpen} onOpenChange={setIsWeatherOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weather Data Fetched</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>🌡 Temperature: {weatherData.temperature} °C</p>
            <p>💧 Humidity: {weatherData.humidity} %</p>
            <p>🌧 Rainfall: {weatherData.rainfall} mm</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWeatherOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyWeatherData}>Apply to Form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InputPage;
