<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="活动id" prop="eventId">
					<el-input v-model="dataForm.eventId" placeholder="活动id"></el-input>
				</el-form-item>
				<el-form-item label="用户id" prop="userId">
					<el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
				</el-form-item>
				<el-form-item label="是否出席" prop="present">
					<el-input v-model="dataForm.present" placeholder="是否出席"></el-input>
				</el-form-item>
				<el-form-item label="是否代替出席" prop="represent">
					<el-input v-model="dataForm.represent" placeholder="是否代替出席"></el-input>
				</el-form-item>
				<el-form-item label="是否缺席" prop="absent">
					<el-input v-model="dataForm.absent" placeholder="是否缺席"></el-input>
				</el-form-item>
				<el-form-item label="是否迟到" prop="lateArrival">
					<el-input v-model="dataForm.lateArrival" placeholder="是否迟到"></el-input>
				</el-form-item>
				<el-form-item label="是否早退" prop="earlyDeparture">
					<el-input v-model="dataForm.earlyDeparture" placeholder="是否早退"></el-input>
				</el-form-item>
				<el-form-item label="是否确认录入" prop="status">
					<el-input v-model="dataForm.status" placeholder="是否确认录入"></el-input>
				</el-form-item>
				<el-form-item label="" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="" prop="updateTime">
					<el-input v-model="dataForm.updateTime" placeholder=""></el-input>
				</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { usePz_event_registrationApi, usePz_event_registrationSubmitApi } from '@/api/module/pz_event_registration'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	eventId: '',
	userId: '',
	present: '',
	represent: '',
	absent: '',
	lateArrival: '',
	earlyDeparture: '',
	status: '',
	createTime: '',
	updateTime: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getPz_event_registration(id)
	}
}

const getPz_event_registration = (id: number) => {
	usePz_event_registrationApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		usePz_event_registrationSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
