import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, Code, PenTool, Users, LineChart, Landmark, Lightbulb, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import clsx from 'clsx';

interface Step2RoleProps {
  onNext: () => void;
  onBack: () => void;
}

const roles = [
  { id: 'founder', title: 'Founder', icon: Briefcase },
  { id: 'student', title: 'Student', icon: GraduationCap },
  { id: 'developer', title: 'Developer', icon: Code },
  { id: 'freelancer', title: 'Freelancer', icon: PenTool },
  { id: 'startup_team', title: 'Startup Team', icon: Users },
  { id: 'business_analyst', title: 'Business Analyst', icon: LineChart },
  { id: 'investor', title: 'Investor', icon: Landmark },
  { id: 'consultant', title: 'Consultant', icon: Lightbulb },
  { id: 'other', title: 'Other', icon: User },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const Step2Role: React.FC<Step2RoleProps> = ({ onNext, onBack }) => {
  const user = useAuthStore(state => state.user);
  const updateUserPreferences = useAuthStore(state => state.updateUserPreferences);
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || '');

  const handleNext = () => {
    updateUserPreferences({ role: selectedRole });
    onNext();
  };

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">Choose Your Role</h2>
        <p className="text-[#6B7280]">How do you identify yourself? This helps us personalize your experience.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200",
                isSelected 
                  ? "border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5] shadow-[0_0_0_1px_#4F46E5]" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
              )}
            >
              <Icon size={24} className="mb-3" />
              <span className="font-medium text-sm">{role.title}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <button 
          onClick={onBack}
          className="text-[#6B7280] hover:text-[#111827] px-4 py-2 font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button 
          onClick={handleNext}
          disabled={!selectedRole}
          className="bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 disabled:hover:bg-[#4F46E5] text-white px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </m.div>
  );
};
