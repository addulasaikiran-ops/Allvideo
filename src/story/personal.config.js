/**
 * The only editable source for personal names, dates, photos, and messages.
 * Keep defaults fictional and neutral. Personal photos belong in /public/personal/
 * and are referenced by their public URL (for example, /personal/photo-01.webp).
 */
export const personalConfig = Object.freeze({
  names: {
    heroine: 'The Lightbringer',
    boyfriend: 'Your Favorite Person',
  },
  dates: {
    specialDay: '',
  },
  photos: {
    cover: '',
    memories: [],
  },
  messages: {
    opening: 'You do not have to carry everything alone.',
    ending: 'We can take the next little step together.',
  },
});

export default personalConfig;
