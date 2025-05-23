
import SectionSeparator from "./SectionSeparator";

export default function SundayBrunchSection() {
  return (
    <div className="py-12">
      <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6">SUNDAY BRUNCH</h2>
      <div className="max-w-[450px] mx-auto text-center">
        <p className="text-anniversary-gold mb-4">
          Join us for a farewell brunch on Sunday morning. Details to be provided closer to the event.
        </p>
      </div>
      <div className="mt-12">
        <SectionSeparator />
      </div>
    </div>
  );
}
