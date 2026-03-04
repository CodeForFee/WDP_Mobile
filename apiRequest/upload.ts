import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";

export const uploadRequest = {
    // POST /upload/image : upload ảnh lên server
    uploadImage: async (formData: FormData) => {
        const res = await api.post<{ data: { url: string } }>(ENDPOINT.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.data;
    },
};
