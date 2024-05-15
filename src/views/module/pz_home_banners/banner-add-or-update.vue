<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="上传图片">
				<el-upload
					ref="upload"
					action="#"
					:limit="1"
					:auto-upload="false"
					:on-change="handleChange"
					class="avatar-uploader"
					:before-upload="beforeAvatarUpload"
					:on-exceed="handleExceed"
					:headers="headers"
					:show-file-list="false"
				>
					<el-image v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100px; height: 100px" />
					<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="跳转链接" prop="target">
				<el-input v-model="dataForm.target" placeholder="跳转链接"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<!-- <el-input v-model="dataForm.sort" placeholder="排序"></el-input> -->
				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :max="100" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="danger" @click="handleDelete" v-if="dataForm.id">删除</el-button>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, UploadInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { usePz_home_bannersBannerApi, usePz_home_bannersBannerAddOrUpateApi, usePz_home_bannersBannerDeleteApi } from '@/api/module/pz_home_banners'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	target: '',
	sort: 0
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
		getPz_banner(id)
	}
}
const getPz_banner = (id: number) => {
	usePz_home_bannersBannerApi(id).then(res => {
		if (res.code === 0) {
			Object.assign(dataForm, res.data)
			console.log(res.data.content)
			imageUrl.value = res.data.content + '?' + new Date().getTime()
		}
	})
}

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

// 删除
const handleDelete = () => {
	ElMessageBox.confirm('是否确认删除该轮播图?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		usePz_home_bannersBannerDeleteApi(dataForm.id).then(res => {
			if (res.code === 0) {
				ElMessage.success('删除成功')
				visible.value = false
				emit('refreshDataList')
			} else {
				ElMessage.error('删除失败')
			}
		})
	})
}

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		if (!imageUrl.value) {
			ElMessage.error('请先上传图片')
			return
		} else {
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

			console.log(param.get('file'))
			console.log(param.get('vo'))

			usePz_home_bannersBannerAddOrUpateApi(param, dataForm.id).then(res => {
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
					ElMessage.error('上传失败')
				}
			})
		}
	})
}

defineExpose({
	init
})
</script>
