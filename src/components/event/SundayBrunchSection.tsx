
import SectionSeparator from "./SectionSeparator";

export default function SundayBrunchSection() {
  return (
    <section className="animate-fade-in pb-16">
      <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">SUNDAY BRUNCH</h2>
      <div className="max-w-[800px] mx-auto">
        <div className="text-center text-white space-y-4">
          <p className="text-lg md:text-xl font-bicyclette">Sunday, August 17, 2025</p>
          <p className="text-lg md:text-xl">Foreign Cinema, 2534 Mission St, San Francisco, CA</p>
          <p className="text-lg md:text-xl font-din mt-6">BRUNCH STARTS AT 11AM</p>
          <p className="mt-6 md:mt-8 text-base md:text-lg max-w-[600px] mx-auto">
            Join Chris & Nate for a relaxed brunch to wrap up the weekend celebration. Enjoy delicious food and drinks as we reminisce about the festivities.
          </p>
        </div>
      </div>
      <div className="pt-16">
        <SectionSeparator />
      </div>
    </section>
  );
}
