<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<!-- <el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item> -->
				<el-form-item label="走访时间" prop="visitTime">
					<!-- <el-input v-model="dataForm.visitTime" placeholder="走访时间"></el-input> -->
					<el-date-picker v-model="dataForm.visitTime" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="走访人" prop="visitorIds">
					<!-- <el-input v-model="dataForm.visitorIds" placeholder="走访人id数组"></el-input> -->
					<el-select v-model="dataForm.visitorIds" filterable multiple placeholder="请选择走访人">
						<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id+''" />
					</el-select>
				</el-form-item>
				<el-form-item label="被走访人" prop="visitedId">
					<!-- <el-input v-model="dataForm.visitedId" placeholder="被走访人id"></el-input> -->
					<el-select v-model="dataForm.visitedId" filterable placeholder="请选择被走访人">
						<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="走访类型" prop="type">
					<!-- <el-input v-model="dataForm.type" placeholder="走访类型"></el-input> -->
					<el-select v-model="dataForm.type" placeholder="走访类型">
						<el-option label="点对点走访" value="0" />
						<el-option label="集体走访" value="1" />
					</el-select>
				</el-form-item>
				<el-form-item label="走访内容" prop="content">
					<el-input v-model="dataForm.content" placeholder="走访内容"></el-input>
				</el-form-item>
				<el-form-item label="走访情况" prop="comment">
					<el-input v-model="dataForm.comment" placeholder="走访情况"></el-input>
				</el-form-item>
				<el-form-item label="是否群发走访" prop="status">
					<!-- <el-input v-model="dataForm.status" placeholder="是否群发走访"></el-input> -->
					<el-select v-model="dataForm.status" placeholder="是否群发走访">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="" prop="updateTime">
					<el-input v-model="dataForm.updateTime" placeholder=""></el-input>
				</el-form-item> -->
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
import { usePz_visitApi, usePz_visitSubmitApi } from '@/api/module/pz_visit'
import { usePz_user_infoAllApi } from '@/api/module/pz_user_info'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	visitTime: '',
	visitorIds: [],
	visitedId: '',
	type: '',
	content: '',
	comment: '',
	status: '',
	createTime: '',
	updateTime: ''})

const userInfoList = ref([])

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getPz_visit(id)
	}
	// 获取用户信息列表
	getPz_userInfoList()
}

const getPz_visit = (id: number) => {
	usePz_visitApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.visitorIds = JSON.parse(res.data.visitorIds)
	})
}

const getPz_userInfoList = () => {
	usePz_user_infoAllApi().then(res => {
		userInfoList.value = res.data
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
		console.log(dataForm.visitorIds)
		usePz_visitSubmitApi({
			...dataForm,
			visitorIds: JSON.stringify(dataForm.visitorIds)
		}).then(() => {
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
