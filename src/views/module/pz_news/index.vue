<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="日期筛选">
				<el-date-picker v-model="dateRange" type="daterange" range-separator="到" start-placeholder="请选择日期"
					end-placeholder="请选择日期" @change="handleDateChange" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="state.queryForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item label="发布状态" prop="status"  style="width: 200px;">
				<el-select v-model="state.queryForm.status" placeholder="请选择发布状态">
					<el-option label="已发布" value="1"></el-option>
					<el-option label="未发布" value="0"></el-option>
					<el-option label="全部" value=""></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_news:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'module:pz_news:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="url" label="小程序跳转url" header-align="center" align="center">
				<template #default="{row}">
					{{ row.url?row.url:'无' }}
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="image" label="封面图路径" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="content" label="内容" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="origin" label="来源" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="发布状态" header-align="center" align="center">
				<template #default="{row}">
					{{ row.status==1?'已发布':'未发布' }}
				</template>
			</el-table-column>
			<el-table-column prop="publishTime" label="发布时间" header-align="center" align="center">
				<template #default="{row}">
					{{ row.publishTime?row.publishTime:'未选择发布时间' }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="修改时间" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_news:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_news:delete'" type="danger" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="ModulePz_newsIndex">
	import {useCrud} from '@/hooks'
	import {reactive, ref} from 'vue'
	import {IHooksOptions} from '@/hooks/interface'
	import AddOrUpdate from './add-or-update.vue'

	const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_news/page',
	deleteUrl: '/module/pz_news',
	queryForm: {
		startTime: '',
		endTime: '',
		title: '',
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

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
