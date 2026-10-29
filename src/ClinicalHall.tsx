import { useState } from 'react';
import type { ClinicalAttempt } from './model';

type Question = { prompt: string; options: string[]; answer: number; explanation: string };
type Case = { id: string; title: string; topic: string; scenario: string; questions: Question[]; takeaway: string };
export const cases: Case[] = [
 {id:'allergy', title:'The allergy alert', topic:'Medication safety', scenario:'A fictional adult patient presents a prescription for amoxicillin. Their recorded history describes immediate wheezing and facial swelling after penicillin.', questions:[
  {prompt:'What is the safest first step?', options:['Dispense because the reaction was in the past','Hold dispensing and clarify the allergy and prescription with the prescriber','Advise the patient to try a smaller dose'],answer:1,explanation:'An immediate-type reaction with respiratory or facial symptoms requires serious attention. Clarify with the prescriber and follow local allergy protocols before dispensing.'},
  {prompt:'What should be documented?',options:['The allergy history, reaction, action taken and communication','Only the drug name','Nothing unless a replacement is prescribed'],answer:0,explanation:'Clear documentation of the reaction and resulting actions supports safe continuity of care.'}
 ],takeaway:'A reported serious drug allergy is a safety signal, not a detail to bypass.'},
 {id:'renal', title:'Kidney function review', topic:'Clinical assessment', scenario:'A fictional older adult with reduced kidney function has a new medication order. The medicine may require renal dose assessment, but a current kidney function estimate is not available.',questions:[
  {prompt:'Which action should precede a dose recommendation?', options:['Assume standard renal function','Review current renal function, indication and patient-specific factors','Automatically halve every dose'],answer:1,explanation:'Renal dose assessment depends on the specific medicine, indication, appropriate renal estimate and patient context.'},
  {prompt:'What is the best approach when essential information is missing?',options:['Guess a safe regimen','Ignore the uncertainty','Seek the necessary clinical information and refer to current dosing guidance'],answer:2,explanation:'Responsible clinical decisions require appropriate patient data and drug-specific references.'}
 ],takeaway:'There is no universal dose adjustment for kidney impairment.'},
 {id:'inhaler', title:'The inhaler consultation', topic:'Patient counseling',scenario:'A fictional patient says their inhaler does not seem to work. They are unsure how to use the device and have not had their technique observed.',questions:[
  {prompt:'What should the pharmacist do first?',options:['Ask for a demonstration and assess technique and adherence','Assume the medication is ineffective','Recommend using extra doses without assessment'],answer:0,explanation:'Observed technique and a nonjudgmental adherence review often uncover remediable problems. Assess symptoms and urgent warning signs as appropriate.'},
  {prompt:'Which follow-up is most appropriate?',options:['End counseling after giving a leaflet','Use teach-back, confirm device-specific steps and arrange appropriate follow-up','Promise that proper technique cures the condition'],answer:1,explanation:'Teach-back helps check understanding, while follow-up evaluates whether care goals are being met.'}
 ],takeaway:'The way a medicine is used can be as important as the choice of medicine.'},
 {id:'interaction', title:'The interaction checkpoint', topic:'Medication reconciliation',scenario:'A fictional patient starts a new prescribed medicine and mentions an over-the-counter product and herbal supplement that are absent from their medication list.',questions:[
  {prompt:'What is the best initial action?',options:['Assume nonprescription products never interact','Perform medication reconciliation including OTC and herbal products, then assess interactions','Tell the patient to stop all prescriptions immediately'],answer:1,explanation:'A complete medication history includes prescribed, OTC and herbal agents. Interaction severity must be checked using credible references.'},
  {prompt:'If a potentially serious interaction is identified, what next?',options:['Explain the concern and coordinate with the prescriber using current evidence','Ignore it if the patient feels well','Invent a substitute regimen'],answer:0,explanation:'Clinical communication should be specific, documented and guided by evidence and local policy.'}
 ],takeaway:'Medication reconciliation begins with asking what the patient actually takes.'}
];
export function ClinicalHall({attempts,onComplete}:{attempts:ClinicalAttempt[];onComplete:(a:ClinicalAttempt)=>void}) {
 const [caseId,setCaseId]=useState(cases[0].id);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const c=cases.find(x=>x.id===caseId)!;
 const complete=c.questions.every((_,i)=>answers[i]!==undefined);
 const count=c.questions.filter((q,i)=>answers[i]===q.answer).length;
 function chooseCase(id:string){setCaseId(id);setAnswers({});setSubmitted(false);}
 function submit(){if(!complete||submitted)return;onComplete({id:crypto.randomUUID(),caseId:c.id,selected:c.questions.map((_,i)=>answers[i]),correct:count,total:c.questions.length,completedAt:new Date().toISOString()});setSubmitted(true);}
 return <div className="clinical-hall">
 <div className="clinical-hero"><small>ATLAS VI / CLINICAL HALL</small><h3>Practice the judgment behind the science.</h3><p>Fictional patient cases for reflective practice. These exercises are not treatment protocols, clinical certification, or patient-specific medical advice.</p><div className="clinical-stats">{attempts.length} completed attempts · {new Set(attempts.map(a=>a.caseId)).size} / {cases.length} cases explored</div></div>
 <div className="clinical-layout"><div className="clinical-case-list" aria-label="Choose a case">{cases.map(item=><button key={item.id} className={caseId===item.id?'selected':''} onClick={()=>chooseCase(item.id)}><small>{item.topic}</small><strong>{item.title}</strong><span>{attempts.some(a=>a.caseId===item.id)?'✓ Practiced':'Begin case'}</span></button>)}</div>
 <section className="clinical-detail"><small>{c.topic.toUpperCase()} / SIMULATION</small><h3>{c.title}</h3><p className="clinical-scenario">{c.scenario}</p>{c.questions.map((q,i)=><fieldset key={i} className="clinical-question"><legend>{i+1}. {q.prompt}</legend>{q.options.map((option,j)=><label key={j} className={submitted?(j===q.answer?'clinical-right':answers[i]===j?'clinical-wrong':''):''}><input type="radio" name={`${c.id}-${i}`} checked={answers[i]===j} disabled={submitted} onChange={()=>setAnswers(v=>({...v,[i]:j}))}/>{option}</label>)}{submitted&&<p className="clinical-explanation"><strong>{answers[i]===q.answer?'Correct.':'Review this choice.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button className="primary" disabled={!complete} onClick={submit}>Submit clinical reasoning</button>:<div className="clinical-result" role="status"><h3>{count} / {c.questions.length} correct</h3><p>{c.takeaway}</p><p>Your attempt is saved in your Atlas backup. This score is educational only and does not demonstrate clinical competency.</p><button onClick={()=>{setAnswers({});setSubmitted(false);}}>Practice again</button></div>}</section></div>
 <p className="muted">Designed for learning and reflection. Always consult current references, institution guidance, and qualified colleagues for actual patient decisions. All patients and events here are fictional.</p>
 </div>;
}
