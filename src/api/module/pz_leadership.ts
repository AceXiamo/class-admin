import service from '@/utils/request'

export const usePz_leadershipApi = (id: number) => {
	return service.get('/module/pz_leadership/' + id)
}

export const usePz_leadershipSubmitApi = (dataForm: any,id:number) => {
	if (id) {
		return service.put('/module/pz_leadership', dataForm,{
			headers: {
                'Content-Type': 'multipart/form-data'
            }
		})
	} else {
		return service.post('/module/pz_leadership', dataForm,{
			headers: {
                'Content-Type': 'multipart/form-data'
            }
		})
	}
}

export const usePz_leadershipSessionApi = (id: number) => {
	return service.get('/module/pz_leadership/session/' + id)
}

export const usePz_leaderShipWeekApi = () => {
	return service.get('/module/pz_leadership/week/get')
}

export const usePz_leaderShipWeekSubmitApi = (dataForm: any) => {	
	return service.post('/module/pz_leadership/week/saveOrUpdate', dataForm)
}

export const usePz_leaderShipDelMemberApi = (id: number) => {	
	return service.delete(`/module/pz_leadership/delete/member/${id}`)
}

export const usePz_leaderShipDelWeekApi = (id: number) => {	
	return service.delete(`/module/pz_leadership/week/delete/${id}`)
}