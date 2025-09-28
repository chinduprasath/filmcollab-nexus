import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  Check,
  Crown,
  Star,
  Zap,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Billing = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const currentPlan = {
    name: 'Free',
    price: 0,
    period: 'month',
    features: [
      'Up to 5 projects',
      'Basic profile',
      'Community access',
      'Job listings',
      'Basic support'
    ],
    limitations: [
      'Limited project storage',
      'No priority support',
      'Basic analytics'
    ]
  };

  const availablePlans = [
    {
      id: 'pro',
      name: 'Pro',
      price: 19,
      period: 'month',
      description: 'Perfect for independent filmmakers',
      features: [
        'Unlimited projects',
        'Advanced profile customization',
        'Priority job alerts',
        'Advanced analytics',
        'Priority support',
        'Custom portfolio themes',
        'Team collaboration (up to 3 members)',
        'Export project data'
      ],
      popular: false,
      icon: Star
    },
    {
      id: 'studio',
      name: 'Studio',
      price: 49,
      period: 'month',
      description: 'For production companies and studios',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 10 members)',
        'Advanced project management',
        'Custom branding',
        'API access',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced reporting'
      ],
      popular: true,
      icon: Crown
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'month',
      description: 'For large organizations',
      features: [
        'Everything in Studio',
        'Unlimited team members',
        'Custom features',
        'On-premise deployment',
        '24/7 dedicated support',
        'SLA guarantee',
        'Custom training',
        'Advanced security'
      ],
      popular: false,
      icon: Zap
    }
  ];

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Upgrade initiated",
        description: `Redirecting to payment for ${planId} plan...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "Redirecting to contact form...",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your subscription and billing information</p>
          </div>
          <Badge variant="outline" className="text-xs">
            <CreditCard className="w-3 h-3 mr-1" />
            Current Plan: {currentPlan.name}
          </Badge>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{currentPlan.name} Plan</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">${currentPlan.price}</span>
                  <span className="text-gray-500">/{currentPlan.period}</span>
                </div>
                <p className="text-sm text-gray-600">Billed monthly</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  Active
                </Badge>
                <p className="text-sm text-gray-500">Next billing: Jan 15, 2025</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Included Features</h4>
                <div className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Limitations</h4>
                <div className="space-y-2">
                  {currentPlan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Upgrade Your Plan
            </CardTitle>
            <CardDescription>
              Choose the plan that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <Card key={plan.id} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg' : 'border-gray-200'}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                          </span>
                          {typeof plan.price === 'number' && (
                            <span className="text-gray-500">/{plan.period}</span>
                          )}
                        </div>
                        {typeof plan.price === 'number' && (
                          <p className="text-sm text-gray-600 mt-1">Billed monthly</p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4">
                        {plan.id === 'enterprise' ? (
                          <Button 
                            onClick={handleContactSales}
                            className="w-full"
                            variant="outline"
                          >
                            Contact Sales
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={isLoading}
                            className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          >
                            {isLoading ? 'Processing...' : 'Upgrade to ' + plan.name}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Billing Information
            </CardTitle>
            <CardDescription>
              Manage your payment methods and billing history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">**** **** **** 1234</p>
                      <p className="text-xs text-gray-500">Expires 12/25</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Update
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="text-sm">123 Film Street</p>
                    <p className="text-sm">Los Angeles, CA 90210</p>
                    <p className="text-sm">United States</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Invoices</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <div>
                        <p className="text-sm font-medium">Invoice #INV-001</p>
                        <p className="text-xs text-gray-500">Dec 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$0.00</p>
                        <Badge variant="secondary" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <div>
                        <p className="text-sm font-medium">Invoice #INV-002</p>
                        <p className="text-xs text-gray-500">Nov 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$0.00</p>
                        <Badge variant="secondary" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View All Invoices
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Need Help?
            </CardTitle>
            <CardDescription>
              Get assistance with billing and subscription questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Contact Support</h4>
                <p className="text-sm text-gray-600 mb-3">Get help from our support team</p>
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">FAQ</h4>
                <p className="text-sm text-gray-600 mb-3">Find answers to common questions</p>
                <Button variant="outline" size="sm">
                  View FAQ
                </Button>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Feature Request</h4>
                <p className="text-sm text-gray-600 mb-3">Suggest new features</p>
                <Button variant="outline" size="sm">
                  Submit Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Billing;
