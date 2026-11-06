import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category = 'men' }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const isCm = unit === 'cm';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-float border border-charcoal-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-serif font-bold text-charcoal-900">
              BAGODI Size & Fit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-900 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit switch */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <p className="text-xs text-charcoal-500">
            All garments tailored to Indian standard sizing. Measurements in {unit}.
          </p>
          <div className="flex items-center border border-charcoal-200 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 rounded transition ${
                unit === 'inches'
                  ? 'bg-charcoal text-white font-medium'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded transition ${
                unit === 'cm'
                  ? 'bg-charcoal text-white font-medium'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-warmWhite text-charcoal-800 border-b border-charcoal-200">
                <th className="p-3 font-semibold">Standard Size</th>
                <th className="p-3 font-semibold">Brand Fit (Chest)</th>
                <th className="p-3 font-semibold">Waist</th>
                <th className="p-3 font-semibold">Shoulder</th>
                <th className="p-3 font-semibold">Garment Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-600 font-sans">
              <tr>
                <td className="p-3 font-bold text-charcoal-900">XS</td>
                <td className="p-3">{isCm ? '91 - 94 cm' : '36 - 37"'}</td>
                <td className="p-3">{isCm ? '76 - 79 cm' : '30 - 31"'}</td>
                <td className="p-3">{isCm ? '43 cm' : '17.0"'}</td>
                <td className="p-3">{isCm ? '71 cm' : '28"'}</td>
              </tr>
              <tr className="bg-charcoal-50/50">
                <td className="p-3 font-bold text-charcoal-900">S (Small)</td>
                <td className="p-3">{isCm ? '96 - 99 cm' : '38 - 39"'}</td>
                <td className="p-3">{isCm ? '81 - 84 cm' : '32 - 33"'}</td>
                <td className="p-3">{isCm ? '44.5 cm' : '17.5"'}</td>
                <td className="p-3">{isCm ? '73.5 cm' : '29"'}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-charcoal-900">M (Medium)</td>
                <td className="p-3">{isCm ? '101 - 104 cm' : '40 - 41"'}</td>
                <td className="p-3">{isCm ? '86 - 89 cm' : '34 - 35"'}</td>
                <td className="p-3">{isCm ? '46 cm' : '18.0"'}</td>
                <td className="p-3">{isCm ? '75 cm' : '29.5"'}</td>
              </tr>
              <tr className="bg-charcoal-50/50">
                <td className="p-3 font-bold text-charcoal-900">L (Large)</td>
                <td className="p-3">{isCm ? '106 - 110 cm' : '42 - 43"'}</td>
                <td className="p-3">{isCm ? '91 - 95 cm' : '36 - 37"'}</td>
                <td className="p-3">{isCm ? '47.5 cm' : '18.5"'}</td>
                <td className="p-3">{isCm ? '76.5 cm' : '30"'}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-charcoal-900">XL (Extra Large)</td>
                <td className="p-3">{isCm ? '112 - 116 cm' : '44 - 45"'}</td>
                <td className="p-3">{isCm ? '96 - 101 cm' : '38 - 39"'}</td>
                <td className="p-3">{isCm ? '49 cm' : '19.2"'}</td>
                <td className="p-3">{isCm ? '78 cm' : '30.5"'}</td>
              </tr>
              <tr className="bg-charcoal-50/50">
                <td className="p-3 font-bold text-charcoal-900">XXL (Double XL)</td>
                <td className="p-3">{isCm ? '118 - 122 cm' : '46 - 48"'}</td>
                <td className="p-3">{isCm ? '103 - 108 cm' : '40 - 42"'}</td>
                <td className="p-3">{isCm ? '51 cm' : '20.0"'}</td>
                <td className="p-3">{isCm ? '80 cm' : '31.5"'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-5 p-3.5 bg-gold-light/40 rounded-lg border border-gold/20 text-xs text-charcoal-700 space-y-1">
          <p className="font-semibold text-charcoal-900">How to measure yourself accurately:</p>
          <p>• <strong>Chest:</strong> Measure around the fullest part of your chest, keeping tape comfortably level under arms.</p>
          <p>• <strong>Waist:</strong> Measure around natural waistline where trouser waistbands comfortably rest.</p>
          <p>• <strong>Note:</strong> Free Size sarees are 5.5m - 6.3m length with matching unstitched blouse fabric.</p>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="btn-charcoal text-xs py-2 px-5 rounded-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

