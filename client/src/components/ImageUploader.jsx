import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { uploadImage } from '../services/analysisService.js';

const ImageUploader = ({ onImageReady, onNext }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(null); // { imageUrl, imagePublicId }
    const [error, setError] = useState('');
    const inputRef = useRef();

    const validate = (f) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowed.includes(f.type)) return 'This image format isn\'t supported. Please upload a JPG, PNG, or WebP image.';
        if (f.size > 10 * 1024 * 1024) return 'This image is too large. Please upload an image smaller than 10 MB.';
        return null;
    };

    const handleFile = (f) => {
        setError('');
        const err = validate(f);
        if (err) { setError(err); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setUploaded(null);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const data = await uploadImage(file);
            setUploaded({ imageUrl: data.imageUrl, imagePublicId: data.imagePublicId });
            onImageReady({ imageUrl: data.imageUrl, imagePublicId: data.imagePublicId });
        } catch (err) {
            setError(err.response?.data?.message || 'We couldn\'t upload your image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setUploaded(null);
        setError('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Upload Skin Image</h2>
                <p className="text-surface-200 text-sm">For better results, use a clear, well-lit image focused on the affected skin area.</p>
            </div>

            <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-3 text-xs text-primary-300">
                📸 You can use your camera directly if supported by your browser.
            </div>

            {!preview ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging
                        ? 'border-primary-400 bg-primary-500/10'
                        : 'border-white/15 hover:border-primary-500/50 hover:bg-primary-500/5'
                        }`}
                >
                    <Upload className="w-10 h-10 text-primary-400/60 mx-auto mb-4" />
                    <p className="text-white font-medium mb-1">Drag & drop your image here</p>
                    <p className="text-surface-200 text-sm mb-4">or click to browse files</p>
                    <span className="text-xs text-surface-200">JPG, JPEG, PNG, WebP · Max 10MB</span>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>
            ) : (
                <div className="relative">
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-surface-800 flex items-center justify-center p-2">
                        <img src={preview} alt="Preview" className="max-h-72 object-contain" />
                    </div>
                    <button onClick={reset} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-900/80 border border-white/20 flex items-center justify-center text-surface-200 hover:text-white transition-colors shadow-lg">
                        <X className="w-4 h-4" />
                    </button>
                    {uploaded && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-surface-900/80 rounded-full px-3 py-1.5 text-xs text-primary-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Uploaded successfully
                        </div>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs text-surface-200 px-2">
                        <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        <button onClick={reset} className="text-primary-400 hover:underline">Replace image</button>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            <div className="flex gap-3">
                {file && !uploaded && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 py-3.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Image</>}
                    </button>
                )}
                {uploaded && (
                    <button
                        onClick={onNext}
                        className="flex-1 py-3.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Next: Describe Symptoms <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <p className="text-xs text-surface-200 text-center mt-2">
                Do not upload images containing unrelated personal information.
            </p>
        </div>
    );
};

export default ImageUploader;
