import { useState, useEffect } from "react";

export const LoanEmiCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(100000);
    const [interestRate, setInterestRate] = useState(10);
    const [tenure, setTenure] = useState(24); // in months
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        const r = interestRate / 12 / 100;
        const n = tenure;
        const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(emiValue || 0);
    }, [loanAmount, interestRate, tenure]);

    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Loan Amount ($)</label>
                        <input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Interest Rate (% p.a.)</label>
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Tenure (Months)</label>
                        <input
                            type="number"
                            value={tenure}
                            onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-6 rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">Monthly EMI</p>
                        <p className="mt-2 text-4xl font-extrabold">${emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div className="space-y-3 border-t border-white/20 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="opacity-70">Total Interest</span>
                            <span className="font-bold">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="opacity-70">Total Amount</span>
                            <span className="font-bold">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
