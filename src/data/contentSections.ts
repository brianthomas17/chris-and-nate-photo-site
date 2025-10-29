import { AccessType } from "@/types";

export interface StaticContentSection {
  id: string;
  title: string;
  content: string;
  order_index: number;
  visible_to_main_event: boolean;
  visible_to_afterparty: boolean;
}

// Static content sections converted from database
const contentSections: StaticContentSection[] = [
  {
    id: "family-dinner",
    title: "FAMILY DINNER",
    content: `<h2>FAMILY DINNER</h2><p> Friday, August 15, 2025<br><br>
Chris & Nate's Castro Home: 
<br><a href="https://maps.app.goo.gl/Po187N4MiM1yBz4q6" target="_blank">24 Hartford Street <br>San Francisco, CA 94114<br></a>
<h4>DINNER STARTS AT 5:00PM</h4>
<p>You are invited to Chris & Nate's home for a casual family dinner. We will order pizza and whatever things sound good at the moment. 
</p>`,
    order_index: 1,
    visible_to_main_event: true,
    visible_to_afterparty: false,
  },
  {
    id: "main-event-and-afterparty",
    title: "THE MAIN EVENT",
    content: `<h2>THE MAIN EVENT</h2>
<h3>DRESS TO IMPRESS. ARRIVE CURIOUS. STAY LATE.</h3>
<p>Saturday, August 16, 2025<br>
St Joseph's Arts Society<br>
1401 Howard Street, San Francisco CA<br>
</p>

<h3>DOORS OPEN AT 4:00PM</h3>
<p>Experience an immersive world designed to engage every sense. Cocktails, hors d'oeuvres and other interactive components will have personal touches reflecting Chris & Nate's lives.</p>

<h3>MAIN EVENT BEGINS PROMPTLY AT 5:30PM</h3>
<p>Chris & Nate turn up the heat with a celebrity MC on stage, talking about 10 years of Determination, Disruption & Dinner Dilemmas </p>

<h3>DINNER STARTS AT 7:00PM</h3>
<p>Savor a thoughtful buffet crafted with elevated ingredients, curated by Chris & Nate, designed to invite reflection around the table. Just be sure to save room for dessert...</p>

<h3>DESSERT FOREST OPENS AT 7:45PM</h3>
<p>You won't want to miss this interactive, edible wonderland! Be prepared to explore, discover and lean into temptation … this is not a passive buffet, come with a sense of wonder!</p>

<h3>AFTERPARTY FROM 9:00PM UNTIL 1:00AM</h3>
<h4>Call time 8:30 PM</h4>
<p>Lose yourself on the dance floor as Bootie SF brings the mashup madness into the morning hours. </p>
<p>Dress code: Elevated Club Vibes</p>`,
    order_index: 2,
    visible_to_main_event: true,
    visible_to_afterparty: true,
  },
  {
    id: "brunch",
    title: "BRUNCH",
    content: `<h2>LATE STARTS, LOUD LAUGHS +<br>STRONG COFFEE</h2>
<p>Sunday, August 17, 2025<br>
Harborview Restaurant and Bar: <br><a href="https://maps.app.goo.gl/y1rj6a8sR1hkUGve9" target="_blank">4 Embarcadero Center,
San Francisco, CA 94111</a><br>
</p>

<h3>BRUNCH FROM 10:30AM UNTIL 1:00PM</h3>
<p>Join Chris & Nate for a casual send-off dim sum brunch, highlighting their favorite dim sum items in an iconic view of the San Francisco Bay Bridge in an outdoor patio.
<p>You're welcome to wear whatever you like; dress code is casual!  Feel free to swing by the restaurant any time between 10AM-1PM to say hi and grab a bite. </p>`,
    order_index: 3,
    visible_to_main_event: true,
    visible_to_afterparty: false,
  },
  {
    id: "getting-ready",
    title: "Getting Ready",
    content: `<h2>Getting Ready</h2>
<h3>Main Event Attire</h3>
<p>Chic — Formalwear welcome.</p>

<h3>Parking</h3>
<p>Rideshare is strongly encouraged—we'll be going late! Limited street parking available near the venue.</p>

<h3>Hotel Recommendations</h3>
<p><a href="https://www.hyatt.com/jdv-by-hyatt/en-US/sfojl-jdv-laurel-inn" target="_blank">Laurel Inn Hyatt</a><br>
Pacific Heights ~ $450/night</p>

<p><a href="https://www.hotelviasf.com/" target="_blank">Hotel VIA</a><br>
South Beach ~ $300/night</p>

<p><a href="https://www.hyatt.com/jdv-by-hyatt/en-US/sfojd-jdv-hotel-kabuki?src=corp_lclb_google_seo_sfojd&?utm_source=google" target="_blank">Hotel Kabuki</a><br>
Japantown ~ $250/night</p>

<p><a href="https://www.marriott.com/en-us/hotels/sfovn-courtyard-san-francisco-downtown-van-ness-ave/overview/" target="_blank">Courtyard on VanNess</a><br>
Downtown ~ $190/night</p>

<h3>FAQ</h3>

<h4>What's the dress code?</h4>
<p>Chic — Formalwear welcome! <br>Bring a change of clothes for the afterparty, where the dress theme is elevated club vibes – there will be a coat check and changing area available.</p>

<h4>Should I bring a gift? Is there a registry?</h4>
<p>Please don't bring any gifts, there is no registry. We just want to celebrate with you!</p>

<h4>Is there a hotel block?</h4>
<p>No hotel block, but see above for recommended options in the city!</p>

<h4>Will there be photos?</h4>
<p>Yes! We'll have a photographer capturing the evening, and you'll also have access to upload your own photos and videos.</p>

<h4>Can I bring a plus one?</h4>
<p>We would love to accommodate everyone, but we're working within some space constraints. If you're able to bring a guest, we have designated that on your invite.</p>

<h4>Can I bring my kids?</h4>
<p>Unfortunately, this is an adults-only event.</p>

<h4>I have a food allergy. Can you accommodate me?</h4>
<p>Yes! Just let us know what you're allergic to, and we will do our best to accommodate you!</p>

<h4>What about the afterparty?</h4>
<p>The afterparty will kick off at 9:00 PM in a separate room from the main event (call time 8:30 PM). We'll have a DJ, drinks, and a chance to let loose! If you have an afterparty ticket, it will be noted on your RSVP confirmation. Dress code: elevated club vibes!</p>`,
    order_index: 4,
    visible_to_main_event: true,
    visible_to_afterparty: false,
  },
];

// Filter content sections by access type
export function getContentByAccessType(accessType: AccessType): StaticContentSection[] {
  return contentSections
    .filter(section => {
      if (accessType === 'main_event') {
        return section.visible_to_main_event;
      } else if (accessType === 'afterparty') {
        return section.visible_to_afterparty;
      }
      return false;
    })
    .sort((a, b) => a.order_index - b.order_index);
}
