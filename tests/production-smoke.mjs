import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const server=spawn(process.execPath,['serve.mjs'],{cwd:root,env:{...process.env,PORT:'4176'},windowsHide:true,stdio:['ignore','pipe','pipe']});
let browser;
try {
  await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Server stopped: '+code)));server.stdout.once('data',resolve)});
  const response=await fetch('http://127.0.0.1:4176/');
  if(!response.ok)throw Error('Production server returned '+response.status);
  browser=await chromium.launch({headless:true,executablePath:process.env.ATLAS_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4176/?graphics=Low&motion=off');
  await page.getByText('Saved on this device',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Library',exact:true}).click();
  await page.locator('input[type=file][accept*=".pdf"]').first().setInputFiles(path.join(root,'docs/Atlas-reading-sample.pdf'));
  await page.getByLabel('Search catalogue').fill('Atlas-reading-sample');
  await page.locator('.book-open').click();
  await page.locator('.pdf-page canvas').waitFor();
  await page.getByLabel('Reader note').fill('Production build smoke check.');
  await page.getByRole('button',{name:'Save annotation'}).click();
  await page.getByText('Production build smoke check.',{exact:true}).waitFor();
  await page.screenshot({path:path.join(root,'docs/production-reader.png')});
  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS: static production server, app startup, lazy PDF chunk/worker, local import, rendered page and saved annotation; no browser errors.');
} finally {
  await browser?.close();
  server.kill();
}
