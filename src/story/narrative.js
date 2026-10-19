import { personalConfig } from './personal.config.js';

export const speakers = {
  heroine: { nameKey: 'speaker.heroine.name', color: '#f3c28e' },
  him: { nameKey: 'speaker.him.name', color: '#9ccfe0' },
  narrator: { nameKey: 'speaker.narrator.name', color: '#d9c9ef' },
};
export const narrativeMessages = {
  'speaker.heroine.name': personalConfig.names.heroine,
  'speaker.him.name': personalConfig.names.boyfriend,
  'speaker.narrator.name': 'A quiet voice',
  'story.nickname': '{{nickname}}',
  'story.insideJoke': '{{insideJoke}}',
  'ch01.title': 'The Small Beginning', 'ch02.title': 'Weather Between Us',
  'ch03.title': 'The Long Way Round', 'ch04.title': 'Room to Breathe',
  'ch05.title': 'The Words We Keep', 'ch06.title': 'A Place Remembered',
  'ch07.title': 'When the Light Wavers', 'ch08.title': 'Tomorrow, Unrushed',
  'fragment.she.01': 'You made the ordinary feel safe.',
  'fragment.she.02': 'You listened without turning my feelings into a project.',
  'fragment.she.03': 'I felt loved in the little things you thought did not count.',
};
const line = (id, speaker, text, emotion = 'calm', extra = {}) => ({ id, speaker, emotion, textKey: id, fallback: text, ...extra });
const scene = (id, lines, extra = {}) => ({ id, lines, ...extra });
const chapters = [
 { id:'chapter-01', titleKey:'ch01.title', scenes:[
  scene('ch01-s01',[line('ch01.l01','narrator','The morning had not decided what sort of day it wanted to be.')]),
  scene('ch01-s02',[line('ch01.l02','heroine','You brought two cups. I only asked for one.','amused'),line('ch01.l03','him','I panicked in the kitchen. It seemed safer to over-prepare.')],{choices:[{id:'tease',label:'Call it excellent planning',next:'ch01-s03',effects:{playfulness:1}},{id:'thank',label:'Thank him for thinking of you',next:'ch01-s03',effects:{care:1}}]}),
  scene('ch01-s03',[line('ch01.l04','heroine','Then I will drink both. Slowly. You can supervise.','warm')],{fragmentId:'she-01',sheSays:true}),
 ]},
 { id:'chapter-02', titleKey:'ch02.title', scenes:[
  scene('ch02-s01',[line('ch02.l01','narrator','Rain arrived halfway through the walk, without asking either of them.')]),
  scene('ch02-s02',[line('ch02.l02','him','I thought the clouds looked harmless. I would like to formally withdraw that opinion.','embarrassed'),line('ch02.l03','heroine','Your weather forecasts are mostly optimism wearing shoes.','amused')],{choices:[{id:'share',label:'Move closer under the umbrella',next:'ch02-s03',effects:{care:1}},{id:'laugh',label:'Laugh and keep walking',next:'ch02-s03',effects:{playfulness:1}}]}),
  scene('ch02-s03',[line('ch02.l04','him','Next time, I will check the forecast.','gentle'),line('ch02.l05','heroine','Next time, bring the big umbrella. That is growth.')]),
 ]},
 { id:'chapter-03', titleKey:'ch03.title', scenes:[
  scene('ch03-s01',[line('ch03.l01','narrator','They took the long path because neither was ready to go home.')]),
  scene('ch03-s02',[line('ch03.l02','heroine','You do not have to fill every quiet minute.','thoughtful'),line('ch03.l03','him','Good. I was running out of clever things to say about ducks.','amused')],{choices:[{id:'quiet',label:'Walk quietly together',next:'ch03-s03',effects:{patience:1}},{id:'duck',label:'Ask for one more duck fact',next:'ch03-s03',effects:{playfulness:1}}]}),
  scene('ch03-s03',[line('ch03.l04','him','I can just be here. I am learning that counts.','sincere')]),
 ]},
 { id:'chapter-04', titleKey:'ch04.title', scenes:[
  scene('ch04-s01',[line('ch04.l01','narrator','At home, the room felt too small for all the thoughts in it.')]),
  scene('ch04-s02',[line('ch04.l02','heroine','I need a little space. It is not a test.','honest'),line('ch04.l03','him','Okay. Would you like me nearby, or would you rather have the room to yourself?','gentle')],{choices:[{id:'nearby',label:'Nearby, please',next:'ch04-s03',effects:{trust:1}},{id:'alone',label:'Some time alone',next:'ch04-s03',effects:{patience:1}}]}),
  scene('ch04-s03',[line('ch04.l04','narrator','No one had to guess. The answer could simply be said.')]),
 ]},
 { id:'chapter-05', titleKey:'ch05.title', scenes:[
  scene('ch05-s01',[line('ch05.l01','narrator','The note was folded three times. The sentence inside was still awkward.')]),
  scene('ch05-s02',[line('ch05.l02','him','I am sorry I tried to solve it before I understood it.','sincere'),line('ch05.l03','heroine','Thank you. I do not need a perfect speech. Just the real one.','warm')],{choices:[{id:'honest',label:'Say what is hard to say',next:'ch05-s03',effects:{trust:1}},{id:'listen',label:'Ask what she needs now',next:'ch05-s03',effects:{care:1}}]}),
  scene('ch05-s03',[line('ch05.l04','him','I can try again. Maybe with fewer dramatic folds in the paper.','amused')]),
 ]},
 { id:'chapter-06', titleKey:'ch06.title', scenes:[
  scene('ch06-s01',[line('ch06.l01','narrator','The old garden was smaller than memory had made it.')]),
  scene('ch06-s02',[line('ch06.l02','heroine','I remember sitting here when the day got too loud.','soft'),line('ch06.l03','him','You never had to explain why you needed the quiet.','gentle')],{choices:[{id:'remember',label:'Share the memory',next:'ch06-s03',effects:{exploration:1}},{id:'wander',label:'Look around the garden',next:'ch06-s03',effects:{exploration:1}}]}),
  scene('ch06-s03',[line('ch06.l04','heroine','You made the ordinary feel safe. I wanted you to know.','tender',{fragmentId:'she-01'} )],{fragmentId:'she-01',sheSays:true}),
 ]},
 { id:'chapter-07', titleKey:'ch07.title', scenes:[
  scene('ch07-s01',[line('ch07.l01','narrator','The lights flickered. For a moment, every worry found its voice.')]),
  scene('ch07-s02',[line('ch07.l02','him','I do not know how to make this better.','worried'),line('ch07.l03','heroine','You can ask whether I want advice, a distraction, or quiet company.','steady')],{choices:[{id:'company',label:'Offer quiet company',next:'ch07-s03',effects:{care:1}},{id:'ask',label:'Ask what would help',next:'ch07-s03',effects:{trust:1}}]}),
  scene('ch07-s03',[line('ch07.l04','heroine','You listened without turning my feelings into a project. That mattered.','tender')],{fragmentId:'she-02',sheSays:true}),
 ]},
 { id:'chapter-08', titleKey:'ch08.title', scenes:[
  scene('ch08-s01',[line('ch08.l01','narrator','Morning came back, as it tends to do. The dishes were still there.')]),
  scene('ch08-s02',[line('ch08.l02','him','I had a grand plan for today. It involved breakfast and not burning toast.','amused'),line('ch08.l03','heroine','Ambitious. I believe in you, but I am keeping the window open.','warm')],{choices:[{id:'together',label:'Make breakfast together',next:'ch08-s03',effects:{care:1}},{id:'tea',label:'Start with tea',next:'ch08-s03',effects:{patience:1}}]}),
  scene('ch08-s03',[line('ch08.l04','heroine','I felt loved in the little things you thought did not count.','tender')],{fragmentId:'she-03',sheSays:true}),
  scene('ch08-s04',[line('ch08.l05','narrator','Nothing was solved forever. They had learned how to begin again, together.')]),
 ]},
];
export { chapters };
export const cutscenes = [
 {id:'cs-opening',chapter:'chapter-01',title:'First light',replayable:true,steps:[{type:'fade',to:'black',duration:250},{type:'camera',path:[{x:0,y:2,z:8},{x:1,y:1.5,z:5}],duration:900},{type:'letterbox',show:true},{type:'fade',to:'clear',duration:450},{type:'animation',character:'heroine',cue:'look-up'},{type:'music',cue:'warm-morning'},{type:'waitForInput'},{type:'letterbox',show:false}]},
 {id:'cs-rain',chapter:'chapter-02',title:'Shared umbrella',replayable:true,steps:[{type:'camera',path:[{x:-2,y:2,z:7},{x:0,y:1,z:4}],duration:700},{type:'letterbox',show:true},{type:'animation',character:'heroine',cue:'open-umbrella'},{type:'music',cue:'soft-rain'},{type:'waitForInput'},{type:'letterbox',show:false}]},
 {id:'cs-tide',chapter:'chapter-03',title:'The shore',replayable:true,steps:[{type:'camera',path:[{x:0,y:4,z:10},{x:3,y:2,z:6}],duration:1100},{type:'letterbox',show:true},{type:'animation',character:'him',cue:'look-to-horizon'},{type:'music',cue:'slow-tide'},{type:'waitForInput'},{type:'letterbox',show:false}]},
 {id:'cs-window',chapter:'chapter-04',title:'Room to breathe',replayable:true,steps:[{type:'fade',to:'black',duration:200},{type:'camera',path:[{x:2,y:1,z:6},{x:0,y:1,z:4}],duration:650},{type:'fade',to:'clear',duration:350},{type:'animation',character:'heroine',cue:'open-window'},{type:'waitForInput}]},
 {id:'cs-paper',chapter:'chapter-05',title:'The folded note',replayable:true,steps:[{type:'camera',path:[{x:0,y:1,z:5},{x:0,y:0.5,z:2}],duration:650},{type:'animation',character:'him',cue:'offer-note'},{type:'music',cue:'quiet-piano'},{type:'waitForInput}]},
 {id:'cs-garden',chapter:'chapter-06',title:'The old garden',replayable:true,steps:[{type:'camera',path:[{x:-3,y:2,z:8},{x:0,y:1,z:4}],duration:950},{type:'letterbox',show:true},{type:'animation',character:'heroine',cue:'kneel-discover'},{type:'music',cue:'garden-bells'},{type:'waitForInput'},{type:'letterbox',show:false}]},
 {id:'cs-storm',chapter:'chapter-07',title:'A flicker of light',replayable:true,steps:[{type:'fade',to:'black',duration:250},{type:'camera',path:[{x:1,y:1,z:6},{x:0,y:1,z:4}],duration:600},{type:'fade',to:'clear',duration:500},{type:'animation',character:'him',cue:'sit-and-breathe'},{type:'music',cue:'low-and-kind'},{type:'waitForInput}]},
 {id:'cs-dawn',chapter:'chapter-08',title:'Another morning',replayable:true,steps:[{type:'camera',path:[{x:0,y:2,z:8},{x:0,y:1.5,z:4}],duration:1000},{type:'letterbox',show:true},{type:'animation',character:'heroine',cue:'small-smile'},{type:'music',cue:'warm-morning'},{type:'waitForInput'},{type:'letterbox',show:false}]}
];
export const sheSaysFragments = [
 {id:'she-01',chapter:'chapter-06',title:'The ordinary felt safe',textKey:'fragment.she.01',fallback:narrativeMessages['fragment.she.01']},
 {id:'she-02',chapter:'chapter-07',title:'You listened',textKey:'fragment.she.02',fallback:narrativeMessages['fragment.she.02']},
 {id:'she-03',chapter:'chapter-08',title:'The little things',textKey:'fragment.she.03',fallback:narrativeMessages['fragment.she.03']},
];
export const journalEntries = [
 {id:'noticed-small-things',chapter:'chapter-01',title:'He notices the small things',text:'Care can be quiet: making tea, walking at your pace, noticing when the room gets too loud.',requires:{collectibles:1}},
 {id:'asks-instead-guesses',chapter:'chapter-02',title:'He is learning to ask',text:'A kind question can be more useful than a confident guess.',requires:{collectibles:2}},
 {id:'lets-silence-be',chapter:'chapter-03',title:'He can sit with silence',text:'He does not have to repair every hard feeling. Sometimes he can stay nearby and listen.',requires:{collectibles:3}},
 {id:'makes-room',chapter:'chapter-04',title:'He makes room for space',text:'Closeness and breathing room can belong in the same relationship.',requires:{collectibles:4}},
 {id:'practices-honesty',chapter:'chapter-05',title:'He tries again with words',text:'The first sentence may be awkward. Trying to be honest still matters.',requires:{collectibles:5}},
 {id:'remembers-kindness',chapter:'chapter-06',title:'He remembers what helped',text:'A small act of attention can become a memory someone carries for a long time.',requires:{collectibles:6}},
 {id:'stays-without-fixing',chapter:'chapter-07',title:'He can stay without fixing',text:'Ask whether someone needs advice, distraction, or quiet company.',requires:{collectibles:7}},
 {id:'keeps-learning',chapter:'chapter-08',title:'He is still learning',text:'Care is not a perfect performance. It is a series of small choices, made with attention.',requires:{collectibles:8}},
];
export function localize(key, vars = {}, catalog = narrativeMessages) {
 const configVars = { nickname: personalConfig.personalization?.nickname || 'friend', insideJoke: personalConfig.personalization?.insideJoke || 'our very specific joke', ...vars };
 const template = String(catalog[key] ?? key);
 return template.replace(/\{\{(\w+)\}\}/g, (_, name) => String(configVars[name] ?? ''));
}
