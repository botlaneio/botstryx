import {Stage} from '@/components/hero/stage';
import {HomeSections} from '@/components/home/sections';
import {SiteFooter} from '@/components/site/site-footer';

export default function Home() {
  return (
    <>
      <Stage />
      <HomeSections />
      <SiteFooter />
    </>
  );
}
