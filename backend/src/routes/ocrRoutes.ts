import { Router } from 'express';
import { parseOcrText } from '../services/ocrService';

const router = Router();

router.post('/', (req, res) => {
  const { text, imageBase64 } = req.body;

  let textToParse = text;
  if (!textToParse && imageBase64) {
    // If base64 image passed, extract or simulate OCR result
    textToParse = `IS 302-2-25:2014 R-71020123 Water Bottle Stainless Steel Model HydroPure 750 www.bis.gov.in`;
  }

  if (!textToParse) {
    textToParse = `IS 17526:2021 CM/L-71020123 AquaSafe Steelware Pvt. Ltd. Stainless Steel Water Bottle 750ml`;
  }

  const result = parseOcrText(textToParse);
  return res.json({
    ...result,
    demoNotice: 'This is a prototype OCR feature. Not an official BIS verification.'
  });
});

export default router;
