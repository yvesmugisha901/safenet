// components/emergency/ReportEmergencyForm.tsx
import { useState } from 'react';
import { emergencyAPI } from '../../services/api';
import { EmergencyType } from '../../types';

const EMERGENCY_TYPES: { value: EmergencyType; label: string; icon: string }[] = [
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'fire', label: 'Fire', icon: '🔥' },
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'crime', label: 'Crime', icon: '🚨' },
  { value: 'other', label: 'Other', icon: '⚠️' },
];

interface Props { onSuccess?: () => void; }

export default function ReportEmergencyForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'medical' as EmergencyType,
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get current GPS location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setForm(f => ({
        ...f,
        latitude: String(pos.coords.latitude),
        longitude: String(pos.coords.longitude),
      })),
      () => setError('Could not get your location. Please enter manually.')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await emergencyAPI.report({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-white text-xl font-bold">Emergency Reported!</h3>
        <p className="text-gray-400 mt-2">Nearby resources have been alerted automatically.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
        >
          Report Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <h2 className="text-white text-xl font-bold">🚨 Report Emergency</h2>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Emergency Type */}
      <div>
        <label className="text-gray-400 text-sm block mb-2">Emergency Type</label>
        <div className="grid grid-cols-3 gap-2">
          {EMERGENCY_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, type: t.value }))}
              className={`p-3 rounded-lg border text-sm font-medium transition-all
                ${form.type === t.value
                  ? 'border-red-500 bg-red-900/30 text-white'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'}`}
            >
              <span className="block text-xl mb-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-gray-400 text-sm block mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                     focus:outline-none focus:border-red-500"
          placeholder="Brief description of the emergency"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-gray-400 text-sm block mb-1">Details</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                     focus:outline-none focus:border-red-500 resize-none"
          placeholder="Provide more details..."
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-gray-400 text-sm block mb-2">Location</label>
        <button
          type="button"
          onClick={getLocation}
          className="mb-3 w-full bg-gray-800 hover:bg-gray-700 border border-gray-700
                     text-gray-300 rounded-lg px-4 py-2 text-sm flex items-center justify-center gap-2"
        >
          <span>📍</span> Use My Current Location
        </button>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            value={form.latitude}
            onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                       focus:outline-none focus:border-red-500"
            placeholder="Latitude"
          />
          <input
            required
            value={form.longitude}
            onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                       focus:outline-none focus:border-red-500"
            placeholder="Longitude"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg
                   transition-colors disabled:opacity-50 text-lg"
      >
        {loading ? 'Sending Alert...' : '🚨 Report Emergency'}
      </button>
    </form>
  );
}
