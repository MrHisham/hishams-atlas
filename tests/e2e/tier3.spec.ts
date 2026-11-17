import {test,expect} from '@playwright/test';
import {researchMissions} from '../../src/research-missions';
import fs from 'node:fs/promises';

test('Tier 3 filtering, safe recognition, research exhibits, saved decisions and backup restore',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?graphics=Low&motion=off');await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Field book',exact:true}).click();await expect(page.locator('.student-plant-card')).toHaveCount(150);
 await page.getByLabel('Plant collection filter').selectOption('tier3');await expect(page.locator('.student-plant-card')).toHaveCount(50);
 await expect(page.locator('.student-plant-card').first()).toContainText('Yellow meadow rue');await expect(page.locator('.student-plant-card').last()).toContainText('Gynostemma');
 await page.getByLabel('Learning module filter').selectOption('advancedtoxicognosy');await expect(page.locator('.student-plant-card')).toHaveCount(10);
 await page.getByRole('button',{name:'Open Rosary pea profile',exact:true}).click();await expect(page.locator('.profile-section')).toHaveCount(7);await expect(page.locator('.warning')).toContainText('HIGHLY TOXIC');await expect(page.getByRole('button',{name:'Select cultivation bed'})).toHaveCount(0);
 await page.getByLabel('Botanical note').fill('Abrin: recognition and poisoning prevention only.');await page.getByRole('button',{name:'Record recognition',exact:true}).click();
 await page.getByRole('button',{name:'All 150 plants',exact:true}).click();await page.getByRole('button',{name:'Research missions',exact:true}).click();
 for(const mission of researchMissions){
  await page.getByLabel('Research mission',{exact:true}).selectOption(mission.moduleId);
  for(let i=0;i<mission.challenges.length;i++){
   const q=mission.challenges[i];await expect(page.getByRole('heading',{name:q.prompt,exact:true})).toBeVisible();
   if(q.exhibit){await expect(page.locator('.mission-evidence')).toBeVisible();await expect(page.locator('.mission-table tbody tr')).toHaveCount(q.exhibit.rows.length)}
   if(mission.moduleId==='terpenoidresins'&&i===0){await expect(page.getByRole('img',{name:'Synthetic signal comparison, arbitrary teaching units'})).toBeVisible();await page.screenshot({path:'docs/tier3-fingerprint.png'})}
   if(mission.moduleId==='advancedtoxicognosy'&&i===0){const wrong=q.options.find(o=>o!==q.answer)!;await page.locator('.answer-options').getByRole('button',{name:wrong,exact:false}).click();await expect(page.getByText('Review the evidence boundary.',{exact:true})).toBeVisible()}
   await page.locator('.answer-options').getByRole('button',{name:q.answer,exact:false}).click();await expect(page.getByText('Decision supported.',{exact:true})).toBeVisible();
   if(i<2)await page.getByRole('button',{name:'Next decision →',exact:true}).click();
  }
  await expect(page.getByText('3 / 3 mission decisions correct',{exact:false})).toBeVisible();
 }
 await page.getByRole('button',{name:'Settings',exact:true}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export full backup'}).click();await(await download).saveAs('docs/tier3-test-backup.json');
 const backup=JSON.parse(await fs.readFile('docs/tier3-test-backup.json','utf8'));expect(Object.keys(backup.state.learning.answers)).toHaveLength(15);expect(backup.state.specimens[0].species).toBe('rosarypea');expect(backup.state.beds).toHaveLength(8);
 await page.locator('input[type=file][accept="application/json"]').setInputFiles('docs/tier3-test-backup.json');await page.getByRole('button',{name:'Verify and restore'}).click();await expect(page.getByText('Backup verified and restored.',{exact:true})).toBeVisible();await page.reload();
 await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Field book',exact:true}).click();await page.getByRole('button',{name:'Research missions',exact:true}).click();
 await page.getByLabel('Research mission',{exact:true}).selectOption('advancedtoxicognosy');await expect(page.getByText('3 / 3 mission decisions correct',{exact:false})).toBeVisible();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/tier3-mobile.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Review plant profile',exact:true}).click();await expect(page.getByLabel('Botanical note')).toHaveValue('Abrin: recognition and poisoning prevention only.');expect(errors).toEqual([]);
});
