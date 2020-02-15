import twilio from 'twilio';

import assistant from '../../config/imb-watson';

import WhatsappSessions from '../helpers/WhatsappSessions';

class WhatsappMessage {
  async store(req, res) {
    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const whatsappClient = req.body.From;
    const message = req.body.Body;

    console.log(message);

    const sessionExists = await WhatsappSessions.find(whatsappClient);

    let sessionId;

    if (sessionExists) {
      sessionId = sessionExists.session;
    } else {
      const newSession = await assistant.createSession({
        assistantId: process.env.ASSISTANT_ID,
      });

      sessionId = newSession.result.session_id;

      await WhatsappSessions.create(whatsappClient, sessionId);
    }

    const {
      result: {
        output: {
          generic: [{ text: responseAssistant }],
        },
      },
    } = await assistant.message({
      assistantId: process.env.ASSISTANT_ID,
      sessionId,
      input: {
        message_type: 'text',
        text: message,
      },
    });

    client.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: responseAssistant,
        to: whatsappClient,
      })
      .then(response => console.log(response.sid));

    if (responseAssistant.includes('finalizada'))
      await WhatsappSessions.delete(whatsappClient);
  }
}

export default new WhatsappMessage();
