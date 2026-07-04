import { Link, Navigate, useParams } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Container from '../components/common/Container.jsx';

const contactEmail = 'divinedhenu@gmail.com';
const contactPhone = '+91 81402 43960';
const contactPhoneHref = '+918140243960';

const policies = {
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    intro: 'These terms govern your use of this website and purchases made from DivineDhenu.',
    updated: 'Last updated: July 4, 2026',
    sections: [
      {
        title: 'Overview',
        body: [
          'This website is operated by DivineDhenu. Throughout the site, the terms "we", "us", and "our" refer to DivineDhenu.',
          'By visiting this website or purchasing from us, you agree to be bound by these Terms and Conditions, including the policies referenced on this website.',
          'We are not using Shopify. Orders, payments, fulfilment workflows, Shiprocket, local courier partners, and other service providers may be used to operate this website and deliver products.',
        ],
      },
      {
        title: 'Online Store Terms',
        body: [
          'You must be legally capable of entering into a contract under applicable law to use this website or place an order.',
          'You may not use our products, website, or services for any illegal or unauthorised purpose.',
          'You must not transmit viruses, malicious code, or any content that may affect the operation or security of the website.',
        ],
      },
      {
        title: 'Products, Pricing, and Availability',
        body: [
          'Product descriptions, images, prices, offers, and availability may be updated without prior notice.',
          'We make reasonable efforts to display product colours, pack sizes, descriptions, and pricing accurately, but minor differences may occur due to device settings, packaging updates, or availability.',
          'We reserve the right to limit quantities, refuse orders, discontinue products, correct pricing errors, or cancel orders where required.',
        ],
      },
      {
        title: 'Billing and Account Information',
        body: [
          'You agree to provide current, complete, and accurate billing, shipping, phone, and email information for all purchases.',
          'If an order is modified or cancelled, we may contact you using the email address or phone number provided at checkout.',
        ],
      },
      {
        title: 'Third-Party Services',
        body: [
          'We may use third-party service providers for payment processing, website hosting, analytics, order management, fulfilment, Shiprocket shipping, and local courier delivery.',
          'Third-party links or services may have their own terms and policies. Please review those terms before using them.',
        ],
      },
      {
        title: 'Prohibited Uses',
        body: [
          'You may not use this website for unlawful activity, fraud, harassment, infringement of intellectual property, uploading harmful code, scraping, spam, phishing, or interfering with website security.',
          'We may terminate or restrict access to the website if we believe these terms have been violated.',
        ],
      },
      {
        title: 'Limitation of Liability',
        body: [
          'The website, services, and products are provided on an "as is" and "as available" basis to the fullest extent permitted by law.',
          'DivineDhenu will not be liable for indirect, incidental, punitive, special, or consequential damages arising from use of the website or products, except where liability cannot be excluded under applicable law.',
        ],
      },
      {
        title: 'Governing Law',
        body: ['These terms are governed by and construed in accordance with the laws of India.'],
      },
      {
        title: 'Changes to These Terms',
        body: ['We may update these terms from time to time. Changes will be effective immediately upon posting on this website.'],
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'This policy explains how we collect, use, store, and protect your personal information when you use our website or place an order.',
    updated: 'Last updated: July 4, 2026',
    sections: [
      {
        title: 'Information We Collect',
        body: [
          'We may collect your name, email address, phone number, billing address, shipping address, order details, payment confirmation details, messages sent to customer support, and information required to fulfil your order.',
          'We may also collect device, browser, IP address, usage, cookie, and analytics information to keep the website secure and improve performance.',
        ],
      },
      {
        title: 'How We Use Your Information',
        body: [
          'We use your information to process orders, confirm payments, arrange dispatch, provide tracking updates, answer support requests, prevent fraud, comply with law, and improve our products and website.',
          'With your consent or where permitted by law, we may use your contact details to send order updates, promotional messages, offers, or product information.',
        ],
      },
      {
        title: 'Payments and Shipping Partners',
        body: [
          'Payments are processed through secure third-party payment providers. We do not store complete card numbers or sensitive payment credentials on our website.',
          'For fulfilment and delivery, we may share required order details with Shiprocket, local courier partners, and logistics providers, including your name, phone number, shipping address, and order package details.',
        ],
      },
      {
        title: 'How We Share Information',
        body: [
          'We may share personal information with trusted service providers who help us operate the website, process payments, manage orders, provide customer support, analyse website usage, prevent fraud, and deliver products.',
          'We may disclose information where required by law, legal process, government request, fraud investigation, or to protect our rights, customers, and business.',
        ],
      },
      {
        title: 'Cookies and Analytics',
        body: [
          'Our website may use cookies and similar technologies to remember preferences, keep carts functional, understand site traffic, and improve the shopping experience.',
          'You can manage cookies through your browser settings, although some features of the website may not work properly if cookies are disabled.',
        ],
      },
      {
        title: 'Data Security and Retention',
        body: [
          'We use reasonable technical and organisational safeguards to protect personal information. No method of online transmission or storage is completely secure.',
          'We retain personal information only for as long as needed for orders, support, legal compliance, accounting, dispute resolution, and legitimate business purposes.',
        ],
      },
      {
        title: 'Your Rights',
        body: [
          'Subject to applicable law, you may request access, correction, deletion, or updating of your personal information by contacting us.',
          'You may opt out of promotional communication at any time, but we may still send essential order, service, or policy-related messages.',
        ],
      },
      {
        title: 'Children',
        body: ['This website is not intended for children. We do not knowingly collect personal information from children without appropriate consent.'],
      },
      {
        title: 'Policy Updates',
        body: ['We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting on this website.'],
      },
    ],
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    intro: 'We use Shiprocket and local courier partners to dispatch and deliver orders across serviceable pin codes.',
    updated: 'Last updated: July 4, 2026',
    sections: [
      {
        title: 'Dispatch and Delivery',
        body: [
          'Once we receive your payment, packages are dispatched within 2 days and shipped via reputable couriers with tracking.',
          'Products will usually be delivered in 3-7 business days, depending on the delivery pin code and courier serviceability.',
        ],
      },
      {
        title: 'Shipping Fees',
        body: [
          'Shipping fees cover handling, packing, and postage costs. Handling fees are fixed, while transport fees may vary based on total shipment weight and delivery destination.',
          'We recommend grouping your items into a single order. Separate orders cannot be combined, and shipping fees will apply to each order.',
        ],
      },
      {
        title: 'Courier Partners',
        body: [
          'Orders may be shipped through Shiprocket, its courier network, or our local courier partners based on availability, pin code serviceability, package weight, and delivery timelines.',
          'As soon as your package is shipped, we will send tracking information by email or another available communication channel.',
        ],
      },
      {
        title: 'Delivery Timings',
        body: [
          'Courier partners generally deliver shipments on working days from Monday to Saturday, between 9 AM and 7 PM.',
          'Working days exclude Sundays and public holidays. Delivery times may be affected by weather, strikes, courier delays, local restrictions, or other factors beyond our control.',
        ],
      },
      {
        title: 'Fragile Items and Risk',
        body: [
          'We take special care to protect fragile items during packing. However, packages are dispatched at the customer\'s risk once handed to the courier partner.',
          'If any additional charges, duties, taxes, or local delivery charges are applicable, they will be the customer\'s responsibility.',
        ],
      },
    ],
  },
  'cancellation-and-refund-policy': {
    title: 'Cancellation and Refund Policy',
    intro: 'Please review cancellation eligibility before placing an order, as delivered products are non-returnable.',
    updated: 'Last updated: July 4, 2026',
    sections: [
      {
        title: 'Order Cancellation by Customer',
        body: [
          `You can request a cancellation by emailing us at ${contactEmail}. To help us process your request, please contact us at least 3 hours before our daily order dispatch time of 3:00 PM.`,
          'We will make every effort to accommodate your cancellation request, provided your order has not been packed or picked up for dispatch.',
          'Once the order is packed, picked up, or in the process of being shipped, it cannot be cancelled.',
        ],
      },
      {
        title: 'Refunds for Accepted Cancellations',
        body: [
          'If your cancellation request is accepted, any payment made will be refunded to the original payment method.',
          'Refunds are usually credited within 3-7 business days, depending on your bank or payment provider.',
          'We do not accept product returns once delivered.',
        ],
      },
      {
        title: 'Order Cancellation by DivineDhenu',
        body: [
          'DivineDhenu reserves the right to cancel any order due to unforeseen circumstances, including stock unavailability, payment authorisation issues, suspected fraud, incorrect pricing, or operational constraints.',
          'If we cancel your order, we will notify you promptly by email or phone and provide a full refund for any payment made.',
          'Refunds for orders cancelled by DivineDhenu are usually processed within 3-7 working days.',
        ],
      },
      {
        title: 'Non-Returnable Orders',
        body: [
          'As goods can also be used for religious purposes, we do not accept product returns once delivered.',
          'Please check your order details, delivery address, and product selection carefully before placing the order.',
        ],
      },
      {
        title: 'Changes to Orders',
        body: [
          'If you wish to modify the delivery address or add/remove items, please contact us as soon as possible.',
          'We will do our best to accommodate your request, provided the order has not been packed or dispatched.',
        ],
      },
      {
        title: 'Important Considerations',
        body: [
          'Orders placed during peak seasons or special promotions may be subject to different cancellation terms, which will be communicated where applicable.',
          'DivineDhenu is not responsible for loss or inconvenience caused by cancellations due to factors beyond our control, such as natural disasters, strikes, logistics disruptions, or other unforeseen events.',
        ],
      },
      {
        title: 'Policy Updates',
        body: ['DivineDhenu reserves the right to update or modify this cancellation and refund policy at any time. Changes will be effective immediately upon posting on this website.'],
      },
    ],
  },
  'pricing-policy': {
    title: 'Pricing Policy',
    intro: 'This policy explains how product prices, promotions, shipping fees, and bulk order terms are handled.',
    updated: 'Last updated: July 4, 2026',
    sections: [
      {
        title: 'Product Pricing',
        body: [
          'All prices listed on our platform are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.',
          'Prices may vary based on market conditions, seasonal availability, and other factors. DivineDhenu reserves the right to update prices without prior notice.',
          'The price displayed at the time of purchase is the final product price, except for shipping fees and any applicable customs duties or destination charges for international orders.',
        ],
      },
      {
        title: 'Promotional Pricing',
        body: [
          'We may offer discounts, promotional pricing, coupon codes, and special offers on selected products.',
          'Offers are time-sensitive, subject to availability, and cannot be combined unless explicitly stated.',
          'Discounts and promotional offers are not applicable to previous purchases.',
        ],
      },
      {
        title: 'Shipping Fees',
        body: [
          'Shipping fees are calculated based on order weight and delivery destination and will be displayed during checkout before order confirmation.',
          'For international orders, customers are responsible for any customs duties, taxes, or additional fees imposed by the destination country.',
          'We recommend combining multiple items in a single order to minimise shipping costs. Separate orders cannot be combined for shipping.',
        ],
      },
      {
        title: 'Price Matching',
        body: ['We do not offer price matching with online or offline retailers. Our listed prices reflect the quality, authenticity, and freshness of DivineDhenu products.'],
      },
      {
        title: 'Payment Terms',
        body: [
          'Payments must be made in full at the time of purchase through the payment options available on our platform, including credit/debit cards, net banking, UPI, and digital wallets where available.',
          'Transactions are securely processed through third-party payment providers to support privacy and data protection.',
        ],
      },
      {
        title: 'Refunds and Cancellations',
        body: [
          'Refunds, if applicable, are processed according to our Cancellation and Refund Policy.',
          'Order cancellations are accepted only if the order has not been processed, packed, or dispatched.',
        ],
      },
      {
        title: 'Pricing Errors',
        body: [
          'While we strive to ensure accurate pricing, errors may occur.',
          'In the event of a pricing error, DivineDhenu reserves the right to cancel the order and refund any payment made. We will promptly inform the customer if this situation arises.',
        ],
      },
      {
        title: 'Bulk Orders and Customisation',
        body: [
          'For bulk orders or wholesale enquiries, please contact our support team. Special pricing and terms may apply.',
          'We offer customisation with a minimum order quantity/value of Rs. 1000.',
        ],
      },
      {
        title: 'Policy Updates',
        body: ['DivineDhenu reserves the right to update or modify this pricing policy at any time. Changes will be effective immediately upon posting on this website.'],
      },
    ],
  },
};

const policyLinks = Object.entries(policies).map(([slug, policy]) => ({ slug, title: policy.title }));

export default function LegalPage() {
  const { policySlug } = useParams();
  const policy = policies[policySlug];

  if (!policy) {
    return <Navigate to="/terms-and-conditions" replace />;
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-lg border border-ritual-border bg-ritual-card p-4 shadow-soft" aria-label="Policy pages">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-ritual-gold">Policies</p>
              <div className="mt-3 grid gap-1">
                {policyLinks.map((link) => (
                  <Link
                    key={link.slug}
                    to={`/${link.slug}`}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-ritual-background hover:text-ritual-gold ${link.slug === policySlug ? 'bg-ritual-background text-ritual-gold' : 'text-ritual-muted'}`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>

          <article className="rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-soft md:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ritual-gold">{policy.updated}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{policy.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ritual-muted">{policy.intro}</p>

            <div className="mt-9 grid gap-8">
              {policy.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-serif text-2xl">{section.title}</h2>
                  <div className="mt-3 grid gap-3 text-sm leading-7 text-ritual-muted md:text-base">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-lg border border-ritual-border bg-ritual-background p-5">
              <h2 className="font-serif text-2xl">Contact Us</h2>
              <div className="mt-4 grid gap-3 text-sm text-ritual-muted sm:grid-cols-2">
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 transition hover:text-ritual-gold">
                  <Mail size={18} className="text-ritual-gold" />
                  <span>{contactEmail}</span>
                </a>
                <a href={`tel:${contactPhoneHref}`} className="flex items-center gap-3 transition hover:text-ritual-gold">
                  <Phone size={18} className="text-ritual-gold" />
                  <span>{contactPhone}</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
