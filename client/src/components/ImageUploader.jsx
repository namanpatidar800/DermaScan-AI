import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, ChevronRight, Check } from 'lucide-react';
import { uploadImage } from '../services/analysisService.js';

const ImageUploader = ({ onImageReady, onNext }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(null); // { imageUrl, imagePublicId }
    const [error, setError] = useState('');
    const [qualityState, setQualityState] = useState(null); // 'checking' | 'passed' | 'failed'
    const [qualityIssues, setQualityIssues] = useState([]);
    const cameraInputRef = useRef();
    const uploadInputRef = useRef();

    const validateFormat = (f) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowed.includes(f.type)) return 'This image format isn\'t supported. Please upload a JPG, PNG, or WebP image.';
        if (f.size > 10 * 1024 * 1024) return 'This image is too large. Please upload an image smaller than 10 MB.';
        return null;
    };

    const checkImageQuality = (f) => {
        return new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(f);
            img.src = objectUrl;
            img.onload = () => {
                let issues = [];
                if (img.width < 250 || img.height < 250) {
                    issues.push('Resolution is too low for a reliable assessment.');
                }

                // Canvas-based brightness heuristic
                const canvas = document.createElement('canvas');
                // Scale down for faster pixel processing
                const scale = Math.min(1, 800 / Math.max(img.width, img.height));
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                try {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    let brightness = 0;
                    let len = imageData.data.length;

                    // Sample every 4th pixel for speed
                    let samples = 0;
                    for (let i = 0; i < len; i += 16) {
                        brightness += (0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2]);
                        samples++;
                    }
                    brightness = brightness / samples;

                    if (brightness < 45) issues.push('Image is too dark (poor lighting).');
                    if (brightness > 220) issues.push('Image is overexposed (too bright).');
                } catch (e) {
                    console.error("Canvas context manipulation failed (CORS/Taint)", e);
                }

                resolve({ valid: issues.length === 0, issues });
            };
            img.onerror = () => resolve({ valid: false, issues: ['Failed to read image data.'] });
        });
    };

    const handleFile = async (f) => {
        setError('');
        const formatErr = validateFormat(f);
        if (formatErr) { setError(formatErr); return; }

        setFile(f);
        setPreview(URL.createObjectURL(f));
        setUploaded(null);
        setQualityState('checking');
        setQualityIssues([]);

        const quality = await checkImageQuality(f);
        if (quality.valid) {
            setQualityState('passed');
        } else {
            setQualityState('failed');
            setQualityIssues(quality.issues);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, []);

    const handleUpload = async () => {
        if (!file || qualityState === 'failed') return;
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
        setQualityState(null);
        setQualityIssues([]);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-surface-900 mb-1">Upload Skin Image</h2>
                <p className="text-surface-800 text-sm">For better results: Use good lighting, focus on the affected skin area, and avoid filters.</p>
            </div>

            <div className="rounded-xl bg-primary-50 border border-primary-200 p-3 text-xs text-primary-700">
                📸 You can use your camera directly if supported by your device.
            </div>

            {!preview ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${dragging
                        ? 'border-primary-400 bg-primary-100'
                        : 'border-surface-300 hover:border-primary-400 hover:bg-surface-100'
                        }`}
                >
                    <Upload className="w-10 h-10 text-primary-400 mx-auto mb-4" />
                    <p className="text-surface-900 font-medium mb-1">Drag & drop your image here</p>
                    <p className="text-surface-800 text-sm mb-6">or choose an input method below</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
                        <button onClick={() => cameraInputRef.current.click()} className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 font-semibold rounded-xl transition-all shadow-sm">
                            📸 Open Camera
                        </button>
                        <button onClick={() => uploadInputRef.current.click()} className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-white hover:bg-surface-50 border border-surface-200 text-surface-800 font-semibold rounded-xl transition-all shadow-sm">
                            📁 Browse Files
                        </button>
                    </div>

                    <span className="block mt-6 text-xs text-surface-500 font-medium tracking-wide">JPG, JPEG, PNG, WebP · Max 10MB</span>

                    <input ref={cameraInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                    <input ref={uploadInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>
            ) : (
                <div className="relative space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-surface-200 bg-surface-100 flex items-center justify-center p-2">
                        <img src={preview} alt="Preview" className="max-h-72 object-contain rounded-xl shadow-sm" />
                    </div>

                    <button onClick={reset} className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white/90 border border-surface-200 flex items-center justify-center text-surface-800 hover:text-surface-900 transition-colors shadow-md">
                        <X className="w-4 h-4" />
                    </button>

                    {/* Quality Gate Status */}
                    {qualityState === 'checking' && (
                        <div className="flex items-center gap-2 p-3 bg-surface-100 border border-surface-200 rounded-xl text-surface-900 text-sm font-medium">
                            <Loader2 className="w-4 h-4 animate-spin text-primary-500" /> Checking image quality...
                        </div>
                    )}
                    {qualityState === 'passed' && (
                        <div className="flex flex-col gap-1 p-3 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600" /> Image quality acceptable
                            </div>
                            <div className="text-xs text-green-600 ml-6 flex gap-3">
                                <span>✓ Resolution acceptable</span>
                                <span>✓ Lighting acceptable</span>
                            </div>
                        </div>
                    )}
                    {qualityState === 'failed' && (
                        <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                                <AlertCircle className="w-4 h-4 text-red-600" /> Image quality is too low for a reliable preliminary assessment.
                            </div>
                            <ul className="text-xs text-red-600 ml-6 list-disc space-y-1">
                                {qualityIssues.map((issue, idx) => (
                                    <li key={idx}>{issue}</li>
                                ))}
                            </ul>
                            <button onClick={reset} className="mt-2 text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 py-1.5 px-4 rounded-lg self-start transition-colors">
                                Use Another Image
                            </button>
                        </div>
                    )}

                    {uploaded && (
                        <div className="flex items-center gap-1.5 bg-primary-100 border border-primary-200 rounded-xl p-3 text-sm font-medium text-primary-700">
                            <CheckCircle className="w-4 h-4" /> Uploaded successfully to SKINOVA cloud
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-surface-800 px-1">
                        <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        <button onClick={reset} className="text-secondary-600 hover:underline font-medium">Replace image</button>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            <div className="flex gap-3">
                {file && !uploaded && qualityState === 'passed' && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 py-3.5 bg-secondary-500 hover:bg-secondary-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing Image...</> : <><Check className="w-4 h-4" /> Confirm & Upload Image</>}
                    </button>
                )}
                {uploaded && (
                    <button
                        onClick={onNext}
                        className="flex-1 py-3.5 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        Next: Describe Symptoms <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <p className="text-xs text-surface-800 text-center mt-2">
                SKINOVA uses this image solely to generate a temporary assessment. Do not upload images containing unrelated personal information.
            </p>
        </div>
    );
};

export default ImageUploader;
