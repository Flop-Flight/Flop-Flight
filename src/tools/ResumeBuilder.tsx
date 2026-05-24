import { useState } from "react";
import { Download, User, Briefcase, GraduationCap } from "lucide-react";

export const ResumeBuilder = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        summary: "",
        experience: "",
        education: "",
    });

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-blue-600">
                       <User className="h-5 w-5" />
                       <h3 className="font-bold uppercase tracking-wider text-xs">Personal Info</h3>
                    </div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-xl border-slate-100 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-xl border-slate-100 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            className="w-full rounded-xl border-slate-100 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-blue-600">
                       <Briefcase className="h-5 w-5" />
                       <h3 className="font-bold uppercase tracking-wider text-xs">Work Experience</h3>
                    </div>
                    <textarea
                        placeholder="Describe your work history..."
                        className="h-32 w-full resize-none rounded-xl border-slate-100 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        onChange={(e) => setData({ ...data, experience: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-blue-600">
                       <GraduationCap className="h-5 w-5" />
                       <h3 className="font-bold uppercase tracking-wider text-xs">Education</h3>
                    </div>
                    <textarea
                        placeholder="Your school/university history..."
                        className="h-32 w-full resize-none rounded-xl border-slate-100 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                        onChange={(e) => setData({ ...data, education: e.target.value })}
                    />
                </div>
            </div>

            <div className="sticky top-24 h-fit rounded-[32px] bg-slate-900 p-10 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black">{data.name || "YOUR NAME"}</h2>
                        <div className="mt-2 flex space-x-4 text-xs opacity-60">
                            <span>{data.email || "email@example.com"}</span>
                            <span>{data.phone || "555-0199"}</span>
                        </div>
                    </div>
                    <button className="flex items-center justify-center rounded-xl bg-blue-600 p-3 hover:bg-blue-700">
                        <Download className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-10 space-y-8">
                    <section>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Experience</h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{data.experience || "Your work experience will appear here..."}</p>
                    </section>
                    <section>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Education</h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{data.education || "Your academic history will appear here..."}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
