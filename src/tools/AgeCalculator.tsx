import { useState, useEffect } from "react";

export const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState("");
    const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

    useEffect(() => {
        if (!birthDate) {
            setAge(null);
            return;
        }

        const today = new Date();
        const birth = new Date(birthDate);

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        setAge({ years, months, days });
    }, [birthDate]);

    return (
        <div className="mx-auto max-w-xl space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <label className="block text-sm font-medium text-slate-700">Select Date of Birth</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white focus:ring-2 focus:ring-blue-600 sm:text-lg"
                />
            </div>

            {age && (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Years", value: age.years },
                        { label: "Months", value: age.months },
                        { label: "Days", value: age.days },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center rounded-2xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-200">
                            <span className="text-3xl font-bold">{item.value}</span>
                            <span className="text-xs font-medium uppercase tracking-wider opacity-80">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {!age && birthDate && (
                <p className="text-center text-sm text-slate-500">Wait, are you from the future? Select a valid past date.</p>
            )}
        </div>
    );
};
