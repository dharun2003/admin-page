import React, { useState, useMemo } from 'react';
import { MOCK_SUBSCRIPTIONS } from '../constants';
import { Subscription } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { Sidebar } from './Sidebar';
import { MenuIcon } from './icons/MenuIcon';
import { PowerIcon } from './icons/PowerIcon';
import { SortIcon } from './icons/SortIcon';

interface SubscriptionsPageProps {
  onLogout: () => void;
  navigateTo: (page: string) => void;
  currentPage: string;
}

const getPlanChipColor = (plan: Subscription['subscriptionPlan']) => {
  switch (plan) {
    case 'Basic':
      return 'bg-blue-100 text-blue-800';
    case 'Pro':
      return 'bg-purple-100 text-purple-800';
    case 'Enterprise':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DateTimeCell: React.FC<{ dateString: string }> = ({ dateString }) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div>
            <span>{`${year}-${month}-${day}`}</span>
            <span className="block text-xs text-gray-500">{timePart}</span>
        </div>
    );
};

const UploadsCell: React.FC<{ used: number; total: number }> = ({ used, total }) => {
    const remaining = total - used;
    const percentage = (used / total) * 100;
  
    let progressBarColor = 'bg-green-500';
    if (percentage > 90) {
      progressBarColor = 'bg-red-500';
    } else if (percentage > 70) {
      progressBarColor = 'bg-yellow-500';
    }
  
    return (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{remaining.toLocaleString()} Left</span>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1.5">
          <div
            className={`h-2 rounded-full ${progressBarColor}`}
            style={{ width: `${100 - percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 mt-1">{used.toLocaleString()} / {total.toLocaleString()} Used</span>
      </div>
    );
};

type SortableSubscriptionKeys = keyof Subscription;

const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({ onLogout, navigateTo, currentPage }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortableSubscriptionKeys; direction: 'ascending' | 'descending' } | null>(null);
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleToggleActivation = (id: number) => {
    setSubscriptions(prevSubs =>
      prevSubs.map(sub =>
        sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      // Plan filter
      if (planFilter !== 'All' && sub.subscriptionPlan !== planFilter) {
        return false;
      }

      // Status filter
      const subStatus = sub.isActive ? 'Active' : 'Inactive';
      if (statusFilter !== 'All' && subStatus !== statusFilter) {
        return false;
      }
      
      // Search query filter
      const query = searchQuery.toLowerCase();
      if (!query) {
        return true;
      }

      const status = sub.isActive ? 'active' : 'inactive';
      return sub.username.toLowerCase().includes(query) ||
        sub.companyName.toLowerCase().includes(query) ||
        sub.subscriptionPlan.toLowerCase().includes(query) ||
        status.includes(query);
    });
  }, [subscriptions, searchQuery, planFilter, statusFilter]);


  const sortedSubscriptions = useMemo(() => {
    let sortableItems = [...filteredSubscriptions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparison = 0;
        if (sortConfig.key === 'uploadsUsed') {
            const remainingA = a.totalUploads - a.uploadsUsed;
            const remainingB = b.totalUploads - b.uploadsUsed;
            if (remainingA < remainingB) comparison = -1;
            if (remainingA > remainingB) comparison = 1;
        } else {
            if (aValue < bValue) comparison = -1;
            if (aValue > bValue) comparison = 1;
        }
        
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [filteredSubscriptions, sortConfig]);

  const requestSort = (key: SortableSubscriptionKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortDirection = (key: SortableSubscriptionKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
        return null;
    }
    return sortConfig.direction;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} navigateTo={navigateTo} currentPage={currentPage} />
      <div className="lg:pl-64">
        <header className="flex justify-between items-center p-4 sm:p-6 lg:p-8 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-900"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                aria-label="Search admin data"
              />
            </div>
            <div className="flex items-center gap-4">
               <div>
                  <label htmlFor="planFilter" className="sr-only">Filter by Plan</label>
                  <select 
                      id="planFilter"
                      value={planFilter}
                      onChange={(e) => setPlanFilter(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                      <option value="All">All Plans</option>
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="statusFilter" className="sr-only">Filter by Status</label>
                  <select
                      id="statusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                  </select>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                        <button onClick={() => requestSort('username')} className="flex items-center gap-1.5 group">
                            Username
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('username')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                        <button onClick={() => requestSort('companyName')} className="flex items-center gap-1.5 group">
                            Company Name
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('companyName')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                        <button onClick={() => requestSort('registrationDate')} className="flex items-center gap-1.5 group">
                            Registration Date
                             <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('registrationDate')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                        <button onClick={() => requestSort('subscriptionPlan')} className="flex items-center gap-1.5 group">
                            Subscription Plan
                             <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('subscriptionPlan')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                         <button onClick={() => requestSort('isActive')} className="flex items-center gap-1.5 group">
                            Status
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('isActive')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                        <button onClick={() => requestSort('subscriptionStartDate')} className="flex items-center gap-1.5 group">
                            Start Date
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('subscriptionStartDate')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                         <button onClick={() => requestSort('subscriptionEndDate')} className="flex items-center gap-1.5 group">
                            End Date
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('subscriptionEndDate')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4">
                        <button onClick={() => requestSort('uploadsUsed')} className="flex items-center gap-1.5 group">
                            Uploads Left
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('uploadsUsed')} />
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sub.username}</td>
                      <td className="px-6 py-4">{sub.companyName}</td>
                      <td className="px-6 py-4">
                        <DateTimeCell dateString={sub.registrationDate} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPlanChipColor(sub.subscriptionPlan)}`}>
                          {sub.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <DateTimeCell dateString={sub.subscriptionStartDate} />
                      </td>
                      <td className="px-6 py-4">
                        <DateTimeCell dateString={sub.subscriptionEndDate} />
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <UploadsCell used={sub.uploadsUsed} total={sub.totalUploads} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                           <button
                              onClick={() => handleToggleActivation(sub.id)}
                              className={`p-2 rounded-full transition-colors duration-200 ${
                                  sub.isActive ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-600'
                              }`}
                              aria-label={sub.isActive ? 'Deactivate user' : 'Activate user'}
                              title={sub.isActive ? 'Deactivate user' : 'Activate user'}
                          >
                              <PowerIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubscriptionsPage;