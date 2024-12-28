import service from '@/utils/request'

// 轮播图api
export const usePz_home_bannersBannerAddOrUpateApi = (dataForm: any, id: number) => {
	if (id) {
		return service.post('/module/home/banner/update', dataForm, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	} else {
		return service.post('/module/home/banner/add', dataForm, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	}
}

export const usePz_home_bannersBannerListApi = () => {
	return service.get('/module/home/banner/list')
}

export const usePz_home_bannersBannerApi = (id: number) => {
	return service.get('/module/home/banner/get/' + id)
}

export const usePz_home_bannersBannerDeleteApi = (id: number) => {
	return service.post('/module/home/banner/delete', id)
}

// 广告图api

export const usePz_home_bannersAdAddOrUpateApi = (dataForm: any, id: number) => {
	if (id) {
		return service.post('/module/home/ad/update', dataForm, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	} else {
		return service.post('/module/home/ad/add', dataForm, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	}
}

export const usePz_home_bannersAdListApi = () => {
	return service.get('/module/home/ad/list')
}

export const usePz_home_bannersAdApi = (id: number) => {
	return service.get('/module/home/ad/get/' + id)
}

export const usePz_home_bannersAdDeleteApi = (id: number) => {
	return service.post('/module/home/ad/delete', id)
}

// “关于我们”api

export const usePz_home_bannersAboutUsShowApi = () => {
	return service.get('/module/home/about/show')
}

export const usePz_home_bannersAboutUsUpateApi = (dataForm: any) => {
	return service.post('/module/home/about/update', dataForm)
}

// “了解更多”api

export const usePz_home_bannersMoreShowApi = () => {
	return service.get('/module/home/more/show')
}

export const usePz_home_bannersMoreUpateApi = (dataForm: any) => {
	return service.post('/module/home/more/update', dataForm, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

// file/upload

export const usePz_home_bannersFileUploadApi = (dataForm: any) => {
	return service.post('/module/home/file/upload', dataForm, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

// “了解更多”api

export const usePz_home_bannersQrCodeShowApi = () => {
	return service.get('/module/home/qrCode/show')
}

export const usePz_home_bannersQrCodeUpateApi = (dataForm: any) => {
	return service.post('/module/home/qrCode/update', dataForm, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}
