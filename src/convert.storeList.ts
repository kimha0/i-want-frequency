import { StoreList, StockList, StoresWithBag } from "./interface";

function getStoreList(storeList: StoreList[], stockList: StockList[]) {
  const MIN_COUNT = 2;
  const StoresWithBagsList = stockList.filter(e => e.BAG_GREEN_COUNT > MIN_COUNT || e.BAG_PINK_COUNT > MIN_COUNT);
  const arrayLikeStoreList = storeList.reduce<{ [key: string]: string}>((a, b, i) => {
    a[b.store_cd] = b.store_nm;
    return a;
  }, {});

  return StoresWithBagsList.map(e => ({
    storeName: arrayLikeStoreList[e.STORE_CD],
    pinkBagCount: e.BAG_PINK_COUNT,
    greenBagCount: e.BAG_GREEN_COUNT,
  }));
}

function getMessage(storesWithBagList: StoresWithBag[]) {
  return storesWithBagList.reduce((accu, curr) => accu += `"${curr.storeName}" 그린: ${curr.greenBagCount}개, 핑크: ${curr.pinkBagCount}개\n`, "");
}

export { getStoreList, getMessage };
