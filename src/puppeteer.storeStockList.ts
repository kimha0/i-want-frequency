import puppeteer from 'puppeteer';
import axios from 'axios';
import qs from 'qs';
import { RootObject } from './interface';


const SESSION_ID = 'JSESSIONID';
const STARBUCKS_LOGIN_URL = 'https://www.starbucks.co.kr/login/login.do';
const STARBUCKS_BAG_COUNT_URL = 'https://www.starbucks.co.kr/store/getStoreStockList.do';

const userLogin = async (email: string, password: string) => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
    await dialog.dismiss();
  });

  await page.goto(STARBUCKS_LOGIN_URL);

  await page.click('.login_id');
  await page.keyboard.type(email);
  await page.click('.login_pw');
  await page.keyboard.type(password);
  await page.click('.btn_login');

  const cookie = await page.cookies();
  
  
  const sessionId = cookie.find(e => e.name === SESSION_ID);
  
  if (sessionId === undefined) {
    throw new Error('세션 아이디를 찾지 못함.');
  }
  
  await browser.close();
  return sessionId.value;
}

const getStoreStockList = async (sessionId: string) => {
  const body = {
    'gugun_cd': '0101',
    'rndCod': 'KHRSNQ8L4M',
    'search_text': '',
    'stock_data[0][sku_kor_nm]': '스카이',
    'stock_data[0][sku_nm]': 'chair_sky',
    'stock_data[0][sku_no]': '9400000000972',
    'stock_data[1][sku_kor_nm]': '그린',
    'stock_data[1][sku_nm]': 'chair_green',
    'stock_data[1][sku_no]': '9400000000973',
    'stock_data[2][sku_kor_nm]': '오렌지',
    'stock_data[2][sku_nm]': 'chair_orange',
    'stock_data[2][sku_no]': '9400000000974',
    'stock_data[3][sku_kor_nm]': '그린',
    'stock_data[3][sku_nm]': 'bag_green',
    'stock_data[3][sku_no]': '9400000000975',
    'stock_data[4][sku_kor_nm]': '핑크',
    'stock_data[4][sku_nm]': 'bag_pink',
    'stock_data[4][sku_no]': '9400000000976',
  }

  const options = {
    headers: {
      'Host': 'www.starbucks.co.kr',
      'Connection': 'keep-alive',
      'Content-Length': '751',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': `JSESSIONID=${sessionId}`,
    },
  };

  const { storeList, stockList } = await axios
    .post(STARBUCKS_BAG_COUNT_URL, qs.stringify(body), options)
    .then(response => response.data);

  return { storeList, stockList } as RootObject;
}

export { userLogin, getStoreStockList };
