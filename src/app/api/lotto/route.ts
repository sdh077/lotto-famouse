import * as cheerio from 'cheerio';
import info from '@public/info.json'
import fs from 'fs';

function saveJsonToFile(filename: string, jsonData: lottoJson) {
  fs.writeFile(`public/${filename}`, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File has been saved');
    }
  });
}
interface RankingData {
  rank: string;
  totalWinners: string;
  prize: string;
}
export interface lottoApi {
  rankingData: RankingData[]
  winningNumbers: string[]
  bonusNumber: string
  drawDate: string
}
interface lottoJson { [x: string]: lottoApi }
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const drwNo = searchParams.get('drwNo') ?? '1141'
  const arr = info as lottoJson
  const keys = Object.keys(arr)
  if (keys.includes(drwNo)) return Response.json(arr[drwNo])
  const data = await fetchLottoData(drwNo);
  arr[drwNo] = data
  saveJsonToFile('info.json', arr)
  return Response.json(data)
}
async function fetchLottoData(drwNo: string): Promise<lottoApi> {
  const data = await
    fetch("https://dhlottery.co.kr/gameResult.do?method=byWin", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      "referrer": "https://dhlottery.co.kr/gameResult.do?method=byWin",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `drwNo=${drwNo}&hdrwComb=1&dwrNoList=${drwNo}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
      .then(res => res.arrayBuffer()) // ArrayBuffer로 데이터를 받아옴
      .then(buffer => {
        // EUC-KR로 인코딩된 데이터를 디코딩
        const decoder = new TextDecoder("euc-kr");
        return decoder.decode(buffer);
      });

  // cheerio를 사용해 HTML 파싱
  const $ = cheerio.load(data);

  // 당첨번호 추출
  const winningNumbers: string[] = [];
  $('.nums .win span.ball_645').each((i, elem) => {
    winningNumbers.push($(elem).text());
  });

  // 보너스 번호 추출
  const bonusNumber: string = $('.bonus span').text();
  const drawDate: string = $('.win_result p.desc').text().replace('(', '').replace(')', '');

  // 순위별 데이터 추출
  const rankingData: RankingData[] = [];
  $('table.tbl_data tbody tr').each((i, row) => {
    const rank = $(row).find('td:nth-child(1)').text().trim(); // 순위
    const totalWinners = $(row).find('td:nth-child(2)').text().trim(); // 당첨자 수
    const prize = $(row).find('td:nth-child(3)').text().trim(); // 당첨금액
    rankingData.push({
      rank,
      totalWinners,
      prize
    });
  });
  return { rankingData, bonusNumber, winningNumbers, drawDate }
}