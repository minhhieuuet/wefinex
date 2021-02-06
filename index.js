const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 10});
  const page = await browser.newPage();
  await page.setViewport({width:0, height:0});
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
  await page.goto('https://wefinex.net/login');
  await page.type('input[name="email"]', 'dung891995@gmail.com')
  await page.type('input[name="password"]', 'baothoa2104')
  await page.click('.siginButton');
  page.setDefaultNavigationTimeout(0);
  page.on('console', (consoleObj) => {
    if(consoleObj.text().includes(':') || consoleObj.text().includes('==') ) {
      if(consoleObj.text().includes('Date: ')) {
        let dateByMil = Number(consoleObj.text().replace('Date: ', ''));
        let dateTime = moment(dateByMil).utcOffset('+7').format('DD-MM-YYYY HH:mm:ss');
        console.log(dateTime);
        fs.appendFileSync('result.txt', `${dateTime} \n`);
        return;
      }
      console.log(consoleObj.text());
      fs.appendFileSync('result.txt', `${consoleObj.text()} \n`);
    }
  });
  await page.waitForNavigation();
  await page.evaluate(() => {
    setInterval(() => {
      let time = document.querySelector('#betAmount > div.bet-wrapper > div > div:nth-child(2) > a > p.font-18.mb-0.font-weight-700').textContent;
      let isDisabled = document.querySelector('#betAmount > div.bet-wrapper > div > div:nth-child(2) > a > p.font-14.mb-0').textContent === 'Chờ Kết quả';
      if(time == '2s' && !isDisabled) {
          let [leftPercent, rightPercent] = [...document.querySelectorAll('#betAmount > div.amount-wrapper > div.slider.mb-4 > div > div.d-flex.justify-content-between span')].map(el => {
              return el.textContent;   
          });
          console.log(`Date: ${new Date().valueOf()}`)
          console.log(`Left: ${leftPercent}`);
          console.log(`Right: ${rightPercent}`);
      }
      if(time == '2s' && isDisabled) {
          let [leftPercent, rightPercent] = [...document.querySelectorAll('#betAmount > div.amount-wrapper > div.slider.mb-4 > div > div.d-flex.justify-content-between span')].map(el => {
              return el.textContent;   
          });
          console.log(`Final Left: ${leftPercent}`);
          console.log(`Final Right: ${rightPercent}`);
          setTimeout(() => {
              
              let finalColor = document.querySelector('.highcharts-tracker > path:nth-last-child(2)').getAttribute('stroke');
              if(finalColor == '#31BAA0') {
                  console.log("Result: UP");
              } else {
                  console.log("Result: DOWN");
              }
              console.log("===============================")
          }, 3500);
      }
      }, 1000)
  })
//   await browser.close();
})();