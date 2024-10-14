<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="日期筛选">
				<el-date-picker v-model="dateRange" type="daterange" range-separator="到" start-placeholder="请选择日期"
					end-placeholder="请选择日期" @change="handleDateChange" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
			</el-form-item>
			<el-form-item label="被走访人" prop="visitedId">
				<!-- <el-input v-model="state.queryForm.visitedId" clearable placeholder="请输入被走访人id"></el-input> -->
				<el-select v-model="state.queryForm.visitedId" clearable filterable placeholder="被走访人" style="width: 150px;">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="走访人" prop="visitorIds">
				<!-- <el-input v-model="state.queryForm.visitorIds" clearable placeholder="请输入走访人id"></el-input> -->
				<el-select v-model="visitors" clearable filterable multiple placeholder="走访人" style="width: 150px;">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="走访类型" prop="type" style="width: 200px;">
				<el-select v-model="state.queryForm.type" clearable placeholder="走访类型">
					<el-option label="点对点走访" value="0"></el-option>
					<el-option label="集体走访" value="1"></el-option>
					<el-option label="全部" value=""></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_visit:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'module:pz_visit:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="visitTime" label="走访时间" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.visitTime ? dayjs(row.visitTime).format('YYYY-MM-DD') : '' }}
				</template>
			</el-table-column>
			<el-table-column prop="visitorNames" label="走访人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="visitedName" label="被走访人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="走访类型" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.type === 0 ? '点对点走访' : '集体走访' }}
				</template>
			</el-table-column>
			<el-table-column prop="content" label="走访内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="comment" label="走访情况" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="是否群发走访" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.status==1 ? '是' : '否' }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="createTime" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_visit:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_visit:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList(true)"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_visitIndex">
	import {useCrud} from '@/hooks'
	import {computed, onMounted, reactive, ref} from 'vue'
	import {IHooksOptions} from '@/hooks/interface'
	import AddOrUpdate from './add-or-update.vue'
	import { usePz_user_infoAllApi } from '@/api/module/pz_user_info'
	import { dayjs } from 'element-plus'

	const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_visit/page',
	deleteUrl: '/module/pz_visit',
	queryForm: {
		startTime: '',
		endTime: '',
		visitedId: '',
		visitorIds: '',
		type: ''
	}
})

const visitors= ref([])
computed((visitors) => {
	state.queryForm.visitorIds = JSON.stringify(visitors.value)
})



const dateRange = ref([])
const handleDateChange = (value) => {
	if(value === null) {
		state.queryForm.startTime = ''
		state.queryForm.endTime = ''
		return
	}
	state.queryForm.startTime = value[0]
	state.queryForm.endTime = value[1]
	dateRange.value = value
}

// 获取用户信息列表
const userInfoList = ref([])
const getPz_userInfoList = () => {
	usePz_user_infoAllApi().then(res => {
		userInfoList.value = res.data
	})
}
onMounted(() => {
	getPz_userInfoList()
})


const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
