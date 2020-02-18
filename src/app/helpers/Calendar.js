import fs from 'fs';
import { resolve } from 'path';
import { google } from 'googleapis';
import { addHours } from 'date-fns';

import GoogleAuthentication from './GoogleAuthentication';

class Calendar {
  findEvent(date, endDate) {
    return new Promise((res, rej) => {
      // Load client secrets from a local file.
      fs.readFile(
        resolve(__dirname, '..', '..', 'keys', 'credentials.json'),
        (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Google Calendar API.
          GoogleAuthentication(JSON.parse(content), auth => {
            const calendar = google.calendar({ version: 'v3', auth });
            calendar.events.list(
              {
                calendarId: 'primary',
                timeMin: date,
                timeMax: endDate,
                maxResults: 1,
                singleEvents: true,
                orderBy: 'startTime',
              },
              (err, data) => {
                if (err)
                  return console.log(`The API returned an error: ${err}`);
                const events = data.data.items;
                if (events.length) {
                  events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                    return res(false);
                  });
                } else {
                  console.log('No upcoming events found.');
                  return res(true);
                }
              }
            );
          });
        }
      );
    });
  }

  createEvent(data) {
    const date = new Date(`${data.sys_date}T${data.sys_time}`);
    const endDate = addHours(date, 1);

    return new Promise((res, rej) => {
      // Load client secrets from a local file.
      fs.readFile(
        resolve(__dirname, '..', '..', 'keys', 'credentials.json'),
        (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Google Calendar API.
          GoogleAuthentication(JSON.parse(content), auth => {
            const event = {
              summary: `Reunião com ${data.name}`,
              location: 'Agência Meme Digital',
              description: `O cliente se chama ${data.name}.
                Ele possui uma empresa no segmento de ${data.tipo_negocio} e solicitou um orçamento para ${data.tipo_servico}.
                Whatsapp do cliente: ${data.whatsapp}.`,
              start: {
                dateTime: date,
                timeZone: 'America/Sao_Paulo',
              },
              end: {
                dateTime: endDate,
                timeZone: 'America/Sao_Paulo',
              },
              reminders: {
                useDefault: false,
                overrides: [
                  { method: 'email', minutes: 24 * 60 },
                  { method: 'popup', minutes: 10 },
                ],
              },
            };

            const calendar = google.calendar({ version: 'v3', auth });

            calendar.events.insert(
              {
                auth,
                calendarId: 'primary',
                resource: event,
              },
              (_err, _event) => {
                if (_err) {
                  console.log(
                    `There was an error contacting the Calendar service: ${_err}`
                  );
                  return rej(_err);
                }
                console.log('Event created!');
                return res(true);
              }
            );
          });
        }
      );
    });
  }
}

export default new Calendar();
