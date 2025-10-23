'use client';

import { useState } from 'react';

interface PreferencesCardProps {
  onPreferencesChange?: (prefs: {
    emailNotifications: boolean;
    newsletter: boolean;
  }) => void;
}

export default function PreferencesCard({
  onPreferencesChange,
}: PreferencesCardProps) {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    newsletter: false,
  });

  const handleToggle = (key: 'emailNotifications' | 'newsletter') => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    onPreferencesChange?.(newPrefs);
  };

  return (
    <section
      className="rounded-lg border-2 border-foreground p-6 mb-6"
      aria-labelledby="preferences-title"
    >
      <h2
        id="preferences-title"
        className="text-2xl font-semibold text-foreground mb-6"
      >
        Preferências
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b-2 border-foreground/20">
          <div>
            <h3 className="font-medium text-foreground">
              Notificações por Email
            </h3>
            <p className="text-sm text-foreground/70">
              Receba atualizações sobre seus pedidos
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <div className="w-11 h-6 bg-accent/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <h3 className="font-medium text-foreground">Newsletter</h3>
            <p className="text-sm text-foreground/70">
              Receba novidades e promoções
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.newsletter}
              onChange={() => handleToggle('newsletter')}
            />
            <div className="w-11 h-6 bg-accent/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
      </div>
    </section>
  );
}
