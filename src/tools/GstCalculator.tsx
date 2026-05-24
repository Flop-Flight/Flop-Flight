import { useState, useEffect } from "react";

export const GstCalculator = () => {
  const [amount, setAmount] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [results, setResults] = useState({
    gstAmount: 0,
    totalAmount: 0,
    baseAmount: 0,
    cgst: 0,
    sgst: 0,
  });

  useEffect(() => {
    let gstAmount = 0;
    let totalAmount = 0;
    let baseAmount = 0;

    if (isInclusive) {
      totalAmount = amount;
      gstAmount = amount - (amount * (100 / (100 + gstRate)));
      baseAmount = totalAmount - gstAmount;
    } else {
      baseAmount = amount;
      gstAmount = (amount * gstRate) / 100;
      totalAmount = amount + gstAmount;
    }

    setResults({
      gstAmount,
      totalAmount,
      baseAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
    });
  }, [amount, gstRate, isInclusive]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700">Amount</label>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="mt-2 block w-full rounded-xl border-0 bg-slate-50 py-3 px-4 text-slate-900 ring-1 ring-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 sm:text-lg"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">GST Rate (%)</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                    gstRate === rate ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <label className="flex cursor-pointer items-center space-x-2">
               <input
                 type="radio"
                 checked={!isInclusive}
                 onChange={() => setIsInclusive(false)}
                 className="text-blue-600 focus:ring-blue-600"
               />
               <span className="text-sm font-medium text-slate-700">Exclusive of GST</span>
             </label>
             <label className="flex cursor-pointer items-center space-x-2">
               <input
                 type="radio"
                 checked={isInclusive}
                 onChange={() => setIsInclusive(true)}
                 className="text-blue-600 focus:ring-blue-600"
               />
               <span className="text-sm font-medium text-slate-700">Inclusive of GST</span>
             </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg shadow-blue-200">
            <p className="text-sm font-medium opacity-80">Total Amount</p>
            <p className="mt-1 text-4xl font-bold">${results.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-medium text-slate-500">Base Amount</p>
              <p className="mt-1 text-lg font-bold text-slate-900">${results.baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-medium text-slate-500">Total GST</p>
              <p className="mt-1 text-lg font-bold text-blue-600">${results.gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-sm text-slate-600">CGST ({(gstRate/2).toFixed(1)}%)</span>
              <span className="text-sm font-bold text-slate-900">${results.cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-sm text-slate-600">SGST ({(gstRate/2).toFixed(1)}%)</span>
              <span className="text-sm font-bold text-slate-900">${results.sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
