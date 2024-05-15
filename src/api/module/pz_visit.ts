import service from '@/utils/request'

export const usePz_visitApi = (id: number) => {
	return service.get('/module/pz_visit/' + id)
}

export const usePz_visitSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/module/pz_visit', dataForm)
	} else {
		return service.post('/module/pz_visit', dataForm)
	}
}

export const usePz_visitUserApi = (id: number) => {
	return service.get('/module/pz_visit/user/' + id)
}

export const usePz_visitDeleteApi = (id: number) => {
	let data: any[] = []
	if(id) {
		data = [id]
	}
	return service.delete('/module/pz_visit', {data})
}