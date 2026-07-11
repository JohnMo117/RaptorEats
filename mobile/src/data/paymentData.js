/**
 * Raptor Eats — Payment Data (Mock)
 *
 * TODO(security): In production, payment information MUST come from a
 * secure backend API over HTTPS. Never hardcode real payment data.
 * Sensitive fields (card numbers, CLABE) must be masked in the UI
 * and never fully exposed client-side.
 */

export const PAYMENT_INFO = {
  recipientName: 'Cafetería Raptor Eats - UTMIR',
  // Masked card number — only last 4 digits shown
  // TODO(security): Real card numbers must never be stored/displayed in full
  cardNumber: '**** **** **** 7842',
  cardNumberFull: '4152 3138 0092 7842', // For copy-to-clipboard only
  // CLABE (Clave Bancaria Estandarizada) — masked
  clabe: '***************4523',
  clabeFull: '012180001234564523', // For copy-to-clipboard only
  bankName: 'BBVA México',
};

export const PAYMENT_INSTRUCTIONS = {
  title: 'Instrucciones de Pago',
  steps: [
    'Realiza la transferencia bancaria al siguiente número de cuenta.',
    'Una vez completada, toma captura de pantalla del comprobante.',
    'Envía el comprobante por WhatsApp usando el botón de abajo.',
    '¡Listo! Tu pedido será preparado al recibir la confirmación.',
  ],
};

// WhatsApp configuration
// TODO(security): Replace with actual phone number. Ensure no PII
// is transmitted in the URL beyond what the user explicitly confirms.
export const WHATSAPP_CONFIG = {
  phoneNumber: '5215512345678', // Placeholder — replace with real number
  getMessage: (total, orderItems) => {
    const itemsList = orderItems
      .map((item) => `• ${item.name} x${item.quantity}`)
      .join('\n');
    return encodeURIComponent(
      `🦖 *Raptor Eats — Comprobante de Pago*\n\n` +
      `*Pedido:*\n${itemsList}\n\n` +
      `*Total pagado:* $${total.toFixed(2)} MXN\n\n` +
      `Adjunto mi comprobante de transferencia. ¡Gracias!`
    );
  },
};
