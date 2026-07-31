import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileAttachment } from '../../types';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  FileCode, 
  Archive, 
  UploadCloud, 
  Download, 
  Search, 
  Eye, 
  Plus, 
  File, 
  CheckCircle2,
  X
} from 'lucide-react';

export const FilesPanel: React.FC = () => {
  const { sessionFiles, addSessionFile, user, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Documents' | 'Images' | 'Code' | 'Archives'>('All');
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getFileCategory = (type: string): 'Documents' | 'Images' | 'Code' | 'Archives' => {
    if (['pdf', 'word', 'powerpoint', 'excel', 'txt', 'markdown'].includes(type)) return 'Documents';
    if (['image', 'png', 'jpg', 'jpeg'].includes(type)) return 'Images';
    if (['code', 'js', 'ts', 'py', 'cpp', 'html'].includes(type)) return 'Code';
    return 'Archives';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-400" />;
      case 'word':
        return <FileText className="w-6 h-6 text-blue-400" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-emerald-400" />;
      case 'code':
        return <Code className="w-6 h-6 text-cyan-400" />;
      case 'zip':
        return <Archive className="w-6 h-6 text-amber-400" />;
      default:
        return <File className="w-6 h-6 text-indigo-400" />;
    }
  };

  const filteredFiles = sessionFiles.filter(file => {
    const categoryMatch = selectedCategory === 'All' || getFileCategory(file.type) === selectedCategory;
    const searchMatch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 50 * 1024 * 1024) {
      showToast('File size exceeds maximum allowed limit of 50MB.', 'warning');
      return;
    }

    setIsUploading(true);
    showToast(`Uploading ${file.name}...`, 'info');

    setTimeout(() => {
      let type: FileAttachment['type'] = 'pdf';
      if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) type = 'image';
      else if (file.name.endsWith('.py') || file.name.endsWith('.js') || file.name.endsWith('.ts')) type = 'code';
      else if (file.name.endsWith('.zip')) type = 'zip';

      const newAttachment: FileAttachment = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type,
        category: getFileCategory(type),
        url: '#',
        uploadedBy: user.name,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        previewContent: type === 'code' ? 'print("Hello from uploaded script!")' : undefined
      };

      addSessionFile(newAttachment);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Top Header & Upload Trigger */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Study Session File Repository</h2>
            <p className="text-xs text-slate-400">Share & view PDFs, Images, Code, Slides and Archives (Max 50MB)</p>
          </div>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg cursor-pointer transition-all hover:scale-105">
          <UploadCloud className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleSimulateUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/60 gap-3">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Documents', 'Images', 'Code', 'Archives'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Files List / Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <div className="p-4 rounded-full bg-slate-950 border border-slate-800 text-slate-500">
              <Folder className="w-8 h-8" />
            </div>
            <p className="text-slate-300 font-bold text-sm">No files found</p>
            <p className="text-slate-500 text-xs">Upload a study file or try searching for another keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className="uppercase text-[10px] font-bold text-indigo-400">{file.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-4 text-[11px] text-slate-500">
                  <span>Uploaded by {file.uploadedBy || 'Partner'}</span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                      title="Preview Inline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => showToast(`Downloading ${file.name}...`, 'info')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile.type)}
                <span className="text-white font-bold text-sm">{previewFile.name}</span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs max-h-96 overflow-y-auto">
              {previewFile.type === 'image' ? (
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                  <ImageIcon className="w-16 h-16 text-emerald-400" />
                  <p className="text-slate-400 text-xs">[ Image Preview Rendered Inline ]</p>
                </div>
              ) : previewFile.previewContent ? (
                <pre className="whitespace-pre-wrap text-emerald-400 leading-relaxed">{previewFile.previewContent}</pre>
              ) : (
                <div className="space-y-3 text-center py-6">
                  <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                  <p className="text-white font-bold text-sm">Study Document Preview</p>
                  <p className="text-slate-400 text-xs">High-yield study notes and formulas for {previewFile.name}.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Size: {previewFile.size}</span>
              <button
                onClick={() => {
                  showToast(`Downloading ${previewFile.name}...`, 'info');
                  setPreviewFile(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
