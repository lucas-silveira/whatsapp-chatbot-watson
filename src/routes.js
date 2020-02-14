import { Router } from 'express';

import WhatsappMessage from './app/controllers/WhatsappMessage';

const routes = new Router();

routes.post('/api/v1/messages', WhatsappMessage.store);

export default routes;
