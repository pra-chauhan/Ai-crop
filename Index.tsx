import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Sprout, TestTube, BarChart3, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const Index = () => {
  const features = [
    {
      icon: TestTube,
      title: "Soil Analysis",
      description: "Input detailed soil parameters including nitrogen, phosphorus, potassium levels, and environmental conditions."
    },
    {
      icon: BarChart3,
      title: "Smart Recommendations", 
      description: "Our ML model analyzes your soil data to recommend the most suitable crops for optimal yield."
    },
    {
      icon: Leaf,
      title: "Sustainable Farming",
      description: "Get insights that promote sustainable agricultural practices and soil health preservation."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        
        <section 
          className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <Sprout className="h-16 w-16 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold">CropWise</h1>
            </div>
            <h2 className="text-2xl md:text-3xl mb-6 font-light">
              Intelligent Crop Recommendation System
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Transform your farming decisions with AI-powered soil analysis. Get personalized crop recommendations 
              based on your soil's unique characteristics and environmental conditions.
            </p>
            <Link to="/input">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                Start Soil Analysis
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our advanced machine learning system analyzes multiple soil parameters to provide accurate crop recommendations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Optimize Your Crop Selection?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of farmers who are already using our AI-powered recommendations to increase their yield and sustainability.
            </p>
            <Link to="/input">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;