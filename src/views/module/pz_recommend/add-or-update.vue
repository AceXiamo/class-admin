<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="10em" @keyup.enter="submitHandle()">
			<!-- <el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item> -->
			<el-form-item label="引荐日期" prop="recommendTime">
				<!-- <el-input v-model="dataForm.recommendTime" placeholder="引荐日期"></el-input> -->
				<el-date-picker v-model="dataForm.recommendTime" type="date" placeholder="请选择日期" format="YYYY/MM/DD"
					value-format="YYYY-MM-DD HH:mm:ss" />
			</el-form-item>
			<el-form-item label="引荐人id" prop="recommenderId">
				<!-- <el-input v-model="dataForm.recommenderId" placeholder="引荐人id"></el-input> -->
				<el-select v-model="dataForm.recommenderId" filterable placeholder="请选择引荐人">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="被引荐人id" prop="recommendedId">
				<!-- <el-input v-model="dataForm.recommendedId" placeholder="被引荐人id"></el-input> -->
				<el-select v-model="dataForm.recommendedId" filterable placeholder="请选择被引荐人">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="引荐类型" prop="type">
				<!-- <el-input v-model="dataForm.type" placeholder="引荐类型"></el-input> -->
				<el-select v-model="dataForm.type" placeholder="引荐类型">
					<el-option label="内部引荐" value="0"></el-option>
					<el-option label="外部引荐" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="引荐内容" prop="recommendContent">
				<el-input v-model="dataForm.recommendContent" placeholder="引荐内容"></el-input>
			</el-form-item>
			<el-form-item label="成交日期" prop="dealTime">
				<!-- <el-input v-model="dataForm.dealTime" placeholder="成交日期"></el-input> -->
				<el-date-picker v-model="dataForm.dealTime" type="date" placeholder="请选择日期" format="YYYY/MM/DD"
					value-format="YYYY-MM-DD HH:mm:ss" />
			</el-form-item>
			<el-form-item label="成交内容" prop="dealContent">
				<el-input v-model="dataForm.dealContent" placeholder="成交内容"></el-input>
			</el-form-item>
			<el-form-item label="成交金额" prop="dealAmout">
				<el-input v-model="dataForm.dealAmout" placeholder="成交金额"></el-input>
			</el-form-item>
			<el-form-item label="感谢函评语" prop="comment">
				<el-input v-model="dataForm.comment" placeholder="感谢函评语"></el-input>
			</el-form-item>
			<el-form-item label="是否群发感谢函" prop="status">
				<!-- <el-input v-model="dataForm.status" placeholder="是否群发感谢函"></el-input> -->
				<el-select v-model="dataForm.status" placeholder="请选择是否群发感谢函">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否跨平台" prop="isCrossPlatform">
				<el-select v-model="dataForm.isCrossPlatform" clearable placeholder="请选择是否跨平台">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
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
import { usePz_recommendApi, usePz_recommendSubmitApi } from '@/api/module/pz_recommend'
import { usePz_user_infoAllApi } from '@/api/module/pz_user_info'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	recommendTime: '',
	recommenderId: '',
	recommendedId: '',
	type: '',
	recommendContent: '',
	dealTime: '',
	dealContent: '',
	dealAmout: '',
	comment: '',
	status: '',
	createTime: '',
	updateTime: '',
	isCrossPlatform: '0'
})

const userInfoList = ref([])

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getPz_recommend(id)
	}
	// 获取用户信息列表
	getPz_userInfoList()
}

const getPz_recommend = (id: number) => {
	usePz_recommendApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.type+=''
	})
}
const getPz_userInfoList = () => {
	usePz_user_infoAllApi().then(res => {
		userInfoList.value = res.data
	})
}

const dataRules = ref({
	recommendTime: [{ required: true, message: '请输入引荐日期', trigger: 'blur' }],
	recommenderId: [{ required: true, message: '请输入引荐人id', trigger: 'blur' }],
	recommendedId: [{ required: true, message: '请输入被引荐人id', trigger: 'blur' }],
	type: [{ required: true, message: '请输入引荐类型', trigger: 'blur' }],
	recommendContent: [{ required: true, message: '请输入引荐内容', trigger: 'blur' }],
	// dealTime: [{ required: true, message: '请输入成交日期', trigger: 'blur' }],
	// dealContent: [{ required: true, message: '请输入成交内容', trigger: 'blur' }],
	// dealAmout: [{ required: true, message: '请输入成交金额', trigger: 'blur' }],
	// comment: [{ required: true, message: '请输入感谢函评语', trigger: 'blur' }],
	// status: [{ required: true, message: '请输入是否群发感谢函', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		usePz_recommendSubmitApi(dataForm).then(() => {
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
