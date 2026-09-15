export interface ExtractedProductInfo {
  productName?: string;
  category?: string;
  material?: string;
  intendedUse?: string;
  capacity?: string;
  voltage?: string;
  isDomestic?: boolean;
  isIndustrial?: boolean;
  isCode?: string;
}

export function extractProductInfo(text: string): ExtractedProductInfo {
  const t = text.toLowerCase();
  const info: ExtractedProductInfo = {};

  // Standard code matching
  const isMatch = text.match(/IS\s*[:\-\s]?\s*(\d+(?:[-–]\d+)*(?::\d{4})?)/i);
  if (isMatch) {
    info.isCode = isMatch[0].replace(/\s+/g, ' ').toUpperCase();
  }

  // Product categories and names
  if (t.includes('water bottle') || t.includes('flask') || t.includes('bottle') || t.includes('thermos')) {
    info.productName = 'Stainless Steel Water Bottle';
    info.category = 'Food & Beverages';
    info.material = t.includes('plastic') ? 'Plastic (Food Grade)' : (t.includes('copper') ? 'Copper' : 'Stainless Steel (SS 304/316)');
    info.intendedUse = 'Drinking Water Storage';
  } else if (t.includes('microwave') || t.includes('oven')) {
    info.productName = 'Microwave Oven';
    info.category = 'Electrical & Electronics';
    info.material = 'Sheet Metal & Cavity Magnetron';
    info.intendedUse = 'Food Reheating & Convection Cooking';
    info.voltage = '230V AC, 50Hz';
  } else if (t.includes('cable') || t.includes('wire') || t.includes('pvc')) {
    info.productName = 'PVC Insulated Electrical Cable';
    info.category = 'Electrical & Cables';
    info.material = 'Copper Conductor / PVC Insulation';
    info.intendedUse = 'Building & Domestic Power Transmission';
    info.voltage = 'Up to 1100V';
  } else if (t.includes('helmet') || t.includes('headgear')) {
    info.productName = 'Two Wheeler Protective Helmet';
    info.category = 'Automotive & Safety';
    info.material = 'ABS Outer Shell / EPS Liner';
    info.intendedUse = 'Rider Head Protection';
  } else if (t.includes('packaged water') || t.includes('drinking water') || t.includes('mineral water')) {
    info.productName = 'Packaged Drinking Water';
    info.category = 'Food & Beverages';
    info.intendedUse = 'Human Consumption';
  } else if (t.includes('charger') || t.includes('ev charger') || t.includes('charging station')) {
    info.productName = 'Electric Vehicle Conductive Charger';
    info.category = 'E-Mobility & Automotive';
    info.intendedUse = 'EV Battery Charging';
  } else if (t.includes('battery') || t.includes('lithium') || t.includes('li-ion') || t.includes('cell')) {
    info.productName = 'Lithium-ion Rechargeable Battery Pack';
    info.category = 'Electrical & Electronics';
    info.intendedUse = 'Portable Electronic Devices';
  } else if (t.includes('plug') || t.includes('socket')) {
    info.productName = 'Domestic Plug and Socket Outlet';
    info.category = 'Electrical Fittings';
    info.intendedUse = 'Domestic Power Connection';
  } else if (t.includes('toy') || t.includes('toys')) {
    info.productName = 'Children Toy';
    info.category = 'Consumer Products / Toys';
    info.intendedUse = 'Child Play & Recreation';
  }

  // Capacity extraction
  const capMatch = text.match(/(\d+(?:\.\d+)?)\s*(ml|l|litre|litres|liter|kg|watt|w|v)/i);
  if (capMatch) {
    info.capacity = `${capMatch[1]} ${capMatch[2]}`;
  }

  // Domestic vs Industrial
  if (t.includes('domestic') || t.includes('home') || t.includes('household')) {
    info.isDomestic = true;
  }
  if (t.includes('industrial') || t.includes('commercial') || t.includes('factory')) {
    info.isIndustrial = true;
  }

  return info;
}
