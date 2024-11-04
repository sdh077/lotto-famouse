import BestShop from "@/page/BestShop";
import LatestLotto from "@/page/LatestLotto";
import LocationInfo from "@/page/LocationInfo";
import axios from 'axios';
import * as cheerio from 'cheerio';

export const revalidate = 3600 // revalidate at most every hour

const getData = async () => {
  const url = 'https://dhlottery.co.kr/gameResult.do?method=byWin';
  const { data } = await axios.get(url);

  // cheerio를 사용해 HTML 파싱
  const $ = cheerio.load(data);

  // selected 속성이 있는 option 찾기
  const latestNo = $('#dwrNoList option[selected]').val();
  return Number(latestNo)
}

export default async function Home() {
  const latestNo = await getData()
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 container pt-8 h-full">
      <div className='flex flex-col gap-4'>
        <LatestLotto latestNo={latestNo} />
        <LocationInfo />
      </div>
      <BestShop />
    </div>
  );
}