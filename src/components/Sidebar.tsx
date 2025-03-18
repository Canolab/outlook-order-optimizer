
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Mail, 
  BarChart, 
  Settings, 
  FileText,
  HelpCircle,
  Filter,
  Send
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-border h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-brand-800 flex items-center gap-2">
          <Mail className="h-6 w-6 text-brand-600" />
          <span>Outlook Optimizer</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
          end
        >
          <Mail className="h-5 w-5" />
          <span>Inbox</span>
        </NavLink>
        
        <NavLink 
          to="/sent-emails" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
        >
          <Send className="h-5 w-5" />
          <span>Sent Emails</span>
        </NavLink>
        
        <NavLink 
          to="/categories" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
        >
          <Filter className="h-5 w-5" />
          <span>Categories</span>
        </NavLink>
        
        <NavLink 
          to="/orders" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
        >
          <FileText className="h-5 w-5" />
          <span>Orders</span>
        </NavLink>
        
        <NavLink 
          to="/analytics" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
        >
          <BarChart className="h-5 w-5" />
          <span>Analytics</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-border">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
        
        <NavLink 
          to="/help" 
          className={({ isActive }) => 
            isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
          }
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help</span>
        </NavLink>
      </div>
    </aside>
  );
};
