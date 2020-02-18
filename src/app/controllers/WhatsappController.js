import twilio from 'twilio';

import assistant from '../../config/imb-watson';

import WhatsappSessions from '../helpers/WhatsappSessions';
import Calendar from '../helpers/Calendar';

class WhatsappController {
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

      if (sessionExists.step === 'name') {
        const name = message;
        await WhatsappSessions.update(whatsappClient, {
          ...sessionExists,
          name,
        });

        const { entities } = sessionExists;
        const whatsapp = whatsappClient.slice(9);

        await Calendar.createEvent({ name, whatsapp, ...entities });

        await client.messages.create({
          from: 'whatsapp:+14155238886',
          body: `Obrigado ${name}! A reunião foi agendada.`,
          to: whatsappClient,
        });

        return WhatsappSessions.delete(whatsappClient);
      }
    } else {
      const newSession = await assistant.createSession({
        assistantId: process.env.ASSISTANT_ID,
      });

      sessionId = newSession.result.session_id;

      await WhatsappSessions.create({
        whatsapp: whatsappClient,
        session: sessionId,
        name: '',
        step: 'chat',
        entities: {},
      });
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
        if (responseAssistant.entities.length) {
          responseAssistant.entities.forEach(entity => {
            const title = entity.entity.includes('sys')
              ? entity.entity.replace('-', '_')
              : entity.entity;

            sessionExists.entities[title] = entity.value;
          });

          WhatsappSessions.update(whatsappClient, sessionExists);
        }
      })
      .catch(err => {
        console.log(err.message);
        WhatsappSessions.delete(whatsappClient);
        responseAssistant = {
          generic: [{ text: 'Olá! Como posso ajudá-lo?' }],
        };
      });

    const {
      generic: [{ text: responseAssistantText }],
    } = responseAssistant;

    if (responseAssistantText.includes('nome')) {
      sessionExists.step = 'name';
      WhatsappSessions.update(whatsappClient, {
        ...sessionExists,
        step: 'name',
      });

      return client.messages
        .create({
          from: 'whatsapp:+14155238886',
          body: 'Legal! Qual é o seu nome?',
          to: whatsappClient,
        })
        .then(response => console.log(response.sid));
    }

    return client.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: responseAssistantText,
        to: whatsappClient,
      })
      .then(response => console.log(response.sid));
  }
}

export default new WhatsappController();
