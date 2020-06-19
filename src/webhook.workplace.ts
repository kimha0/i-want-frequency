import Axios from "axios";

const WEBHOOK_URL: string = process.env.FACEBOOK_WEBHOOK_URL || '';

async function webHook(message: string) {
  if (!message) throw new Error('message 없음');
  if (!WEBHOOK_URL) throw new Error('webhook 주소가 없음');

  await Axios.post(WEBHOOK_URL, {
    message,
  })
};

export { webHook };
