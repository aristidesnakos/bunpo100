"use client";

import { PRICING_PLANS } from "@/lib/pricing/constants";
import { useState } from "react";
import { useUser } from "@/context/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

const Pricing = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { profile } = useUser();

  const hasAccess = profile?.has_access;
  const customerId = profile?.customer_id;
  const isExpiredTrial = !hasAccess && customerId && customerId !== 'NULL' && !customerId.includes('@');

  const handleCheckout = async (plan: typeof PRICING_PLANS[number]) => {
    setIsLoading(plan.id);
    const checkoutUrl =
      isExpiredTrial && plan.id === 'amateur' && 'checkoutLinkDirect' in plan
        ? (plan as any).checkoutLinkDirect
        : plan.checkoutLink;
    window.location.href = checkoutUrl;
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {isExpiredTrial
                ? "Your trial has ended. Choose a plan to continue!"
                : "Simple, transparent pricing"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${'isFeatured' in plan && plan.isFeatured ? 'border-primary shadow-lg' : ''}`}
              >
                {'badge' in plan && plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.displayPrice}</span>
                    <span className="text-muted-foreground">{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckIcon className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={'isFeatured' in plan && plan.isFeatured ? 'default' : 'outline'}
                    onClick={() => handleCheckout(plan)}
                    disabled={isLoading === plan.id}
                  >
                    {isLoading === plan.id ? 'Loading...' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
