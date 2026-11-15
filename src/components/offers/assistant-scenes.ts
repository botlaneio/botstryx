// Four conversations with an assistant for an example business, Oak & Ember Catering. Three are answered from the
// business's own information (the chip under each answer says which part); the fourth needs a person, so the
// assistant hands it on. Oak & Ember, its prices and its policies are illustrations.
export interface Scene {
  id: string;
  label: string;
  time: string;
  ask: string;
  answer: string;
  source?: string;
  handoff?: {to: string; summary: string};
}

export const SCENES: Scene[] = [
  {
    id: 'price',
    label: 'A price',
    time: '11:42 pm',
    ask: 'How much is catering for 50 people?',
    answer: 'Our buffet menu is $28 a head, so about $1,400 for 50 guests, with staff and setup included. Want me to check a date?',
    source: 'Menus and prices',
  },
  {
    id: 'policy',
    label: 'A policy',
    time: '2:16 am',
    ask: 'Can I change the numbers a week before?',
    answer: 'Yes. You can change guest numbers up to 7 days before the event at no charge. After that, we bill for the number you confirmed.',
    source: 'Booking terms',
  },
  {
    id: 'faq',
    label: 'A common question',
    time: '6:05 am',
    ask: 'Do you do vegan and gluten-free?',
    answer: 'We do. Every menu has a vegan option, and gluten-free dishes are marked. Tell us about allergies when you book and the kitchen plans around them.',
    source: 'Questions we get',
  },
  {
    id: 'person',
    label: 'One for a person',
    time: '9:31 pm',
    ask: 'Could you cater a wedding on a boat in March?',
    answer: 'That’s a great one for the team rather than me. I’ve passed your question on with your email, and someone will get back to you.',
    handoff: {to: 'Oak & Ember team', summary: 'Wedding on a boat, March · asked by maya@example.com'},
  },
];
