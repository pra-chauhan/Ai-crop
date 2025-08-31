/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { BarChart3, Leaf, Sprout, ArrowLeft, RefreshCw } from "lucide-react";
import { LocationState } from "../types"; 

interface CropRecommendation {
  name: string;
  confidence?: number; 
  description?: string;
  characteristics?: string[];
  season?: string;
  yield?: string;
}

const ResultsPage = () => {
  const location = useLocation();
  const soilData = location.state as LocationState | null; 

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (soilData) {
      fetchRecommendations(soilData);
    }
  }, [soilData]);

  const fetchRecommendations = async (data: LocationState) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: data.nitrogen,
          P: data.phosphorus,
          K: data.potassium,
          temperature: data.temperature,
          humidity: data.humidity,
          ph: data.ph,
          rainfall: data.rainfall,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch predictions");
      }

      const result = await response.json();

      const crop: CropRecommendation = {
        name: result.prediction,
        description: "AI-powered recommendation based on your soil data.",
      };

      setRecommendations([crop]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number | undefined) => {
    if (!confidence) return "bg-muted text-muted-foreground";
    if (confidence >= 85) return "bg-leaf text-primary-foreground";
    if (confidence >= 70) return "bg-harvest text-accent-foreground";
    return "bg-muted text-muted-foreground";
  };

  if (!soilData) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-card flex items-center justify-center">
          <Card className="shadow-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">No Analysis Data Found</h2>
              <p className="text-muted-foreground mb-6">
                Please complete a soil analysis first to see your crop recommendations.
              </p>
              <Link to="/input">
                <Button variant="hero">Start Soil Analysis</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-card py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Crop Recommendations
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Based on your soil analysis, here are our AI-powered crop recommendations
            </p>
          </div>

          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Your Soil Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Nitrogen</p>
                  <p className="text-lg font-semibold">{soilData.nitrogen} kg/ha</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Phosphorus</p>
                  <p className="text-lg font-semibold">{soilData.phosphorus} kg/ha</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Potassium</p>
                  <p className="text-lg font-semibold">{soilData.potassium} kg/ha</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">pH Level</p>
                  <p className="text-lg font-semibold">{soilData.ph}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading && <p className="text-center text-muted-foreground">Loading recommendations...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid gap-6 mb-8">
            {recommendations.map((crop, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl">
                      <Sprout className="h-6 w-6 mr-2 text-leaf" />
                      {crop.name}
                    </CardTitle>
                    {crop.confidence && (
                      <Badge className={getConfidenceColor(crop.confidence)}>
                        {crop.confidence}% Match
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {crop.description || "AI-powered recommendation based on soil conditions."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/input">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </Link>
            <Button variant="harvest" size="lg" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ResultsPage;
