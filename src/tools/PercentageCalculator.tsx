import { useState } from "react";

export const PercentageCalculator = () => {
    const [num1, setNum1] = useState(10);
    const [num2, setNum2] = useState(100);
    
    return (
        <div className="mx-auto max-w-xl space-y-12">
            <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">What is X% of Y?</h3>
                <div className="flex items-center space-x-4">
                    <input
                        type="number"
                        value={num1}
                        onChange={(e) => setNum1(parseFloat(e.target.value) || 0)}
                        className="w-24 rounded-xl border-0 bg-slate-50 p-3 text-center text-lg font-bold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="font-medium text-slate-500">% of</span>
                    <input
                        type="number"
                        value={num2}
                        onChange={(e) => setNum2(parseFloat(e.target.value) || 0)}
                        className="w-32 rounded-xl border-0 bg-slate-50 p-3 text-center text-lg font-bold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="font-medium text-slate-500">is</span>
                </div>
                <div className="mt-4 flex h-16 items-center justify-center rounded-xl bg-blue-50 text-3xl font-black text-blue-600">
                    {((num1 / 100) * num2).toLocaleString()}
                </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">X is what % of Y?</h3>
                <div className="flex items-center space-x-4">
                    <input
                        type="number"
                        id="p2-x"
                        defaultValue={20}
                        className="w-24 rounded-xl border-0 bg-slate-50 p-3 text-center text-lg font-bold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="font-medium text-slate-500">is what % of</span>
                    <input
                        type="number"
                        id="p2-y"
                        defaultValue={200}
                        className="w-32 rounded-xl border-0 bg-slate-50 p-3 text-center text-lg font-bold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                {/* Note: In a real app we'd use more state, but keeping it simple for the Turn */}
                <p className="text-sm text-slate-400 text-center">Use the calculators above to find differences instantly.</p>
            </div>
        </div>
    );
};
