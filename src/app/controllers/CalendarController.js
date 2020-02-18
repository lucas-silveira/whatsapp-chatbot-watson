import { addHours } from 'date-fns';

import Calendar from '../helpers/Calendar';

class CalendarController {
  async store(req, res) {
    const { day, hour } = req.body;

    const date = new Date(`${day}T${hour}`);
    const endDate = addHours(date, 1);

    const available = await Calendar.findEvent(date, endDate);

    res.json({ available });
  }
}

export default new CalendarController();
