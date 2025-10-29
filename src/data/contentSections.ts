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
    title: 'Family Dinner',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">FAMILY DINNER</h2>
      <p class="text-[#C2C2C2] mb-4">Friday, August 15, 2025</p>
      <p class="text-[#C2C2C2] mb-4">Chris & Nate's Castro Home:<br/>24 Hartford Street, San Francisco, CA 94114</p>
      <p class="text-xl font-din text-anniversary-gold mb-4 mt-6">DINNER STARTS AT 5:00PM</p>
      <p class="text-[#C2C2C2]">We're kicking off the weekend with a casual family dinner at our home. Join us for good food, great company, and a relaxed evening before the big celebration.</p>
    `,
    order_index: 1,
    accessType: 'main_event'
  },
  {
    id: 'main-2',
    title: 'The Main Event Intro',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-6">DRESS TO IMPRESS. ARRIVE CURIOUS. STAY LATE.</h2>
      <p class="text-[#C2C2C2] mb-4">Saturday, August 16, 2025</p>
      <p class="text-[#C2C2C2] mb-6">St Joseph's Arts Society<br/>1401 Howard Street, San Francisco CA</p>
    `,
    order_index: 2,
    accessType: 'main_event'
  },
  {
    id: 'main-3',
    title: 'Doors Open',
    content: `
      <h2 class="text-xl font-din text-anniversary-gold mb-4">DOORS OPEN AT 4:00PM</h2>
      <p class="text-[#C2C2C2] mb-4">Step into an immersive world designed to celebrate a decade of love, laughter, and life together. As you arrive, you'll be greeted with craft cocktails and hors d'oeuvres while you explore installations that tell our story through personal touches, interactive moments, and surprises around every corner.</p>
      <p class="text-[#C2C2C2]">Take your time to wander, discover, and soak it all in before the main event begins.</p>
    `,
    order_index: 3,
    accessType: 'main_event'
  },
  {
    id: 'main-4',
    title: 'Main Event Begins',
    content: `
      <h2 class="text-xl font-din text-anniversary-gold mb-4">MAIN EVENT BEGINS PROMPTLY AT 5:30PM</h2>
      <p class="text-[#C2C2C2] mb-4">Our celebrity MC will guide us through an unforgettable program celebrating 10 years of determination, disruption, and dinner dilemmas. Expect heartfelt speeches, surprise performances, and moments that will have you laughing, crying, and everything in between.</p>
      <p class="text-[#C2C2C2]">This is where the magic happens—don't be late!</p>
    `,
    order_index: 4,
    accessType: 'main_event'
  },
  {
    id: 'main-5',
    title: 'Dinner',
    content: `
      <h2 class="text-xl font-din text-anniversary-gold mb-4">DINNER STARTS AT 7:00PM</h2>
      <p class="text-[#C2C2C2] mb-4">We've curated a thoughtful buffet featuring elevated ingredients and flavors that reflect our journey together. From comfort food favorites to adventurous bites, there's something for every palate.</p>
      <p class="text-[#C2C2C2]">Save room for dessert—trust us on this one.</p>
    `,
    order_index: 5,
    accessType: 'main_event'
  },
  {
    id: 'main-6',
    title: 'Dessert Forest',
    content: `
      <h2 class="text-xl font-din text-anniversary-gold mb-4">DESSERT FOREST OPENS AT 7:45PM</h2>
      <p class="text-[#C2C2C2]">Enter an interactive edible wonderland where sweet treats grow on trees, hide in nooks, and surprise at every turn. This isn't just dessert—it's an experience. Explore, taste, and indulge in a sugar-fueled adventure that's as Instagram-worthy as it is delicious.</p>
    `,
    order_index: 6,
    accessType: 'main_event'
  },
  {
    id: 'main-7',
    title: 'Afterparty',
    content: `
      <h2 class="text-xl font-din text-anniversary-gold mb-4">AFTERPARTY FROM 9:00PM UNTIL 1:00AM</h2>
      <p class="text-[#C2C2C2] mb-4">Call time 8:30 PM</p>
      <p class="text-[#C2C2C2] mb-4">The night is far from over. Bootie SF is bringing their signature mashup madness to keep the dance floor packed until the early hours. Expect high energy, nostalgic throwbacks, and beats that'll make you lose track of time.</p>
      <p class="text-lg font-din text-anniversary-gold mb-2 mt-6">DRESS CODE:</p>
      <p class="text-[#C2C2C2]">Elevated Club Vibes — Think fashion-forward, fun, and ready to move. Leave the formal wear at home and bring your best dance floor energy.</p>
    `,
    order_index: 7,
    accessType: 'main_event'
  },
  {
    id: 'main-8',
    title: 'Sunday Brunch',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-4">LATE STARTS, LOUD LAUGHS + STRONG COFFEE</h2>
      <p class="text-[#C2C2C2] mb-4">Sunday, August 17, 2025</p>
      <p class="text-[#C2C2C2] mb-4">Harborview Restaurant and Bar<br/>4 Embarcadero Center, San Francisco, CA 94111</p>
      <p class="text-xl font-din text-anniversary-gold mb-4 mt-6">BRUNCH FROM 10:30AM UNTIL 1:00PM</p>
      <p class="text-[#C2C2C2] mb-4">Sleep in, recover, and join us for a casual dim sum brunch to recap the weekend's highlights. We've secured the outdoor patio overlooking the Bay Bridge—perfect for lingering conversations, strong coffee, and one last toast before we all head our separate ways.</p>
      <p class="text-[#C2C2C2]">Dress code: Casual. Come as you are (sunglasses highly encouraged).</p>
    `,
    order_index: 8,
    accessType: 'main_event'
  },
  {
    id: 'main-9',
    title: 'Getting Ready',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-6">GETTING READY</h2>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">MAIN EVENT ATTIRE</h3>
      <p class="text-[#C2C2C2] mb-6">Chic – Formalwear welcome</p>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">PARKING</h3>
      <p class="text-[#C2C2C2] mb-6">Rideshare is highly encouraged. Limited street parking is available in the surrounding neighborhood, but spaces fill up quickly on Saturday evenings.</p>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">HOTEL RECOMMENDATIONS</h3>
      <p class="text-[#C2C2C2] mb-4">We don't have a hotel block, but here are some great options close to the venue:</p>
      <ul class="text-[#C2C2C2] space-y-3 mb-4">
        <li><strong>Laurel Inn Hyatt</strong> — Pacific Heights charm with modern amenities</li>
        <li><strong>Hotel VIA</strong> — Sleek South Beach spot, walkable to nightlife</li>
        <li><strong>Hotel Kabuki</strong> — Japantown gem with serene vibes</li>
        <li><strong>Courtyard on VanNess</strong> — Affordable and centrally located</li>
      </ul>
    `,
    order_index: 9,
    accessType: 'main_event'
  },
  {
    id: 'main-10',
    title: 'FAQ',
    content: `
      <h2 class="text-2xl font-din text-anniversary-gold mb-6">FAQ</h2>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">WHAT'S THE DRESS CODE?</h3>
      <p class="text-[#C2C2C2] mb-6">For the main event: Chic – formalwear welcome. For the afterparty: Elevated club vibes. Don't worry, there will be a coat check if you want to stash your fancy layers before hitting the dance floor.</p>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">SHOULD I BRING A GIFT? IS THERE A REGISTRY?</h3>
      <p class="text-[#C2C2C2] mb-6">No gifts, please! Your presence is the only present we need. Just show up, celebrate with us, and make memories.</p>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">IS THERE A HOTEL BLOCK?</h3>
      <p class="text-[#C2C2C2] mb-6">We don't have an official hotel block, but we've listed our favorite nearby hotels in the "Getting Ready" section above.</p>
      
      <h3 class="text-lg font-din text-anniversary-gold mb-3">WILL THERE BE PHOTOS?</h3>
      <p class="text-[#C2C2C2]">Yes! We'll have professional photographers capturing glam portraits, candid moments, and group shots throughout the night. Expect photos in the group chat post-event.</p>
    `,
    order_index: 10,
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
