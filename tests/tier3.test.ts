import {describe,it,expect} from 'vitest';
import baseline from './fixtures/essential100-baseline.json';
import originalQuestions from './fixtures/essential100-questions.json';
import {curriculumEntries,learningModules,moduleQuestions,curriculumSearch} from '../src/curriculum';
import {plants} from '../src/botany';
import {researchMissions} from '../src/research-missions';
import {initialState,validateState} from '../src/model';

describe('Tier 3 compatibility and supplied ordering',()=>{
 it('preserves all original 100 records, ten modules and 110 questions exactly',()=>{
  expect(curriculumEntries.slice(0,100)).toEqual(baseline.plants);
  expect(learningModules.slice(0,10)).toEqual(baseline.modules);
  expect(learningModules.slice(0,10).flatMap(m=>moduleQuestions(m.id))).toEqual(originalQuestions);
 });
 it('adds the exact 50 distinct taxa in the supplied order and consecutive ten-plant modules',()=>{
  expect(plants.slice(100).map(p=>p.latin)).toEqual(['Thalictrum flavum','Chelidonium majus','Eschscholzia californica','Lobelia inflata','Areca catechu','Mitragyna speciosa','Gelsemium sempervirens','Glaucium flavum','Nicotiana tabacum','Piper nigrum','Artemisia absinthium','Acorus calamus','Cinnamomum camphora','Laurus nobilis','Juniperus communis','Copaifera langsdorffii','Dracaena cinnabari','Pistacia lentiscus','Curcuma zedoaria','Dolomiaea costus','Frangula alnus','Frangula purshiana','Arctostaphylos uva-ursi','Filipendula ulmaria','Rheum palmatum','Crocus sativus','Scutellaria baicalensis','Pueraria montana','Reynoutria japonica','Eleutherococcus senticosus','Abrus precatorius','Nerium oleander','Cascabela thevetia','Conium maculatum','Cicuta virosa','Veratrum album','Gloriosa superba','Bryonia dioica','Helleborus niger','Aristolochia clematitis','Terminalia chebula','Phyllanthus emblica','Tinospora cordifolia','Picrorhiza kurrooa','Nardostachys jatamansi','Santalum album','Prunus africana','Warburgia salutaris','Hoodia gordonii','Gynostemma pentaphyllum']);
  expect(new Set(plants.map(p=>p.latin)).size).toBe(150);
  for(let i=10;i<15;i++)expect(learningModules[i].species).toEqual(plants.slice(i*10,i*10+10).map(p=>p.id));
 });
 it('restricts every Module 14 entry and provides explicit new source status',()=>{
  expect(plants.slice(130,140).every(p=>p.recognitionOnly&&p.toxic)).toBe(true);
  for(const p of plants.slice(100)){expect(p.profile).toHaveLength(7);expect(p.sourceScope).toBeTruthy();expect(p.sourceReview).toMatch(/pending/);}
  expect(curriculumSearch('picrosides')[0].latin).toBe('Picrorhiza kurrooa');
 });
});
describe('research missions',()=>{
 it('provides five saved missions with 15 unique answerable decisions and scoped exhibits',()=>{
  expect(researchMissions).toHaveLength(5);const decisions=researchMissions.flatMap(m=>m.challenges);
  expect(decisions).toHaveLength(15);expect(new Set(decisions.map(q=>q.id)).size).toBe(15);
  const practiceIds=new Set(learningModules.flatMap(m=>moduleQuestions(m.id)).map(q=>q.id));
  for(const q of decisions){expect(practiceIds.has(q.id)).toBe(false);expect(new Set(q.options).size).toBe(4);expect(q.options.filter(o=>o===q.answer)).toHaveLength(1);expect(plants.some(p=>p.id===q.plantId)).toBe(true);expect(new URL(q.source).protocol).toBe('https:');if(q.exhibit)expect(q.exhibit.rows.every(row=>row.length===q.exhibit!.headers.length)).toBe(true)}
 });
 it('clearly labels fictional fingerprints and does not treat the signals as identification',()=>{
  const q=researchMissions[1].challenges[0];expect(q.exhibit?.caption).toContain('synthetic');expect(q.answer).toContain('unconfirmed');expect(q.exhibit?.fingerprints).toHaveLength(3);
 });
 it('round trips old/new progress, mission answers, notes and Tier 3 recognition records together',()=>{
  const state=initialState();const q=researchMissions[3].challenges[0];state.learning={seen:['chamomile','ipecac','rosarypea'],answers:{'everyday:chamomile':{answer:'Matricaria chamomilla',correct:true,at:'2026-11-01T00:00:00Z'},[q.id]:{answer:q.answer,correct:true,at:'2026-11-01T00:01:00Z'}}};state.plantNotes.rosarypea='Recognition only';state.specimens.push({id:'tier3',species:'rosarypea',day:1,part:'Virtual recognition only',bed:'Field book',stage:-1,observations:'No material collected',confidence:'Curriculum name matching only',links:[]});expect(validateState(JSON.parse(JSON.stringify(state)))).toEqual(state);expect(state.beds).toHaveLength(8);
 });
});
