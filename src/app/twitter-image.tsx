import {shareImage} from '@/lib/share-image';

export const alt = 'botLane · Custom websites and web apps, built properly';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function Image() {
  return shareImage('Custom websites and web apps, built properly.', 'botLane');
}
