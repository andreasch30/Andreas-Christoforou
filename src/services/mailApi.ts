import axios from 'axios';

const BASE_URL = 'https://api.mail.tm';

export interface Domain {
  id: string;
  domain: string;
  isActive: boolean;
}

export interface Account {
  id: string;
  address: string;
  quota: number;
  used: number;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  accountId: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  to: {
    address: string;
    name: string;
  }[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDetail extends Message {
  text: string;
  html: string[];
  attachments: {
    id: string;
    filename: string;
    contentType: string;
    size: number;
    transferEncoding: string;
  }[];
}

export class MailApi {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private get headers() {
    return {
      Authorization: this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(config: any, retries = 3, backoff = 1000): Promise<T> {
    try {
      const response = await axios({
        ...config,
        headers: { ...this.headers, ...config.headers },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        // Rate limited - wait and retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoff));
        return this.request(config, retries - 1, backoff * 2);
      }
      throw error;
    }
  }

  async getDomains(): Promise<Domain[]> {
    const data = await this.request<any>({ method: 'get', url: `${BASE_URL}/domains` });
    return data['hydra:member'];
  }

  async createAccount(address: string, password: string): Promise<Account> {
    return this.request<Account>({
      method: 'post',
      url: `${BASE_URL}/accounts`,
      data: { address, password },
    });
  }

  async getToken(address: string, password: string): Promise<string> {
    const data = await this.request<any>({
      method: 'post',
      url: `${BASE_URL}/token`,
      data: { address, password },
    });
    this.token = data.token;
    return data.token;
  }

  async getMessages(page = 1): Promise<Message[]> {
    const data = await this.request<any>({
      method: 'get',
      url: `${BASE_URL}/messages?page=${page}`,
    });
    return data['hydra:member'];
  }

  async getMessage(id: string): Promise<MessageDetail> {
    return this.request<MessageDetail>({
      method: 'get',
      url: `${BASE_URL}/messages/${id}`,
    });
  }

  async deleteMessage(id: string): Promise<void> {
    await this.request({
      method: 'delete',
      url: `${BASE_URL}/messages/${id}`,
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.request({
      method: 'delete',
      url: `${BASE_URL}/accounts/${id}`,
    });
  }
}

export const mailApi = new MailApi();
