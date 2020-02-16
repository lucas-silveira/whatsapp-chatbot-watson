import fs from 'fs';
import { resolve } from 'path';

class WPsessionsJSON {
  constructor() {
    this.filename = resolve(__dirname, '..', '..', 'tmp', 'wpsessions.json');
  }

  save(content) {
    const contentString = JSON.stringify(content);
    return fs.writeFileSync(this.filename, contentString);
  }

  load() {
    const fileBuffer = fs.readFileSync(this.filename, 'utf-8');
    const contentJson = JSON.parse(fileBuffer);
    return contentJson;
  }
}

export default new WPsessionsJSON();
