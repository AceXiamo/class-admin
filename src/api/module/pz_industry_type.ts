import service from '@/utils/request'

export const usePz_industry_typeApi = (id: number) => {
	return service.get('/module/pz_industry_type/' + id)
}

export const usePz_industry_typeSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/module/pz_industry_type', dataForm)
	} else {
		return service.post('/module/pz_industry_type', dataForm)
	}
}

export const usePz_industry_typeAllApi = () => {
	return service.get('/module/pz_industry_type/all')
}