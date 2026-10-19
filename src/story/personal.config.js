/**
 * The only editable source for personal names, dates, photos, and messages.
 * Keep defaults fictional and neutral. Personal photos belong in /public/personal/
 * and are referenced by their public URL (for example, /personal/photo-01.webp).
 */
export const ENDING_MESSAGE = Object.freeze({
  lines: [
    'We can take the next little step together.',
    'And then the next one, whenever we are ready.',
  ],
  signature: 'Your Favorite Person',
  date: '',
});

export const personalConfig = Object.freeze({
  names: { heroine: 'The Lightbringer', boyfriend: 'Your Favorite Person' },
  dates: { specialDay: '' },
  photos: { cover: '', memories: [] },
  messages: {
    opening: 'You do not have to carry everything alone.',
    ending: 'We can take the next little step together.',
  },
  gameplay: { collectedHearts: 3 },
  personalization: { nickname: '', insideJoke: '', sheSaysOverrides: {} },
  memoryScenes: [
    { id: 'first-meeting', title: 'The First Hello', date: '', caption: 'Two ordinary paths crossed, and the day became a little brighter.', detail: 'A small beginning, with room for every good thing that followed.', photo: '', illustration: 'meeting', accent: '#f3c28e' },
    { id: 'rainy-umbrella', title: 'Under One Umbrella', date: '', caption: 'Rain tapped above us while the world grew quiet underneath.', detail: 'There was enough shelter for both of us.', photo: '', illustration: 'rain', accent: '#9ccfe0' },
    { id: 'shared-meal', title: 'Something Shared', date: '', caption: 'A simple meal, a long conversation, and nowhere else to be.', detail: 'The smallest rituals can become the ones we keep closest.', photo: '', illustration: 'meal', accent: '#e9b77e' },
    { id: 'stargazing-night', title: 'A Sky Full of Stars', date: '', caption: 'We looked up at the same sky and let the night take its time.', detail: 'Some moments do not need words to stay with us.', photo: '', illustration: 'stars', accent: '#b8a8ed' },
  ],
});

/**
 * Companion presentation is story data: dialogue and emotional state can be
 * personalized here without changing the UI component.
 */
export const COMPANION_STATES = Object.freeze({
  default: { state: 'hopeful', label: 'Still here', lines: ['One little step is enough.', 'I am here beside you, not ahead of you.'] },
  'chapter-01': { state: 'curled-up', label: 'Curled up, finding quiet', lines: ['We can start small.', 'You do not have to hurry for me.'] },
  'chapter-02': { state: 'looking-away', label: 'Looking away', lines: ['My thoughts are loud today.', 'I am listening, even when I look away.'] },
  'chapter-03': { state: 'tired', label: 'A little tired', lines: ['The distance feels big. I am still here.', 'Let the tide slow us down for a moment.'] },
  'chapter-04': { state: 'hopeful', label: 'Trying again', lines: ['We can take this one piece at a time.', 'A pause is part of the journey, too.'] },
  'chapter-05': { state: 'looking-away', label: 'Finding his words', lines: ['That doubt is a thought, not the whole truth.', 'I am learning to speak more gently.'] },
  'chapter-06': { state: 'hopeful', label: 'Turning toward you', lines: ['I remember this place with you.', 'Take my hand if you want. We can wander.'] },
  'chapter-07': { state: 'tired', label: 'Staying through the hard part', lines: ['I do not need you to fix this for me.', 'Staying close is already something.'] },
  'chapter-08': { state: 'smiling', label: 'Here, with you', lines: ['I am glad we made it here together.', 'No finish line for us. Just the next day.'] },
});

export const COMPANION_PRESENCE = Object.freeze({
  default: { icon: '✦', label: 'A warm light waits nearby' },
  'chapter-01': { icon: '🧣', label: 'A scarf caught on a fence' },
  'chapter-02': { icon: '✧', label: 'A small light through the tangle' },
  'chapter-03': { icon: '☼', label: 'A lantern across the water' },
  'chapter-04': { icon: '⌁', label: 'A ribbon marks a quiet route' },
  'chapter-05': { icon: '◇', label: 'A reflection turns toward you' },
  'chapter-06': { icon: '🧣', label: 'His familiar scarf by the path' },
  'chapter-07': { icon: '☼', label: 'A steady light beyond the dark' },
  'chapter-08': { icon: '✿', label: 'A flower from the morning walk' },
});

export default personalConfig;
