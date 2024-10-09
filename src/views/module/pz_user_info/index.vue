<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="用户姓名" prop="name">
				<el-input v-model="state.queryForm.name" clearable placeholder="请输入用户姓名" style="width: 150px"></el-input>
			</el-form-item>
			<el-form-item label="用户角色状态" prop="status">
				<!-- <el-input v-model="state.queryForm.status" clearable placeholder="请输入用户角色状态"></el-input> -->
				<el-select v-model="state.queryForm.status" clearable placeholder="请选择用户角色状态" style="width: 200px">
					<el-option label="游客" value="0"></el-option>
					<el-option label="待验证" value="1"></el-option>
					<el-option label="准嘉宾" value="2"></el-option>
					<el-option label="嘉宾" value="3"></el-option>
					<el-option label="会员" value="4"></el-option>
					<el-option label="顾问团" value="5"></el-option>
					<el-option label="历史会员" value="6"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_user_info:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_user_info:export'" type="primary" @click="exportHandle()">导出</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_user_info:save'" type="primary" @click="indexEdit()">排序编辑</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'module:pz_user_info:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="name" label="用户姓名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="用户角色状态" header-align="center" align="center">
				<template #default="{ row }">
					<div v-if="row.status === 0">游客</div>
					<div v-else-if="row.status === 1">待验证</div>
					<div v-else-if="row.status === 2">准嘉宾</div>
					<div v-else-if="row.status === 3">嘉宾</div>
					<div v-else-if="row.status === 4">会员</div>
					<div v-else-if="row.status === 5">顾问团</div>
					<div v-else-if="row.status === 6">历史会员</div>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="account" label="用户关联登录手机号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="sex" label="用户性别" header-align="center" align="center"></el-table-column>
			<el-table-column prop="homeplace" label="家乡" header-align="center" align="center"></el-table-column>
			<el-table-column prop="college" label="用户大学/年级/专业" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="industry" label="行业" header-align="center" align="center"></el-table-column>
			<el-table-column prop="company" label="公司" header-align="center" align="center"></el-table-column>
			<el-table-column prop="position" label="职位" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tags" label="用户自定义标签" header-align="center" align="center">
				<template #default="{ row }">
					<el-tag
						v-for="(tag, index) in JSON.parse(row.tags || '[]')"
						:key="tag"
						closable
						:disable-transitions="false"
						@close="handleClose(tag, row)"
						effect="plain"
					>
						{{ tag }}
					</el-tag>
					<el-input
						v-if="inputVisible[row.id]"
						ref="InputRef"
						v-model="inputValue"
						class="w-20"
						size="small"
						@keyup.enter="handleInputConfirm(row)"
						@blur="handleInputConfirm(row)"
					/>
					<el-button v-else class="button-new-tag" size="small" @click="showInput(row)"> + 添加 </el-button>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="companyAddress" label="公司地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="bussiness" label="主营业务" header-align="center" align="center"></el-table-column>
			<el-table-column prop="advantage" label="公司优势" header-align="center" align="center"></el-table-column>
			<el-table-column prop="resourcesNeed" label="需要引荐的资源" header-align="center" align="center"></el-table-column>
			<el-table-column prop="resourcesProvide" label="能够引荐的资源" header-align="center" align="center"></el-table-column>
			<el-table-column prop="hobby" label="兴趣爱好" header-align="center" align="center"></el-table-column>
			<el-table-column prop="recommenderId" label="引荐人id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mobile" label="联系电话" header-align="center" align="center"></el-table-column>
			<el-table-column prop="wechatQrCode" label="微信个人二维码" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="updateTime" label="修改时间" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="400">
				<template #default="scope">
					<el-button v-auth="'module:pz_user_info:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_user_info:delete'" type="danger" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button type="primary" v-if="scope.row.status != 5" link @click="userRecordHandle(scope.row.id, scope.row.name)">用户记录</el-button>
					<el-button type="primary" v-if="scope.row.status == 2" @click="userVerifyHandle(scope.row, 3)">通过申请</el-button>
					<el-button type="primary" v-if="scope.row.status == 3" @click="userVerifyHandle(scope.row, 4)">升级会员</el-button>
					<el-button type="primary" v-if="scope.row.status == 4" @click="userVerifyHandle(scope.row, 6)">转为历史会员</el-button>
					<el-button type="primary" v-if="scope.row.status == 6" @click="userVerifyHandle(scope.row, 4)">转为会员</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_user_infoIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, nextTick, onMounted } from 'vue'
import { ElInput, ElLoading, ElMessageBox } from 'element-plus'
import { ElMessage, UploadInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { usePz_user_infoAddTagApi, usePz_user_infoSubmitApi } from '@/api/module/pz_user_info'
import { useRouter } from 'vue-router'
import { dayjs } from 'element-plus'
import IndexListDialog from './components/IndexListDialog'

const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_user_info/page',
	deleteUrl: '/module/pz_user_info',
	queryForm: {
		name: '',
		status: ''
	}
})

// 标签
const inputValue = ref('')
const inputVisible = reactive({})
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string, row: any) => {
	console.log(row.tags)
	let dynamicTags = JSON.parse(row.tags || '[]')
	dynamicTags.splice(dynamicTags.indexOf(tag), 1)
	row.tags = JSON.stringify(dynamicTags)
	usePz_user_infoAddTagApi({ id: row.id, tags: JSON.stringify(dynamicTags) }).then(res => {
		if (res.code === 0) {
			ElMessage.success('删除成功')
		} else {
			ElMessage.error(res.msg)
		}
	})
}

const showInput = row => {
	// inputVisible.value = true
	inputVisible[row.id] = true
	nextTick(() => {
		InputRef.value!.input!.focus()
	})
}

const handleInputConfirm = (row: any) => {
	if (inputValue.value) {
		let dynamicTags = JSON.parse(row.tags || '[]')
		dynamicTags.push(inputValue.value)
		row.tags = JSON.stringify(dynamicTags)
		usePz_user_infoAddTagApi({ id: row.id, tags: JSON.stringify(dynamicTags) }).then(res => {
			if (res.code === 0) {
				ElMessage.success('添加成功')
			} else {
				ElMessage.error(res.msg)
			}
		})
	}
	// inputVisible.value = false
	inputVisible[row.id] = false
	inputValue.value = ''
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

// 通过申请，将用户状态待验证改为准嘉宾
const userVerifyHandle = (row: any, status: any) => {
	ElMessageBox.confirm(
		status == 3 ? '确定通过申请吗?' : status == 4 && row.status == 3 ? '确定升级会员吗?' : status == 6 ? '确定转为历史会员吗?' : '确定转为会员吗?',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}
	)
		.then(() => {
			row.status = status
			row.createTime = dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
			row.updateTime = dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
			let param = new FormData()
			let jsonStr = JSON.stringify(row)
			const blob = new Blob([jsonStr], { type: 'application/json' })
			param.append('vo', blob)
			let emptyBlob = new Blob([''], { type: 'application/octet-stream' })
			param.append('avatar', emptyBlob)
			param.append('qrCode', emptyBlob)
			usePz_user_infoSubmitApi(param, row.id).then(res => {
				if (res.code === 0) {
					ElMessage.success('操作成功')
					getDataList()
				} else {
					ElMessage.error(res.msg)
				}
			})
		})
		.catch(() => {})
}

const exportHandle = () => {
	if (state.dataListSelections && state.dataListSelections?.length <= 0) return
	console.log(state.dataListSelections)
	const loading = ElLoading.service({
		lock: true,
		text: '导出中',
		spinner: 'el-icon-loading'
	})
	downloadHandle('module/pz_user_info/export', state.dataListSelections)
		.then(res => {
			ElMessage.success('导出成功')
		})
		.finally(() => {
			loading.close()
		})
}

const indexEdit = () => {
	IndexListDialog.show()
}

// 跳转到用户数据记录页面
const router = useRouter()
const userRecordHandle = (id: number, name: string) => {
	router.push({ name: 'UserRecord', query: { id: id, name: name } })
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle } = useCrud(state)
</script>
