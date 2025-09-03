import React, { useState, useRef } from 'react';
import { Icon } from './Icon';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (results: any) => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a CSV or Excel file');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate API call
      const response = await fetch('/api/admin/users/bulk-import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const results = await response.json();
      
      setSuccess(`Successfully imported ${results.successCount} users. ${results.errorCount} errors.`);
      onImportComplete(results);
      
      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import users');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = [
      'username,phone,role,nationality,nationalId,guardianName',
      'john_doe,+265991234567,patient_adult,Malawian,123456789,',
      'jane_smith,+265992345678,guardian,Malawian,987654321,John Smith',
      'dr_wilson,+265993456789,staff,Malawian,456789123,'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bulk Import Users</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Import multiple users from a CSV file</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Icon name="XIcon" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Import Instructions
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Upload a CSV or Excel file with user data</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Download the template for correct format</li>
                <li>• Required fields: username, phone, role</li>
                <li>• Optional fields: nationality, nationalId, guardianName</li>
              </ul>
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
              <div className="text-center">
                <Icon name="ChartBarIcon" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    {file ? file.name : 'Click to select file or drag and drop'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Select File
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={downloadTemplate}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
              >
                <Icon name="ChartBarIcon" className="h-4 w-4" />
                <span>Download Template</span>
              </button>
              
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Supported formats: CSV, Excel
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !file}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{loading ? 'Importing...' : 'Import Users'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
