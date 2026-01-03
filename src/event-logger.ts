import { EventStatus, EventType } from "./constants/events";
import { DB } from "./db";
import { Events } from "./models/Event";

export class EventLogger {
  constructor(private db: DB, private useConsole = true) { }

  async logSuccess(type: EventType, text: string) {
    this.logEvent('success', type, text);
  }

  async logError(type: EventType, text: string) {
    this.logEvent('error', type, text);
  }

  async logInfo(type: EventType, text: string) {
    this.logEvent('info', type, text);
  }

  async logEvent(status: EventStatus, type: EventType, text: string) {
    const event = {
      timestamp: new Date(),
      status,
      type,
      text
    };

    if (this.useConsole) {
      console.log('Logging event:', event);
    }

    return this.db.getRepo(Events).save(event).catch((err: any) => {
      console.error('Failed to log event:', err.message);
    });
  }
}