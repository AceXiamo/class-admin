<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item> -->
			<el-form-item>
				<el-button v-auth="'module:pz_leadership:save'" type="primary" @click="addOrUpdateHandle()">新建一个任期</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'module:pz_leadership:delete'" type="danger"
					@click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="userId" label="领导成员id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="position" label="领导团队职位" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mainImg" label="首页图" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="session" label="届数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="leaders" label="领导成员" header-align="center" align="center"></el-table-column>
			<el-table-column prop="startTime" label="任期开始时间" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.startTime ? dayjs(row.startTime).format('YYYY-MM-DD') : '' }}
				</template>
			</el-table-column>
			<el-table-column prop="endTime" label="任期结束时间" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.endTime ? dayjs(row.endTime).format('YYYY-MM-DD') : '' }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="status" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_leadership:update'" type="primary" link @click="addOrUpdateHandle(scope.row.session)">修改</el-button>
					<el-button v-auth="'module:pz_leadership:delete'" type="primary" link @click="deleteBatchHandle(scope.row.session)">删除</el-button>
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

		<!-- <el-table :data="weekList" style="width: 100%">
			<el-table-column prop="id" label="id" width="180"></el-table-column>
			<el-table-column prop="session" label="届数" width="180"></el-table-column>
			<el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
			<el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
		</el-table> -->
		<div style="margin: 10px">
			<el-button @click="weekListSubmitHandle" type="primary">修改周期算法</el-button>
		</div>
		<div v-for="(week, index) in weekList" style="display: flex; align-items: center; margin: 10px">
			<div style="margin-right: 10px; margin-left: 10px">{{ '第' + (index + 1) + '周' }}</div>
			<el-date-picker v-model="week.startTime" type="date" placeholder="请选择日期" />
			<div style="margin-right: 10px; margin-left: 10px">到</div>
			<el-date-picker v-model="week.endTime" type="date" placeholder="请选择日期" />
			<el-button type="danger" style="margin-left: 10px" @click="handleDel(index)">删除</el-button>
		</div>
		<div style="margin: 10px">
			<el-button @click="weekListAddHandle" type="primary">新增一周</el-button>
		</div>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_leadershipIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { usePz_leaderShipWeekApi, usePz_leaderShipWeekSubmitApi, usePz_leaderShipDelWeekApi } from '@/api/module/pz_leadership'
import { cloneDeep } from 'lodash'

const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_leadership/session/page',
	deleteUrl: '/module/pz_leadership',
	queryForm: {}
})

const weekDataForm = reactive({
	id: '',
	session: '',
	startTime: '',
	endTime: ''
})

const handleDel = (index: number) => {
	ElMessageBox.confirm('确定删除吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		usePz_leaderShipDelWeekApi(weekList.value[index].id).then((res: any) => {
			if (res.code == 0) {
				ElMessage.success('删除成功')
				weekList.value.splice(index, 1)
			}
		})
	})
}

const weekList = ref<any[]>([])
const getWeekList = () => {
	usePz_leaderShipWeekApi().then(res => {
		weekList.value = res.data
	})
}

const weekListAddHandle = () => {
	weekList.value.push({
		id: '',
		session: '',
		startTime: '',
		endTime: ''
	})
}

const weekListSubmitHandle = () => {
	ElMessageBox.confirm('确定修改周期吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			if (verifyWeekData()) {
				usePz_leaderShipWeekSubmitApi(weekList.value).then(() => {
					ElMessage.success('修改成功')
				})
			}
		})
		.catch(() => {
			ElMessage.info('已取消修改')
		})
}

const verifyWeekData = (): boolean => {
	const weekListCopy = cloneDeep(weekList.value)
	weekListCopy.sort((a, b) => {
		return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
	})
	for (let i = 0; i < weekListCopy.length - 1; i++) {
		if (dayjs(weekListCopy[i].endTime).valueOf() > dayjs(weekListCopy[i + 1].startTime).valueOf()) {
			ElMessage.error('周数据不能重叠')
			return false
		}
	}
	return true
}

onMounted(() => {
	getWeekList()
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
