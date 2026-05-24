import { useState } from "react";
import { Shield, Copy, Check } from "lucide-react";

export const PrivacyPolicyGen = () => {
    const [companyName, setCompanyName] = useState("");
    const [websiteName, setWebsiteName] = useState("");
    const [email, setEmail] = useState("");
    const [copied, setCopied] = useState(false);

    const policy = `Privacy Policy for ${websiteName || "[Website Name]"}

At ${companyName || "[Company Name]"}, accessible from ${websiteName || "[Website URL]"}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${companyName || "[Company Name]"} and how we use it.

If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${email || "[Email Address]"}.

Log Files
${companyName || "[Company Name]"} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics.

Privacy Policies
You may consult this list to find the Privacy Policy for each of the advertising partners of ${companyName || "[Company Name]"}.

Third Party Privacy Policies
${companyName || "[Company Name]"}'s Privacy Policy does not apply to other advertisers or websites.

Consent
By using our website, you hereby consent to our Privacy Policy and agree to its terms.`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(policy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Website URL</label>
                        <input
                            type="text"
                            value={websiteName}
                            onChange={(e) => setWebsiteName(e.target.value)}
                            className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Contact Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 rounded-2xl bg-slate-900 p-8 text-slate-300">
                <div className="flex items-center justify-between">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>Copy Policy</span>
                    </button>
                </div>
                <div className="h-96 overflow-auto font-mono text-xs leading-relaxed">
                    {policy}
                </div>
            </div>
        </div>
    );
};
