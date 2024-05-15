import service from '@/utils/request'

export const usePz_newsApi = (id: number) => {
	return service.get('/module/pz_news/' + id)
}

export const usePz_newsSubmitApi = (param: any,id:number) => {
	if (id) {
		return service.put('/module/pz_news', param,{
			headers: {
                'Content-Type': 'multipart/form-data'
            }
		})
	} else {
		return service.post('/module/pz_news', param,{
			headers: {
                'Content-Type': 'multipart/form-data'
            }
		})
	}
}