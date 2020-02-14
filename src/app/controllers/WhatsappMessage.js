import twilio from 'twilio';

class WhatsappMessage {
  async store(req, res) {
    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = req.body.Body;

    console.log(message);

    client.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: 'Hello World',
        to: 'whatsapp:+5519987202267',
      })
      .then(response => console.log(response.sid));
  }
}

export default new WhatsappMessage();
