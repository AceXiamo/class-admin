<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<!-- <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px"
			@keyup.enter="submitHandle()">		 -->
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<!-- <el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item> -->
			<el-form-item label="小程序跳转url" prop="url">
				<el-input v-model="dataForm.url" placeholder="小程序跳转url"></el-input>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item label="封面图" prop="image">
				<!-- <el-input v-model="dataForm.image" placeholder="封面图路径"></el-input> -->
				<el-upload ref="upload" action="#" :limit="1" :auto-upload="false" :on-change="handleChange"
					class="avatar-uploader" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed"
					:headers="headers" :show-file-list="false">
					<el-image v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100px; height: 100px" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			
			<el-form-item label="来源" prop="origin">
				<el-input v-model="dataForm.origin" placeholder="来源"></el-input>
			</el-form-item>
			<el-form-item label="发布状态" prop="status">
				<!-- <el-input v-model="dataForm.status" placeholder="发布状态(0未发布 1已发布)"></el-input> -->
				<el-select v-model="dataForm.status" placeholder="请选择发布状态">
					<el-option label="未发布" :value="0"></el-option>
					<el-option label="已发布" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="发布时间" prop="publishTime">
				<!-- <el-input v-model="dataForm.publishTime" placeholder="发布时间"></el-input> -->
				<el-date-picker v-model="dataForm.publishTime" type="datetime" placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"/>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<!-- <el-input v-model="dataForm.content" placeholder="内容"></el-input> -->
				<WangEditor v-model="dataForm.content" mode="simple" />
			</el-form-item>
			<!-- <el-form-item label="创建时间" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
				</el-form-item>
				<el-form-item label="修改时间" prop="updateTime">
					<el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
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
import { usePz_newsApi, usePz_newsSubmitApi } from '@/api/module/pz_news'
import WangEditor from '@/components/wang-editor/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	url: '',
	title: '',
	image: '',
	content: '',
	origin: '',
	status: '',
	publishTime: '',
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
		getPz_news(id)
	}
}

const getPz_news = (id: number) => {
	usePz_newsApi(id).then(res => {
		Object.assign(dataForm, res.data)
		imageUrl.value = res.data?.image
	})
}

const dataRules = ref({
	// url: [{ required: true, message: '请输入小程序跳转url', trigger: 'blur' }],
	title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	// image: [{ required: true, message: '请上传封面图', trigger: 'blur' }],
	origin: [{ required: true, message: '请输入来源', trigger: 'blur' }],
	status: [{ required: true, message: '请选择发布状态', trigger: 'blur' }],
	publishTime: [{ required: true, message: '请选择发布时间', trigger: 'blur' }],
	// content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
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
	} else if (rawFile.size / 1024 / 1024 > 10) {
		ElMessage.error('Avatar picture size can not exceed 10MB!')
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
			ElMessage.error('请上传封面图')
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

		usePz_newsSubmitApi(param,dataForm.id).then((res) => {
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
