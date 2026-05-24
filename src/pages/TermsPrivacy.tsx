import { ShieldCheck } from "lucide-react";

export const TermsPrivacy = () => {
    return (
        <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Legal & Privacy</h1>
                    <p className="text-slate-500 max-w-lg italic">We take your digital safety seriously. Here is how we protect your rights and data on Luminix.</p>
                </div>

                <section className="space-y-4 prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Privacy Policy</h2>
                    <p className="text-slate-600">
                        Luminix is designed with privacy-first principles. Most of our tools operate entirely within your browser (client-side). This means your data—whether it's a password you generated, a piece of text you converted, or a calculation you performed—never leaves your computer.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600">
                        <li><strong>No Data Storage:</strong> We do not store User Generated Content (UGC) on our servers. Your security is our priority.</li>
                        <li><strong>100% Free:</strong> Luminix will never charge you for basic utility tools. There are no "Pro" plans or hidden data-sharing costs.</li>
                        <li><strong>Cookies:</strong> We use minimal cookies only for essential site functionality and anonymized analytics.</li>
                    </ul>
                </section>

                <section className="space-y-4 prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Terms & Intellectual Property</h2>
                    <p className="text-slate-600">
                        Luminix is a registered trademark. The platform architecture, design, and original source code are protected under international copyright laws. Unauthorized scraping or cloning of the platform is strictly prohibited.
                    </p>
                    <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600 italic border border-slate-200">
                        "The tools provided on this platform are for general informational and utility purposes. While we strive for 100% accuracy, Luminix is not responsible for any errors, financial losses, or data mishaps resulting from the use of our calculators or generators."
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600">
                        <li><strong>Intellectual Property:</strong> Users retain ownership of any content they create using our tools. However, the Luminix interface, design, and code are protected by copyright.</li>
                        <li><strong>Prohibited Use:</strong> You may not use Luminix for any illegal activities, including but not limited to generating harmful code or violating privacy rights.</li>
                    </ul>
                </section>

                <div className="pt-10 flex justify-center">
                    <div className="text-xs font-black text-slate-300 tracking-[0.5em] uppercase">
                        End of Document
                    </div>
                </div>
            </div>
        </div>
    );
};
