import baseline from './fixtures/essential50-baseline.json';
import oldQuestions from './fixtures/essential50-questions.json';
import {describe,it,expect} from 'vitest';
import {curriculumEntries,learningModules,moduleQuestions,curriculumSearch} from '../src/curriculum';
import {plants,plantById} from '../src/botany';
import {initialState,validateState} from '../src/model';
describe('150-plant curriculum integrity',()=>{
 it('preserves exactly 150 unique priorities in the supplied order',()=>{
  expect(curriculumEntries).toHaveLength(150);expect(new Set(plants.map(p=>p.id)).size).toBe(150);
  expect(plants.map(p=>p.priority)).toEqual(Array.from({length:150},(_,i)=>i+1));
  expect(plants[0].latin).toBe('Matricaria chamomilla');expect(plants[49].latin).toBe('Colchicum autumnale');
  expect(plants.find(p=>p.id==='opiumpoppy')?.latin).toBe('Papaver somniferum');
 });
 it('partitions the catalogue into fifteen modules of ten with no omissions or duplicate membership',()=>{
  expect(learningModules).toHaveLength(15);for(const m of learningModules)expect(m.species).toHaveLength(10);
  const ids=learningModules.flatMap(m=>m.species);expect(new Set(ids).size).toBe(150);expect(ids.slice().sort()).toEqual(plants.map(p=>p.id).sort());
 });
 it('provides seven explicitly scoped profile sections and references for every plant',()=>{
  for(const p of plants){expect(p.profile.map(s=>s.id)).toEqual(['botany','pharmacognosy','phytochemistry','pharmacology','clinical','toxicology','pharmacy']);
   expect(p.profile.every(s=>s.summary&&s.task&&s.review&&new URL(s.source).protocol==='https:')).toBe(true);
   expect(p.accessed).toBe('2026-11-01');expect(p.profile[1].summary).toContain('No validated microscopic');}
 });
 it('supports search by name, chemistry and module without treating safety modules as efficacy rankings',()=>{
  expect(curriculumSearch('Hypericum')).toHaveLength(1);expect(curriculumSearch('glycyrrhizin')[0].id).toBe('licorice');
  expect(curriculumSearch('','clinical')).toHaveLength(10);expect(curriculumSearch('','','recognition').every(p=>p.hazard==='toxic'||p.hazard==='controlled'||p.recognitionOnly)).toBe(true);
  expect(curriculumSearch('ginger','safety')).toHaveLength(0);
 });
 it('keeps toxic and controlled records explicitly restricted to recognition education',()=>{
  for(const id of ['foxglove','belladonna','opiumpoppy','cinchona','periwinkle','yew','ephedra','castorbean','rauwolfia','autumncrocus']){
   const p=plantById(id);expect(p.toxic).toBe(true);expect(p.profile[6].summary).toContain('Recognition');}
  expect(plantById('opiumpoppy').hazard).toBe('controlled');
 });
});
describe('saved curriculum progress and legacy compatibility',()=>{
 it('adds empty learning progress to old state without changing beds, specimens or notes',()=>{
  const old=initialState();old.beds[0].stage=3;old.plantNotes.foxglove='Saved observation';old.tasks.push({id:'keep-task',text:'Keep this task',done:false});
  const raw=JSON.parse(JSON.stringify(old));delete raw.learning;const migrated=validateState(raw);
  expect(migrated.learning).toEqual({seen:[],answers:{}});expect(migrated.beds).toEqual(old.beds);expect(migrated.plantNotes).toEqual(old.plantNotes);expect(migrated.tasks).toEqual(old.tasks);
 });
 it('keeps the eight garden IDs independent from the 50-entry catalogue order',()=>{
  expect(initialState().beds.map(b=>b.species)).toEqual(['peppermint','chamomile','lavender','rosemary','milkthistle','turmeric','willow','foxglove']);
 });
 it('round trips a new recognition record, note and quiz answer through backup validation',()=>{
  const s=initialState();s.learning={seen:['opiumpoppy'],answers:{'naturalproducts:opiumpoppy':{answer:'Opioid alkaloids, regulated medicines',correct:true,at:'2026-11-01T00:00:00Z'}}};
  s.plantNotes.opiumpoppy='Recognition and history only.';s.specimens.push({id:'recognition-1',species:'opiumpoppy',day:1,part:'Observation only',bed:'Field book',stage:-1,observations:'No material collected',confidence:'Curriculum name matching',links:[]});
  expect(validateState(JSON.parse(JSON.stringify(s)))).toEqual(s);
 });
});
describe('practice questions',()=>{
 it('creates 165 distinct, answerable questions with unique options and one teaching case per module',()=>{
  const all=learningModules.flatMap(m=>moduleQuestions(m.id));expect(all).toHaveLength(165);expect(new Set(all.map(q=>q.id)).size).toBe(165);
  for(const q of all){expect(q.options).toHaveLength(4);expect(new Set(q.options).size).toBe(4);expect(q.options.filter(o=>o===q.answer)).toHaveLength(1);expect(q.explanation).toBeTruthy()}
  for(const m of learningModules)expect(moduleQuestions(m.id).at(-1)?.id).toBe(m.id+':case');
 });
 it('uses stable question IDs and does not put the correct option in a fixed position',()=>{
  expect(moduleQuestions('everyday')).toEqual(moduleQuestions('everyday'));
  const indices=moduleQuestions('everyday').map(q=>q.options.indexOf(q.answer));expect(new Set(indices).size).toBeGreaterThan(1);
 });
});

describe('additive Essential 100 expansion',()=>{
 it('preserves every original record, module, question ID, option and answer exactly',()=>{
  expect(curriculumEntries.slice(0,50)).toEqual(baseline.plants);
  expect(learningModules.slice(0,5)).toEqual(baseline.modules);
  expect(learningModules.slice(0,5).flatMap(m=>moduleQuestions(m.id))).toEqual(oldQuestions);
 });
 it('keeps supplied priorities 51–100 in five consecutive modules and marks all Module 10 as recognition only',()=>{
  expect(plants[50].latin).toBe('Melissa officinalis');expect(plants[99].latin).toBe('Carapichea ipecacuanha');
  for(let i=5;i<10;i++)expect(learningModules[i].species).toEqual(plants.slice(i*10,i*10+10).map(p=>p.id));
  expect(plants.slice(90,100).every(p=>p.recognitionOnly&&p.profile[6].summary.includes('Recognition'))).toBe(true);
  expect(plantById('sweetwormwood').hazard).toBe('caution');
 });
 it('round trips old progress alongside new plant notes, answers and recognition records',()=>{
  const s=initialState();s.learning={seen:['chamomile','ipecac'],answers:{'everyday:chamomile':{answer:'Matricaria chamomilla',correct:true,at:'2026-11-01T00:00:00Z'},'toxicognosy:case':{answer:moduleQuestions('toxicognosy').at(-1)!.answer,correct:true,at:'2026-11-01T00:01:00Z'}}};
  s.plantNotes.ipecac='Historical use; no administration.';s.specimens.push({id:'new-100',species:'ipecac',day:1,part:'Recognition only',bed:'Field book',stage:-1,observations:'No material collected',confidence:'Curriculum matching',links:[]});
  expect(validateState(JSON.parse(JSON.stringify(s)))).toEqual(s);
 });
});
