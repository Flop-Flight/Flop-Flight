import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature";

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  temperature: {
    celsius: "c",
    fahrenheit: "f",
    kelvin: "k",
  },
};

export const UnitConverter = () => {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>("meters");
  const [toUnit, setToUnit] = useState<string>("kilometers");
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    if (category === "temperature") {
      let temp = value;
      // Convert to Celsius first
      if (fromUnit === "fahrenheit") temp = (value - 32) * (5 / 9);
      if (fromUnit === "kelvin") temp = value - 273.15;

      // Convert from Celsius to target
      let final = temp;
      if (toUnit === "fahrenheit") final = temp * (9 / 5) + 32;
      if (toUnit === "kelvin") final = temp + 273.15;
      setResult(final);
    } else {
      const categoryUnits = units[category as keyof typeof units] as any;
      const fromRate = categoryUnits[fromUnit];
      const toRate = categoryUnits[toUnit];
      const baseValue = value / (fromRate as number);
      setResult(baseValue * (toRate as number));
    }
  }, [value, fromUnit, toUnit, category]);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const firstUnit = Object.keys(units[cat])[0];
    const secondUnit = Object.keys(units[cat])[1];
    setFromUnit(firstUnit);
    setToUnit(secondUnit);
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="flex justify-center space-x-2">
        {(["length", "weight", "temperature"] as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              category === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">From</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white focus:ring-2 focus:ring-blue-600"
            >
              {Object.keys(units[category]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">To</label>
            <div className="flex h-12 items-center rounded-xl bg-blue-50 px-4 font-bold text-blue-700">
               {result.toLocaleString(undefined, { maximumFractionDigits: 5 })}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white focus:ring-2 focus:ring-blue-600"
            >
              {Object.keys(units[category]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
           <button 
             onClick={() => {
                const temp = fromUnit;
                setFromUnit(toUnit);
                setToUnit(temp);
                setValue(result);
             }}
             className="rounded-full bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
           >
              <ArrowLeftRight className="h-5 w-5" />
           </button>
        </div>
      </div>
    </div>
  );
};
