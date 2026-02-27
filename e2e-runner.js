import puppeteer from 'puppeteer';
import fs from 'fs';

(async ()=>{
  const outDir = './e2e-artifacts';
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const url = 'http://openclaw-gateway:5173';
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.setViewport({width:1280,height:800});
  await page.goto(url,{waitUntil:'networkidle2',timeout:60000});
  await page.screenshot({path:`${outDir}/01-home.png`,fullPage:true});
  // Try clicking Continue or Next buttons if present
  const selectors = ['button:contains("Continue")','button:contains("Next")','button','a'];
  // simple heuristic: click visible buttons with text
  const buttons = await page.$$('button');
  for(let i=0;i<buttons.length && i<10;i++){
    try{
      const txt = await page.evaluate(el=>el.innerText, buttons[i]);
      if(!txt) continue;
      await buttons[i].click();
      await page.waitForTimeout(800);
      await page.screenshot({path:`${outDir}/click-${i}-${txt.replace(/[^a-z0-9]/gi,'_')}.png`,fullPage:true});
    }catch(e){/*ignore*/}
  }
  // Try to navigate a few routes
  await page.waitForTimeout(1000);
  // capture final state
  await page.screenshot({path:`${outDir}/final.png`,fullPage:true});
  await browser.close();
  console.log('Done');
})();
