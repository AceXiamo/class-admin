<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="日期筛选">
				<el-date-picker v-model="dateRange" type="daterange" range-separator="到" start-placeholder="请选择日期"
					end-placeholder="请选择日期" @change="handleDateChange" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
			</el-form-item>
			<el-form-item label="活动主题" prop="theme">
				<el-input v-model="state.queryForm.theme" placeholder="活动主题"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status"  style="width: 200px;">
				<el-select v-model="state.queryForm.status" placeholder="请选择是否上架">
					<el-option label="上架" value="1"></el-option>
					<el-option label="下架" value="0"></el-option>
					<el-option label="全部" value=""></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_event:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'module:pz_event:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="eventTime" label="活动时间" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="mainImg" label="活动主图" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="theme" label="活动主题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="是否上架" header-align="center" align="center">
				<template #default="{row}">
					{{ row.status==1?'上架':'未上架' }}
				</template>
			</el-table-column>
			<el-table-column prop="type" label="活动类型" header-align="center" align="center">
				<template #default="{row}">
					<div v-if="row.type === 0">普通活动</div>
					<div v-else-if="row.type === 1">会议/培训</div>
					<div v-else-if="row.type === 2">集体走访</div>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="guestAllowed" label="嘉宾是否能报名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="eventLocation" label="活动地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deadline" label="活动报名截止时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="活动内容" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="createTime" label="发布时间" header-align="center" align="center">
				<template #default="{row}">
					{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_event:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_event:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button type="primary" @click="eventRegistrationHandle(scope.row.theme,scope.row.id)">查看名单</el-button>
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

<script setup lang="ts" name="ModulePz_eventIndex">
	import {useCrud} from '@/hooks'
	import {reactive, ref} from 'vue'
	import {IHooksOptions} from '@/hooks/interface'
	import AddOrUpdate from './add-or-update.vue'
import { useRouter } from 'vue-router';
import { dayjs } from 'element-plus';
	

	const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_event/page',
	deleteUrl: '/module/pz_event',
	queryForm: {
		startTime: null,
		endTime: null,
		theme: '',
		status: ''
	}
})

const dateRange = ref([])
const handleDateChange = () => {
	if(dateRange.value === null) {
		state.queryForm.startTime = ''
		state.queryForm.endTime = ''
		return
	}
	state.queryForm.startTime = dateRange.value[0]
	state.queryForm.endTime = dateRange.value[1]
}


const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

// 跳转到查看名单页面
const router = useRouter()
const eventRegistrationHandle = (theme:string,id:number) => {
	router.push({
		name: 'EventRegistration',
		query: {
			theme: theme,
			id: id
		}
	})
}


const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
