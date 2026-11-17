import {useEffect,useState} from 'react';
import {researchMissions,type EvidenceExhibit} from './research-missions';
import type {State} from './model';

export function EvidenceDisplay({exhibit}:{exhibit:EvidenceExhibit}){
 return <figure className="mission-evidence"><figcaption>{exhibit.caption}</figcaption>
  {exhibit.fingerprints&&<svg viewBox="0 0 640 260" role="img" aria-label="Synthetic signal comparison, arbitrary teaching units"><title>Fictional fingerprints; no measured botanical data</title>{exhibit.fingerprints.map((signal,row)=><g key={signal.label} transform={`translate(0,${row*76})`}><text x="8" y="18">{signal.label}</text><path d="M190 58H620"/><text x="580" y="73">Signal index</text>{signal.peaks.map((peak,i)=><g key={i}><path className={'signal-line signal-'+row} d={`M${230+i*110} 58V${58-peak*.52}`}/><text x={225+i*110} y="73">{i+1}</text></g>)}</g>)}</svg>}
  <div className="mission-table"><table><thead><tr>{exhibit.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{exhibit.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
 </figure>;
}
export function ResearchMissions({state,change,selectPlant,initialModule}:{state:State;change:(fn:(s:State)=>State)=>void;selectPlant:(id:string)=>void;initialModule:string}){
 const [moduleId,setModuleId]=useState(researchMissions.some(m=>m.moduleId===initialModule)?initialModule:researchMissions[0].moduleId),[index,setIndex]=useState(0);
 const mission=researchMissions.find(m=>m.moduleId===moduleId)!,question=mission.challenges[index],saved=state.learning.answers[question.id];
 const score=mission.challenges.filter(q=>state.learning.answers[q.id]?.correct).length;
 useEffect(()=>{document.querySelector('.workspace-content')?.scrollTo({top:0})},[moduleId,index]);
 return <section className="research-missions"><label>Research mission<select aria-label="Research mission" value={moduleId} onChange={e=>{setModuleId(e.target.value);setIndex(0)}}>{researchMissions.map(m=><option key={m.moduleId} value={m.moduleId}>{m.title}</option>)}</select></label>
 <h3>{mission.title}</h3><p>{mission.brief}</p><p className="muted">{score} / {mission.challenges.length} mission decisions correct · Saved on this device and included in backups. Separate from the 165 module practice questions.</p>
 <article className="practice-card"><small>RESEARCH MISSION / DECISION {index+1} OF {mission.challenges.length}</small>
 {question.exhibit&&<EvidenceDisplay exhibit={question.exhibit}/>}<h3>{question.prompt}</h3>
 <div className="answer-options">{question.options.map((option,i)=><button key={option} aria-pressed={saved?.answer===option} className={saved?.answer===option?'selected-answer':''} onClick={()=>change(s=>({...s,learning:{...s.learning,answers:{...s.learning.answers,[question.id]:{answer:option,correct:option===question.answer,at:new Date().toISOString()}}}}))}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
 {saved&&<div className={`answer-feedback ${saved.correct?'correct':'review'}`} role="status"><strong>{saved.correct?'Decision supported.':'Review the evidence boundary.'}</strong><p>{question.explanation}</p>{!saved.correct&&<p>Expected answer: {question.answer}</p>}<a href={question.source} target="_blank" rel="noreferrer">Reference and scope ↗</a><button className="text-button" onClick={()=>selectPlant(question.plantId)}>Review plant profile</button></div>}
 <div className="practice-navigation"><button disabled={index===0} onClick={()=>setIndex(i=>i-1)}>← Previous decision</button><span>{score} / 3 correct</span>{index<2?<button className="primary" disabled={!saved} onClick={()=>setIndex(i=>i+1)}>Next decision →</button>:<button onClick={()=>setIndex(0)}>Review mission</button>}</div>
 </article><p className="notice">Synthetic educational decisions, not validated analytical methods, diagnostic plant identification, clinical competency certification or legal advice. No practical handling or extraction of toxic plants is included.</p></section>;
}
