export interface NotificationMessage {
  to: string;
  template: string;
  data: Record<string, any>;
  channel: 'email' | 'sms' | 'whatsapp';
}

export interface NotificationProvider {
  send(msg: NotificationMessage): Promise<{ success: boolean; messageId?: string }>;
}

export class MockNotificationProvider implements NotificationProvider {
  async send(msg: NotificationMessage) {
    console.log(`[NOTIFICATION] ${msg.channel}:${msg.template} -> ${msg.to}`);
    return { success: true, messageId: `mock_${Date.now()}` };
  }
}

export class EmailNotificationProvider implements NotificationProvider {
  constructor(private from: string) {}

  async send(msg: NotificationMessage) {
    // Production: integrate with SendGrid/SES/Resend
    console.log(`[EMAIL] ${this.from} -> ${msg.to}: ${msg.template}`);
    return { success: true, messageId: `email_${Date.now()}` };
  }
}
