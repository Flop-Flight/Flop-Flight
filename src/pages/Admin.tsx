import { motion } from "motion/react";
import { Users, Activity, MousePointerClick, TrendingUp } from "lucide-react";

export const Admin = () => {
  const stats = [
    { label: "Total Users", value: "14,209", change: "+12%", icon: Users },
    { label: "Active Sessions", value: "342", change: "+5%", icon: Activity },
    { label: "Tools Used Today", value: "8,921", change: "+18%", icon: MousePointerClick },
    { label: "Platform Growth", value: "24%", change: "+2%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back, Owner. Here is what's happening today.</p>
          </div>
          <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
            Secret Route Active
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          <div className="mt-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-sm text-slate-700">User generated a <span className="font-semibold text-slate-900">QR Code</span></p>
                </div>
                <span className="text-xs text-slate-400">{i * 2} mins ago</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
