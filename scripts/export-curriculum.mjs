import {build} from 'esbuild';
import {writeFile} from 'node:fs/promises';
const result=await build({entryPoints:['src/curriculum-data.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {curriculumEntries,learningModules}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
await writeFile('public/pharmacy-curriculum.json',JSON.stringify({version:'5.3',date:'2026-11-01',scope:'User-selected educational priorities, not an efficacy ranking or accreditation list. Introductory profiles; provisional taxonomy, chemistry and detailed mechanisms require specialist review. All Module 10 and Module 14 entries are recognition education only. Source-review status is explicit per entry.',plants:curriculumEntries,modules:learningModules},null,2)+'\n');
console.log(`Exported ${curriculumEntries.length} plants and ${learningModules.length} modules.`);
