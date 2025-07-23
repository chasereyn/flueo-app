import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const freePlan = products.find((product) => product.name === 'Free');
  const proPlan = products.find((product) => product.name === 'Pro');

  const freePrice = prices.find((price) => price.productId === freePlan?.id);
  const proPrice = prices.find((price) => price.productId === proPlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <PricingCard
          name={freePlan?.name || 'Free'}
          price={0}
          interval="month"
          features={[
            'Basic Usage',
            '1 Workspace Member',
            'Community Support',
          ]}
          priceId={freePrice?.id}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={299}
          interval="month"
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Priority Email Support',
            'Early Access to Features',
          ]}
          priceId={proPrice?.id}
        />
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  features,
  priceId,
}: {
  name: string;
  price: number;
  interval: string;
  features: string[];
  priceId?: string;
}) {
  return (
    <div className="pt-6">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      {price > 0 && (
        <form action={checkoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
