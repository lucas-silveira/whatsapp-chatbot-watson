class CalendarController {
  async store(req, res) {
    console.log(req.body);
    res.json({ available: true });
  }
}

export default new CalendarController();
