import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import quizController from '../../../../controllers/quiz.controller';

const log = debug('tjl:api:quiz:quiz');

/** quiz root */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  const { method, query } = req;
  log(method);
  if (method !== 'GET') {
    res.status(404).end();
  }
  await quizController.findAllQuizFromBank({ query, res });
}
