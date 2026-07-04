import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { publicApi } from '../../services/api.js';

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    publicApi.getSiteSettings()
      .then((settings) => setWhatsapp(settings?.whatsapp || ''))
      .catch(() => setWhatsapp(''));
  }, []);

  const whatsappLink = useMemo(() => {
    const phone = whatsapp.replace(/\D/g, '');
    if (!phone) return '';
    const message = encodeURIComponent('Hello Divine Dhenu, I need help with an order.');
    return `https://wa.me/${phone}?text=${message}`;
  }, [whatsapp]);

  if (!whatsappLink) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[60] lg:bottom-6 lg:right-6">
      {open ? (
        <div className="mb-3 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#17120e] p-5 text-white shadow-[0_16px_42px_rgba(0,0,0,0.28)]">
          <p className="font-semibold">Chat with us</p>
          <p className="mt-2 text-sm leading-6 text-white/60">Have a question or need help? We typically reply within minutes.</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1fbd59]"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" /> Start Conversation
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.38)] transition hover:scale-105"
        aria-label={open ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
      >
        {open ? <X size={24} /> : <WhatsAppIcon className="h-7 w-7" />}
      </button>
    </div>
  );
}

function WhatsAppIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 4.25a10.9 10.9 0 0 0-9.43 16.37L5 27l6.53-1.52A10.92 10.92 0 1 0 16 4.25Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.15 10.72c.25-.56.51-.57.76-.58h.65c.2 0 .48.07.62.43.16.38.57 1.39.62 1.5.05.1.08.23.02.36-.07.13-.1.21-.21.33-.1.12-.22.26-.31.35-.1.11-.2.23-.09.43.12.2.52.86 1.13 1.39.77.69 1.42.9 1.62 1 .2.1.32.08.44-.05.12-.14.51-.6.65-.81.14-.2.27-.17.46-.1.19.06 1.18.56 1.38.66.2.1.33.15.38.23.05.08.05.47-.11.93-.16.46-.93.88-1.28.94-.34.07-.79.1-1.27-.05-.29-.09-.66-.21-1.14-.42-.5-.22-2.16-.8-3.7-2.16-1.23-1.09-2.06-2.43-2.3-2.84-.24-.41-.03-.63.18-.84.19-.19.42-.48.63-.72.21-.24.28-.41.42-.69.14-.27.07-.51-.03-.72-.1-.2-.88-2.13-1.22-2.91Z"
        fill="currentColor"
      />
    </svg>
  );
}
