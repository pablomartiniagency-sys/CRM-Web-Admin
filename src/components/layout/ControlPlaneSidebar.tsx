'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Server, Users, ShieldAlert, ActivitySquare, TerminalSquare } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ControlPlaneSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Clients Map', href: '/clients', icon: Server },
    { name: 'Access Controls', href: '/access', icon: Users },
    { name: 'Audit Logs', href: '/audit', icon: ActivitySquare },
  ];

  return (
    <aside className="w-64 bg-slate-950 flex-col flex border-r border-slate-800 text-slate-300">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
        <TerminalSquare className="w-6 h-6 text-indigo-400 mr-3" />
        <span className="font-semibold text-white tracking-tight">KMS Control Plane</span>
      </div>
      <nav className="flex flex-1 flex-col mt-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2 px-4">
          <li className="text-xs font-semibold leading-6 text-slate-500 uppercase px-2 mb-2">Core Services</li>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    isActive ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300',
                      'h-5 w-5 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto px-4 pb-4">
          <div className="bg-slate-900 rounded-md p-4 ring-1 ring-white/10">
             <div className="flex items-center gap-2 mb-1">
               <ShieldAlert className="w-4 h-4 text-emerald-400" />
               <h4 className="text-xs font-semibold text-white">RLS Active</h4>
             </div>
             <p className="text-[10px] text-slate-400 leading-tight">Service calls are cryptographically bounded to your active session.</p>
          </div>
        </div>
      </nav>
    </aside>
  );
}
