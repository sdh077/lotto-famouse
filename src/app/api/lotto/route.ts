import * as cheerio from 'cheerio';
import info from '@public/info.json'
import file from '@public/file.json'
import fs from 'fs';
interface FileItem {
  name: string;
  location: string;
  items: number[];
}

interface File {
  [locationId: string]: FileItem;
}

// info 객체가 JSON으로부터 불러오지만, 해당 JSON에 타입을 지정

export async function POST(request: Request) {
  const fileTyped = file as File; // 타입 단언을 사용해 info에 타입을 지정
  const res = await request.json()
  const drwNo = res.drwNo;
  const hdrwComb = drwNo <= 600 ? 2 : 1
  await fetch("https://dhlottery.co.kr/store.do?method=topStore&pageGubun=L645", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrer": "https://dhlottery.co.kr/store.do?method=topStore&pageGubun=L645",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `method=topStore&nowPage=1&rankNo=&gameNo=5133&hdrwComb=${hdrwComb}&drwNo=${drwNo}&schKey=all&schVal=`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
    .then(res => res.arrayBuffer()) // ArrayBuffer로 데이터를 받아옴
    .then(buffer => {
      // EUC-KR로 인코딩된 데이터를 디코딩
      const decoder = new TextDecoder("euc-kr");
      return decoder.decode(buffer);
    })
    .then(html => {
      // 2. Cheerio로 HTML 파싱
      const $ = cheerio.load(html);

      // 3. 테이블 선택 (첫 번째 group_content 내 테이블)
      const firstGroupContent = $('.group_content').first(); // 첫 번째 group_content만 선택
      const rows = firstGroupContent.find('table tbody tr');

      rows.each((i, row) => {
        const columns = $(row).find('td');

        // 위치보기에서 onclick 속성의 숫자만 추출
        const onclickAttr = $(columns[4]).find('a').attr('onclick');
        const locationId = onclickAttr?.match(/\d+/)?.[0] ?? ''; // 정규식을 이용해 숫자만 추출
        if (!locationId) return
        if (!fileTyped[locationId])
          fileTyped[locationId] = {
            name: $(columns[1]).text().trim(),
            location: $(columns[3]).text().trim(),
            items: []
          }
        fileTyped[locationId].items.push(Number(drwNo))
      });

      // 5. JSON 출력
    })
    .catch(error => console.error("Fetch 오류:", error));
  saveJsonToFile('file.json', fileTyped);
  return Response.json({ ok: 'ok' })
}
function saveJsonToFile<T>(filename: string, jsonData: T) {
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