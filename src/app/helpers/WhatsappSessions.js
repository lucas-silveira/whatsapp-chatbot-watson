import WPsessionsJSON from '../../lib/WPsessions';

class WhatsappSessions {
  find(whatsapp) {
    const content = WPsessionsJSON.load();
    const session = content.find(item => item.whatsapp === whatsapp);

    return session;
  }

  update(whatsapp, body) {
    const content = WPsessionsJSON.load();
    const newContent = content.filter(item => item.whatsapp !== whatsapp);
    newContent.push(body);
    WPsessionsJSON.save(newContent);

    return body;
  }

  create(body) {
    const content = WPsessionsJSON.load();
    content.push(body);
    WPsessionsJSON.save(content);

    return content;
  }

  delete(whatsapp) {
    const content = WPsessionsJSON.load();
    const newContent = content.filter(item => item.whatsapp !== whatsapp);
    WPsessionsJSON.save(newContent);

    return true;
  }
}

export default new WhatsappSessions();
