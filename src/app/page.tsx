'use client';

import { fetchTaxRules } from "@/lib/api/taxRules";
import { useTaxStore } from "@/lib/store/taxStore";
import { TaxClass } from "@/lib/types/tax";
import { calculateTax } from "@/lib/utils/calculateTax";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { grossIncome, taxClass,  churchTax,  setGrossIncome, setTaxClass} = useTaxStore();

  const { data: taxRules, isPending, error } = useQuery({
    queryKey: ['tax-rules'],
    queryFn: fetchTaxRules,
    staleTime: 100 * 60 * 60
  })

  const result = taxRules && calculateTax({
    grossIncome,
    taxClass,
    churchTax,
  }, taxRules);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">Tax Advisor</h1>
      <p className="text-gray-600 mb-8">This is a simple tax estimation tool</p>

      <div className="flex flex-col gap-1 mb-5 w-80">
        <label className="mb-1 text-gray-700 font-medium">Gross Income</label>
        <input
          type="number"
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={grossIncome}
          onChange={(e) => setGrossIncome(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col items-center gap-2 mb-6 w-80">
        <label className="text-gray-700 font-medium">Tax Class:</label>
        <select
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex-1"
          value={taxClass}
          onChange={(e) => setTaxClass(e.target.value as TaxClass)}
        >
          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
          <option value="V">V</option>
        </select>
      </div>

      <p className="mt-6 bg-white shadow px-6 py-4 rounded text-gray-800 text-lg">
        <strong className="block mb-2">Current State:</strong>
        Income: <span className="font-semibold">€{grossIncome}</span><br />
        Tax Class: <span className="font-semibold">{taxClass}</span>
      </p>

      {isPending && <p>Loading tax rules...</p>}
      {error && <p>Error loading tax rules</p>}
      {result && (
        <div className="bg-white rounded-lg shadow-md px-8 py-6 mt-6 w-96">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Tax Breakdown</h2>
          <div className="mb-3">
            <p className="text-gray-700">Base Tax: <span className="font-mono font-semibold text-blue-700">€{result.baseTax.toFixed(2)}</span></p>
            <p className="text-gray-700">Solidarity Tax: <span className="font-mono font-semibold text-blue-700">€{result.solidarityTax.toFixed(2)}</span></p>
            <p className="text-gray-700">Church Tax: <span className="font-mono font-semibold text-blue-700">€{result.churchTax.toFixed(2)}</span></p>
          </div>

          <hr className="my-4 border-gray-200" />

          <p className="text-lg"><strong>Total Tax:</strong> <span className="font-mono font-bold text-red-700">€{result.totalTax.toFixed(2)}</span></p>
          <p className="text-lg"><strong>Net Income:</strong> <span className="font-mono font-bold text-green-700">€{result.netIncome.toFixed(2)}</span></p>
        </div>
      )}
    </div>

  );
}
