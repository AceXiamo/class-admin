<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增一个任期' : '修改'" width="1000px" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<!-- <el-form-item label="" prop="id">
					<el-input v-model="dataForm.id" placeholder=""></el-input>
				</el-form-item> -->
			<el-form-item label="届数" prop="session">
				<!-- <el-input v-model="dataForm.session" placeholder="届数"></el-input> -->
				<el-input-number v-model="dataForm.session" controls-position="right" :min="1" :max="10000" />
			</el-form-item>
			<el-form-item label="任期时间">
				<!-- <el-input v-model="dataForm.startTime" placeholder="任期开始时间"></el-input>
				</el-form-item>
				<el-form-item label="任期结束时间" prop="endTime">
					<el-input v-model="dataForm.endTime" placeholder="任期结束时间"></el-input> -->
				<el-date-picker
					v-model="dateRange"
					type="daterange"
					range-separator="到"
					start-placeholder="请选择日期"
					end-placeholder="请选择日期"
					@change="handleDateChange"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>
			<!-- <el-form-item label="领导成员id" prop="userId">
					<el-input v-model="dataForm.userId" placeholder="领导成员id"></el-input>
				</el-form-item>
				<el-form-item label="领导团队职位" prop="position">
					<el-input v-model="dataForm.position" placeholder="领导团队职位"></el-input>
				</el-form-item>
				<el-form-item label="首页图" prop="mainImg">
					<el-input v-model="dataForm.mainImg" placeholder="首页图"></el-input>
				</el-form-item> -->
			<el-form-item label="领导团队成员">
				<div v-for="(leaderShip, index) in leaderShips" :key="index" style="display: flex; align-items: flex-start; margin-bottom: 20px">
					<el-input v-model="leaderShip.position" placeholder="领导团队职位" style="width: 200px; margin-right: 20px"></el-input>
					<!-- <el-input v-model="leaderShip.userId" placeholder="领导成员id" style="width: 200px;"></el-input> -->
					<el-select v-model="leaderShip.userId" filterable placeholder="请选择领导成员" style="width: 200px; margin-right: 20px">
						<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
					<el-input-number v-model="leaderShip.sort" :min="0" style="margin-right: 20px" />
					<!-- <el-input v-model="leaderShip.mainImg" placeholder="首页图" style="width: 100px;"></el-input> -->
					<el-upload
						ref="upload"
						action="#"
						:limit="1"
						:auto-upload="false"
						:on-change="file => handleChange(file, index)"
						class="avatar-uploader"
						:before-upload="beforeAvatarUpload"
						:on-exceed="file => handleExceed(file, index)"
						:headers="headers"
						:show-file-list="false"
						style="margin-right: 20px"
					>
						<!-- <el-button type="primary" style="align-self: flex-start;">首页图片</el-button> -->
						<el-image
							v-if="imageUrl[index]"
							:src="imageUrl[index]"
							class="avatar"
							style="width: 100px; height: 100px; align-self: center"
							fit="contain"
						/>
						<el-icon v-else class="avatar-uploader-icon" style="border: 1px dashed #ccc; width: 100px; height: 100px">
							<Plus />
							首页图片
						</el-icon>
					</el-upload>
					<el-button type="danger" @click="handleDelLeader(index)">删除</el-button>
				</div>
			</el-form-item>

			<div style="margin-left: 100px">
				<el-button @click="handleAddLeader">新增岗位</el-button>
			</div>
			<!-- <el-form-item label="" prop="status">
					<el-input v-model="dataForm.status" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="" prop="createTime">
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
import { usePz_leadershipSessionApi, usePz_leadershipSubmitApi, usePz_leaderShipDelMemberApi } from '@/api/module/pz_leadership'
import { it } from 'element-plus/es/locale'
import { usePz_user_infoAllApi } from '@/api/module/pz_user_info'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const userInfoList = ref([])

const dataForm = reactive({
	id: '',
	userId: '',
	position: '',
	mainImg: '',
	session: '',
	startTime: '',
	endTime: '',
	status: '',
	createTime: '',
	updateTime: '',
	sort: 0
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		leaderShips.value = []
		upload.value.map(item => item.clearFiles())
		imageUrl.value = leaderShips.value.map(() => '')
		fileUpload.value = leaderShips.value.map(() => null)
	}

	if (id) {
		getPz_leadership(id)
	}
	// 获取用户信息列表
	getPz_userInfoList()
}
// 根据届数获取领导团队成员
const getPz_leadership = (id: number) => {
	usePz_leadershipSessionApi(id).then((res): void => {
		//Object.assign(dataForm, res.data)
		Object.assign(leaderShips.value, res.data)
		console.log(leaderShips.value)
		dataForm.startTime = res.data[0].startTime
		dataForm.endTime = res.data[0].endTime
		dataForm.session = res.data[0].session
		dataForm.status = res.data[0].status
		dataForm.sort = res.data[0].sort
		dateRange.value = [dataForm.startTime, dataForm.endTime]
		imageUrl.value = leaderShips.value.map(item => item.mainImg + '?' + new Date().getTime())
	})
}
// 获取用户信息列表
const getPz_userInfoList = () => {
	usePz_user_infoAllApi().then(res => {
		userInfoList.value = res.data
	})
}

// 时间选择处理
const dateRange = ref([])
const handleDateChange = value => {
	if (value === null) {
		dataForm.startTime = ''
		dataForm.endTime = ''
		return
	}
	dataForm.startTime = value[0]
	dataForm.endTime = value[1]
	dateRange.value = value
}

const leaderShips = ref<any[]>([])

// 删除领导团队成员
const handleDelLeader = (index: number) => {
	// usePz_leaderShipDelMemberApi
	ElMessageBox.confirm('确定删除该团队成员吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		usePz_leaderShipDelMemberApi(leaderShips.value[index].id).then((res: any) => {
			if (res.code == 0) {
				ElMessage.success('删除成功')
				leaderShips.value.splice(index, 1)
				imageUrl.value.splice(index, 1)
				fileUpload.value.splice(index, 1)
				emit('refreshDataList')
			}
		})
	})
}

// 新增领导团队成员
const handleAddLeader = () => {
	leaderShips.value.push({ ...dataForm, userId: '', position: '', mainImg: '', sort: 0 })
	imageUrl.value.push('')
	fileUpload.value.push(null)
}

// 图片上传
// 设置请求头
const headers = {
	'Content-Type': 'multipart/form-data'
}
// 图像回显到前端
const imageUrl = ref(leaderShips.value.map(() => ''))
// 图像文件
const fileUpload = ref<any>(leaderShips.value.map(() => null))
// 图像文件更换
const handleChange = (file: any, index: number) => {
	fileUpload.value[index] = file
	imageUrl.value[index] = URL.createObjectURL(file.raw!)
}
const upload = ref<UploadInstance>()
// 图片覆盖上一张图片
const handleExceed: UploadProps['onExceed'] = (files, index: number) => {
	upload.value[index]!.clearFiles()
	const file = files[0] as UploadRawFile
	file.uid = genFileId()
	upload.value[index]!.handleStart(file)
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

const dataRules = ref({
	session: [{ required: true, message: '请输入届数', trigger: 'blur' }]
	// startTime: [{ required: true, message: '请选择任期开始时间', trigger: 'change' }],
	// endTime: [{ required: true, message: '请选择任期结束时间', trigger: 'change' }],
	// // userId: [{ required: true, message: '请输入领导成员id', trigger: 'blur' }],
	// // position: [{ required: true, message: '请输入领导团队职位', trigger: 'blur' }],
	// // mainImg: [{ required: true, message: '请输入首页图', trigger: 'blur' }],
	// // status: [{ required: true, message: '请输入状态', trigger: 'blur' }],
	// // createTime: [{ required: true, message: '请输入创建时间', trigger: 'blur' }],
	// // updateTime: [{ required: true, message: '请输入更新时间', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (!dateRange.value[0] || !dateRange.value[1]) {
			ElMessage.error('请选择任期时间')
			return false
		}
		console.log(leaderShips.value)

		for (let index = 0; index < leaderShips.value.length; index++) {
			if (leaderShips.value[index].userId == '' || leaderShips.value[index].position == '') {
				continue
			}
			if (!imageUrl.value[index]) {
				ElMessage.error('请上传' + leaderShips.value[index].position + '的图片')
				return false
			}
			let param = new FormData()
			if (fileUpload.value[index] == null) {
				let emptyBlob = new Blob([''], { type: 'application/octet-stream' })
				param.append('file', emptyBlob)
			} else {
				param.append('file', fileUpload.value[index].raw)
			}

			let jsonStr = JSON.stringify({
				...dataForm,
				id: leaderShips.value[index].id,
				userId: leaderShips.value[index].userId,
				position: leaderShips.value[index].position,
				sort: leaderShips.value[index].sort
			})
			const blob = new Blob([jsonStr], { type: 'application/json' })
			param.append('vo', blob)

			usePz_leadershipSubmitApi(param, leaderShips.value[index].id).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {
						visible.value = false

						if (index == leaderShips.value.length - 1) {
							emit('refreshDataList')
						}
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
