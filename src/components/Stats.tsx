import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { STATS } from '../constants';

export default function Stats() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-dark-card border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-5xl lg:text-7xl font-display font-extrabold text-white">
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} />
                ) : (
                  '0'
                )}
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
