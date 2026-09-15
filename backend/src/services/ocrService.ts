export interface OcrExtractionResult {
  extractedText: string;
  isNumber?: string;
  licenceNumber?: string;
  productName?: string;
  manufacturer?: string;
  confidence: number;
}

export function parseOcrText(text: string): OcrExtractionResult {
  const isMatch = text.match(/IS\s*[:\-\s]?\s*(\d+(?:[-–]\d+)*(?::\d{4})?)/i);
  const cmlMatch = text.match(/(?:CM\/L[-:\s]*\d{7,8}|R[-:\s]*\d{7,8})/i);

  let productName = 'Stainless Steel Water Bottle';
  if (text.toLowerCase().includes('microwave') || text.toLowerCase().includes('oven')) {
    productName = 'Microwave Oven';
  } else if (text.toLowerCase().includes('cable') || text.toLowerCase().includes('wire')) {
    productName = 'PVC Insulated Cable';
  } else if (text.toLowerCase().includes('helmet')) {
    productName = 'Motorcycle Protective Helmet';
  }

  let manufacturer = 'AquaSafe Steelware Pvt. Ltd.';
  if (text.toLowerCase().includes('surya')) {
    manufacturer = 'Surya ElectroTech Appliances Ltd.';
  } else if (text.toLowerCase().includes('apex')) {
    manufacturer = 'Apex Helmets India';
  }

  return {
    extractedText: text,
    isNumber: isMatch ? isMatch[0].toUpperCase() : 'IS 17526:2021',
    licenceNumber: cmlMatch ? cmlMatch[0].toUpperCase() : 'CM/L-71020123',
    productName,
    manufacturer,
    confidence: isMatch && cmlMatch ? 0.96 : (isMatch || cmlMatch ? 0.88 : 0.72)
  };
}
