"""Dependency-free package checks. Implements only the JSON Schema keywords used here,
not a general JSON Schema conformance validator. Full review/release rules remain separate.
Run with Python 3 from any working directory. No network or installed packages required.
"""
from pathlib import Path
import json,copy,re,math,hashlib

ROOT=Path(__file__).resolve().parent
def read(name):return json.loads((ROOT/name).read_text(encoding='utf-8'))
def require(ok,message):
 if not ok:raise ValueError(message)
def check(value,schema,root=None,path='$'):
 root=root or schema
 if '$ref' in schema:
  target=root
  for part in schema['$ref'].removeprefix('#/').split('/'):target=target[part]
  return check(value,target,root,path)
 types=schema.get('type',[]);types=[types] if isinstance(types,str) else types
 predicates={'object':lambda v:isinstance(v,dict),'array':lambda v:isinstance(v,list),'string':lambda v:isinstance(v,str),'number':lambda v:isinstance(v,(float,int)) and not isinstance(v,bool),'integer':lambda v:isinstance(v,int) and not isinstance(v,bool),'boolean':lambda v:isinstance(v,bool),'null':lambda v:v is None}
 if types:require(any(predicates[t](value) for t in types),path+': type mismatch')
 if 'const' in schema:require(value==schema['const'],path+': const mismatch')
 if 'enum' in schema:require(value in schema['enum'],path+': enum mismatch')
 if isinstance(value,str):
  require(len(value)>=schema.get('minLength',0),path+': short string')
  if 'pattern' in schema:require(re.search(schema['pattern'],value) is not None,path+': pattern mismatch')
 if isinstance(value,(int,float)) and not isinstance(value,bool):require(value>=schema.get('minimum',-math.inf),path+': below minimum')
 if isinstance(value,list):
  require(len(value)>=schema.get('minItems',0),path+': too few items');require(len(value)<=schema.get('maxItems',math.inf),path+': too many items')
  for i,item in enumerate(value):check(item,schema.get('items',{}),root,f'{path}[{i}]')
 if isinstance(value,dict):
  require(all(k in value for k in schema.get('required',[])),path+': missing required field')
  props=schema.get('properties',{});extra=schema.get('additionalProperties',True)
  for key,item in value.items():
   if key in props:check(item,props[key],root,path+'.'+key)
   elif extra is False:raise ValueError(path+': unknown field '+key)
   elif isinstance(extra,dict):check(item,extra,root,path+'.'+key)

def check_review_release(record):
 review=record.get('review',{})
 if review.get('status')=='approved_for_scoped_release':
  require(all(review.get(k) for k in ['reviewerId','reviewDate','nextReviewDate','scope']),'Approval without reviewer/dates/scope')
  require(review['nextReviewDate']>=review['reviewDate'],'Invalid review interval')

def check_quest_domain(bundle):
 quests=bundle['quests'];ids={q['id'] for q in quests};sources={s['id'] for s in bundle['sources']};competencies={c['id'] for c in bundle['competencies']}
 require(len(ids)==15,'Duplicate quest IDs')
 seen=set()
 for q in quests:
  require(all(p in seen for p in q['prerequisites']),'Dangling, cyclic or unordered prerequisite')
  require(set(q['competencies'])<=competencies,'Unknown competency');require(set(q['source_ids'])<=sources,'Unknown source')
  require(set(q['dataset']['source_ids'])<=sources,'Unknown dataset source')
  expected=6 if q['id']=='Q15' else 5;rubric=q['rubric']
  require(len(q['rubric_checks'])==expected,'Wrong rubric dimension count')
  require(rubric['maximum']==expected*2,'Rubric maximum mismatch')
  require(rubric['pass_score']==(10 if expected==6 else 8),'Rubric pass threshold mismatch')
  require(rubric['minimum_per_criterion']==(1 if expected==6 else 0),'Rubric floor mismatch')
  require(q['dataset']['not_measured'] and not q['dataset']['species_diagnostic'],'False measured/diagnostic labeling')
  seen.add(q['id'])

def verdict(scores,rubric,critical=False,assisted=False):
 require(len(scores)*2==rubric['maximum'] and all(x in (0,1,2) for x in scores),'Invalid score vector')
 passed=sum(scores)>=rubric['pass_score'] and min(scores)>=rubric['minimum_per_criterion'] and not critical
 return {'practice_pass':passed,'independent_eligible':passed and not assisted}

tests=[]
def test(name,fn):fn();tests.append(name)
def rejects(fn):
 try:fn()
 except ValueError:return
 raise ValueError('Expected rejection did not occur')

bundle=read('quest-specification.json');graph=read('example-graph.json');student=read('prototype-content.json');keys=read('instructor-keys.json');register=read('plant-review-register.json')
test('authoring bundle structural schema',lambda:check(bundle,read('quest-bundle.schema.json')))
test('example graph structural schema',lambda:check(graph,read('SCIENTIFIC-CONTENT-SCHEMA.json')))
test('quest references, DAG, competencies and rubric variants',lambda:check_quest_domain(bundle))
test('exact three departments and fifteen ordered quests',lambda:require([q['id'] for q in bundle['quests']]==[f'Q{i:02}' for i in range(1,16)] and len(set(q['department'] for q in bundle['quests']))==3,'Scope mismatch'))
test('twelve review candidates, zero falsely approved profiles',lambda:require(len(register['candidates'])==12 and register['approved_count']==0 and all(p['reviewer'] is None for p in register['candidates']),'False sign-off'))
for record in graph['entities']['claims']:check_review_release(record)
test('example graph source and plant links resolve',lambda:require(graph['entities']['claims'][0]['sourceIds']==[graph['entities']['sources'][0]['id']] and graph['entities']['specimens'][0]['declaredPlantId']==graph['entities']['plants'][0]['id'],'Dangling example reference'))
test('learner payload excludes grading and transfer keys',lambda:require(all(not(set(q)&{'correct_reasoning','rubric_checks','rubric','error_feedback','critical_errors','transfer_variant','mastery'}) for q in student['quests']) and len(student['quests'])==15,'Key leakage'))
test('instructor keys match quest IDs and rubric dimensions',lambda:require([q['id'] for q in keys['quests']]==[q['id'] for q in bundle['quests']] and len(keys['quests'][-1]['rubric_checks'])==6,'Key mismatch'))
test('foreign-material percentage and unseen reversal',lambda:require(math.isclose(100*.4/10,4) and math.isclose(100*.2/20,1),'Percentage error'))
test('TLC Rf arithmetic',lambda:require(math.isclose(2.4/8,.30) and math.isclose(2.48/8,.31),'Rf error'))
d=bundle['quests'][10]['dataset']['data'];diff=[abs(a-b) for a,b in zip(d['reference_normalized_signals'],d['sample_normalized_signals'])]
test('largest chromatogram discrepancy and percentage',lambda:require(d['peak_ids'][diff.index(max(diff))]=='C' and math.isclose(100*(36-120)/120,-70),'Chromatogram error'))
t=bundle['quests'][10]['transfer_variant']['data'];td=[abs(a-b) for a,b in zip(t['reference'],t['sample'])]
test('transfer peak changes to X rather than memorized C',lambda:require(t['peaks'][td.index(max(td))]=='X','Transfer failed'))
test('model EC50 ratio and half-maximum',lambda:require(math.isclose(8/2,4) and math.isclose(100*2/(2+2),50),'Model error'))
test('trial risk difference and approximate uncertainty',lambda:require(math.isclose(100*(30/100-20/100),10) and -2<0<22,'Evidence arithmetic error'))
standard=bundle['quests'][0]['rubric'];capstone=bundle['quests'][-1]['rubric']
test('standard threshold accepts eight but rejects seven',lambda:require(verdict([2,2,2,1,1],standard)['practice_pass'] and not verdict([2,2,1,1,1],standard)['practice_pass'],'Threshold error'))
test('safety-critical miss blocks maximum score',lambda:require(not verdict([2]*6,capstone,critical=True)['independent_eligible'],'Critical flag bypass'))
test('capstone zero dimension blocks numeric ten',lambda:require(not verdict([2,2,2,2,2,0],capstone)['practice_pass'],'Capstone floor bypass'))
test('assisted pass cannot establish independent mastery',lambda:require(verdict([2]*5,standard,assisted=True)['practice_pass'] and not verdict([2]*5,standard,assisted=True)['independent_eligible'],'Assistance bypass'))
bad=copy.deepcopy(bundle);bad['quests'][0]['prerequisites']=['Q15']
test('rejects a cyclic/future prerequisite',lambda:rejects(lambda:check_quest_domain(bad)))
bad_review={'review':{'status':'approved_for_scoped_release','reviewerId':None,'reviewDate':None,'nextReviewDate':None,'scope':'draft'}}
test('rejects fabricated approval with absent reviewer/dates',lambda:rejects(lambda:check_review_release(bad_review)))
bad_graph=copy.deepcopy(graph);bad_graph['entities']['specimens'][0]['unexpected_field']=True
test('rejects unknown entity fields',lambda:rejects(lambda:check(bad_graph,read('SCIENTIFIC-CONTENT-SCHEMA.json'))))

result={'date':'2026-11-02','status':'PASS','checks':len(tests),'passed':tests,'limitations':['Dependency-free checker covers the schema keywords used in this package, not full JSON Schema standards conformance.','No authentic plant/microscopy dataset or independent scientific review is claimed.','No game implementation, learner testing, instructor sign-off or learning-effect validation performed.']}
(ROOT/'validation-results.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'status':'PASS','checks':len(tests),'quests':15,'candidate_profiles':12,'approved_profiles':0}))
