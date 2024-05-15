import service from '@/utils/request'

export const usePz_recommendApi = (id: number) => {
	return service.get('/module/pz_recommend/' + id)
}

export const usePz_recommendSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/module/pz_recommend', dataForm)
	} else {
		return service.post('/module/pz_recommend', dataForm)
	}
}

export const usePz_recommendUserApi = (id: number) => {
	return service.get('/module/pz_recommend/user/' + id)
}

export const usePz_recommendDeleteApi = (id: number) => {
	let data: any[] = []
	if(id) {
		data = [id]
	}
	return service.delete('/module/pz_recommend', {data})
}