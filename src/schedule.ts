
import { userLogin, getStoreStockList } from './puppeteer.storeStockList';
import { getStoreList, getMessage } from './convert.storeList';
import schedule from 'node-schedule';
import { webHook } from './webhook.workplace';

const STARBUCKS_EMAIL: string = process.env.STARBUCKS_EMAIL || '';
const STARBUCKS_PASSWORD: string = process.env.STARBUCKS_PASSWORD || '';



async function job() {
  if (STARBUCKS_EMAIL === '' || STARBUCKS_PASSWORD === '') {
    throw new Error('Email 혹은 Password가 없습니다.');
  }

  const sessionId = await userLogin(STARBUCKS_EMAIL, STARBUCKS_PASSWORD);
  const { storeList, stockList } = await getStoreStockList(sessionId);
  const storesWithBagList = getStoreList(storeList, stockList);

  const message = getMessage(storesWithBagList);
  await webHook(message);

}

function getRule() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;

  return rule;
}

function run() {
  const rule = getRule();
  schedule.scheduleJob(rule, job);
}


export { run };