import { useState, useEffect } from "react";
import { Banknote, RefreshCw } from "lucide-react";

export const CurrencyConverter = () => {
    const [amount, setAmount] = useState(100);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EUR");
    const [result, setResult] = useState(0);

    const rates: Record<string, number> = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151,
        INR: 83.3,
        CAD: 1.35,
        AUD: 1.52,
        AED: 3.67,
        CNY: 7.23,
        CHF: 0.91,
        BRL: 5.12,
        KRW: 1362,
        SGD: 1.36,
        MXN: 16.90,
        ZAR: 18.70,
        RUB: 92.50,
        TRY: 32.20,
    };

    useEffect(() => {
        const rateFrom = rates[from] || 1;
        const rateTo = rates[to] || 1;
        setResult((amount / rateFrom) * rateTo);
    }, [amount, from, to]);

    return (
        <div className="mx-auto max-w-xl space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
                <div>
                    <label className="text-sm font-medium text-slate-700">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">From</label>
                        <select
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        >
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">To</label>
                        <select
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        >
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button 
                       onClick={() => { const t = from; setFrom(to); setTo(t); }}
                       className="rounded-full bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
                    >
                        <RefreshCw className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-3xl bg-blue-600 p-10 text-white shadow-xl shadow-blue-200">
                <Banknote className="mb-4 h-8 w-8 opacity-60" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Result</p>
                <div className="mt-2 text-5xl font-black">
                    {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
                </div>
                <p className="mt-4 text-xs opacity-70 italic text-center">Using fixed sample exchange rates for demonstration purposes.</p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-400">
                <Banknote className="h-3 w-3" />
                <span>Zero Transaction Fees | 100% Free Utility</span>
            </div>
        </div>
    );
};
