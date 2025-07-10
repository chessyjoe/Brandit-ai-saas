import React, { useState } from 'react';
import { 
  CreditCard, 
  Crown, 
  Zap, 
  Palette, 
  BarChart3, 
  Shield, 
  Check, 
  X,
  Settings,
  AlertCircle,
  TrendingUp,
  Star
} from 'lucide-react';

const PaymentAccessControl = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Simulate usage limits based on plan
  const planLimits = {
    free: {
      logoGenerations: 15,
      brandAssets: 10,
      downloads: 20,
      projects: 5,
      collaborators: 1,
      aiProcessing: 'standard',
      whiteLabel: false,
      analytics: 'basic'
    },
    starter: {
      logoGenerations: 100,
      brandAssets: 75,
      downloads: 200,
      projects: 25,
      collaborators: 3,
      aiProcessing: 'priority',
      whiteLabel: false,
      analytics: 'advanced'
    },
    professional: {
      logoGenerations: 500,
      brandAssets: 400,
      downloads: 1000,
      projects: 100,
      collaborators: 10,
      aiProcessing: 'priority',
      whiteLabel: true,
      analytics: 'advanced'
    },
    agency: {
      logoGenerations: 'unlimited',
      brandAssets: 'unlimited',
      downloads: 'unlimited',
      projects: 'unlimited',
      collaborators: 'unlimited',
      aiProcessing: 'priority',
      whiteLabel: true,
      analytics: 'enterprise'
    }
  };

  type Plan = {
    id: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    features: string[];
    limitations: string[];
    popular: boolean;
  };

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '15 logo generations/month',
        '10 brand assets/month',
        '20 downloads/month',
        '5 projects',
        'Basic templates',
        'Standard AI processing'
      ],
      limitations: [
        'Watermarked downloads',
        'No collaboration features',
        'Limited export formats'
      ],
      popular: false
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 19,
      yearlyPrice: 190,
      description: 'Great for small businesses',
      features: [
        '100 logo generations/month',
        '75 brand assets/month',
        '200 downloads/month',
        '25 projects',
        'All templates',
        'Priority AI processing',
        'HD downloads',
        'Basic analytics'
      ],
      limitations: [
        'Up to 3 collaborators'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: 'For growing businesses',
      features: [
        '500 logo generations/month',
        '400 brand assets/month',
        '1000 downloads/month',
        '100 projects',
        'All templates + premium',
        'Priority AI processing',
        'White-label options',
        'Advanced analytics',
        'Version history',
        'Brand consistency checker'
      ],
      limitations: [
        'Up to 10 collaborators'
      ],
      popular: false
    },
    {
      id: 'agency',
      name: 'Agency',
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: 'For agencies & enterprises',
      features: [
        'Unlimited generations',
        'Unlimited brand assets',
        'Unlimited downloads',
        'Unlimited projects',
        'Custom templates',
        'Priority AI processing',
        'Full white-label',
        'Enterprise analytics',
        'Custom integrations',
        'Dedicated support'
      ],
      limitations: [],
      popular: false
    }
  ];

  type UsageBarProps = {
    label: string;
    used: number;
    limit: number | 'unlimited';
    unit?: string;
  };

  const UsageBar = ({ label, used, limit, unit = '' }: UsageBarProps) => {
    const percentage = limit === 'unlimited' ? 0 : (used / (limit as number)) * 100;
    const isNearLimit = limit !== 'unlimited' && percentage > 80;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm ${isNearLimit ? 'text-red-600' : 'text-gray-600'}`}>
            {used}{unit} / {limit === 'unlimited' ? '∞' : `${limit}${unit}`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${isNearLimit ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {isNearLimit && (
          <p className="text-xs text-red-600 mt-1 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Approaching limit - consider upgrading
          </p>
        )}
      </div>
    );
  };

  type PlanCardProps = {
    plan: Plan;
    isCurrentPlan: boolean;
  };

  const PlanCard = ({ plan, isCurrentPlan }: PlanCardProps) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const savings = billingCycle === 'yearly' ? Math.round(((plan.monthlyPrice * 12) - plan.yearlyPrice) / (plan.monthlyPrice * 12) * 100) : 0;
    
    return (
      <div className={`relative bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
        isCurrentPlan ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Most Popular
            </span>
          </div>
        )}
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">${price}</span>
            {plan.monthlyPrice > 0 && (
              <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            )}
            {savings > 0 && (
              <div className="text-sm text-green-600 font-medium mt-1">
                Save {savings}% yearly
              </div>
            )}
          </div>
          
          {isCurrentPlan ? (
            <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg font-medium">
              Current Plan
            </button>
          ) : (
            <button 
              onClick={() => {
                setSelectedPlan(plan);
                setShowPaymentModal(true);
              }}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                plan.popular 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {plan.monthlyPrice === 0 ? 'Get Started' : 'Upgrade Now'}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
          
          {plan.limitations.map((limitation: string, index: number) => (
            <div key={index} className="flex items-start">
              <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500">{limitation}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PaymentModal = () => {
    if (!showPaymentModal || !selectedPlan) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-bold mb-4">Upgrade to {selectedPlan.name}</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span>Plan: {selectedPlan.name}</span>
              <span className="font-bold">
                ${billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice}
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            
            {billingCycle === 'yearly' && selectedPlan.monthlyPrice > 0 && (
              <div className="text-sm text-green-600">
                Save ${(selectedPlan.monthlyPrice * 12) - selectedPlan.yearlyPrice} compared to monthly
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <CreditCard className="w-4 h-4 mr-2" />
                Credit/Debit Card
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-600">
                Your payment information is encrypted and processed securely through Stripe.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Simulate payment processing
                setTimeout(() => {
                  setCurrentPlan(selectedPlan.id);
                  setShowPaymentModal(false);
                  setSelectedPlan(null);
                }, 1000);
              }}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const currentPlanData = plans.find((p) => p.id === currentPlan) as Plan | undefined;
  const currentLimits = planLimits[currentPlan as keyof typeof planLimits];

  const usage = {
    logoGenerations: 10,
    brandAssets: 5,
    downloads: 3,
    projects: 2,
    collaborators: 1,
    // ...add other usage fields as needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Palette className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">BrandAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Crown className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {currentPlanData?.name} Plan
                </span>
              </div>
              <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Dashboard */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Usage Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <UsageBar 
                label="Logo Generations" 
                used={usage.logoGenerations} 
                limit={currentLimits.logoGenerations as number | 'unlimited'} 
              />
              <UsageBar 
                label="Brand Assets" 
                used={usage.brandAssets} 
                limit={currentLimits.brandAssets as number | 'unlimited'} 
              />
            </div>
            <div>
              <UsageBar 
                label="Downloads" 
                used={usage.downloads} 
                limit={currentLimits.downloads as number | 'unlimited'} 
              />
              <UsageBar 
                label="Projects" 
                used={usage.projects} 
                limit={currentLimits.projects as number | 'unlimited'} 
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                {currentPlan === 'free' ? 'Ready to unlock more features?' : 'Need more resources?'}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {currentPlan === 'free' 
                ? 'Upgrade to remove watermarks and access premium features.'
                : 'Upgrade your plan to increase limits and unlock advanced features.'
              }
            </p>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              isCurrentPlan={plan.id === currentPlan}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Starter</th>
                  <th className="text-center py-3 px-4">Professional</th>
                  <th className="text-center py-3 px-4">Agency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">AI Processing</td>
                  <td className="text-center py-3 px-4">Standard</td>
                  <td className="text-center py-3 px-4">
                    <Zap className="w-4 h-4 text-yellow-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Zap className="w-4 h-4 text-yellow-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Zap className="w-4 h-4 text-yellow-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Collaborators</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4">3</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">White-label</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-4 h-4 text-red-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-4 h-4 text-red-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Analytics</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">Enterprise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentModal />
    </div>
  );
};

export default PaymentAccessControl;