'use client'

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Cta = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLoading(true);
    router.push("/companion/newCompanion");
  };

  return (
    <section className="cta-section">
      <div className="cta-badge">Start learning your way.</div>
      <h2 className="text-3xl font-bold">
        Build and Personalize Your Learning Companion
      </h2>
      <p className="text-xs">
        Pick a subject that interests you, customize your study plan, and track your
        progress with smart, interactive tools designed to help you stay focused and
        achieve your goals faster.
      </p>
      <Image
        src="/images/cta.svg"
        alt="cta"
        height={232}
        width={362}
      />

      <button 
        className="btn-primary flex items-center justify-center gap-2"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
            <span>Build a New Companion</span>
          </>
        )}
      </button>
    </section>
  );
};

export default Cta;
