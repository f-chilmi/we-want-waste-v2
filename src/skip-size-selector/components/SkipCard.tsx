import { Calendar, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import React from "react";

function SkipCard({
  skip,
  calculateTotalPrice,
}: {
  skip: {
    id: number;
    size: number;
    hire_period_days: number;
    price_before_vat: number;
    vat: number;
    allowed_on_road: boolean;
    allows_heavy_waste: boolean;
  };
  calculateTotalPrice: (priceBeforeVat: any, vatRate: any) => number;
}) {
  const totalPrice = calculateTotalPrice(skip.price_before_vat, skip.vat);
  const getSkipColor = (size) => {
    const colors = {
      4: "bg-green-400", // Smallest - Light green
      5: "bg-green-500", // Small - Green
      6: "bg-yellow-500", // Medium small - Yellow
      8: "bg-orange-500", // Medium - Orange
      10: "bg-red-500", // Large - Red
      12: "bg-red-700", // Largest - Dark red
    };
    return colors[size] || "bg-gray-500";
  };
  return (
    <div
      key={skip.id}
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 p-3 transition-all duration-200 hover:shadow-lg group cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-8 h-8 ${getSkipColor(
            skip.size
          )} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
        >
          <span className="text-white font-bold text-xs">{skip.size}</span>
        </div>
        <div className="flex gap-0.5 flex-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < skip.size / 2 ? getSkipColor(skip.size) : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            skip.size <= 5
              ? "bg-green-50 text-green-700"
              : skip.size <= 8
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {skip.size <= 5 ? "S" : skip.size <= 8 ? "M" : "L"}
        </span>
      </div>

      <div className="mb-2">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">
          {skip.size} Yard Skip
        </h3>
        <div className="text-2xl font-black text-gray-900 mt-1">
          £{totalPrice}
        </div>
        <div className="text-xs text-gray-500 -mt-1">Inc. VAT</div>
      </div>

      <div className="flex items-center text-gray-500 text-xs mb-2">
        <Calendar className="w-3 h-3 mr-1" />
        {skip.hire_period_days} days hire
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {skip.allowed_on_road ? (
          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Road Legal
          </span>
        ) : (
          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Private Only
          </span>
        )}

        {skip.allows_heavy_waste && (
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            Heavy OK
          </span>
        )}
      </div>

      <button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center group">
        Select
        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

export default SkipCard;
