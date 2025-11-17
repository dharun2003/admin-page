import React, { useState, useMemo } from 'react';
import { MOCK_PAYMENTS } from '../constants';
import { Payment } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { Sidebar } from './Sidebar';
import { MenuIcon } from './icons/MenuIcon';
import { SortIcon } from './icons/SortIcon';

interface PaymentDetailsPageProps {
  onLogout: () => void;
  navigateTo: (page: string) => void;
  currentPage: string;
}

const AmountCell: React.FC<{ amount: number }> = ({ amount }) => (
  <span className="font-medium text-gray-900">
    {new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)}
  </span>
);

type SortablePaymentKeys = keyof Payment;

const PaymentDetailsPage: React.FC<PaymentDetailsPageProps> = ({ onLogout, navigateTo, currentPage }) => {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortablePaymentKeys; direction: 'ascending' | 'descending' } | null>(null);

  const filteredPayments = payments.filter(p => {
    const query = searchQuery.toLowerCase();
    return p.username.toLowerCase().includes(query) ||
      p.companyName.toLowerCase().includes(query);
  });

  const sortedPayments = useMemo(() => {
    let sortableItems = [...filteredPayments];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredPayments, sortConfig]);

  const requestSort = (key: SortablePaymentKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortDirection = (key: SortablePaymentKeys) => {
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Details</h1>
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
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-6">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by username or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                aria-label="Search payments"
              />
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
                        <button onClick={() => requestSort('totalAmountPaid')} className="flex items-center gap-1.5 group">
                            Total Amount Paid
                            <SortIcon className="h-3 w-3 text-gray-400 group-hover:text-gray-600" direction={getSortDirection('totalAmountPaid')} />
                        </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{payment.username}</td>
                      <td className="px-6 py-4">{payment.companyName}</td>
                      <td className="px-6 py-4">
                        <AmountCell amount={payment.totalAmountPaid} />
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

export default PaymentDetailsPage;