import {test,expect} from '@playwright/test';
import {moduleQuestions} from '../../src/curriculum';
import fs from 'node:fs/promises';

test('150 plant profiles, filters, seven sections, recognition notes and persisted module practice',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?graphics=Low&motion=off');await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Field book',exact:true}).click();await expect(page.locator('.student-plant-card')).toHaveCount(150);
 await page.screenshot({path:'docs/curriculum-150.png'});
 await page.getByLabel('Learning module filter').selectOption('clinical');await expect(page.locator('.student-plant-card')).toHaveCount(10);
 await page.getByLabel('Search plants').fill('Hypericum');await expect(page.locator('.student-plant-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Open St. John’s wort profile'}).click();await expect(page.locator('.profile-section')).toHaveCount(7);
 await expect(page.getByRole('heading',{name:'Pharmacognosy',exact:true})).toBeVisible();
 await page.getByLabel('Botanical note').fill('Review interactions using the exact product and medicine list.');
 await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'All 150 plants',exact:true}).click();
 await page.getByLabel('Search plants').fill('');await page.getByLabel('Learning module filter').selectOption('all');
 await page.getByLabel('Plant safety filter').selectOption('recognition');
 await page.getByRole('button',{name:'Open Opium poppy profile'}).click();
 await expect(page.getByText('Controlled-material context · recognition only',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Select cultivation bed'})).toHaveCount(0);
 await page.screenshot({path:'docs/controlled-plant-profile.png'});
 await page.getByRole('button',{name:'Record recognition',exact:true}).click();
 await page.getByRole('button',{name:'Herbarium',exact:true}).click();
 await expect(page.locator('.specimen')).toHaveCount(1);await expect(page.locator('.specimen')).toContainText('Recognition record · Curriculum name matching only; not real-world identification');
 await page.getByRole('button',{name:'Field book',exact:true}).click();await page.getByRole('button',{name:'Fifteen learning modules',exact:true}).click();
 await expect(page.locator('.learning-module')).toHaveCount(15);await page.screenshot({path:'docs/learning-modules.png'});
 await page.getByRole('button',{name:'Practice Everyday medicinal plants',exact:true}).click();
 for(const q of moduleQuestions('everyday')){
  await expect(page.getByRole('heading',{name:q.prompt,exact:true})).toBeVisible();
  if(q.id==='everyday:chamomile'){
   const wrong=q.options.find(o=>o!==q.answer)!;await page.getByRole('button',{name:wrong,exact:false}).click();
   await expect(page.getByText('A useful point to revisit.',{exact:true})).toBeVisible();
  }
  await page.locator('.answer-options').getByRole('button',{name:q.answer,exact:false}).click();
  await expect(page.getByText('Correct — keep exploring.',{exact:true})).toBeVisible();
  if(q.id==='everyday:case')await page.screenshot({path:'docs/teaching-case.png'});
  await page.getByRole('button',{name:q.id.endsWith(':case')?'See progress':'Next question →',exact:true}).click();
 }
 await expect(page.locator('.practice-results>strong')).toHaveText('11 / 11');
 await page.getByRole('button',{name:'Settings',exact:true}).click();
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export full backup'}).click();await (await event).saveAs('docs/curriculum-test-backup.json');
 const backup=JSON.parse(await fs.readFile('docs/curriculum-test-backup.json','utf8'));expect(Object.keys(backup.state.learning.answers)).toHaveLength(11);expect(backup.state.specimens[0].species).toBe('opiumpoppy');
 await page.locator('input[type=file][accept="application/json"]').setInputFiles('docs/curriculum-test-backup.json');await page.getByRole('button',{name:'Verify and restore'}).click();
 await expect(page.getByText('Backup verified and restored.',{exact:true})).toBeVisible();
 await page.reload();await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Field book',exact:true}).click();
 await page.getByRole('button',{name:'Fifteen learning modules',exact:true}).click();await expect(page.locator('.learning-module').first()).toContainText('11 / 11 current practice answers correct');
 await page.getByRole('button',{name:'St. John’s wort',exact:true}).click();await expect(page.getByLabel('Botanical note')).toHaveValue('Review interactions using the exact product and medicine list.');
 expect(errors).toEqual([]);
});

test('legacy saves receive a metadata snapshot and preserve the original eight garden bed identities',async({page})=>{
 await page.goto('/?graphics=Low&motion=off');await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();
 await page.evaluate(async()=>{
  const database=await new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('hishams-atlas-5');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
  await new Promise<void>((resolve,reject)=>{const tx=database.transaction('state','readwrite'),store=tx.objectStore('state'),get=store.get('main');get.onsuccess=()=>{const row=get.result;delete row.value.learning;row.value.beds[0].stage=2;row.value.beds[0].moisture=71;row.value.plantNotes.peppermint='Keep this original garden note';store.put(row)};tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)});database.close();
 });
 await page.reload();await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();
 const data=await page.evaluate(async()=>{
  const database=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('hishams-atlas-5');r.onsuccess=()=>resolve(r.result)});
  const read=(table:string,id:string)=>new Promise<any>(resolve=>{const tx=database.transaction(table),r=tx.objectStore(table).get(id);r.onsuccess=()=>resolve(r.result)});
  const current=await read('state','main'),before=await read('snapshots','before-curriculum-5.1');database.close();return {current:current.value,before:before?.value};
 });
 expect(data.current.beds[0].species).toBe('peppermint');expect(data.current.beds[0].stage).toBe(2);expect(data.current.beds[0].moisture).toBe(71);
 expect(data.current.learning).toEqual({seen:[],answers:{}});expect(data.before.learning).toBeUndefined();expect(data.before.plantNotes.peppermint).toBe('Keep this original garden note');
 await page.getByRole('button',{name:'Field book',exact:true}).click();await page.getByRole('button',{name:'Open Peppermint profile',exact:true}).click();await expect(page.getByLabel('Botanical note')).toHaveValue('Keep this original garden note');
 await page.setViewportSize({width:1024,height:768});await page.getByRole('button',{name:'All 150 plants',exact:true}).click();await page.screenshot({path:'docs/curriculum-tablet.png'});
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Fifteen learning modules',exact:true}).click();await page.screenshot({path:'docs/curriculum-mobile.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
