import React from 'react';
import { useStore } from '../../context/useStore';
import { X, Ruler, Sparkles, Check } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();

  if (!isSizeGuideOpen) return null;

  const sizeTable = [
    {
      size: '50',
      heightFt: '4\'11" – 5\'1"',
      lengthInches: '50" (127 cm)',
      bustInches: '38" – 40"',
      sleeveInches: '26"',
    },
    {
      size: '52',
      heightFt: '5\'1" – 5\'3"',
      lengthInches: '52" (132 cm)',
      bustInches: '40" – 42"',
      sleeveInches: '27"',
    },
    {
      size: '54',
      heightFt: '5\'3" – 5\'5"',
      lengthInches: '54" (137 cm)',
      bustInches: '42" – 44"',
      sleeveInches: '28"',
    },
    {
      size: '56',
      heightFt: '5\'5" – 5\'7"',
      lengthInches: '56" (142 cm)',
      bustInches: '44" – 46"',
      sleeveInches: '28.5"',
    },
    {
      size: '58',
      heightFt: '5\'7" – 5\'9"',
      lengthInches: '58" (147 cm)',
      bustInches: '46" – 48"',
      sleeveInches: '29"',
    },
    {
      size: '60',
      heightFt: '5\'9" – 6\'0"+',
      lengthInches: '60" (152 cm)',
      bustInches: '48" – 50"',
      sleeveInches: '30"',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#171614]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden bg-[#F8F6F1] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-[#171614]/10 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-[#171614]/10 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-[#B69A70]" />
              <h2 className="font-editorial text-2xl font-normal uppercase tracking-wider text-[#171614]">
                Atelier Sizing & Fitting Guide
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1 text-[#171614]/60 hover:text-[#171614] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#171614]/70 font-light leading-relaxed mb-6">
            Our luxury abayas are designed in traditional modest fluid cuts with generous ease. Abaya sizes correspond directly to garment length in inches (from the highest point of the shoulder down to the hem).
          </p>

          {/* Size Chart Table */}
          <div className="overflow-x-auto border border-[#171614]/10 bg-white mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171614] text-[#F8F6F1] uppercase text-[10px] tracking-wider font-medium">
                <tr>
                  <th className="py-3 px-4">Abaya Size</th>
                  <th className="py-3 px-4">Recommended Height</th>
                  <th className="py-3 px-4">Garment Length</th>
                  <th className="py-3 px-4">Approx. Bust</th>
                  <th className="py-3 px-4">Sleeve Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171614]/10">
                {sizeTable.map((row) => (
                  <tr key={row.size} className="hover:bg-[#E8DFD2]/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#171614]">
                      Size {row.size}"
                    </td>
                    <td className="py-3 px-4 text-[#171614]/80">{row.heightFt}</td>
                    <td className="py-3 px-4 text-[#171614]/80">{row.lengthInches}</td>
                    <td className="py-3 px-4 text-[#171614]/80">{row.bustInches}</td>
                    <td className="py-3 px-4 text-[#171614]/80">{row.sleeveInches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#E8DFD2]/30 p-4 border border-[#171614]/5 text-xs text-[#171614]/80">
            <div className="space-y-1.5">
              <h4 className="font-medium text-[#171614] flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>How to Choose Your Length</span>
              </h4>
              <p className="font-light leading-relaxed">
                Measure with a measuring tape from the center of your collarbone straight down to your ankle bone. If you plan to wear luxury heels or wedges, we advise selecting one size longer.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-medium text-[#171614] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>Bespoke Length Tailoring</span>
              </h4>
              <p className="font-light leading-relaxed">
                Need a specific length (e.g. 53" or 57")? Leave a note at checkout or contact our atelier concierge via WhatsApp for complimentary bespoke hem adjustments before dispatch.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="bg-[#171614] text-[#F8F6F1] px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#B69A70] transition-colors font-medium"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
