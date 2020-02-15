import fs from 'fs';
import { resolve } from 'path';

class WhatsappSessions {
  find(whatsapp) {
    return new Promise((res, rej) => {
      fs.exists(
        resolve(__dirname, '..', '..', '..', 'tmp', 'whatsapp_sessions.json'),
        exists => {
          if (exists) {
            fs.readFile(
              resolve(
                __dirname,
                '..',
                '..',
                '..',
                'tmp',
                'whatsapp_sessions.json'
              ),
              function readFileCallback(err, fileData) {
                if (err) {
                  console.log(err);
                  return rej(err);
                }

                const obj = JSON.parse(fileData);

                const objItem = obj.find(item => item.whatsapp === whatsapp);

                return res(objItem);
              }
            );
          } else {
            return res(null);
          }
        }
      );
    });
  }

  create(whatsapp, session) {
    return new Promise((res, rej) => {
      fs.exists(
        resolve(__dirname, '..', '..', '..', 'tmp', 'whatsapp_sessions.json'),
        exists => {
          if (exists) {
            fs.readFile(
              resolve(
                __dirname,
                '..',
                '..',
                '..',
                'tmp',
                'whatsapp_sessions.json'
              ),
              function readFileCallback(err, fileData) {
                if (err) {
                  console.log(err);
                  return rej(err);
                }

                const obj = JSON.parse(fileData);

                obj.push({
                  whatsapp,
                  session,
                });

                const json = JSON.stringify(obj);

                fs.writeFile(
                  resolve(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'tmp',
                    'whatsapp_sessions.json'
                  ),
                  json,
                  () => {}
                );

                return res(true);
              }
            );
          } else {
            const obj = [
              {
                whatsapp,
                session,
              },
            ];

            const json = JSON.stringify(obj);
            fs.writeFile(
              resolve(
                __dirname,
                '..',
                '..',
                '..',
                'tmp',
                'whatsapp_sessions.json'
              ),
              json,
              () => {}
            );

            return res(true);
          }
        }
      );
    });
  }

  delete(whatsapp) {
    return new Promise((res, rej) => {
      fs.readFile(
        resolve(__dirname, '..', '..', '..', 'tmp', 'whatsapp_sessions.json'),
        function readFileCallback(err, fileData) {
          if (err) {
            console.log(err);
            return rej(err);
          }

          const obj = JSON.parse(fileData);

          const newData = obj.filter(item => item.whatsapp !== whatsapp);

          const json = JSON.stringify(newData);

          fs.writeFile(
            resolve(
              __dirname,
              '..',
              '..',
              '..',
              'tmp',
              'whatsapp_sessions.json'
            ),
            json,
            () => {}
          );

          return res(true);
        }
      );
    });
  }
}

export default new WhatsappSessions();
