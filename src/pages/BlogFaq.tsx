import { motion } from "motion/react";
import { MessageSquare, HelpCircle, BookOpen } from "lucide-react";

export const BlogFaq = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="mx-auto max-w-4xl space-y-12">
                
                {/* FAQ Section */}
                <section className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <HelpCircle className="h-8 w-8 text-blue-600" />
                        <h2 className="text-3xl font-black text-slate-900 italic">Frequently Asked Questions</h2>
                    </div>
                    <div className="grid gap-4">
                        {[
                            { q: "Is Luminix free to use?", a: "Yes! Luminix is a completely free utility platform. We aim to help developers and creators without any cost. No subscription, no paywalls, no hidden fees—ever." },
                            { q: "Why can't I sign in with Google?", a: "Common causes: 1. Pop-ups are blocked (enable them for this site). 2. Third-party cookies are disabled. 3. Network firewalls or VPNs might block Firebase Auth. If you see an 'unauthorized domain' error, the developer needs to add the current URL to the Firebase console." },
                            { q: "Is my data safe?", a: "Absolute Privacy: 95% of our tools run entirely client-side. This means your data never reaches our servers; it is processed locally in your browser and destroyed as soon as you close the tab." },
                            { q: "How many people use Luminix?", a: "We are proud to support a growing community of over 15,000 daily active users who trust us for their sensitive conversion and calculation needs." },
                            { q: "Can I request a new tool?", a: "Absolutely. You can reach out to us directly at aryantiwari56541@gmail.com for custom tool requests, feature suggestions, or business enquiries." }
                        ].map((faq, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                            >
                                <h3 className="font-bold text-slate-900">{faq.q}</h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Blog Section */}
                <section className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <h2 className="text-3xl font-black text-slate-900 italic">Latest from Blog</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Building Luminix: The 30 Tool Challenge", date: "May 15, 2026", desc: "How we built a massive utility platform in record time." },
                            { title: "The Future of Web Utilities", date: "May 12, 2026", desc: "Why decentralized tools are the next big thing for developers." }
                        ].map((post, i) => (
                            <div key={i} className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:ring-blue-600">
                                <span className="text-xs font-bold text-blue-600">{post.date}</span>
                                <h3 className="mt-2 font-bold text-slate-900 group-hover:text-blue-600">{post.title}</h3>
                                <p className="mt-2 text-sm text-slate-500">{post.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Comments / Feedback Section */}
                <section className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                        <h2 className="text-3xl font-black text-slate-900 italic">User Feedback</h2>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-8 text-white">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center font-bold">A</div>
                                <div>
                                    <h4 className="font-bold">Amita G.</h4>
                                    <p className="mt-1 text-sm text-slate-400 italic">"The QR generator saved me hours of work on my project. Love the UI!"</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 border-t border-slate-800 pt-6">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center font-bold">R</div>
                                <div>
                                    <h4 className="font-bold">Rahul S.</h4>
                                    <p className="mt-1 text-sm text-slate-400 italic">"The Pomodoro timer is my new go-to for study sessions. Highly recommend."</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center space-x-2 rounded-xl bg-slate-800 p-2">
                             <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent px-4 py-2 text-sm outline-none" />
                             <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold hover:bg-blue-700">Post</button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};
