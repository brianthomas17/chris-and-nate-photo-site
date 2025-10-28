import { AccessType } from '@/types';

export interface StaticContentSection {
  id: string;
  title: string;
  content: string;
  order_index: number;
  accessType: AccessType;
}

// Main Event Content Sections
export const mainEventSections: StaticContentSection[] = [
  {
    id: 'main-1',
    title: 'When & Where',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">WHEN & WHERE</h2>
      <p class="text-[#C2C2C2] mb-4">Saturday, October 28, 2023</p>
      <p class="text-[#C2C2C2] mb-4">6:00 PM - 11:00 PM</p>
      <p class="text-[#C2C2C2] mb-4">The Midway, San Francisco</p>
      <p class="text-[#C2C2C2]">900 Marin St, San Francisco, CA 94124</p>
    `,
    order_index: 1,
    accessType: 'main_event'
  },
  {
    id: 'main-2',
    title: 'What to Expect',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">WHAT TO EXPECT</h2>
      <p class="text-[#C2C2C2] mb-4">An unforgettable evening featuring:</p>
      <ul class="text-[#C2C2C2] list-disc pl-6 space-y-2">
        <li>Cocktail hour with signature drinks</li>
        <li>Gourmet dinner service</li>
        <li>Live entertainment and performances</li>
        <li>Dancing and celebration</li>
        <li>Special surprises throughout the night</li>
      </ul>
    `,
    order_index: 2,
    accessType: 'main_event'
  },
  {
    id: 'main-3',
    title: 'Dress Code',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">DRESS CODE</h2>
      <p class="text-[#C2C2C2] mb-4">Formal Evening Attire</p>
      <p class="text-[#C2C2C2]">Come dressed to impress for this spectacular celebration. Think elegant, sophisticated, and ready to make memories.</p>
    `,
    order_index: 3,
    accessType: 'main_event'
  }
];

// Afterparty Content Sections
export const afterpartySections: StaticContentSection[] = [
  {
    id: 'after-1',
    title: 'The Afterparty',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">THE AFTERPARTY</h2>
      <p class="text-[#C2C2C2] mb-4">11:00 PM - Late</p>
      <p class="text-[#C2C2C2] mb-4">The party doesn't stop!</p>
      <p class="text-[#C2C2C2]">Join us for late-night dancing, drinks, and continued celebration. The energy continues with special DJ sets and surprises.</p>
    `,
    order_index: 1,
    accessType: 'afterparty'
  },
  {
    id: 'after-2',
    title: 'What to Bring',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">WHAT TO BRING</h2>
      <p class="text-[#C2C2C2] mb-4">Just yourself and your dancing shoes!</p>
      <p class="text-[#C2C2C2]">Everything else will be provided. Come ready to dance the night away.</p>
    `,
    order_index: 2,
    accessType: 'afterparty'
  }
];

export const getContentByAccessType = (accessType: AccessType): StaticContentSection[] => {
  return accessType === 'main_event' ? mainEventSections : afterpartySections;
};
