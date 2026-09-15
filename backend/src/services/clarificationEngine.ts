import { ExtractedProductInfo } from './productExtractionService';

export interface ClarificationResult {
  needsClarification: boolean;
  reason?: string;
  questions?: string[];
  suggestedAnswers?: { question: string; options: string[] }[];
}

export function checkClarificationNeed(query: string, info: ExtractedProductInfo): ClarificationResult {
  const q = query.trim().toLowerCase();

  // Electrical appliance generic trigger
  const isGenericAppliance = 
    (q.includes('appliance') || q.includes('electrical product')) && 
    !q.includes('microwave') && !q.includes('oven') && !q.includes('geyser') && !q.includes('heater') && !q.includes('cooktop');

  if (isGenericAppliance) {
    return {
      needsClarification: true,
      reason: 'Electrical appliances have distinct standards depending on whether it is a microwave, water heater, toaster, or air conditioner.',
      questions: [
        'What specific type of electrical appliance do you manufacture (e.g. Microwave Oven, Water Heater, Toaster)?',
        'What is the rated voltage and power wattage?',
        'Is it intended for domestic household use or commercial catering?'
      ],
      suggestedAnswers: [
        {
          question: 'Appliance Type',
          options: ['Microwave Oven (IS 302-2-25)', 'Electric Geyser / Water Heater', 'Room Heater', 'Induction Cooktop']
        }
      ]
    };
  }

  // Generic bottle trigger
  const isGenericBottle = 
    (q.includes('bottle') || q.includes('flask')) && 
    !q.includes('stainless') && !q.includes('steel') && !q.includes('glass') && !q.includes('packaged') && !q.includes('mineral water');

  if (isGenericBottle) {
    return {
      needsClarification: true,
      reason: 'Standard applicability depends on material (stainless steel vs plastic vs copper) and whether it is vacuum-insulated.',
      questions: [
        'What material is the bottle constructed from (Stainless Steel SS 304/316, Plastic, Copper, or Glass)?',
        'Is the bottle double-wall vacuum insulated or single-wall?',
        'What is the intended capacity range (e.g. 500ml, 750ml, 1000ml)?'
      ],
      suggestedAnswers: [
        {
          question: 'Material & Insulation',
          options: ['Stainless Steel Vacuum Insulated (IS 17526)', 'Food Grade Plastic Bottle', 'Pure Copper Water Vessel']
        }
      ]
    };
  }

  // Generic wire / cable trigger
  const isGenericCable = 
    (q.includes('cable') || q.includes('wire')) && 
    !q.includes('is 694') && !q.includes('pvc') && !q.includes('xlpe') && !q.includes('1100v');

  if (isGenericCable) {
    return {
      needsClarification: true,
      reason: 'Cable standards diverge by working voltage (up to 1100V vs high-tension) and insulation material (PVC, XLPE, Rubber).',
      questions: [
        'What is the maximum rated voltage (e.g., up to 1100 V or higher)?',
        'What conductor material is used (Copper or Aluminium)?',
        'What is the primary insulation material (PVC or XLPE)?'
      ],
      suggestedAnswers: [
        {
          question: 'Voltage & Insulation',
          options: ['PVC Insulated up to 1100V (IS 694)', 'XLPE Power Cables', 'Submersible Pump Cables']
        }
      ]
    };
  }

  return {
    needsClarification: false
  };
}
