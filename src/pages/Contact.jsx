import { Instagram, Mail, MessageCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import Container from '../components/common/Container.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import { PrimaryButton } from '../components/common/Button.jsx';

const faqs = [
  ['How long does delivery take?', 'Most orders arrive within 3-7 business days after dispatch, depending on the delivery pin code.'],
  ['Are your products gift-ready?', 'Yes, our ritual sets and hampers are packed with gifting in mind.'],
  ['Do you offer bulk gifting?', 'Yes, share your requirement through the form and our team will respond.'],
  ['Which product is best for daily puja?', 'Temple Rose Incense Cones, Coastal Camphor Incense, and Sacred Santalum Havan Cups are lovely daily puja choices.'],
  ['Are the products charcoal-free?', 'Our core incense and dhoop range is designed around clean-burning, charcoal-free ritual formats.'],
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Valid email is required';
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) nextErrors.phone = 'Valid phone is required';
    if (form.message.trim().length < 10) nextErrors.message = 'Please write at least 10 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading title="Contact DivineDhenu" subtitle="Questions about daily puja, gifting, or finding your right fragrance? We would love to help." />
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <form onSubmit={submit} className="rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-soft md:p-8">
            {sent ? <p className="mb-5 rounded-lg bg-ritual-background p-4 text-sm font-semibold text-ritual-gold">Thank you. Your message has been received.</p> : null}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" value={form.name} error={errors.name} onChange={(value) => setForm({ ...form, name: value })} />
              <Field label="Email" value={form.email} error={errors.email} onChange={(value) => setForm({ ...form, email: value })} />
              <Field label="Phone" value={form.phone} error={errors.phone} onChange={(value) => setForm({ ...form, phone: value })} />
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold">Message</span>
                <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows="5" className="focus-ring mt-2 w-full rounded-lg border border-ritual-border bg-ritual-background px-4 py-3 text-sm" />
                {errors.message ? <span className="mt-1 block text-xs text-red-700">{errors.message}</span> : null}
              </label>
            </div>
            <PrimaryButton className="mt-6">Send Message</PrimaryButton>
          </form>
          <div className="grid gap-4">
            {[
              ['Email', 'divinedhenu@gmail.com', Mail],
              ['WhatsApp', '+91 81402 43960', MessageCircle],
              ['Instagram', '@divinedhenu', Instagram],
              ['Business hours', 'Mon-Sat, 10 AM - 6 PM', Clock],
            ].map(([title, value, Icon]) => (
              <div key={title} className="rounded-lg border border-ritual-border bg-ritual-card p-5 shadow-soft">
                <Icon className="text-ritual-gold" size={22} />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="text-sm text-ritual-muted">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="font-serif text-3xl">FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-lg border border-ritual-border bg-ritual-card p-5 shadow-soft">
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-ritual-muted">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({ label, value, error, onChange }) {
  return (
    <label>
      <span className="text-sm font-semibold">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 w-full rounded-full border border-ritual-border bg-ritual-background px-4 py-3 text-sm" />
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}
