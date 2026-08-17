import React, { useState, useEffect } from "react";
import { LandingTopbar } from "@/components/layout/landing-topbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
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

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans overflow-x-hidden pt-16">
      <LandingTopbar />
      
      <main className="flex-grow py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your filmmaking needs.
            </p>
            
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
              <Button 
                variant={billingPeriod === 'monthly' ? 'default' : 'ghost'} 
                className={billingPeriod === 'monthly' ? 'bg-white text-gray-900 shadow-sm hover:bg-gray-50' : 'text-gray-500 hover:text-gray-900'}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant={billingPeriod === 'yearly' ? 'default' : 'ghost'} 
                className={billingPeriod === 'yearly' ? 'bg-white text-gray-900 shadow-sm hover:bg-gray-50' : 'text-gray-500 hover:text-gray-900'}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly (Save 20%)
              </Button>
            </div>
          </div>

          <div className="flex flex-row overflow-x-auto gap-8 pb-8 lg:grid lg:grid-cols-3 lg:overflow-visible snap-x">
            {isLoadingPlans ? (
              <div className="col-span-3 text-center py-20">
                <div className="w-8 h-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent mx-auto mb-2"></div>
                <p className="text-gray-500">Loading plans...</p>
              </div>
            ) : availablePlans.map((plan) => {
              const IconComponent = plan.is_custom_price ? Zap : (plan.popular ? Crown : Star);
              const price = billingPeriod === 'monthly' 
                ? (plan.final_monthly_price || plan.monthly_price)
                : (plan.final_yearly_price || plan.yearly_price);
                
              const originalPrice = billingPeriod === 'monthly' ? plan.monthly_price : plan.yearly_price;
              const hasDiscount = originalPrice && price && originalPrice > price;

              return (
                <Card key={plan.id} className={`relative min-w-[300px] lg:min-w-0 flex-shrink-0 snap-center ${plan.popular ? 'border-yellow-500 shadow-xl scale-105 z-10' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-1 text-sm shadow-md">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-6 pt-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-yellow-600" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <div className="flex flex-col items-center justify-center gap-1">
                        {plan.is_custom_price ? (
                          <span className="text-4xl font-bold text-gray-900">Custom</span>
                        ) : (
                          <>
                            {hasDiscount && (
                              <span className="text-lg text-gray-400 line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold text-gray-900">₹{price}</span>
                              <span className="text-gray-500">
                                /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                              </span>
                            </div>
                          </>
                        )}
                        {!plan.is_custom_price && (
                          <span className="text-sm text-gray-500">
                            Billed {billingPeriod}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features?.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full h-12 text-lg ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg' 
                          : plan.is_custom_price
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                      }`}
                      onClick={() => navigate("/auth/signup")}
                    >
                      {plan.is_custom_price ? 'Contact Sales' : `Get Started with ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
