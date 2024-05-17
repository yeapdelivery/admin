import api from ".";

let interceptorId: number | null = null;

const configureAxiosInterceptors = (token: string | null) => {
  if (interceptorId !== null) {
    api.interceptors.request.eject(interceptorId);
  }

  interceptorId = api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

export default configureAxiosInterceptors;
