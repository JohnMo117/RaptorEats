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
    'Confirma tu pedido presionando el botón de abajo.',
    '¡Listo! Tu pedido será preparado y verás el tiempo estimado.',
  ],
};

