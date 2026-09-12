import { Router } from 'express';
import { sizeRecommendationSchema } from '../../../../../packages/validation/src/index.js';
import { recommendSize } from '../../services/size-recommendation.js';
import { sendError, sendSuccess } from '../../lib/errors.js';

const router = Router();

router.post('/recommend', async (req, res) => {
  try {
    const input = sizeRecommendationSchema.parse(req.body);
    const result = recommendSize(input);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e); }
});

export default router;
