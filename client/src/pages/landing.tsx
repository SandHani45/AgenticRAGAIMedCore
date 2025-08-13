import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Brain, Users } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Compliant",
      description: "HIPAA-compliant platform ensuring your medical data stays protected."
    },
    {
      icon: <Brain className="h-8 w-8 text-secondary" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI helps doctors analyze patient documents and provide insights."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Multi-Role Access",
      description: "Tailored experiences for administrators, doctors, and patients."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedCore</h1>
                <p className="text-xs text-gray-600">Healthcare Management Platform</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Advanced Healthcare
              <span className="text-primary block">Management Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Streamline medical document management with AI-powered analysis, 
              secure patient data handling, and comprehensive healthcare administration tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/5"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MedCore?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for healthcare professionals with enterprise-grade security and AI capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="backdrop-blur-sm bg-white/80 border-blue-100 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="backdrop-blur-sm bg-white/80 border-blue-100">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Healthcare Practice?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of healthcare professionals who trust MedCore for their document management needs.
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
                data-testid="button-start-today"
              >
                Start Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">MedCore</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 MedCore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
