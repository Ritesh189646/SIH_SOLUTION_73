import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import apiService from '../../services/api';

const FileUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.csv')) {
        setIsError(true);
        setMessage('Only CSV telemetry files are accepted.');
        setFile(null);
        return;
      }
      setFile(selected);
      setMessage('');
      setIsError(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage('Uploading CSV dataset to Backend...');
    setIsError(false);
    try {
      const res = await apiService.uploadData(file);
      if (res.success) {
        setMessage(res.message || 'File uploaded and pipeline executed successfully!');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onUploadSuccess) onUploadSuccess(res);
      } else {
        setIsError(true);
        setMessage(res.message || 'Failed to upload CSV dataset.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Error connecting to upload API: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
          <UploadCloud style={{ width: '20px', height: '20px' }} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Upload Telemetry CSV Dataset</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Select a synthetic or raw AWS weather telemetry CSV file to process</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-file-input"
        />
        <label
          htmlFor="csv-file-input"
          className="btn btn-secondary"
          style={{ cursor: 'pointer', flex: 1, justifyContent: 'flex-start', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <FileText style={{ width: '16px', height: '16px', color: '#64748b' }} />
          {file ? file.name : 'Choose CSV File...'}
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn btn-primary"
          style={{ opacity: !file || uploading ? 0.6 : 1 }}
        >
          {uploading ? <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : 'Upload & Analyze'}
        </button>
      </div>

      {message && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
          color: isError ? '#dc2626' : '#16a34a',
          border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`
        }}>
          {isError ? <AlertCircle style={{ width: '14px', height: '14px' }} /> : <CheckCircle2 style={{ width: '14px', height: '14px' }} />}
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
