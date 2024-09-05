import type { PostMessageRequestParams } from '@site-types/contact';
import axios from 'axios';
import { Constants } from '../constants';

const sendMessageEndpoint = `${Constants.BACKEND_URL}/message`;
export const sendMessage = async (
  email: string | undefined,
  telegram: string | undefined,
  message: string
): Promise<string> => {
  const body: PostMessageRequestParams = { email, telegram, message };
  const resp = await axios.post(sendMessageEndpoint, body, {
    headers: { Accept: 'text/plain' },
  });
  return resp.data;
};
