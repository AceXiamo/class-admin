import service from '@/utils/request'

export const usePz_user_infoApi = (id: number) => {
	return service.get('/module/pz_user_info/' + id)
}

export const usePz_user_infoSubmitApi = (param: any, id: number) => {
	if (id) {
		return service.put('/module/pz_user_info', param, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	} else {
		return service.post('/module/pz_user_info', param, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	}
}

export const usePz_user_infoAddTagApi = (dataForm: any) => {
	return service.post('/module/pz_user_info/addTag', dataForm)
}

export const usePz_user_infoAllApi = () => {
	return service.get('/module/pz_user_info/all')
}

export const usePz_user_infoUserApi = (id: number) => {
	return service.get('/module/pz_user_info/user/' + id)
}

export const usePz_user_infoDeleteApi = (id: number) => {
	let data: any[] = []
	if (id) {
		data = [id]
	}
	return service.delete('module/pz_user_info', { data })
}
