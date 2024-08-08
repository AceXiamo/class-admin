<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<!-- <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="10em" @keyup.enter="submitHandle()"> -->
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="10em">
			<!-- <el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item> -->
			<el-form-item label="活动主图" prop="mainImg">
				<!-- <el-input v-model="dataForm.mainImg" placeholder="活动主图"></el-input> -->
				<el-upload ref="upload" action="#" :limit="1" :auto-upload="false" :on-change="handleChange"
					class="avatar-uploader" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :headers="headers"
					:show-file-list="false">
					<el-image v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100px; height: 100px" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="活动主题" prop="theme">
				<el-input v-model="dataForm.theme" placeholder="活动主题"></el-input>
			</el-form-item>
			<el-form-item label="活动类型" prop="type">
				<!-- <el-input v-model="dataForm.type" placeholder="活动类型"></el-input> -->
				<el-select v-model="dataForm.type" placeholder="请选择活动类型">
					<el-option label="普通活动" value="0"></el-option>
					<el-option label="会议/培训" value="1"></el-option>
					<el-option label="集体走访" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="被走访人id" prop="visitedId" v-if="Number(dataForm.type)===2">
				<!-- <el-input v-model="dataForm.visitedId" placeholder="被走访人id"></el-input> -->
				<el-select v-model="dataForm.visitedId" filterable placeholder="请选择被走访人" style="width: 200px;">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="嘉宾是否能报名" prop="guestAllowed">
				<!-- <el-input v-model="dataForm.guestAllowed" placeholder="嘉宾是否能报名"></el-input> -->
				<el-select v-model="dataForm.guestAllowed" placeholder="请选择嘉宾是否能报名">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动时间" prop="eventTime">
				<!-- <el-input v-model="dataForm.eventTime" placeholder="活动时间"></el-input> -->
				<el-date-picker v-model="dataForm.eventTime" type="datetime" placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"/>
			</el-form-item>
			<el-form-item label="活动地点" prop="eventLocation">
				<el-input v-model="dataForm.eventLocation" placeholder="活动地点"></el-input>
			</el-form-item>
			<el-form-item label="活动报名截止时间" prop="deadline">
				<!-- <el-input v-model="dataForm.deadline" placeholder="活动报名截止时间"></el-input> -->
				<el-date-picker v-model="dataForm.deadline" type="datetime" placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"/>
			</el-form-item>
			<el-form-item label="是否上架" prop="status">
				<!-- <el-input v-model="dataForm.status" placeholder="是否上架"></el-input> -->
				<el-select v-model="dataForm.status" placeholder="请选择是否上架">
					<el-option label="上架" value="1"></el-option>
					<el-option label="下架" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动内容" prop="content">
				<!-- <el-input v-model="dataForm.content" placeholder="活动内容"></el-input> -->
				<WangEditor v-model="dataForm.content" mode="simple" />
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
import { ElMessage, ElMessageBox, UploadInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { usePz_eventApi, usePz_eventSubmitApi } from '@/api/module/pz_event'
import WangEditor from '@/components/wang-editor/index.vue'
import { usePz_user_infoAllApi } from '@/api/module/pz_user_info'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const userInfoList = ref([])

const dataForm = reactive({
	id: '',
	mainImg: '',
	theme: '',
	type: '',
	visitedId: '',
	guestAllowed: '',
	eventTime: '',
	eventLocation: '',
	deadline: '',
	status: '',
	content: '',
	createTime: '',
	updateTime: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		upload.value?.clearFiles()
		imageUrl.value = ''
		fileUpload.value = null
	}

	if (id) {
		getPz_event(id)
	}
	getPz_userInfoList()
}

const getPz_event = (id: number) => {
	usePz_eventApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.guestAllowed += ''
		dataForm.status += ''
		dataForm.type += ''
		imageUrl.value = res.data?.mainImg
	})
}

// 获取用户信息列表
const getPz_userInfoList = () => {
	usePz_user_infoAllApi().then(res => {
		userInfoList.value = res.data
	})
}


const dataRules = ref({
	theme: [{ required: true, message: '请输入活动主题', trigger: 'blur' }],
	type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
	guestAllowed: [{ required: true, message: '请选择嘉宾是否能报名', trigger: 'change' }],
	eventTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
	eventLocation: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
	deadline: [{ required: true, message: '请选择活动报名截止时间', trigger: 'change' }],
	status: [{ required: true, message: '请选择是否上架', trigger: 'change' }],
	content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
	visitedId: [{ required: Number(dataForm.type) === 2, message: '请输入被走访人id', trigger: 'blur' }]
})

// 图片上传
// 设置请求头
const headers = {
	'Content-Type': 'multipart/form-data'
}
// 图像回显到前端
const imageUrl = ref('')
// 图像文件
const fileUpload = ref()
// 图像文件更换
const handleChange = (file: any) => {
	fileUpload.value = file
	imageUrl.value = URL.createObjectURL(file.raw!)
}
const upload = ref<UploadInstance>()
// 图片覆盖上一张图片
const handleExceed: UploadProps['onExceed'] = files => {
	upload.value!.clearFiles()
	const file = files[0] as UploadRawFile
	file.uid = genFileId()
	upload.value!.handleStart(file)
}
// 上传图片前的校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('Avatar picture must be JPG format!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('Avatar picture size can not exceed 2MB!')
		return false
	}
	return true
}



// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		if (!imageUrl.value) {
			ElMessage.error('请上传活动主图')
			return false
		}
		let param = new FormData()
		if (fileUpload.value == null) {
			let emptyBlob = new Blob([''], { type: 'application/octet-stream' })
			param.append('file', emptyBlob)
		} else {
			param.append('file', fileUpload.value.raw)
		}

		let jsonStr = JSON.stringify(dataForm)
		const blob = new Blob([jsonStr], { type: 'application/json' })
		param.append('vo', blob)
		usePz_eventSubmitApi(param, dataForm.id).then((res) => {
			if (res.code == 0) {
				ElMessage.success({
					message: '上传成功',
					duration: 500,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			} else {
				ElMessage.error(res.msg)
			}
		})
	})
}

defineExpose({
	init
})
</script>
