<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<!-- <el-form-item label="id" prop="id">
				<el-input v-model="dataForm.id" placeholder=""></el-input>
			</el-form-item> -->
			<el-form-item label="活动id" prop="eventId">
				<el-select v-model="dataForm.eventId" placeholder="活动" style="width: 240px">
					<el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value"
						:disabled="item.disabled" />
				</el-select>
			</el-form-item>
			<el-form-item label="用户" prop="userId">
				<el-select v-model="dataForm.userId" placeholder="活动" style="width: 240px">
					<el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"
						:disabled="item.disabled" />
				</el-select>
			</el-form-item>
			<el-form-item label="是否出席" prop="present">
				<el-select v-model="dataForm.present" placeholder="是否出席" style="width: 240px">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否代替出席" prop="represent">
				<el-select v-model="dataForm.represent" placeholder="是否出席" style="width: 240px">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否缺席" prop="absent">
				<el-select v-model="dataForm.absent" placeholder="是否出席" style="width: 240px">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否迟到" prop="lateArrival">
				<el-select v-model="dataForm.lateArrival" placeholder="是否出席" style="width: 240px">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否早退" prop="earlyDeparture">
				<el-select v-model="dataForm.earlyDeparture" placeholder="是否出席" style="width: 240px">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否确认录入" prop="status">
				<el-select v-model="dataForm.status" placeholder="是否出席" style="width: 240px">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
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
import { usePz_event_registrationApi, usePz_event_registrationSubmitApi, eventList, userInfoList } from '@/api/module/pz_event_registration'

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
	updateTime: ''
})

const eventOptions = ref<any>([])
const loadEventOptions = () => {
	eventList({
		page: 1,
		limit: 1000,
		theme: ''
	}).then(res => {
		console.log(res)
		eventOptions.value = res.data.list.map((item: any) => {
			return {
				value: item.id,
				label: item.theme
			}
		})
	})
}
loadEventOptions()

const userOptions = ref<any>([])
const loadUserOptions = () => {
	userInfoList({
		page: 1,
		limit: 1000,
		name: ''
	}).then(res => {
		userOptions.value = res.data.list.map((item: any) => {
			return {
				value: item.id,
				label: item.name
			}
		})
	})
}
loadUserOptions()

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
