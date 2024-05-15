import service from '@/utils/request';

export const usePz_event_registrationApi = (id: number) => {
	return service.get('/module/pz_event_registration/' + id)
}

export const usePz_event_registrationSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/module/pz_event_registration', dataForm)
	} else {
		return service.post('/module/pz_event_registration', dataForm)
	}
}

export const usePz_event_registrationEventApi = (id: number) => {
	return service.get('/module/pz_event_registration/event/' + id)
}

export const usePz_event_registrationConfirmApi = (dataForm:any) => {
	return service.post('/module/pz_event_registration/saveBatch' , dataForm)
}