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
  memoryScenes: [
    { id: 'first-meeting', title: 'The First Hello', date: '', caption: 'Two ordinary paths crossed, and the day became a little brighter.', detail: 'A small beginning, with room for every good thing that followed.', photo: '', illustration: 'meeting', accent: '#f3c28e' },
    { id: 'rainy-umbrella', title: 'Under One Umbrella', date: '', caption: 'Rain tapped above us while the world grew quiet underneath.', detail: 'There was enough shelter for both of us.', photo: '', illustration: 'rain', accent: '#9ccfe0' },
    { id: 'shared-meal', title: 'Something Shared', date: '', caption: 'A simple meal, a long conversation, and nowhere else to be.', detail: 'The smallest rituals can become the ones we keep closest.', photo: '', illustration: 'meal', accent: '#e9b77e' },
    { id: 'stargazing-night', title: 'A Sky Full of Stars', date: '', caption: 'We looked up at the same sky and let the night take its time.', detail: 'Some moments do not need words to stay with us.', photo: '', illustration: 'stars', accent: '#b8a8ed' },
  ],
});
export default personalConfig;
