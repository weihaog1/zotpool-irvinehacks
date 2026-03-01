import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { upsertVehicle } from '../services/vehicles';
import {
  StepSignUp,
  StepNameGender,
  StepCity,
  StepStudies,
  StepSocials,
  StepRole,
  StepVehicle,
} from '../components/onboarding';
import type { OnboardingFormData } from '../components/onboarding';

const EMPTY_VEHICLE = {
  make: '',
  model: '',
  year: '',
  color: '',
  licensePlate: '',
};

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(user ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingFormData>({
    name: user?.name || '',
    gender: '',
    pronouns: '',
    city: '',
    major: '',
    year: '',
    phone: '',
    instagram: '',
    discord: '',
    role: '',
    vehicle: { ...EMPTY_VEHICLE },
  });

  // Auto-advance past sign-up step once user is authenticated
  useEffect(() => {
    if (user && step === 1) {
      setStep(2);
      if (user.name) {
        setFormData(prev => ({ ...prev, name: user.name }));
      }
    }
  }, [user, step]);

  // Redirect already-onboarded users to dashboard
  useEffect(() => {
    if (user?.isOnboarded) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const needsVehicleStep = formData.role === 'driver' || formData.role === 'both';
  const totalSteps = needsVehicleStep ? 7 : 6;

  const isStepValid = (): boolean => {
    switch (step) {
      case 2:
        return formData.name.trim().length > 0;
      case 6:
        return formData.role !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkipStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 2) setStep(step - 1);
  };

  const saveVehicle = async () => {
    const v = formData.vehicle;
    const hasVehicleData = v.make || v.model || v.year || v.color || v.licensePlate;
    if (!hasVehicleData || !user) return;

    await upsertVehicle({
      userId: user.id,
      make: v.make,
      model: v.model,
      year: v.year ? parseInt(v.year, 10) : 0,
      color: v.color,
      licensePlate: v.licensePlate,
      isDefault: true,
    });
  };

  const handleFinish = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      if (needsVehicleStep) {
        await saveVehicle();
      }

      await updateUser({
        name: formData.name,
        gender: formData.gender,
        pronouns: formData.pronouns,
        city: formData.city,
        major: formData.major,
        year: formData.year,
        socials: {
          instagram: formData.instagram,
          discord: formData.discord,
          phone: formData.phone,
        },
        role: formData.role as 'driver' | 'passenger' | 'both',
        isOnboarded: true,
      });
      navigate('/waiver');
    } catch {
      // Profile save failed
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = step === totalSteps;
  const showSkip = step === 4 || (step === 7 && needsVehicleStep);
  const isSignUpStep = step === 1;

  const stepProps = { formData, setFormData, email: user?.email };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-10" />

      <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-12 border border-white/50 relative z-10 transition-all duration-500">
        {/* Step indicator */}
        {!isSignUpStep && (
          <div className="flex items-center justify-center space-x-2 mb-10">
            {Array.from({ length: totalSteps - 1 }, (_, i) => i + 2).map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i <= step ? 'w-8 bg-uci-blue' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step content */}
        <div key={step} className="animate-fade-in-up">
          {step === 1 && <StepSignUp />}
          {step === 2 && <StepNameGender {...stepProps} />}
          {step === 3 && <StepCity {...stepProps} />}
          {step === 4 && <StepStudies {...stepProps} />}
          {step === 5 && <StepSocials {...stepProps} />}
          {step === 6 && <StepRole {...stepProps} />}
          {step === 7 && needsVehicleStep && <StepVehicle {...stepProps} />}
        </div>

        {/* Navigation (hidden on sign-up step) */}
        {!isSignUpStep && (
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={step === 2}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                step === 2 ? 'invisible' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft size={20} /> Back
            </button>

            <div className="flex items-center gap-3">
              {showSkip && (
                <button
                  onClick={handleSkipStep}
                  className="px-5 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className="bg-uci-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:translate-x-1"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" size={20} /> Saving...</>
                ) : (
                  <>{isLastStep ? 'Finish Profile' : 'Next Step'}{!isLastStep && <ChevronRight size={20} />}</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
