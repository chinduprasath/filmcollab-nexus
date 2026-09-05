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
import { supabase } from '@/integrations/supabase/client';

const Billing = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase.from('subscription_plans').select('*').order('monthly_price');
      if (error && error.code !== '42P01') throw error;
      if (data) setAvailablePlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">Billing & Plans</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your subscription and billing information</p>
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
                  <span className="text-3xl font-bold text-foreground">${currentPlan.price}</span>
                  <span className="text-muted-foreground">/{currentPlan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">Billed monthly</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  Active
                </Badge>
                <p className="text-sm text-muted-foreground">Next billing: Jan 15, 2025</p>
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
                      <span className="text-sm text-muted-foreground">{feature}</span>
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
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Upgrade Your Plan
              </CardTitle>
              <CardDescription>
                Choose the plan that best fits your needs
              </CardDescription>
            </div>
            
            <div className="flex items-center bg-muted border border-border rounded-lg p-1">
              <Button 
                variant={billingPeriod === 'monthly' ? 'default' : 'ghost'} 
                size="sm"
                className={billingPeriod === 'monthly' ? 'bg-card text-foreground shadow-sm hover:bg-card/80' : 'text-muted-foreground hover:text-foreground'}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant={billingPeriod === 'yearly' ? 'default' : 'ghost'} 
                size="sm"
                className={billingPeriod === 'yearly' ? 'bg-card text-foreground shadow-sm hover:bg-card/80' : 'text-muted-foreground hover:text-foreground'}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly (Save 20%)
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row overflow-x-auto gap-6 pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible snap-x">
              {isLoadingPlans ? (
                <div className="col-span-3 text-center py-10">
                  <div className="w-8 h-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent mx-auto mb-2"></div>
                  <p className="text-muted-foreground text-sm">Loading plans...</p>
                </div>
              ) : availablePlans.map((plan) => {
                const IconComponent = plan.is_custom_price ? Zap : (plan.popular ? Crown : Star);
                return (
                  <Card key={plan.id} className={`relative min-w-[280px] lg:min-w-0 flex-shrink-0 snap-center ${plan.popular ? 'border-yellow-500 shadow-lg' : 'border-border'}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-600 text-white px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                      <div className="mt-4">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {plan.is_custom_price ? (
                            <span className="text-3xl font-bold text-foreground">Custom</span>
                          ) : (
                            <>
                              {billingPeriod === 'monthly' ? (
                                <>
                                  {plan.final_monthly_price && plan.final_monthly_price !== plan.monthly_price && (
                                    <span className="text-sm text-muted-foreground/60 line-through">₹{plan.monthly_price}</span>
                                  )}
                                  <div className="flex items-end">
                                    <span className="text-3xl font-bold text-foreground">
                                      ₹{plan.final_monthly_price || plan.monthly_price || 0}
                                    </span>
                                    <span className="text-muted-foreground mb-1 ml-1">/mo</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {plan.final_yearly_price && plan.final_yearly_price !== plan.yearly_price && (
                                    <span className="text-sm text-muted-foreground/60 line-through">₹{plan.yearly_price}</span>
                                  )}
                                  <div className="flex items-end">
                                    <span className="text-3xl font-bold text-foreground">
                                      ₹{plan.final_yearly_price || plan.yearly_price || 0}
                                    </span>
                                    <span className="text-muted-foreground mb-1 ml-1">/yr</span>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                        {!plan.is_custom_price && (
                          <p className="text-sm text-muted-foreground mt-1">Billed {billingPeriod}</p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4">
                        {plan.is_custom_price ? (
                          <Button 
                            onClick={handleContactSales}
                            className="w-full border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors"
                            variant="outline"
                          >
                            Contact Sales
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
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
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">**** **** **** 1234</p>
                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors">
                      Update
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <div className="p-3 border border-border rounded-lg">
                    <p className="text-sm">123 Film Street</p>
                    <p className="text-sm">Los Angeles, CA 90210</p>
                    <p className="text-sm">United States</p>
                    <Button variant="outline" size="sm" className="mt-2 border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Invoices</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <div>
                        <p className="text-sm font-medium">Invoice #INV-001</p>
                        <p className="text-xs text-muted-foreground">Dec 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₹0.00</p>
                        <Badge variant="secondary" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <div>
                        <p className="text-sm font-medium">Invoice #INV-002</p>
                        <p className="text-xs text-muted-foreground">Nov 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₹0.00</p>
                        <Badge variant="secondary" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors">
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
              <div className="text-center p-4 border border-border rounded-lg">
                <Users className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Contact Support</h4>
                <p className="text-sm text-muted-foreground mb-3">Get help from our support team</p>
                <Button variant="outline" size="sm" className="border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors">
                  Contact Us
                </Button>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">FAQ</h4>
                <p className="text-sm text-muted-foreground mb-3">Find answers to common questions</p>
                <Button variant="outline" size="sm" className="border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors">
                  View FAQ
                </Button>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Feature Request</h4>
                <p className="text-sm text-muted-foreground mb-3">Suggest new features</p>
                <Button variant="outline" size="sm" className="border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400 dark:hover:border-yellow-500/60 transition-colors">
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
