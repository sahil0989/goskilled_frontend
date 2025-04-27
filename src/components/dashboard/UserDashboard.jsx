import { Copy } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [kycVerified, setKycVerified] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const handleRedeem = () => {
    if (kycVerified) {
      const redeemedAmount = walletBalance;
      setTransactions([...transactions, { id: Date.now(), amount: redeemedAmount, date: new Date().toLocaleString() }]);
      setWalletBalance(0);
      alert('Balance redeemed successfully!');
    } else {
      alert('Please complete KYC verification first!');
    }
  };

  const handleVerifyKYC = () => {
    setKycVerified(true);
    alert('KYC verified successfully!');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Courses', icon: '📚' },
    { name: 'KYC Verification', icon: '🆔' },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-[#1A6E0A] text-white flex flex-col">
        <div className="px-6 py-4 text-2xl font-semibold hidden md:block">
          Dashboard
        </div>
        <nav className="flex-1 px-4 py-2 mt-8 md:mt-0">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-md ${activeTab === item.name ? 'bg-[#1a4d10]' : 'hover:bg-[#1a4d10]'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span className='hidden md:block'>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-80px)] overflow-scroll p-6">
        <h1 className="text-3xl font-bold mb-6">{activeTab}</h1>

        {activeTab === 'Dashboard' && (
          <>
            {/* User Details */}
            <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
              <h2 className='text-2xl font-bold flex'>Welcome, <span>SAHIL</span><span className='hidden md:block pl-2'>in the GoSkilled Family!</span></h2>

              {/* personal details  */}
              <div className='py-4 flex flex-col gap-3'>
                <h2 className='font-semibold'>Email: <span>testing@gmail.com</span></h2>
                <h2 className='font-semibold'>Phone No. : <span>9999999889</span></h2>
              </div>

            </div>
            <div className='bg-white shadow-md rounded-lg p-6 mb-6 md:text-2xl md:font-black'>
              <div className="flex w-full justify-end mb-4"><Copy onClick={() => toast.success("Copied Referral Code!!")} className=' cursor-pointer' size={18} /></div>
              <h2 className='font-semibold'>Referral Code: <span className='font-bold text-xl'>[1234567]</span></h2>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-gray-600 text-lg mb-2">Wallet Balance</h2>
              <p className="text-4xl font-bold">₹ {walletBalance.toFixed(2)}</p>
            </div>

            {/* KYC Warning */}
            {!kycVerified ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 mb-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">ℹ️</span>
                  <p className="text-md">KYC verification is required to redeem balance.</p>
                </div>
                <button
                  onClick={() => setActiveTab('KYC Verification')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md"
                >
                  Verify KYC
                </button>
              </div>
            ) : (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 mb-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <p className="text-md">KYC verified! You can redeem your balance.</p>
                </div>
                <button
                  onClick={handleRedeem}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md"
                >
                  Redeem
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'Courses' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-gray-600 text-lg">No courses enrolled yet.</h2>
          </div>
        )}

        {activeTab === 'KYC Verification' && (
          <>
            <div className="bg-white shadow-md rounded-lg p-6">
              {kycVerified ? (
                <h2 className="text-green-600 text-lg font-semibold">KYC already verified!</h2>
              ) : (
                <button
                  onClick={handleVerifyKYC}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md"
                >
                  Complete KYC
                </button>
              )}
            </div>


            {/* Recent Transactions */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h2 className="text-gray-600 text-lg mb-4">Recent Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-gray-400">No recent transactions.</p>
              ) : (
                <ul className="space-y-4">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="flex justify-between">
                      <span>Redeemed ₹ {tx.amount}</span>
                      <span className="text-sm text-gray-500">{tx.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
