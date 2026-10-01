import React, { useState } from "react";
import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuthStore } from '../../store/useAuthStore';
import clsx from "clsx";

interface Step3IndustriesProps {
  onNext: () => void;
  onBack: () => void;
}

const industries = [
  "AI",
  "Healthcare",
  "Education",
  "FinTech",
  "E-Commerce",
  "Food Delivery",
  "Travel",
  "Agriculture",
  "Manufacturing",
  "Logistics",
  "Real Estate",
  "Cybersecurity",
  "Gaming",
  "Blockchain",
  "IoT",
  "SaaS",
  "Marketplace",
  "Robotics",
  "Cloud Computing",
  "Others",
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const Step3Industries: React.FC<Step3IndustriesProps> = ({
  onNext,
  onBack,
}) => {
  const user = useAuthStore(state => state.user);
  const updateUserPreferences = useAuthStore(state => state.updateUserPreferences);

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    user?.industries ?? []
  );

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleNext = () => {
    updateUserPreferences({
      industries: selectedIndustries,
    });

    onNext();
  };

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">
          Your Interests
        </h2>

        <p className="text-[#6B7280]">
          Select the industries you are most interested in. You can choose
          multiple.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10 max-h-[40vh] overflow-y-auto pr-2">
        {industries.map((industry) => {
          const selected = selectedIndustries.includes(industry);

          return (
            <button
              key={industry}
              type="button"
              onClick={() => toggleIndustry(industry)}
              className={clsx(
                "px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 flex items-center gap-2",
                selected
                  ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {selected && <Check size={14} strokeWidth={3} />}
              {industry}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={selectedIndustries.length === 0}
          className="flex items-center gap-2 bg-[#4F46E5] text-white px-8 py-3 rounded-full disabled:opacity-50"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </m.div>
  );
};

export { Step3Industries };