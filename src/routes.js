import { Router } from 'express';

import WhatsappController from './app/controllers/WhatsappController';
import CalendarController from './app/controllers/CalendarController';

const routes = new Router();

routes.post('/api/v1/messages', WhatsappController.store);
routes.post('/api/v1/calendar', CalendarController.store);

export default routes;
