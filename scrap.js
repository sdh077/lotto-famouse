const cheerio = require('cheerio');
const fs = require('fs');
const lottery = {

}
async function scrap() {
  for (let drwNo = 1; drwNo <= 1134; drwNo++) {
    const hdrwComb = drwNo <= 600 ? 2 : 1
    const data = await fetch("https://dhlottery.co.kr/store.do?method=topStore&pageGubun=L645", {
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

        // 4. 테이블 데이터를 JSON 형식으로 변환
        const tableData = [];

        rows.each((i, row) => {
          const columns = $(row).find('td');

          // 위치보기에서 onclick 속성의 숫자만 추출
          const onclickAttr = $(columns[4]).find('a').attr('onclick');
          const locationId = onclickAttr ? onclickAttr.match(/\d+/)[0] : ''; // 정규식을 이용해 숫자만 추출

          if (!lottery[locationId]) lottery[locationId] = {
            name: $(columns[1]).text().trim(),
            location: $(columns[3]).text().trim(),
            items: []
          }
          lottery[locationId].items.push(drwNo)
        });

        // 5. JSON 출력
      })
      .catch(error => console.error("Fetch 오류:", error));
  }
  saveJsonToFile('file.json', lottery);
}
scrap()

function saveJsonToFile(filename, jsonData) {
  fs.writeFile(filename, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File has been saved');
    }
  });
}
