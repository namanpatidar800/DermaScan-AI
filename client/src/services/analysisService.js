import api from './api.js';

export const uploadImage = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post('/analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (onProgress) {
                onProgress(Math.round((e.loaded * 100) / e.total));
            }
        },
    });
    return data;
};

export const analyze = async (imageUrl, imagePublicId, symptoms, patientDetails) => {
    const { data } = await api.post('/analysis/analyze', { imageUrl, imagePublicId, symptoms, patientDetails });
    return data;
};

export const getAnalyses = async (page = 1, limit = 10) => {
    const { data } = await api.get(`/analysis?page=${page}&limit=${limit}`);
    return data;
};

export const getAnalysisById = async (id) => {
    const { data } = await api.get(`/analysis/${id}`);
    return data;
};

export const deleteAnalysis = async (id) => {
    const { data } = await api.delete(`/analysis/${id}`);
    return data;
};
