<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="10em" @keyup.enter="submitHandle()">
			<!-- <el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item> -->
			<el-form-item label="用户角色状态" prop="status">
				<!-- <el-input v-model="dataForm.status" placeholder="用户角色状态"></el-input> -->
				<el-select v-model="dataForm.status" :disabled="true" placeholder="请选择用户角色状态">
					<el-option label="游客" :value="0"></el-option>
					<!-- <el-option label="待验证" value="1"></el-option> -->
					<el-option label="准嘉宾" :value="2"></el-option>
					<el-option label="嘉宾" :value="3"></el-option>
					<el-option label="会员" :value="4"></el-option>
					<el-option label="顾问团" :value="5"></el-option>
					<el-option label="历史会员" :value="6"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.status!=5" label="用户关联登录手机号" prop="account">
				<el-input v-model="dataForm.account" placeholder="用户关联登录手机号"></el-input>
			</el-form-item>
			<!-- <el-form-item label="用户自定义标签" prop="tags">
				<el-input v-model="dataForm.tags" placeholder="用户自定义标签"></el-input>
			</el-form-item> -->
			<el-form-item label="用户头像" prop="avatar">
				<el-upload ref="upload" action="#" :limit="1" :auto-upload="false" :on-change="handleChange"
					class="avatar-uploader" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :headers="headers"
					:show-file-list="false">
					<el-image v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100px; height: 100px" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>

			<el-form-item label="用户姓名" prop="name">
				<el-input v-model="dataForm.name" placeholder="用户姓名"></el-input>
			</el-form-item>
			<el-form-item label="用户性别" prop="sex">
				<el-select v-model="dataForm.sex" placeholder="用户性别">
					<el-option label="男" :value="0"></el-option>
					<el-option label="女" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="家乡" prop="homeplace">
				<el-input v-model="dataForm.homeplace" placeholder="家乡"></el-input>
			</el-form-item>
			<el-form-item label="用户大学/年级/专业" prop="college">
				<el-input v-model="dataForm.college" placeholder="用户大学/年级/专业"></el-input>
			</el-form-item>
			<el-form-item label="行业" prop="industry">
				<el-input v-model="dataForm.industry" placeholder="行业"></el-input>
			</el-form-item>
			<el-form-item label="行业类型" prop="industryType">
				<el-select v-model="dataForm.industryType" placeholder="请选择行业类型">
					<el-option v-for="item in industryTypeList" :key="item.id" :label="item.title" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="公司" prop="company">
				<el-input v-model="dataForm.company" placeholder="公司"></el-input>
			</el-form-item>
			<el-form-item label="职务" prop="position">
				<el-input v-model="dataForm.position" placeholder="职位"></el-input>
			</el-form-item>
			<el-form-item label="公司地址" prop="companyAddress">
				<el-input v-model="dataForm.companyAddress" placeholder="公司地址"></el-input>
			</el-form-item>
			<el-form-item label="主营业务" prop="bussiness">
				<el-input v-model="dataForm.bussiness" placeholder="主营业务"></el-input>
			</el-form-item>
			<el-form-item label="公司优势" prop="advantage">
				<el-input v-model="dataForm.advantage" placeholder="公司优势"></el-input>
			</el-form-item>
			<el-form-item label="需要引荐的资源" prop="resourcesNeed">
				<el-input v-model="dataForm.resourcesNeed" placeholder="需要引荐的资源"></el-input>
			</el-form-item>
			<el-form-item label="能够引荐的资源" prop="resourcesProvide">
				<el-input v-model="dataForm.resourcesProvide" placeholder="能够引荐的资源"></el-input>
			</el-form-item>
			<el-form-item label="兴趣爱好" prop="hobby">
				<el-input v-model="dataForm.hobby" placeholder="兴趣爱好"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.status!=5" label="引荐人" prop="recommenderId">
				<!-- <el-input v-model="dataForm.recommenderId" placeholder="引荐人id"></el-input> -->
				<el-select v-model="dataForm.recommenderId" placeholder="请选择引荐人">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系电话" prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="联系电话"></el-input>
			</el-form-item>
			<el-form-item label="个人微信二维码" prop="wechatQrCode">
				<el-upload ref="upload2" action="#" :limit="1" :auto-upload="false" :on-change="handleChange2"
					class="avatar-uploader" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed2" :headers="headers"
					:show-file-list="false">
					<el-image v-if="imageUrl2" :src="imageUrl2" class="avatar" style="width: 100px; height: 100px" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
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
import { usePz_user_infoAllApi, usePz_user_infoApi, usePz_user_infoSubmitApi } from '@/api/module/pz_user_info'
import { da } from 'element-plus/es/locale';
import { usePz_industry_typeAllApi } from '@/api/module/pz_industry_type';

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	tags: '',
	status: '',
	avatar: '',
	account: '',
	name: '',
	sex: '',
	homeplace: '',
	college: '',
	industry: '',
	industryType: '',
	company: '',
	position: '',
	companyAddress: '',
	bussiness: '',
	advantage: '',
	resourcesNeed: '',
	resourcesProvide: '',
	hobby: '',
	recommenderId: '',
	mobile: '',
	wechatQrCode: '',
	createTime: '',
	updateTime: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''
	dataForm.status = 5
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		upload.value?.clearFiles()
		imageUrl.value = ''
		fileUpload.value = null
		upload2.value?.clearFiles()
		imageUrl2.value = ''
		fileUpload2.value = null
		userInfoList.value = [{id:0,name:'平台'}]
	}

	if (id) {
		getPz_user_info(id)
	}
	// 获取用户信息列表
	getPz_userInfoList()
	// 获取行业类型列表
	getPz_industryTypeList()
}

const getPz_user_info = (id: number) => {
	usePz_user_infoApi(id).then(res => {
		Object.assign(dataForm, res.data)
		imageUrl.value = res.data.avatar
		imageUrl2.value = res.data.wechatQrCode
		// dataForm.status += ''
	})
}

const userInfoList = ref([{id:0,name:'平台'}])
const getPz_userInfoList = () => {
	usePz_user_infoAllApi().then(res => {
		userInfoList.value = userInfoList.value.concat(res.data)
	})
}

const industryTypeList = ref([])
const getPz_industryTypeList = () => {
	usePz_industry_typeAllApi().then(res => {
		industryTypeList.value = res.data
	})
}

const dataRules = ref({
	name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
	sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
	industry: [{ required: true, message: '请填写行业', trigger: 'blur' }],
	industryType: [{ required: true, message: '请选择行业类型', trigger: 'blur' }],
	company: [{ required: true, message: '请填写公司', trigger: 'blur' }],
	position: [{ required: true, message: '请填写职务', trigger: 'blur' }],
	recommenderId: [{ required: true, message: '请选择引荐人', trigger: 'blur' }],
})

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

const imageUrl2 = ref('')
const fileUpload2 = ref()
const handleChange2 = (file: any) => {
	fileUpload2.value = file
	imageUrl2.value = URL.createObjectURL(file.raw!)
}
const upload2 = ref<UploadInstance>()
const handleExceed2: UploadProps['onExceed'] = files => {
	upload2.value!.clearFiles()
	const file = files[0] as UploadRawFile
	file.uid = genFileId()
	upload2.value!.handleStart(file)
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
			ElMessage.error('请先上传头像')
			return
		} else if(!imageUrl2.value){
			ElMessage.error('个人微信二维码')
			return
		}else {
			let param = new FormData()
			if (fileUpload.value == null) {
				let emptyBlob = new Blob([''], { type: 'application/octet-stream' })
				param.append('avatar', emptyBlob)
			} else {
				param.append('avatar', fileUpload.value.raw)
			}
			if (fileUpload2.value == null) {
				let emptyBlob = new Blob([''], { type: 'application/octet-stream' })
				param.append('qrCode', emptyBlob)
			} else {
				param.append('qrCode', fileUpload2.value.raw)
			}
			let jsonStr = JSON.stringify(dataForm)
			const blob = new Blob([jsonStr], { type: 'application/json' })
			param.append('vo', blob)

			usePz_user_infoSubmitApi(param,dataForm.id).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			})
		}
	})
}

defineExpose({
	init
})
</script>