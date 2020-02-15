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

    let responseAssistant;

    await assistant
      .message({
        assistantId: process.env.ASSISTANT_ID,
        sessionId,
        input: {
          message_type: 'text',
          text: message,
        },
      })
      .then(data => {
        responseAssistant = data.result.output;
      })
      .catch(async err => {
        console.log(err.message);
        await WhatsappSessions.delete(whatsappClient);
        responseAssistant = {
          generic: [{ text: 'Olá! Como posso ajudá-lo?' }],
        };
      });

    const {
      generic: [{ text: responseAssistantText }],
    } = responseAssistant;

    console.log(responseAssistant);

    return client.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: responseAssistantText,
        to: whatsappClient,
      })
      .then(response => console.log(response.sid));
  }
}

export default new WhatsappMessage();
