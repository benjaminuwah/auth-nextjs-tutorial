'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Account {
  id: string;
  accountNumber: string;
  type: string;
  balance: number;
  currency: string;
}

interface TransferData {
  fromAccountId: string;
  toAccountNumber: string;
  amount: string;
  description: string;
  recipientName: string;
  recipientBank: string;
  routingNumber: string;
  swiftCode: string;
}

export default function TransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<TransferData>({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
    recipientName: '',
    recipientBank: '',
    routingNumber: '',
    swiftCode: '',
  });
  const [isInternalTransfer, setIsInternalTransfer] = useState(false);
  const [showSwiftCode, setShowSwiftCode] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchTransferData();
    }
  }, [status, router]);

  const fetchTransferData = async () => {
    try {
      const response = await fetch('/api/transfers');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load accounts');
      }

      setAccounts(data.accounts);
      
      // Pre-select the first account if available
      if (data.accounts.length > 0) {
        setFormData(prev => ({
          ...prev,
          fromAccountId: data.accounts[0].id,
        }));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'toAccountNumber') {
      // Check if the account number matches any of the user's accounts
      const isInternal = accounts.some(acc => acc.accountNumber === value);
      setIsInternalTransfer(isInternal);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount,
          currency: accounts.find(acc => acc.id === formData.fromAccountId)?.currency || 'USD',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      setSuccess(data.message || 'Transfer completed successfully');
      setFormData({
        ...formData,
        amount: '',
        description: '',
        toAccountNumber: '',
        recipientName: '',
        recipientBank: '',
        routingNumber: '',
        swiftCode: '',
      });
      
      // Refresh account balances
      await fetchTransferData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const selectedAccount = accounts.find(acc => acc.id === formData.fromAccountId);
  const maxAmount = selectedAccount ? selectedAccount.balance : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Transfer Funds</h1>
          <p className="mt-2 text-sm text-gray-600">
            Transfer money between your accounts or to other bank accounts
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="fromAccountId" className="block text-sm font-medium text-gray-700">
                  From Account <span className="text-red-500">*</span>
                </label>
                <select
                  id="fromAccountId"
                  name="fromAccountId"
                  value={formData.fromAccountId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.type} - {account.accountNumber} (Balance: {account.currency} {account.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="toAccountNumber" className="block text-sm font-medium text-gray-700">
                  To Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="toAccountNumber"
                  name="toAccountNumber"
                  value={formData.toAccountNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter account number"
                  required
                />
                {isInternalTransfer && (
                  <p className="mt-1 text-sm text-green-600">
                    This is an internal transfer. The recipient will receive funds immediately.
                  </p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter recipient's full name"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="recipientBank" className="block text-sm font-medium text-gray-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="recipientBank"
                  name="recipientBank"
                  value={formData.recipientBank}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter bank name"
                  required
                />
              </div>

              {!isInternalTransfer && (
                <>
                  <div className="sm:col-span-3">
                    <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">
                      Routing Number {!isInternalTransfer && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      id="routingNumber"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter routing number"
                      required={!isInternalTransfer}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">
                        SWIFT/BIC Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSwiftCode(!showSwiftCode)}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        {showSwiftCode ? 'Hide' : 'Add SWIFT/BIC'}
                      </button>
                    </div>
                    {showSwiftCode ? (
                      <input
                        type="text"
                        id="swiftCode"
                        name="swiftCode"
                        value={formData.swiftCode}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter SWIFT/BIC code"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled
                        className="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-md shadow-sm py-2 px-3 text-gray-500 sm:text-sm"
                        placeholder="Click 'Add SWIFT/BIC' to enter"
                      />
                    )}
                  </div>
                </>
              )}

              <div className="sm:col-span-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount <span className="text-red-500">*</span>
                  {selectedAccount && (
                    <span className="text-xs text-gray-500 ml-2">
                      Available: {selectedAccount.currency} {maxAmount.toFixed(2)}
                    </span>
                  )}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {selectedAccount?.currency || 'USD'}
                    </span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    max={maxAmount}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Add a note (e.g., For rent, Gift, etc.)"
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.fromAccountId || !formData.toAccountNumber || !formData.amount}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting || !formData.fromAccountId || !formData.toAccountNumber || !formData.amount
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Transfer Money'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Transfer Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Internal Transfers</h3>
              <p className="mt-1 text-sm text-gray-900">
                Transfers between your accounts are processed instantly with no fees.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">External Transfers</h3>
              <p className="mt-1 text-sm text-gray-900">
                Transfers to other banks typically take 1-3 business days to process. Please ensure all recipient details are accurate.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transfer Limits</h3>
              <p className="mt-1 text-sm text-gray-900">
                Maximum transfer amount: {selectedAccount?.currency || 'USD'} 10,000 per transaction.
                Daily limit: {selectedAccount?.currency || 'USD'} 50,000.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
