import service from '@/utils/request'

export const usePz_eventApi = (id: number) => {
	return service.get('/module/pz_event/' + id)
}

export const usePz_eventSubmitApi = (dataForm: any, id:number) => {
	if (id) {
		return service.put('/module/pz_event', dataForm,{
			headers: {
                'Content-Type': 'multipart/form-data'
            }
		})
	} else {
		return service.post('/module/pz_event', dataForm,{
			headers: {
                'Content-Type': 'multipart/form-data'
            }
		})
	}
}

export const usePz_eventUserApi = (id: number) => {
	return service.get('/module/pz_event/user/' + id)
}

export const usePz_eventDeleteApi = (id:number) => {
	let data :any[]=[]
	if(id){
		data=[id]
	}
	return service.delete('module/pz_event',{data})
}