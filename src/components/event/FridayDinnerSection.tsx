
import { SectionSeparator } from "./SectionSeparator";

export default function FridayDinnerSection() {
  return (
    <section className="animate-fade-in pb-16">
      <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">FAMILY DINNER</h2>
      <div className="max-w-[800px] mx-auto">
        <div className="text-center text-white space-y-4">
          <p className="text-lg md:text-xl font-bicyclette">Friday, August 15, 2025</p>
          <p className="text-lg md:text-xl">Chris & Nate's Castro Home: 24 Hartford Street San Francisco, CA</p>
          <p className="text-lg md:text-xl font-din mt-6">DINNER STARTS AT 5PM</p>
          <p className="mt-6 md:mt-8 text-base md:text-lg max-w-[600px] mx-auto">
            You are invited to Chris & Nate's home for a casual family dinner. We will order pizza and whatever things sound good at the moment.
          </p>
        </div>
      </div>
      <div className="pt-16">
        <SectionSeparator />
      </div>
    </section>
  );
}
