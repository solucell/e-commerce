// utils/pix.ts
// Geração de código PIX no padrão EMV

interface PixPayloadParams {
  pixKey: string;      // ex: +5531999999999 | CPF | CNPJ | chave aleatória
  merchantName: string;
  merchantCity: string;
  amount: number;      // valor final
  txid?: string;       // default: '***'
}

const formatField = (id: string, value: string) =>
  `${id}${value.length.toString().padStart(2, '0')}${value}`;

export function generatePixCode({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  txid = '***',
}: PixPayloadParams): string {
  const merchantAccount =
    formatField('00', 'br.gov.bcb.pix') +
    formatField('01', pixKey);

  const payload =
    '000201' +
    formatField('26', merchantAccount) +
    '52040000' +
    '5303986' +
    formatField('54', amount.toFixed(2)) +
    '5802BR' +
    formatField('59', merchantName.substring(0, 25)) +
    formatField('60', merchantCity.substring(0, 15)) +
    formatField('62', formatField('05', txid)) +
    '6304';

  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }

  return payload + (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}
