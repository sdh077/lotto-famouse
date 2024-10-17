import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  const url = 'https://dhlottery.co.kr/gameResult.do?method=byWin';
  const { data } = await axios.get(url);

  // cheerio를 사용해 HTML 파싱
  const $ = cheerio.load(data);

  // selected 속성이 있는 option 찾기
  const latestNo = $('#dwrNoList option[selected]').val();
  return Response.json({ latestNo })
}