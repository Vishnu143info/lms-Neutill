import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  Trash2,
  Cloud,
  AlertCircle,
  UserCheck,
  Calendar,
  Shield,
  Star,
  Clock
} from "lucide-react";

const FileUploadCard = ({ file, onRemove }) => {
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'txt': return <FileText className="w-6 h-6 text-gray-500" />;
      default: return <FileText className="w-6 h-6 text-indigo-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-green-100 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            {getFileIcon(file.name)}
          </div>
          <div>
            <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <CheckCircle className="w-6 h-6 text-green-500" />
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Uploaded just now
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Secure
          </span>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please upload PDF, DOC, DOCX, or TXT files only');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles(prev => [...prev, {
            id: Date.now(),
            file: file,
            uploadedAt: new Date().toISOString()
          }]);
          setFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
          📄 Resume & Portfolio Upload
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your resume and portfolio files to share with tutors and enhance your learning profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Section */}
        <div className="lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Files Uploaded</p>
                  <p className="text-2xl font-bold text-gray-800">{uploadedFiles.length}</p>
                </div>
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-800">2.4 MB</p>
                </div>
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-800">48</p>
                </div>
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tutor Reviews</p>
                  <p className="text-2xl font-bold text-gray-800">5</p>
                </div>
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className={`rounded-2xl border-2 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} transition-all duration-300 p-8 mb-8`}
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}>
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Your Resume</h3>
                <p className="text-gray-600 mb-6">
                  Drag and drop your file here, or click to browse
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              
              <button
                onClick={handleBrowseClick}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl mb-4"
              >
                Browse Files
              </button>
              
              <p className="text-sm text-gray-500">
                Supports: PDF, DOC, DOCX, TXT • Max size: 5MB
              </p>
            </div>
          </div>

          {/* Selected File Preview */}
          {file && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Selected File</h3>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB • Last modified: {new Date(file.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading ? (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                      <div 
                        style={{ width: `${uploadProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={simulateUpload}
                  disabled={isUploading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </button>
              )}
            </div>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Your Uploaded Files</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {uploadedFiles.map((uploadedFile) => (
                  <FileUploadCard 
                    key={uploadedFile.id}
                    file={uploadedFile.file}
                    onRemove={() => handleRemoveFile(uploadedFile.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Tips & Guidelines */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-800">Tips for Success</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Update your resume with recent projects</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Include links to GitHub or portfolio</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Highlight relevant skills and certifications</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Keep file size under 5MB for quick access</span>
              </li>
            </ul>
          </div>

          {/* Privacy Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-gray-800">Privacy & Security</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-gray-700">Files are encrypted and securely stored</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-gray-700">Only verified tutors can access your files</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-gray-700">You can delete files anytime</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Download Template</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Preview Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">View Upload History</span>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Upload Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Profile Completion</span>
                  <span>85%</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                    <div 
                      style={{ width: '85%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-gray-800">2 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next Review</span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  In 1 week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}